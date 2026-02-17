'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import {
  ArrowLeft,
  Save,
  PlusCircle,
  X,
  Download,
  Sparkles,
  Trash2,
  Plus,
  Pencil,
  Check
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Input } from '@/ui/Input'
import { Label } from '@/ui/Label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/ui/Select'
import PDFExportButton from '@/components/contracts/PDFExport'
import ContractPreview from '@/components/contracts/ContractPreview'
import ApproveContractButton from '@/components/contracts/ApproveContractButton'
import { usePdfGeneration } from '@/hooks/usePdfGeneration'
import { extractHtmlWithStyles } from '@/lib/extractHtml'
import { formatDateTimeShort } from '@/utils/date'

// Dynamic import to avoid SSR issues with TipTap
const TipTapEditor = dynamic(
  () => import('@/components/contracts/TipTapEditor'),
  {
    ssr: false,
    loading: () => <div className="p-4 text-neutral-500">Loading editor...</div>
  }
)

interface Party {
  id: string
  legal_name: string
  display_name?: string | null
  tax_id?: string | null
  address?: string | null
}

interface ContractParty {
  party_id: string
  role: string
  sign_label?: string
  signed_date?: string
}

interface ContractFormData {
  contract_number?: string
  origin: 'Internal' | 'External'
  title: string
  current_status: 'Draft' | 'Active' | 'Expired' | 'Terminated'
  content: string
  parties: ContractParty[]
}

interface ContractDetail {
  id: string
  contract_number: string
  origin: 'Internal' | 'External'
  title: string
  current_status: 'Draft' | 'Active' | 'Expired' | 'Terminated'
  parties?: Array<{
    id: string
    legal_name: string
    display_name?: string
    role: string
    sign_label?: string
  }>
  rules?: string[]
  latest_version?: {
    content_text: string
  }
  party_signatures?: Array<{
    role: string
    signed_date: string
    signature_url: string
  }>
}

interface ContractVersion {
  id: string
  version_number: number
  content_text: string
  created_at: string
  is_final: boolean
  file_url?: string
}

export default function ContractFormPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const isNew = !params.id || params.id === 'new'

  // Ref for easy height calculation
  const contentRef = useRef<HTMLDivElement>(null)
  const [pageHeight, setPageHeight] = useState('297mm')

  const [formData, setFormData] = useState<ContractFormData>({
    contract_number: '',
    origin: 'Internal',
    title: '',
    current_status: 'Draft',
    content: '',
    parties: []
  })
  const [newParty, setNewParty] = useState<ContractParty>({
    party_id: '',
    role: '',
    sign_label: '',
    signed_date: ''
  })
  const [editingPartyIndex, setEditingPartyIndex] = useState<number | null>(
    null
  )
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Calculate pages on content change (dynamic page height)
  useEffect(() => {
    // Small delay to allow DOM to update
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const A4_HEIGHT_PX = 1123 // Approx 297mm in pixels (96 DPI)
        const contentHeight = contentRef.current.scrollHeight
        // Calculate pages: minimum 1
        let pages = Math.ceil(contentHeight / A4_HEIGHT_PX)
        if (pages < 1) pages = 1

        // Ensure the container is always a multiple of 297mm
        setPageHeight(`${pages * 297}mm`)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [formData.content, formData.parties])

  // AI Rules State
  const [rules, setRules] = useState<string[]>([])
  const [newRule, setNewRule] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  // PDF Generation hook
  const {
    previewPdf,
    savePdf,
    isGenerating: isPdfGenerating
  } = usePdfGeneration()

  // Local loading state for immediate feedback during HTML extraction
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  // Fetch available parties
  const { data: availableParties = [] } = useQuery({
    queryKey: ['parties'],
    queryFn: async () => {
      const res = await apiClient.get('/parties')
      return res.data as Party[]
    }
  })

  // Fetch contract versions
  const { data: versions = [] } = useQuery({
    queryKey: ['contract-versions', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/contracts/${params.id}/versions`)
      return res.data as ContractVersion[]
    },
    enabled: !isNew,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false
  })

  const loadVersion = (version: ContractVersion) => {
    if (
      confirm(
        `Load Version ${version.version_number}? This will replace current content.`
      )
    ) {
      setFormData(prev => ({ ...prev, content: version.content_text }))
    }
  }

  // Fetch contract details (for edit mode)
  const { data: contractDetail } = useQuery({
    queryKey: ['contracts', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/contracts/${params.id}`)
      return res.data as ContractDetail
    },
    enabled: !isNew,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false
  })

  // Update form data when contract detail is loaded
  useEffect(() => {
    if (contractDetail) {
      setFormData({
        contract_number: contractDetail.contract_number,
        origin: contractDetail.origin,
        title: contractDetail.title,
        current_status: contractDetail.current_status,
        content: contractDetail.latest_version?.content_text || '',
        parties:
          contractDetail.parties?.map((p: any) => ({
            party_id: p.id,
            role: p.role,
            sign_label: p.sign_label,
            signed_date: p.signed_date // Assuming this exists in DB, or we'll add it
          })) || []
      })
      setRules(contractDetail.rules || [])
    }
  }, [contractDetail])

  // Helper to get full party object
  const getParty = (partyId: string) =>
    availableParties.find(p => p.id === partyId)

  // Helper to get generic name for display
  const getPartyName = (partyId: string) => {
    const party = getParty(partyId)
    return party?.display_name || party?.legal_name || partyId
  }

  // Helper to generate and upload PDF using Gotenberg
  const generateAndUploadPDF = async (contractNum: string) => {
    if (!contentRef.current) {
      throw new Error('Content ref is not available')
    }

    // Extract HTML from the preview component (now async)
    const html = await extractHtmlWithStyles(contentRef.current)

    // Generate filename
    const filename = `contract-${contractNum}.pdf`

    // Use Gotenberg service to generate and upload
    const url = await savePdf(html, filename)

    if (!url) {
      throw new Error('Failed to generate and upload PDF')
    }

    return url
  }

  // Preview PDF handler with immediate loading feedback
  const handlePreviewPdf = async () => {
    if (!contentRef.current) {
      alert('Content is not ready for preview')
      return
    }

    // Set loading immediately for instant feedback
    setIsPreviewLoading(true)

    try {
      // Extract HTML (this takes time)
      const html = await extractHtmlWithStyles(contentRef.current)
      // Generate and preview PDF
      await previewPdf(html)
    } catch (error) {
      console.error('Preview failed:', error)
      alert('Failed to generate preview')
    } finally {
      setIsPreviewLoading(false)
    }
  }

  // Create/Update contract mutation
  const { mutate: saveContract, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      // 1. If NEW, generate PDF with placeholder first (or handle post-creation)
      let fileUrl = ''
      const isFinal = payload.current_status === 'Active'

      if (isNew) {
        // Create Contract first to get contract number
        const res = await apiClient.post('/contracts', payload)
        const contractNumber = res.data.contract_number

        // Generate and upload PDF with actual contract number
        try {
          fileUrl = await generateAndUploadPDF(contractNumber)
        } catch (e) {
          console.error('Failed to generate PDF', e)
        }

        // Create version with PDF URL
        if (fileUrl) {
          await apiClient.post(`/contracts/${res.data.id}/versions`, {
            content_text: payload.content,
            is_final: isFinal,
            file_url: fileUrl
          })
        }

        return res.data
      } else {
        // Update existing contract
        // Update contract metadata including parties
        await apiClient.put(`/contracts/${params.id}`, {
          title: payload.title,
          current_status: payload.current_status,
          parties: payload.parties,
          rules: payload.rules
        })

        // Generate and upload PDF
        try {
          fileUrl = await generateAndUploadPDF(
            contractDetail?.contract_number || ''
          )
        } catch (e) {
          console.error('Failed to generate PDF', e)
        }

        // Create new version with PDF URL
        await apiClient.post(`/contracts/${params.id}/versions`, {
          content_text: payload.content,
          is_final: isFinal,
          file_url: fileUrl
        })

        return { success: true }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contract-versions'] })
      router.push('/dashboard/contracts')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save contract')
    }
  })

  // Add/Edit Party Logic
  const addParty = () => {
    if (newParty.party_id) {
      if (editingPartyIndex !== null) {
        const updatedParties = [...formData.parties]
        updatedParties[editingPartyIndex] = newParty
        setFormData({ ...formData, parties: updatedParties })
        setEditingPartyIndex(null)
      } else {
        setFormData({
          ...formData,
          parties: [...formData.parties, newParty]
        })
      }
      setNewParty({ party_id: '', role: '', sign_label: '', signed_date: '' })
    }
  }

  const editParty = (index: number) => {
    setEditingPartyIndex(index)
    setNewParty(formData.parties[index])
  }

  const removeParty = (index: number) => {
    if (editingPartyIndex === index) {
      setEditingPartyIndex(null)
      setNewParty({ party_id: '', role: '', sign_label: '', signed_date: '' })
    }
    setFormData({
      ...formData,
      parties: formData.parties.filter((_, i) => i !== index)
    })
  }

  // Validations & AI Logic
  const handleAddRule = () => {
    if (newRule.trim()) {
      if (editingRuleIndex !== null) {
        const updatedRules = [...rules]
        updatedRules[editingRuleIndex] = newRule.trim()
        setRules(updatedRules)
        setEditingRuleIndex(null)
      } else {
        setRules([...rules, newRule.trim()])
      }
      setNewRule('')
    }
  }

  const editRule = (index: number) => {
    setEditingRuleIndex(index)
    setNewRule(rules[index])
  }

  const handleDeleteRule = (index: number) => {
    if (editingRuleIndex === index) {
      setEditingRuleIndex(null)
      setNewRule('')
    }
    setRules(rules.filter((_, i) => i !== index))
  }

  const handleGenerateAI = async () => {
    try {
      setIsGenerating(true)
      const fullParties = formData.parties.map(p => {
        const party = availableParties.find(ap => ap.id === p.party_id)
        return {
          legal_name: party?.legal_name || '',
          display_name: party?.display_name,
          tax_id: party?.tax_id,
          address: party?.address,
          role: p.role,
          sign_label: p.sign_label
        }
      })

      const res = await apiClient.post('/contracts/generate', {
        parties: fullParties,
        rules: rules,
        existingContent: formData.content
      })

      setFormData(prev => ({ ...prev, content: res.data.content }))
    } catch (e: any) {
      if (e.response?.status === 400) {
        alert('BAD REQUEST: The AI detected an out-of-scope request.')
      } else {
        console.error(e)
        alert('Failed to generate contract content.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const payload: any = {
      origin: formData.origin,
      title: formData.title,
      current_status: formData.current_status,
      parties: formData.parties,
      content: formData.content,
      rules: rules
    }

    saveContract(payload)
  }

  // Live preview data for PDF
  const previewContract = {
    contract_number:
      formData.contract_number || contractDetail?.contract_number || 'DRAFT',
    title: formData.title,
    origin: formData.origin,
    current_status: formData.current_status,
    parties: formData.parties.map(p => {
      const partyObj = getParty(p.party_id)

      // Find signature from contract detail if available
      let signatureUrl = undefined
      if (contractDetail?.party_signatures) {
        // Map Thai roles to signature roles (party_a, party_b, etc)
        // Also handle cases where role might already be in English (legacy/API data)
        let signatureRole = ''
        const lowerRole = p.role?.toLowerCase()?.trim() || ''

        if (['ผู้ว่าจ้าง', 'employer', 'party_a', 'partya'].includes(lowerRole))
          signatureRole = 'party_a'
        else if (
          ['ผู้รับจ้าง', 'contractor', 'party_b', 'partyb'].includes(lowerRole)
        )
          signatureRole = 'party_b'
        else if (
          ['พยาน 1', 'witness 1', 'witness_1', 'witness1'].includes(lowerRole)
        )
          signatureRole = 'witness_1'
        else if (
          ['พยาน 2', 'witness 2', 'witness_2', 'witness2'].includes(lowerRole)
        )
          signatureRole = 'witness_2'

        console.log(`[DEBUG] Role mapping: "${p.role}" -> "${signatureRole}"`)

        const sig = contractDetail.party_signatures.find(
          s => s.role === signatureRole
        )
        if (sig) {
          signatureUrl = sig.signature_url
        }
      }

      return {
        legal_name: partyObj?.legal_name || '...',
        display_name: partyObj?.display_name || undefined,
        role: p.role,
        sign_label: p.sign_label,
        signed_date: p.signed_date,
        signature_url: signatureUrl
      }
    }),
    latest_version: {
      content_text: formData.content
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/contracts"
            className="p-2 hover:bg-[#f0f2f6] dark:hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <ArrowLeft
              size={20}
              className="text-neutral-500 dark:text-neutral-400"
            />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              {isNew ? 'Create Contract' : 'Edit Contract'}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              {isNew ? 'Create a new contract' : 'Update contract details'}
            </p>
          </div>
        </div>

        <PDFExportButton
          contract={previewContract}
          mode="gotenberg"
          contentRef={contentRef}
          disabled={!formData.content}
        />
      </div>

      {!isNew && formData.current_status !== 'Active' && (
        <ApproveContractButton
          contractId={params.id as string}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ['contracts', params.id]
            })
            // Update local state if needed
            setFormData(prev => ({ ...prev, current_status: 'Active' }))
          }}
        />
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contract Number *</Label>
              <Input
                type="text"
                value={
                  formData.contract_number || 'Auto-generated (CTR-YYYYMM-XXXX)'
                }
                disabled
              />
              {isNew && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Contract number will be auto-generated in format:
                  CTR-YYYYMM-XXXX
                </p>
              )}
            </div>

            <div>
              <Label>Origin *</Label>
              <Select
                value={formData.origin}
                onValueChange={value =>
                  setFormData({
                    ...formData,
                    origin: value as 'Internal' | 'External'
                  })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Title *</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={formData.current_status}
              onValueChange={value =>
                setFormData({
                  ...formData,
                  current_status: value as any
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Parties
          </h2>

          {/* Existing Parties */}
          {formData.parties.length > 0 && (
            <div className="space-y-2">
              {formData.parties.map((party, index) => {
                if (editingPartyIndex === index) {
                  return (
                    <div
                      key={index}
                      className="flex gap-2 p-2 bg-white dark:bg-[#0F172A] border border-indigo-500/50 rounded-lg"
                    >
                      <Select
                        value={newParty.party_id || 'none'}
                        onValueChange={value =>
                          setNewParty({
                            ...newParty,
                            party_id: value === 'none' ? '' : value
                          })
                        }
                      >
                        <SelectTrigger className="flex-1 px-3 py-1.5 text-sm">
                          <SelectValue placeholder="Select Party" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select Party</SelectItem>
                          {availableParties.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.display_name || p.legal_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="text"
                        value={newParty.sign_label || ''}
                        onChange={e =>
                          setNewParty({
                            ...newParty,
                            sign_label: e.target.value
                          })
                        }
                        placeholder="Label"
                        className="px-3 py-1.5 text-sm w-32"
                      />

                      <Select
                        value={newParty.role || 'none'}
                        onValueChange={value =>
                          setNewParty({
                            ...newParty,
                            role: value === 'none' ? '' : value
                          })
                        }
                      >
                        <SelectTrigger className="flex-1 px-3 py-1.5 text-sm">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Select Role</SelectItem>
                          <SelectItem value="ผู้ว่าจ้าง">
                            ผู้ว่าจ้าง (Employer)
                          </SelectItem>
                          <SelectItem value="ผู้รับจ้าง">
                            ผู้รับจ้าง (Contractor)
                          </SelectItem>
                          <SelectItem value="พยาน 1">
                            พยาน 1 (Witness 1)
                          </SelectItem>
                          <SelectItem value="พยาน 2">
                            พยาน 2 (Witness 2)
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        type="date"
                        value={newParty.signed_date || ''}
                        onChange={e =>
                          setNewParty({
                            ...newParty,
                            signed_date: e.target.value
                          })
                        }
                        className="px-3 py-1.5 text-sm w-36"
                      />

                      <button
                        type="button"
                        onClick={addParty}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        title="Save Changes"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPartyIndex(null)
                          setNewParty({
                            party_id: '',
                            role: '',
                            sign_label: '',
                            signed_date: ''
                          })
                        }}
                        className="p-1.5 bg-[#e0e4ea] hover:bg-[#dce4ed] text-neutral-900 rounded-lg transition-colors"
                        title="Cancel Edit"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )
                }

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#f8f9fb] dark:bg-[#1E293B] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {getPartyName(party.party_id)}
                      </span>
                      {party.sign_label && (
                        <span className="text-neutral-500 dark:text-neutral-400 text-sm bg-white dark:bg-[#0F172A] px-2 py-0.5 rounded">
                          {party.sign_label}
                        </span>
                      )}
                      {party.role && (
                        <span className="text-indigo-600 dark:text-indigo-400 text-sm">
                          {party.role}
                        </span>
                      )}
                      {party.signed_date && (
                        <span className="text-neutral-400 dark:text-neutral-500 text-xs">
                          ({party.signed_date})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => editParty(index)}
                        className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-[#f0f2f6] dark:hover:bg-[#1E293B] rounded transition-colors"
                        title="Edit Party"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeParty(index)}
                        className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-red-400 hover:bg-[#f0f2f6] dark:hover:bg-[#1E293B] rounded transition-colors"
                        title="Remove Party"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add Party Form (Hidden when editing) */}
          {editingPartyIndex === null && (
            <div className="flex gap-2">
              <Select
                value={newParty.party_id || 'none'}
                onValueChange={value =>
                  setNewParty({
                    ...newParty,
                    party_id: value === 'none' ? '' : value
                  })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select Party</SelectItem>
                  {availableParties.map(party => (
                    <SelectItem key={party.id} value={party.id}>
                      {party.display_name || party.legal_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="text"
                value={newParty.sign_label || ''}
                onChange={e =>
                  setNewParty({ ...newParty, sign_label: e.target.value })
                }
                placeholder="Label"
                className="w-48"
              />

              <Select
                value={newParty.role || 'none'}
                onValueChange={value =>
                  setNewParty({
                    ...newParty,
                    role: value === 'none' ? '' : value
                  })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select Role</SelectItem>
                  <SelectItem value="ผู้ว่าจ้าง">
                    ผู้ว่าจ้าง (Employer)
                  </SelectItem>
                  <SelectItem value="ผู้รับจ้าง">
                    ผู้รับจ้าง (Contractor)
                  </SelectItem>
                  <SelectItem value="พยาน 1">พยาน 1 (Witness 1)</SelectItem>
                  <SelectItem value="พยาน 2">พยาน 2 (Witness 2)</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={newParty.signed_date || ''}
                onChange={e =>
                  setNewParty({ ...newParty, signed_date: e.target.value })
                }
                className="w-40"
              />

              <button
                type="button"
                onClick={addParty}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <PlusCircle size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Rules & Purpose */}
        <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Rules & Purpose
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Define the purpose and specific constraints for this contract. These
            rules will be stored and used for AI generation.
          </p>

          <div>
            {editingRuleIndex === null && (
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  value={newRule}
                  onChange={e => setNewRule(e.target.value)}
                  onKeyDown={e =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddRule())
                  }
                  placeholder="Add a rule (e.g. 'Must include NDA clause')"
                  className="flex-1"
                />
                <button
                  onClick={handleAddRule}
                  type="button"
                  className="p-2 bg-[#f3f5f8] dark:bg-[#1E293B] hover:bg-[#e5e8ed] dark:hover:bg-[#334155] text-neutral-900 dark:text-white rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
            {rules.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {rules.map((rule, idx) => {
                  if (editingRuleIndex === idx) {
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-[#f8f9fb] dark:bg-[#1E293B] border border-indigo-500/50 rounded-full pl-3 pr-1 py-1"
                      >
                        <input
                          type="text"
                          value={newRule}
                          onChange={e => setNewRule(e.target.value)}
                          onKeyDown={e =>
                            e.key === 'Enter' &&
                            (e.preventDefault(), handleAddRule())
                          }
                          className="bg-transparent border-none text-neutral-900 dark:text-white text-sm focus:outline-none w-48"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleAddRule}
                          className="p-0.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                          title="Save Rule"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRuleIndex(null)
                            setNewRule('')
                          }}
                          className="p-0.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                          title="Cancel Edit"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  }
                  return (
                    <span
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-full text-sm group transition-all"
                    >
                      {rule}
                      <div className="flex items-center gap-1 border-l border-[#e5e8ed] dark:border-[#1E293B] ml-1 pl-1">
                        <button
                          type="button"
                          onClick={() => editRule(idx)}
                          className="hover:text-neutral-900 dark:hover:text-white transition-colors p-0.5"
                          title="Edit Rule"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRule(idx)}
                          className="hover:text-red-400 transition-colors p-0.5"
                          title="Delete Rule"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Contract Content & Versions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {/* AI Rules & Generation */}
            {/* AI Generation Trigger */}
            <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Sparkles
                    className="text-indigo-600 dark:text-indigo-400"
                    size={20}
                  />
                  AI Assistant
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Generate content using the Parties and Rules defined above.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isGenerating ? (
                  <Sparkles className="animate-spin" size={20} />
                ) : (
                  <Sparkles size={20} />
                )}
                <span>
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Contract Content
                </h2>
                <div className="flex bg-[#f8f9fb] dark:bg-[#1E293B] p-1 rounded-lg border border-[#e5e8ed] dark:border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                      activeTab === 'edit'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Edit Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                      activeTab === 'preview'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Preview & Print
                  </button>
                </div>
              </div>

              {/* Edit Mode */}
              <div className={activeTab === 'edit' ? 'block' : 'hidden'}>
                <div className="bg-white text-black p-4 min-h-[500px] border border-[#e0e4ea]">
                  <TipTapEditor
                    content={formData.content}
                    onChange={content => setFormData({ ...formData, content })}
                  />
                </div>
              </div>

              {/* Preview Mode */}
              <div className={activeTab === 'preview' ? 'block' : 'hidden'}>
                <ContractPreview
                  content={formData.content}
                  contractNumber={formData.contract_number || ''}
                  title={formData.title}
                  contentRef={contentRef}
                  isActive={activeTab === 'preview'}
                  parties={previewContract.parties}
                />
              </div>
            </div>
          </div>

          {/* Version History Sidebar */}
          {!isNew && (
            <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-4 h-fit">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Version History
              </h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {versions.length === 0 ? (
                  <p className="text-neutral-400 dark:text-neutral-500 text-sm">
                    No versions yet.
                  </p>
                ) : (
                  versions.map(version => (
                    <div
                      key={version.id}
                      className="p-3 bg-[#f8f9fb] dark:bg-[#1E293B] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] hover:border-[#dce4ed] dark:hover:border-[#334155] transition-colors cursor-pointer group"
                      onClick={() => loadVersion(version)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                          v{version.version_number}
                        </span>
                        {version.is_final && (
                          <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20">
                            Final
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 dark:text-neutral-500 mb-2">
                        {formatDateTimeShort(version.created_at)}
                      </div>

                      {/* Download Button */}
                      {version.file_url && (
                        <a
                          href={version.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1.5 bg-white dark:bg-[#0F172A] rounded border border-[#e5e8ed] dark:border-[#1E293B] hover:border-[#dce4ed] dark:hover:border-[#334155] w-fit"
                          onClick={e => e.stopPropagation()}
                        >
                          <Download size={12} />
                          Download PDF
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/contracts"
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
            <span>{isPending ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
