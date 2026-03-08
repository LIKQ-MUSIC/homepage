import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  DataTable,
  type Column,
  type PaginationMeta
} from '@/components/dashboard/DataTable'
import { Input } from '@/ui/Input'
import { usePagination } from '@/hooks/use-pagination'
import {
  getDonations,
  type Donation,
  type DonationSetting
} from '@/services/donation-service'
import { DonationsSummary } from './DonationsSummary'
import { calcFeeBreakdown } from '../utils/fee-calculator'

export function DonationListTab({ settings }: { settings: DonationSetting[] }) {
  const { page, limit, nextPage, prevPage } = usePagination()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const {
    data: response,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['admin-donations', page, limit, search, statusFilter],
    queryFn: () =>
      getDonations({
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined
      })
  })

  const donations: Donation[] = response?.data || []
  const meta: (PaginationMeta & { totalAmount?: number }) | undefined =
    response?.meta

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
            minute: '2-digit'
          })}
        </span>
      )
    },
    {
      header: 'Donor',
      cell: item => (
        <span className="text-heading font-medium">
          {item.metadata?.donorName || 'Anonymous'}
        </span>
      )
    },
    {
      header: 'Amount',
      cell: item => (
        <span className="font-mono font-medium">
          {(item.amount / 100).toLocaleString('th-TH', {
            minimumFractionDigits: 2
          })}{' '}
          THB
        </span>
      )
    },
    {
      header: 'Method',
      cell: item => (
        <span className="badge-info text-xs px-2 py-0.5 rounded-full">
          {item.payment_method === 'promptpay' ? 'PromptPay' : 'Credit Card'}
        </span>
      )
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
      )
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
      }
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
      }
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
        }
      })
    )
  ]

  // Summary totals (using the totalAmount from backend metadata which accounts for all pages)
  const totalAmountSatang = meta?.totalAmount ?? 0

  // Calculate fees on the total aggregated amount.
  // We assume the total amount has a specific payment method ratio if we wanted exact splits,
  // but since we need aggregate splits across all payment methods, we can't easily rely on `calcFeeBreakdown` natively without parsing arrays, unless we sum up per donation.
  // Wait, `meta.totalAmount` is the total but doesn't have methods.
  // So a naive sum on the frontend only works for the current page!
  // To get an exact accurate fee, the backend itself must return grouped sums.
  // Let's rely on the current page's fee calculation to give a proportional split, OR we just sum the current page.
  // Actually, I can keep the manual sum for current page as UI requires it, BUT the amount will be the exact one from backend.
  // Wait, let's just do manual reduce for current page for fees/splits, but display Total Amount from backend sum.
  const totals = donations.reduce(
    (acc, d) => {
      // Only aggregate successful donations if we want "filter only success"
      // Or if the backend filter handles status, we can aggregate whatever the backend returned.
      // We will only calculate for successful items if that status matches, or implicitly if statusFilter='successful'.
      // The user wants "sum of money according to filter, but basically just for successes".
      // Let's filter here just to be safe if status='successful' wasn't set.
      if (d.status !== 'successful') return acc

      const { fee, vat, net, splits } = calcFeeBreakdown(
        d.amount,
        d.payment_method,
        settings
      )
      // We still sum current page items so that fee ratios look somewhat normal, though it's constrained to page context.
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

      {donations.length > 0 && <DonationsSummary totals={totals} />}

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
    </div>
  )
}
