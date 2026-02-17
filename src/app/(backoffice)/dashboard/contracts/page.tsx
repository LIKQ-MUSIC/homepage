'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react'
import Button from '@/ui/Button'
import { usePagination } from '@/hooks/use-pagination'
import { formatDateShort } from '@/utils/date'
import {
  DataTable,
  Column,
  StatusBadge,
  ActionButton,
  PaginationMeta
} from '@/components/dashboard/DataTable'
import PermissionGate from '@/components/dashboard/PermissionGate'

interface Contract {
  id: string
  contract_number: string
  origin: 'Internal' | 'External'
  title: string
  current_status: 'Draft' | 'Active' | 'Expired' | 'Terminated'
  created_at: string
}

interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

const statusColors: Record<string, string> = {
  draft: 'badge-draft',
  active: 'badge-approved',
  expired: 'badge-warning',
  terminated: 'badge-danger'
}

// Case-insensitive status color mapping
const getStatusColor = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || 'draft'
  return statusColors[normalizedStatus] || 'badge-default'
}

export default function ContractsPage() {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOrigin, setFilterOrigin] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { page, limit, nextPage, prevPage } = usePagination()

  const {
    data: paginatedResult,
    isLoading,
    isError
  } = useQuery({
    queryKey: [
      'contracts',
      filterStatus,
      filterOrigin,
      searchQuery,
      page,
      limit
    ],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filterStatus) params.append('status', filterStatus)
      if (filterOrigin) params.append('origin', filterOrigin)
      if (searchQuery) params.append('search', searchQuery)
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const res = await apiClient.get(`/contracts?${params}`)
      return res.data as PaginatedResponse<Contract>
    }
  })

  const contracts = paginatedResult?.data || []
  const meta = paginatedResult?.meta

  const { mutate: deleteContract } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/contracts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
    onError: () => {
      alert('Failed to delete contract')
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      deleteContract(id)
    }
  }

  const columns: Column<Contract>[] = [
    {
      header: 'Contract #',
      accessorKey: 'contract_number',
      className: 'text-primary dark:text-white font-mono font-medium'
    },
    {
      header: 'Title',
      accessorKey: 'title',
      className: 'text-heading'
    },
    {
      header: 'Status',
      cell: item => (
        <StatusBadge
          status={item.current_status}
          colorMap={{
            [item.current_status]: getStatusColor(item.current_status)
          }}
        />
      )
    },
    {
      header: 'Origin',
      cell: item => <span className="text-body">{item.origin}</span>
    },
    {
      header: 'Created',
      cell: item => (
        <span className="text-muted text-sm">
          {formatDateShort(item.created_at)}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      cell: item => (
        <div className="flex justify-end gap-1">
          <ActionButton
            href={`/dashboard/contracts/${item.id}`}
            icon={<Pencil size={16} />}
            title="Edit"
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
    <Link href="/dashboard/contracts/new">
      <Button
        variant="primary"
        size="md"
        className="!rounded-lg gap-2 w-full sm:w-auto"
      >
        <PlusCircle size={20} />
        <span>New Contract</span>
      </Button>
    </Link>
  )

  const searchSlot = (
    <>
      <div className="relative flex-1 w-full lg:max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by contract number or title..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input-base pl-10"
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="select-base flex-1 sm:flex-none"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Terminated">Terminated</option>
        </select>

        <select
          value={filterOrigin}
          onChange={e => setFilterOrigin(e.target.value)}
          className="select-base flex-1 sm:flex-none"
        >
          <option value="">All Origins</option>
          <option value="Internal">Internal</option>
          <option value="External">External</option>
        </select>
      </div>
    </>
  )

  return (
    <PermissionGate>
      <DataTable
        data={contracts}
        columns={columns}
        keyExtractor={item => item.id}
        isLoading={isLoading}
        error={isError}
        emptyMessage="No contracts found. Create your first contract to get started."
        errorMessage="Failed to load contracts. Please try again."
        title="Contract Management"
        subtitle="Manage and track all contracts"
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
