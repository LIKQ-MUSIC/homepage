'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PermissionGate from '@/components/dashboard/PermissionGate'
import { DataTable, Column, PaginationMeta } from '@/components/dashboard/DataTable'
import Button from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Plus, Trash2, Pencil, Settings, List } from 'lucide-react'
import { usePagination } from '@/hooks/use-pagination'
import {
  getDonations,
  getDonationSettings,
  createDonationSetting,
  updateDonationSetting,
  deleteDonationSetting,
  type Donation,
  type DonationSetting,
  type CreateDonationSettingDTO,
} from '@/services/donation-service'

// --- Fee Calculation Helpers ---
function roundUp2(n: number): number {
  return Math.ceil(n * 100) / 100
}

function calcFeeBreakdown(
  amountSatang: number,
  paymentMethod: string,
  settings: DonationSetting[]
) {
  const amount = amountSatang / 100

  // Find fee rate for this payment method
  const feeSettings = settings.filter(
    s => s.type === 'fee' && s.payment_method === paymentMethod
  )
  const vatSetting = settings.find(
    s => s.type === 'fee' && s.payment_method === null
  )
  const splitSettings = settings.filter(s => s.type === 'split')

  const feeRate = feeSettings.reduce((sum, s) => sum + Number(s.percentage), 0)
  const vatRate = vatSetting ? Number(vatSetting.percentage) : 0

  const fee = roundUp2(amount * (feeRate / 100))
  const vat = roundUp2(fee * (vatRate / 100))
  const net = roundUp2(amount - fee - vat)

  const splits: Record<string, number> = {}
  for (const s of splitSettings) {
    splits[s.name] = roundUp2(net * (Number(s.percentage) / 100))
  }

  return { fee, vat, net, splits }
}

// --- Tab: Donation List ---
function DonationListTab({ settings }: { settings: DonationSetting[] }) {
  const { page, limit, nextPage, prevPage } = usePagination()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['admin-donations', page, limit, search, statusFilter],
    queryFn: () =>
      getDonations({
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
      }),
  })

  const donations: Donation[] = response?.data || []
  const meta: PaginationMeta | undefined = response?.meta

  const splitSettings = settings.filter(s => s.type === 'split')

  const columns: Column<Donation>[] = [
    {
      header: 'Date',
      cell: item => (
        <span className="text-muted text-xs">
          {new Date(item.created_at).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Donor',
      cell: item => (
        <span className="text-heading font-medium">
          {item.metadata?.donorName || 'Anonymous'}
        </span>
      ),
    },
    {
      header: 'Amount',
      cell: item => (
        <span className="font-mono font-medium">
          {(item.amount / 100).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
          })}{' '}
          THB
        </span>
      ),
    },
    {
      header: 'Method',
      cell: item => (
        <span className="badge-info text-xs px-2 py-0.5 rounded-full">
          {item.payment_method === 'promptpay' ? 'PromptPay' : 'Credit Card'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: item => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            item.status === 'successful'
              ? 'badge-success'
              : item.status === 'pending'
                ? 'badge-warning'
                : 'badge-danger'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: 'Fee',
      cell: item => {
        const { fee, vat } = calcFeeBreakdown(
          item.amount,
          item.payment_method,
          settings
        )
        return (
          <span className="font-mono text-xs text-muted">
            {fee.toFixed(2)} + VAT {vat.toFixed(2)}
          </span>
        )
      },
    },
    {
      header: 'Net',
      cell: item => {
        const { net } = calcFeeBreakdown(
          item.amount,
          item.payment_method,
          settings
        )
        return (
          <span className="font-mono font-medium text-green-600 dark:text-green-400">
            {net.toFixed(2)}
          </span>
        )
      },
    },
    ...splitSettings.map(
      (s): Column<Donation> => ({
        header: s.name,
        cell: item => {
          const { splits } = calcFeeBreakdown(
            item.amount,
            item.payment_method,
            settings
          )
          return (
            <span className="font-mono text-xs">
              {(splits[s.name] || 0).toFixed(2)}
            </span>
          )
        },
      })
    ),
  ]

  // Summary totals
  const totals = donations.reduce(
    (acc, d) => {
      const { fee, vat, net, splits } = calcFeeBreakdown(
        d.amount,
        d.payment_method,
        settings
      )
      acc.amount += d.amount / 100
      acc.fee += fee
      acc.vat += vat
      acc.net += net
      for (const [k, v] of Object.entries(splits)) {
        acc.splits[k] = (acc.splits[k] || 0) + v
      }
      return acc
    },
    { amount: 0, fee: 0, vat: 0, net: 0, splits: {} as Record<string, number> }
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <Input
          type="text"
          placeholder="Search donor name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All Status</option>
          <option value="successful">Successful</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <DataTable
        data={donations}
        columns={columns}
        keyExtractor={item => item.id}
        isLoading={isLoading}
        error={isError}
        emptyMessage="No donations found."
        errorMessage="Failed to load donations"
        title="Donation List"
        pagination={meta}
        currentPage={page}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />

      {donations.length > 0 && (
        <div className="card-base p-4">
          <h3 className="text-sm font-semibold text-heading mb-2">Page Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted">Total Amount</span>
              <p className="font-mono font-medium">{totals.amount.toFixed(2)} THB</p>
            </div>
            <div>
              <span className="text-muted">Total Fees</span>
              <p className="font-mono font-medium">
                {totals.fee.toFixed(2)} + VAT {totals.vat.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-muted">Total Net</span>
              <p className="font-mono font-medium text-green-600 dark:text-green-400">
                {totals.net.toFixed(2)}
              </p>
            </div>
            {Object.entries(totals.splits).map(([name, value]) => (
              <div key={name}>
                <span className="text-muted">{name}</span>
                <p className="font-mono font-medium">{value.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Tab: Settings ---
function SettingsTab({ settings }: { settings: DonationSetting[] }) {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<DonationSetting | null>(null)
  const [formData, setFormData] = useState<CreateDonationSettingDTO>({
    name: '',
    percentage: 0,
    type: 'split',
    payment_method: null,
  })

  const createMutation = useMutation({
    mutationFn: (dto: CreateDonationSettingDTO) => createDonationSetting(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-settings'] })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CreateDonationSettingDTO> }) =>
      updateDonationSetting(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-settings'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDonationSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-settings'] })
    },
  })

  function closeModal() {
    setIsModalOpen(false)
    setEditingSetting(null)
    setFormData({ name: '', percentage: 0, type: 'split', payment_method: null })
  }

  function openCreate() {
    setEditingSetting(null)
    setFormData({ name: '', percentage: 0, type: 'split', payment_method: null })
    setIsModalOpen(true)
  }

  function openEdit(s: DonationSetting) {
    setEditingSetting(s)
    setFormData({
      name: s.name,
      percentage: Number(s.percentage),
      type: s.type,
      payment_method: s.payment_method,
    })
    setIsModalOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingSetting) {
      updateMutation.mutate({ id: editingSetting.id, dto: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const feeSettings = settings.filter(s => s.type === 'fee')
  const splitSettings = settings.filter(s => s.type === 'split')

  return (
    <div className="space-y-6">
      {/* Fee Settings (read-only) */}
      <div className="card-base p-4">
        <h3 className="text-sm font-semibold text-heading mb-3">Payment Gateway Fees</h3>
        <div className="space-y-2">
          {feeSettings.map(s => (
            <div
              key={s.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
            >
              <div>
                <span className="text-heading font-medium text-sm">{s.name}</span>
                {s.payment_method && (
                  <span className="ml-2 badge-info text-xs px-2 py-0.5 rounded-full">
                    {s.payment_method}
                  </span>
                )}
              </div>
              <span className="font-mono text-sm">{Number(s.percentage).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Settings (editable) */}
      <div className="card-base p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-heading">Revenue Splits</h3>
          <Button onClick={openCreate} size="sm" className="!rounded-lg gap-1">
            <Plus size={16} />
            Add Split
          </Button>
        </div>

        {splitSettings.length === 0 ? (
          <p className="text-muted text-sm py-4 text-center">
            No revenue split settings configured.
          </p>
        ) : (
          <div className="space-y-2">
            {splitSettings.map(s => (
              <div
                key={s.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
              >
                <div>
                  <span className="text-heading font-medium text-sm">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">
                    {Number(s.percentage).toFixed(2)}%
                  </span>
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1 text-muted hover:text-heading transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${s.name}"?`)) {
                        deleteMutation.mutate(s.id)
                      }
                    }}
                    className="p-1 text-muted hover:text-danger transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {editingSetting ? 'Edit Split' : 'Add Split'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Name
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Maintenance Fund"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Percentage (%)
                </label>
                <Input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.percentage}
                  onChange={e =>
                    setFormData({ ...formData, percentage: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingSetting
                      ? 'Update'
                      : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Main Page ---
export default function DonationsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list')

  const { data: settings = [], isLoading: settingsLoading } = useQuery({
    queryKey: ['donation-settings'],
    queryFn: getDonationSettings,
  })

  return (
    <PermissionGate>
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Donations</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'list'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-heading'
            }`}
          >
            <List size={16} />
            รายการโดเนท
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-heading'
            }`}
          >
            <Settings size={16} />
            ตั้งค่า
          </button>
        </div>

        {/* Tab Content */}
        {settingsLoading ? (
          <div className="text-center py-12 text-muted">Loading settings...</div>
        ) : activeTab === 'list' ? (
          <DonationListTab settings={settings} />
        ) : (
          <SettingsTab settings={settings} />
        )}
      </div>
    </PermissionGate>
  )
}
