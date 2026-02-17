'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Search, Book } from 'lucide-react'
import Button from '@/ui/Button'
import { usePagination } from '@/hooks/use-pagination'
import { revalidateQuotations } from './actions'
import { formatDateShort } from '@/utils/date'
import {
  DataTable,
  Column,
  StatusBadge,
  ActionButton,
  PaginationMeta
} from '@/components/dashboard/DataTable'
import PermissionGate from '@/components/dashboard/PermissionGate'

interface QuotationItem {
  description: string
  quantity: number
  price: number
}

interface Quotation {
  id: string
  quotation_number: string
  contact_person_id?: string | null
  bill_to_party_id?: string | null
  approver_id?: string | null
  customer_signatory_id?: string | null
  issued_date?: string | null
  valid_until_date?: string | null
  approved_date?: string | null
  accepted_date?: string | null
  status: string
  total_amount: number
  currency: string
  items: QuotationItem[]
  created_at: string
  updated_at: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

const statusColors: Record<string, string> = {
  draft: 'badge-default',
  sent: 'badge-info',
  accepted: 'badge-success',
  approved: 'badge-success',
  rejected: 'badge-danger'
}

// Case-insensitive status color mapping
const getStatusColor = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || 'draft'
  return statusColors[normalizedStatus] || 'badge-default'
}

const formatCurrency = (amount: number, currency: string = 'THB') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export default function QuotationsPage() {
  const queryClient = useQueryClient()
  const { page, limit, nextPage, prevPage } = usePagination()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: paginatedResult,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['quotations', page, limit, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (searchQuery) params.append('search', searchQuery)

      const res = await apiClient.get(`/quotations?${params}`)
      return res.data as PaginatedResponse<Quotation>
    }
  })

  const quotations = paginatedResult?.data || []
  const meta = paginatedResult?.meta

  const { mutate: deleteQuotation } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/quotations/${id}`)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      await revalidateQuotations()
    },
    onError: () => {
      alert('Failed to delete quotation')
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      deleteQuotation(id)
    }
  }

  const columns: Column<Quotation>[] = [
    {
      header: 'Quotation Number',
      accessorKey: 'quotation_number',
      className: 'text-heading font-medium'
    },
    {
      header: 'Status',
      cell: item => (
        <StatusBadge
          status={item.status || 'Draft'}
          colorMap={{
            [item.status || 'Draft']: getStatusColor(item.status || 'Draft')
          }}
        />
      )
    },
    {
      header: 'Total Amount',
      cell: item => (
        <span className="text-body">
          {formatCurrency(item.total_amount, item.currency)}
        </span>
      )
    },
    {
      header: 'Issued Date',
      cell: item => (
        <span className="text-muted">
          {formatDateShort(item.issued_date ?? undefined)}
        </span>
      )
    },
    {
      header: 'Valid Until',
      cell: item => (
        <span className="text-muted">
          {formatDateShort(item.valid_until_date ?? undefined)}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      cell: item => (
        <div className="flex justify-end gap-1">
          <ActionButton
            href={`/dashboard/quotations/${item.id}`}
            icon={<Pencil size={16} />}
            title="View/Edit"
          />
          <ActionButton
            onClick={() => handleDelete(item.id)}
            icon={<Trash2 size={16} />}
            variant="danger"
            title="Delete"
          />
        </div>
      )
    }
  ]

  const headerActions = (
    <>
      <Link href="/dashboard/quotations/docs" className="hidden sm:block">
        <Button variant="outline" size="md" className="!rounded-lg gap-2">
          <Book size={20} />
          <span>API Docs</span>
        </Button>
      </Link>
      <Link href="/dashboard/quotations/new">
        <Button
          variant="primary"
          size="md"
          className="!rounded-lg gap-2 w-full sm:w-auto"
        >
          <PlusCircle size={20} />
          <span>Create Quotation</span>
        </Button>
      </Link>
    </>
  )

  const searchSlot = (
    <div className="relative w-full lg:max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by quotation number..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="input-base pl-10"
      />
    </div>
  )

  return (
    <PermissionGate>
      <DataTable
        data={quotations}
        columns={columns}
        keyExtractor={item => item.id}
        isLoading={isLoading}
        error={isError}
        emptyMessage="No quotations found. Create your first quotation to get started."
        errorMessage="Failed to load quotations. Please try again."
        title="Quotations"
        subtitle="Manage quotations"
        headerActions={headerActions}
        searchSlot={searchSlot}
        pagination={meta}
        currentPage={page}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </PermissionGate>
  )
}
