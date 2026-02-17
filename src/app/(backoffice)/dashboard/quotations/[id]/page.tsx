'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Plus,
  Minus,
  X,
  Loader2,
  GripVertical,
  Copy
} from 'lucide-react'
import PDFExportButton from '@/components/contracts/PDFExport'
import QuotationPreview from '@/components/quotations/QuotationPreview'
import ApproveQuotationButton from '@/components/quotations/ApproveQuotationButton'
import AuditLogTimeline from '@/components/quotations/AuditLogTimeline'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { revalidateQuotations } from '../actions'
import {
  quotationFormSchema,
  type QuotationFormData,
  type QuotationItem
} from '../schema'
import { ZodError } from 'zod'
import dayjs from '@/utils/dayjs'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/ui/Select'
import Button from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Textarea } from '@/ui/Textarea'
import { Label } from '@/ui/Label'

const STATUS_OPTIONS = [
  'Draft',
  'Sent',
  'Approved',
  'Accepted',
  'Rejected',
  'Expired',
  'Cancelled'
] as const

// Sortable Item Component
interface SortableItemProps {
  id: number
  item: QuotationItem
  index: number
  isViewMode: boolean
  fieldErrors: Record<string, string | undefined>
  updateItem: (
    index: number,
    field: keyof QuotationItem,
    value: string | number
  ) => void
  removeItem: (index: number) => void
  duplicateItem: (index: number) => void
  setFieldErrors: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >
  itemsLength: number
  currency: string
  descriptionInputRef?: (el: HTMLInputElement | null) => void
}

function SortableItem({
  id,
  item,
  index,
  isViewMode,
  fieldErrors,
  updateItem,
  removeItem,
  duplicateItem,
  setFieldErrors,
  itemsLength,
  currency,
  descriptionInputRef
}: SortableItemProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const quantityValue = Number.isFinite(Number(item.quantity))
    ? Number(item.quantity)
    : 1
  const normalizedQuantity = Math.max(1, Math.round(quantityValue || 1))
  const priceValue = Number.isFinite(Number(item.price))
    ? Number(item.price)
    : 0
  const safePrice = Number.isFinite(priceValue) ? priceValue : 0
  const lineTotal = normalizedQuantity * priceValue
  const safeCurrency = currency && currency.trim() ? currency : 'THB'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-12 gap-4 p-4 bg-[#f8f9fb] dark:bg-[#1E293B] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] hover:border-[#dce4ed] dark:hover:border-[#334155] transition-colors"
    >
      {!isViewMode && (
        <div
          className="col-span-1 flex items-center justify-center cursor-grab active:cursor-grabbing self-center"
          {...(isMounted ? attributes : {})}
          {...(isMounted ? listeners : {})}
        >
          <GripVertical className="h-5 w-5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" />
        </div>
      )}
      <div
        className={
          isViewMode ? 'col-span-12 md:col-span-5' : 'col-span-11 md:col-span-4'
        }
      >
        <Label>Description</Label>
        <Input
          ref={descriptionInputRef}
          type="text"
          value={item.description}
          onChange={e => {
            updateItem(index, 'description', e.target.value)
            const errorKey = `items.${index}.description`
            if (fieldErrors[errorKey]) {
              setFieldErrors(prev => {
                const next = { ...prev }
                delete next[errorKey]
                return next
              })
            }
          }}
          onKeyDown={e => {
            // Ctrl/Cmd + Enter to add new item
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault()
              const addButton = document.getElementById('add-item-btn')
              addButton?.click()
            }
          }}
          error={!!fieldErrors[`items.${index}.description`]}
          placeholder="Service description"
          disabled={isViewMode}
        />
        {fieldErrors[`items.${index}.description`] && (
          <p className="mt-1 text-sm text-red-400">
            {fieldErrors[`items.${index}.description`]}
          </p>
        )}
      </div>
      <div className="col-span-12 md:col-span-3">
        <Label>Quantity</Label>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            onClick={() =>
              updateItem(index, 'quantity', Math.max(1, normalizedQuantity - 1))
            }
            className="h-9 w-9 shrink-0 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border-[#e0e4ea] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-0"
            disabled={isViewMode || normalizedQuantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Input
            type="number"
            min="1"
            step="1"
            value={normalizedQuantity}
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={e => {
              const nextValue = Math.max(
                1,
                Math.round(Number(e.target.value) || 1)
              )
              updateItem(index, 'quantity', nextValue)
              const errorKey = `items.${index}.quantity`
              if (fieldErrors[errorKey]) {
                setFieldErrors(prev => {
                  const next = { ...prev }
                  delete next[errorKey]
                  return next
                })
              }
            }}
            onKeyDown={e => {
              if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault()
              }
            }}
            onBlur={() => {
              updateItem(index, 'quantity', normalizedQuantity)
            }}
            className="flex-1 min-w-0 px-2 py-2 text-center tabular-nums appearance-none"
            error={!!fieldErrors[`items.${index}.quantity`]}
            disabled={isViewMode}
          />
          <Button
            variant="outline"
            onClick={() =>
              updateItem(index, 'quantity', normalizedQuantity + 1)
            }
            className="h-9 w-9 shrink-0 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border-[#e0e4ea] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-0"
            disabled={isViewMode}
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        {fieldErrors[`items.${index}.quantity`] && (
          <p className="mt-1 text-sm text-red-400">
            {fieldErrors[`items.${index}.quantity`]}
          </p>
        )}
      </div>
      <div className="col-span-12 md:col-span-3">
        <Label>Price</Label>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            onClick={() =>
              updateItem(index, 'price', Math.max(0, safePrice - 1))
            }
            className="h-9 w-9 shrink-0 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border-[#e0e4ea] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-0"
            disabled={isViewMode}
            aria-label="Decrease price"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={item.price}
            inputMode="decimal"
            onChange={e => {
              const parsed = parseFloat(e.target.value)
              updateItem(index, 'price', Number.isNaN(parsed) ? 0 : parsed)
              const errorKey = `items.${index}.price`
              if (fieldErrors[errorKey]) {
                setFieldErrors(prev => {
                  const next = { ...prev }
                  delete next[errorKey]
                  return next
                })
              }
            }}
            className="flex-1 min-w-0 px-2 py-2 text-right tabular-nums appearance-none"
            error={!!fieldErrors[`items.${index}.price`]}
            disabled={isViewMode}
          />
          <Button
            variant="outline"
            onClick={() => updateItem(index, 'price', safePrice + 1)}
            className="h-9 w-9 shrink-0 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border-[#e0e4ea] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-0"
            disabled={isViewMode}
            aria-label="Increase price"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            Line total:
          </span>
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: safeCurrency,
              minimumFractionDigits: 2
            }).format(lineTotal)}
          </span>
        </div>
        {fieldErrors[`items.${index}.price`] && (
          <p className="mt-1 text-sm text-red-400">
            {fieldErrors[`items.${index}.price`]}
          </p>
        )}
      </div>
      <div className="col-span-12 md:col-span-1 flex md:justify-end items-start gap-1">
        {!isViewMode && (
          <button
            type="button"
            onClick={() => duplicateItem(index)}
            className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-indigo-500/10 rounded-lg"
            title="Duplicate item"
            aria-label="Duplicate item"
          >
            <Copy size={16} />
          </button>
        )}
        {!isViewMode && itemsLength > 1 && (
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="p-2 text-red-400 dark:text-red-500 hover:text-red-300 transition-colors hover:bg-red-500/10 rounded-lg"
            title="Remove item"
            aria-label="Remove item"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function QuotationFormPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const isNew = params.id === 'new'
  const contentRef = useRef<HTMLDivElement>(null)
  const [showPreview, setShowPreview] = useState(false)

  const [formData, setFormData] = useState<QuotationFormData>({
    quotation_number: '',
    contact_person_id: '',
    bill_to_party_id: '',
    approver_id: '',
    customer_signatory_id: '',
    issued_date: '',
    valid_until_date: '',
    approved_date: '',
    accepted_date: '',
    signature_date: '',
    payment_method: '',
    vat_rate: 7, // Default 7% VAT (Thailand standard)
    status: 'Draft',
    total_amount: 0,
    currency: 'THB',
    items: [{ description: '', quantity: 1, price: 0 }],
    authorized_signature_url: undefined
  })
  const [error, setError] = useState<string | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({})

  useEffect(() => {
    if (!isNew) return
    const issuedDate = dayjs.utc().startOf('day')
    const validUntilDate = issuedDate.add(30, 'day')
    setFormData(prev => ({
      ...prev,
      issued_date: issuedDate.toISOString(),
      valid_until_date: validUntilDate.toISOString()
    }))
  }, [isNew])

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Handle drag end to reorder items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.items.findIndex((_, i) => i === Number(active.id))
        const newIndex = prev.items.findIndex((_, i) => i === Number(over.id))

        return {
          ...prev,
          items: arrayMove(prev.items, oldIndex, newIndex)
        }
      })
    }
  }

  // Fetch quotation details if in edit/view mode
  const { data: quotation, isLoading: isLoadingQuotation } = useQuery({
    queryKey: ['quotation', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/quotations/${params.id}`)
      return res.data.data || res.data
    },
    enabled: !isNew && !!params.id
  })

  // Fetch all parties for dropdowns
  const { data: partiesData } = useQuery({
    queryKey: ['parties', 'all'],
    queryFn: async () => {
      const res = await apiClient.get('/parties?limit=1000') // Get all parties
      return Array.isArray(res.data) ? res.data : res.data.data || []
    }
  })

  // Fetch all users for approver dropdown
  const { data: usersData } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const res = await apiClient.get('/users?limit=1000') // Get all users
      // Handle paginated response structure: { data: User[], meta: {...} }
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data
      }
      // Handle response with success flag: { success: boolean, data: User[], meta: {...} }
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data
      }
      // Handle direct array response
      if (Array.isArray(res.data)) {
        return res.data
      }
      return []
    }
  })

  const parties = partiesData || []
  const users = usersData || []

  // Helper to normalize GET response data to form format
  const normalizeQuotationData = (quotation: any) => {
    return {
      quotation_number: quotation.quotation_number || '',
      contact_person_id: quotation.contact_person_id || '',
      bill_to_party_id: quotation.bill_to_party_id || '',
      approver_id: quotation.approver_id || '',
      customer_signatory_id: quotation.customer_signatory_id || '',
      issued_date: quotation.issued_date || '',
      valid_until_date: quotation.valid_until_date || '',
      approved_date: quotation.approved_date || '',
      accepted_date: quotation.accepted_date || '',
      signature_date: quotation.signature_date || '',
      payment_method: quotation.payment_method || '',
      vat_rate: !isNaN(parseFloat(String(quotation.vat_rate)))
        ? parseFloat(String(quotation.vat_rate))
        : 7,
      status: quotation.status
        ? quotation.status.charAt(0) + quotation.status.slice(1).toLowerCase() // Convert "DRAFT" to "Draft"
        : 'Draft',
      // Convert total_amount from string (GET response) to number (form format)
      total_amount:
        typeof quotation.total_amount === 'string'
          ? parseFloat(quotation.total_amount) || 0
          : typeof quotation.total_amount === 'number'
            ? quotation.total_amount
            : 0,
      currency: quotation.currency || 'THB',
      // Handle items: null (GET response) or array
      items:
        quotation.items &&
        Array.isArray(quotation.items) &&
        quotation.items.length > 0
          ? quotation.items
          : [{ description: '', quantity: 1, price: 0 }],
      authorized_signature_url: quotation.authorized_signature_url
    }
  }

  // Update form data when quotation is loaded (normalize GET response format)
  useEffect(() => {
    if (quotation) {
      const normalizedData = normalizeQuotationData(quotation)
      setFormData(normalizedData)
      if (normalizedData.status === 'Approved') {
        setIsViewMode(true)
      }
    }
  }, [quotation])

  // Calculate total amount from items
  useEffect(() => {
    const total = formData.items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    )
    setFormData(prev => ({ ...prev, total_amount: total }))
  }, [formData.items])

  // Helper to format payload for CREATE/UPDATE (same format for both)
  const formatQuotationPayload = (data: QuotationFormData) => {
    // Format items array - send null if empty, otherwise send filtered items
    const filteredItems = data.items
      .filter(item => item.description && item.description.trim() !== '')
      .map(item => {
        const quantity =
          typeof item.quantity === 'string'
            ? parseFloat(item.quantity) || 0
            : typeof item.quantity === 'number'
              ? item.quantity
              : 0

        const price =
          typeof item.price === 'string'
            ? parseFloat(item.price) || 0
            : typeof item.price === 'number'
              ? item.price
              : 0

        return {
          price: isNaN(price) ? 0 : price,
          quantity: isNaN(quantity) ? 0 : quantity,
          description: String(item.description || '').trim()
        }
      })

    const payload: any = {
      quotation_number: data.quotation_number,
      status: data.status.toUpperCase(), // Convert to uppercase to match API format (DRAFT, SENT, etc.)
      total_amount: data.total_amount,
      currency: data.currency || 'THB',
      vat_rate: data.vat_rate,
      payment_method: data.payment_method || '',
      items: filteredItems.length > 0 ? filteredItems : null // Send null if no items (matching API response format)
    }

    // Add optional fields only if they have values (don't send null or empty strings)
    if (data.contact_person_id?.trim()) {
      payload.contact_person_id = data.contact_person_id
    }

    if (data.bill_to_party_id?.trim()) {
      payload.bill_to_party_id = data.bill_to_party_id
    }

    if (data.approver_id?.trim()) {
      payload.approver_id = data.approver_id
    }

    if (data.customer_signatory_id?.trim()) {
      payload.customer_signatory_id = data.customer_signatory_id
    }
    // Helper to format date as ISO string at midnight UTC (matching API docs format)
    const formatDateForAPI = (dateString: string): string | null => {
      if (!dateString || !dateString.trim()) return null

      try {
        let dateOnly: string

        // If it's already an ISO string, extract the date part
        if (dateString.includes('T')) {
          dateOnly = dateString.split('T')[0]
        } else {
          // If it's just a date string (YYYY-MM-DD)
          dateOnly = dateString
        }

        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
          return null
        }

        // Return as ISO string at midnight UTC (format: 2024-01-18T00:00:00Z)
        return `${dateOnly}T00:00:00Z`
      } catch {
        return null
      }
    }

    const issuedDate = formatDateForAPI(data.issued_date || '')
    if (issuedDate) payload.issued_date = issuedDate

    const validUntilDate = formatDateForAPI(data.valid_until_date || '')
    if (validUntilDate) payload.valid_until_date = validUntilDate

    const approvedDate = formatDateForAPI(data.approved_date || '')
    if (approvedDate) payload.approved_date = approvedDate

    const acceptedDate = formatDateForAPI(data.accepted_date || '')
    if (acceptedDate) payload.accepted_date = acceptedDate

    const signatureDate = formatDateForAPI(data.signature_date || '')
    if (signatureDate) payload.signature_date = signatureDate

    // Convert total_amount to string to match API format (both CREATE and UPDATE use same format)
    payload.total_amount = String(payload.total_amount || 0)

    return payload
  }

  // Create/Update mutation (uses same payload format for both)
  const { mutate: saveQuotation, isPending } = useMutation({
    mutationFn: async (data: QuotationFormData) => {
      // Use same payload format for both CREATE and UPDATE
      const payload = formatQuotationPayload(data)

      // Log payload for debugging (remove in production)
      console.log('Quotation payload:', JSON.stringify(payload, null, 2))

      if (isNew) {
        await apiClient.post('/quotations', payload)
      } else {
        await apiClient.put(`/quotations/${params.id}`, payload)
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      await revalidateQuotations()
      router.push('/dashboard/quotations')
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to save quotation'
      )
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    try {
      // Validate with Zod
      const validatedData = quotationFormSchema.parse(formData)
      saveQuotation(validatedData)
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {}
        err.issues.forEach(issue => {
          const path = issue.path.join('.')
          errors[path] = issue.message
        })
        setFieldErrors(errors)

        // Set general error message
        const firstIssue = err.issues[0]
        if (firstIssue) {
          setError(`Validation error: ${firstIssue.message}`)
        }
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  // Refs for auto-focusing new items
  const descriptionInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const addItem = () => {
    setFormData(prev => {
      const newItems = [
        ...prev.items,
        { description: '', quantity: 1, price: 0 }
      ]
      // Schedule focus after render
      setTimeout(() => {
        const newIndex = newItems.length - 1
        descriptionInputRefs.current[newIndex]?.focus()
      }, 0)
      return {
        ...prev,
        items: newItems
      }
    })
  }

  const duplicateItem = (index: number) => {
    setFormData(prev => {
      const itemToDuplicate = prev.items[index]
      const newItems = [
        ...prev.items.slice(0, index + 1),
        { ...itemToDuplicate },
        ...prev.items.slice(index + 1)
      ]
      // Schedule focus after render
      setTimeout(() => {
        const newIndex = index + 1
        descriptionInputRefs.current[newIndex]?.focus()
      }, 0)
      return {
        ...prev,
        items: newItems
      }
    })
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (
    index: number,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  if (!isNew && isLoadingQuotation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/quotations"
            className="p-2 hover:bg-[#f0f2f6] dark:hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <ArrowLeft
              size={20}
              className="text-neutral-500 dark:text-neutral-400"
            />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              {showPreview
                ? 'Print Preview'
                : isNew
                  ? 'New Quotation'
                  : isViewMode
                    ? 'View Quotation'
                    : 'Edit Quotation'}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              {showPreview
                ? 'Review layout before export'
                : isNew
                  ? 'Create a new quotation'
                  : isViewMode
                    ? 'View quotation details'
                    : 'Update quotation details'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showPreview && (
            <PDFExportButton contentRef={contentRef} mode="gotenberg" />
          )}

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 text-sm transition-colors rounded-lg flex items-center gap-2 ${showPreview ? 'bg-indigo-600 text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-[#f0f2f6] dark:hover:bg-[#1E293B] border border-[#e0e4ea] dark:border-[#334155]'}`}
          >
            {showPreview ? 'Back to Form' : 'A4 Preview'}
          </button>

          {!isNew &&
            !isViewMode &&
            !showPreview &&
            formData.status !== 'Approved' && (
              <button
                type="button"
                onClick={() => setIsViewMode(true)}
                className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                View Mode
              </button>
            )}
          {isViewMode && !showPreview && formData.status !== 'Approved' && (
            <button
              type="button"
              onClick={() => setIsViewMode(false)}
              className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Edit Mode
            </button>
          )}
        </div>
      </div>

      {!isNew &&
        formData.status !== 'Approved' &&
        // Only show if the ORIGINAL status (from DB) is NOT Approved.
        // If original is Approved, it means we must save as Draft first.
        quotation?.status !== 'APPROVED' &&
        quotation?.status !== 'Approved' && (
          <div className="max-w-4xl mx-auto">
            <ApproveQuotationButton
              quotationId={params.id as string}
              currentStatus={formData.status}
              onSuccess={() => {
                queryClient.invalidateQueries({
                  queryKey: ['quotation', params.id]
                })
                // Update local state to hide button immediately if needed
                setFormData(prev => ({ ...prev, status: 'Approved' }) as any)
              }}
            />
          </div>
        )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 max-w-4xl mx-auto">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {showPreview ? (
        <div className="flex justify-center max-w-[95vw] mx-auto pb-10">
          <QuotationPreview
            formData={{
              ...formData,
              authorized_signature_url:
                formData.authorized_signature_url || undefined
            }}
            parties={parties}
            vatRate={formData.vat_rate}
            contentRef={contentRef}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          {/* Step 1: Basic Information */}
          <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm">
                1
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>
                  Quotation Number
                  {isNew && (
                    <span className="ml-2 text-xs text-indigo-600">
                      (Auto-generated)
                    </span>
                  )}
                  {!isNew && ' *'}
                </Label>
                <Input
                  type="text"
                  value={formData.quotation_number || ''}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      quotation_number: e.target.value
                    })
                    // Clear error when user starts typing
                    if (fieldErrors.quotation_number) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.quotation_number
                        return next
                      })
                    }
                  }}
                  error={!!fieldErrors.quotation_number}
                  placeholder={
                    isNew
                      ? 'Auto-generated (QT-YYYYMM-XXXX)'
                      : 'e.g. Q-2024-001'
                  }
                  required={!isNew}
                  disabled={isNew || isViewMode}
                />
                {fieldErrors.quotation_number && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.quotation_number}
                  </p>
                )}
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={value => {
                    const previousStatus = formData.status

                    if (
                      STATUS_OPTIONS.includes(
                        value as (typeof STATUS_OPTIONS)[number]
                      )
                    ) {
                      const newFormData: any = {
                        ...formData,
                        status: value as QuotationFormData['status']
                      }

                      // If changing from Approved to Draft, clear signature fields
                      if (previousStatus === 'Approved' && value === 'Draft') {
                        newFormData.authorized_signature_url = null
                        newFormData.signature_date = ''
                        newFormData.approved_date = ''
                      }

                      setFormData(newFormData)
                    }
                  }}
                  disabled={isViewMode && formData.status !== 'Approved'} // Allow editing if status is Approved even in view mode
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Currency</Label>
                <Input
                  type="text"
                  value={formData.currency}
                  onChange={e => {
                    setFormData({ ...formData, currency: e.target.value })
                    if (fieldErrors.currency) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.currency
                        return next
                      })
                    }
                  }}
                  error={!!fieldErrors.currency}
                  placeholder="THB"
                  disabled={true}
                />
                {fieldErrors.currency && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.currency}
                  </p>
                )}
              </div>

              <div>
                <Label>VAT Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.vat_rate}
                  onChange={e => {
                    const value = parseFloat(e.target.value)
                    if (value >= 0 && value <= 100) {
                      setFormData(prev => ({ ...prev, vat_rate: value }))
                    }
                  }}
                  placeholder="7"
                  disabled={isViewMode}
                />
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Value Added Tax percentage
                </p>
              </div>

              <div>
                <Label>Payment Method</Label>
                <Textarea
                  rows={3}
                  value={formData.payment_method || ''}
                  onChange={e => {
                    setFormData({ ...formData, payment_method: e.target.value })
                    if (fieldErrors.payment_method) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.payment_method
                        return next
                      })
                    }
                  }}
                  error={!!fieldErrors.payment_method}
                  className="resize-y"
                  placeholder="e.g. Bank Transfer to Account: 123-456-789&#10;Bank: SCB&#10;Account Name: LiKQ MUSIC"
                  disabled={isViewMode}
                />
                {fieldErrors.payment_method && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.payment_method}
                  </p>
                )}
              </div>

              <div>
                <Label>Signature Date</Label>
                <Input
                  type="date"
                  value={
                    formData.signature_date
                      ? formData.signature_date.split('T')[0]
                      : ''
                  }
                  onChange={e => {
                    const dateValue = e.target.value
                      ? new Date(e.target.value).toISOString()
                      : ''
                    setFormData({ ...formData, signature_date: dateValue })
                    if (fieldErrors.signature_date) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.signature_date
                        return next
                      })
                    }
                  }}
                  error={!!fieldErrors.signature_date}
                  disabled={isViewMode}
                />
                {fieldErrors.signature_date && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.signature_date}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Party & User References */}
          <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm">
                2
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Party & User References
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Contact Person</Label>
                <Select
                  value={
                    formData.contact_person_id
                      ? formData.contact_person_id
                      : 'none'
                  }
                  onValueChange={value => {
                    setFormData({
                      ...formData,
                      contact_person_id: value === 'none' ? '' : value
                    })
                    if (fieldErrors.contact_person_id) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.contact_person_id
                        return next
                      })
                    }
                  }}
                  disabled={isViewMode}
                  key={`contact-person-${parties.length}-${formData.contact_person_id || 'none'}`}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select contact person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {parties.map((party: any) => (
                      <SelectItem key={party.id} value={party.id}>
                        {party.display_name || party.legal_name} (
                        {party.party_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.contact_person_id && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.contact_person_id}
                  </p>
                )}
              </div>

              <div>
                <Label>Bill To Party</Label>
                <Select
                  value={
                    formData.bill_to_party_id
                      ? formData.bill_to_party_id
                      : 'none'
                  }
                  onValueChange={value => {
                    setFormData({
                      ...formData,
                      bill_to_party_id: value === 'none' ? '' : value
                    })
                    if (fieldErrors.bill_to_party_id) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.bill_to_party_id
                        return next
                      })
                    }
                  }}
                  disabled={isViewMode}
                  key={`bill-to-party-${parties.length}-${formData.bill_to_party_id || 'none'}`}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select bill to party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {parties.map((party: any) => (
                      <SelectItem key={party.id} value={party.id}>
                        {party.display_name || party.legal_name} (
                        {party.party_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.bill_to_party_id && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.bill_to_party_id}
                  </p>
                )}
              </div>

              <div>
                <Label>Approver</Label>
                <Select
                  value={formData.approver_id ? formData.approver_id : 'none'}
                  onValueChange={value => {
                    setFormData({
                      ...formData,
                      approver_id: value === 'none' ? '' : value
                    })
                    if (fieldErrors.approver_id) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.approver_id
                        return next
                      })
                    }
                  }}
                  disabled={isViewMode}
                  key={`approver-${users.length}-${parties.length}-${formData.approver_id || 'none'}`}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select approver (User or Party)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {users.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>👤 Users</SelectLabel>
                        {users.map((user: any) => (
                          <SelectItem key={`user_${user.id}`} value={user.id}>
                            {user.name || user.email}{' '}
                            {user.email ? `(${user.email})` : ''}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    {parties.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>🏢 Parties</SelectLabel>
                        {parties.map((party: any) => (
                          <SelectItem
                            key={`party_${party.id}`}
                            value={party.id}
                          >
                            {party.display_name || party.legal_name} (
                            {party.party_type})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
                {fieldErrors.approver_id && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.approver_id}
                  </p>
                )}
              </div>

              <div>
                <Label>Customer Signatory</Label>
                <Select
                  value={
                    formData.customer_signatory_id
                      ? formData.customer_signatory_id
                      : 'none'
                  }
                  onValueChange={value => {
                    setFormData({
                      ...formData,
                      customer_signatory_id: value === 'none' ? '' : value
                    })
                    if (fieldErrors.customer_signatory_id) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.customer_signatory_id
                        return next
                      })
                    }
                  }}
                  disabled={isViewMode}
                  key={`customer-signatory-${parties.length}-${formData.customer_signatory_id || 'none'}`}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select customer signatory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {parties.map((party: any) => (
                      <SelectItem key={party.id} value={party.id}>
                        {party.display_name || party.legal_name} (
                        {party.party_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.customer_signatory_id && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.customer_signatory_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Dates */}
          <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm">
                3
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Dates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Issued Date</Label>
                <Input
                  type="date"
                  value={
                    formData.issued_date
                      ? new Date(formData.issued_date)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={e => {
                    const dateValue = e.target.value
                    setFormData({
                      ...formData,
                      issued_date: dateValue
                        ? new Date(dateValue).toISOString()
                        : ''
                    })
                    if (fieldErrors.issued_date) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.issued_date
                        return next
                      })
                    }
                  }}
                  error={!!fieldErrors.issued_date}
                  disabled={isViewMode}
                />
                {fieldErrors.issued_date && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.issued_date}
                  </p>
                )}
              </div>

              <div>
                <Label>Valid Until Date</Label>
                <Input
                  type="date"
                  value={
                    formData.valid_until_date
                      ? new Date(formData.valid_until_date)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={e => {
                    const dateValue = e.target.value
                    setFormData({
                      ...formData,
                      valid_until_date: dateValue
                        ? new Date(dateValue).toISOString()
                        : ''
                    })
                    if (fieldErrors.valid_until_date) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.valid_until_date
                        return next
                      })
                    }
                  }}
                  error={!!fieldErrors.valid_until_date}
                  disabled={isViewMode}
                />
                {fieldErrors.valid_until_date && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.valid_until_date}
                  </p>
                )}
              </div>

              <div>
                <Label>Approved Date</Label>
                <Input
                  type="date"
                  value={
                    formData.approved_date
                      ? new Date(formData.approved_date)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={e => {
                    const dateValue = e.target.value
                    setFormData({
                      ...formData,
                      approved_date: dateValue
                        ? new Date(dateValue).toISOString()
                        : ''
                    })
                    if (fieldErrors.approved_date) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.approved_date
                        return next
                      })
                    }
                  }}
                  error={!!fieldErrors.approved_date}
                  disabled={isViewMode}
                />
                {fieldErrors.approved_date && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.approved_date}
                  </p>
                )}
              </div>

              <div>
                <Label>Accepted Date</Label>
                <Input
                  type="date"
                  value={
                    formData.accepted_date
                      ? new Date(formData.accepted_date)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={e => {
                    const dateValue = e.target.value
                    setFormData({
                      ...formData,
                      accepted_date: dateValue
                        ? new Date(dateValue).toISOString()
                        : ''
                    })
                    if (fieldErrors.accepted_date) {
                      setFieldErrors(prev => {
                        const next = { ...prev }
                        delete next.accepted_date
                        return next
                      })
                    }
                  }}
                  error={!!fieldErrors.accepted_date}
                  disabled={isViewMode}
                />
                {fieldErrors.accepted_date && (
                  <p className="mt-1 text-sm text-red-400">
                    {fieldErrors.accepted_date}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Line Items */}
          <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5e8ed] dark:border-[#1E293B] pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm">
                  4
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    Line Items
                  </h2>
                  <span className="px-2 py-0.5 bg-[#f3f5f8] dark:bg-[#1E293B] text-neutral-500 dark:text-neutral-400 text-xs rounded-full font-medium">
                    {formData.items.length}
                  </span>
                </div>
              </div>
              {!isViewMode && (
                <button
                  type="button"
                  id="add-item-btn"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
                >
                  <Plus size={16} />
                  Add Item
                  <span className="hidden sm:inline text-xs text-indigo-300 ml-1">
                    (Ctrl+Enter)
                  </span>
                </button>
              )}
            </div>

            {fieldErrors.items && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-400">{fieldErrors.items}</p>
              </div>
            )}

            {/* Empty State */}
            {formData.items.length === 0 && (
              <div className="text-center py-12 bg-[#f3f5f8] dark:bg-[#1E293B] rounded-lg border border-dashed border-[#e5e8ed] dark:border-[#1E293B]">
                <div className="w-12 h-12 bg-[#f3f5f8] dark:bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-neutral-400 dark:text-neutral-500" />
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 mb-2">
                  No line items yet
                </p>
                <p className="text-neutral-400 dark:text-neutral-500 text-sm mb-4">
                  Add your first item to get started
                </p>
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Add First Item
                  </button>
                )}
              </div>
            )}

            {formData.items.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formData.items.map((_, index) => index)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <SortableItem
                        key={index}
                        id={index}
                        item={item}
                        index={index}
                        isViewMode={isViewMode}
                        fieldErrors={fieldErrors}
                        updateItem={updateItem}
                        removeItem={removeItem}
                        duplicateItem={duplicateItem}
                        setFieldErrors={setFieldErrors}
                        itemsLength={formData.items.length}
                        currency={formData.currency || 'THB'}
                        descriptionInputRef={(el: HTMLInputElement | null) => {
                          descriptionInputRefs.current[index] = el
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Summary Section -- always show, even with 0 items */}
            {(() => {
              const summaryCurrency =
                formData.currency && formData.currency.trim()
                  ? formData.currency
                  : 'THB'
              const vatAmount =
                (formData.total_amount * formData.vat_rate) / 100
              const grandTotal = formData.total_amount + vatAmount
              return (
                <div className="mt-6 pt-6 border-t border-[#e5e8ed] dark:border-[#1E293B]">
                  <div className="flex flex-col gap-3">
                    {/* Subtotal Row */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Subtotal
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-300 font-medium tabular-nums">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: summaryCurrency,
                          minimumFractionDigits: 2
                        }).format(formData.total_amount)}
                      </span>
                    </div>
                    {/* VAT Row */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        VAT ({formData.vat_rate}%)
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-300 font-medium tabular-nums">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: summaryCurrency,
                          minimumFractionDigits: 2
                        }).format(vatAmount)}
                      </span>
                    </div>
                    {/* Divider */}
                    <div className="border-t border-[#e5e8ed] dark:border-[#1E293B] my-2"></div>
                    {/* Total Row - Aligned Layout */}
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-400 dark:text-neutral-500 mb-1">
                          Currency
                        </span>
                        <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {summaryCurrency}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-neutral-400 dark:text-neutral-500 mb-1">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: summaryCurrency,
                            minimumFractionDigits: 2
                          }).format(grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          {!isViewMode && (
            <div className="flex justify-end gap-3">
              <Link
                href="/dashboard/quotations"
                className="px-6 py-2 border border-[#e0e4ea] dark:border-[#334155] text-neutral-500 dark:text-neutral-400 rounded-lg hover:bg-[#f0f2f6] dark:hover:bg-[#1E293B] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                <span>
                  {isPending
                    ? 'Saving...'
                    : isNew
                      ? 'Create Quotation'
                      : 'Update Quotation'}
                </span>
              </button>
            </div>
          )}
        </form>
      )}

      {/* Audit Log Timeline - Only show for existing quotations */}
      {!isNew && !showPreview && (
        <div className="max-w-4xl mx-auto mt-6">
          <AuditLogTimeline quotationId={params.id as string} />
        </div>
      )}
    </div>
  )
}
