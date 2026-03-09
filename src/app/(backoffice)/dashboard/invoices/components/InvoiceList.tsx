import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataTable, type Column } from '@/components/dashboard/DataTable'
import Button from '@/ui/Button'
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react'
import { CopyLinkButton } from './CopyLinkButton'
import {
  getInvoices,
  deleteInvoice,
  type Invoice
} from '@/services/invoice-service'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function InvoiceList() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: invoices = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: getInvoices
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] })
    }
  })

  const columns: Column<Invoice>[] = [
    {
      header: 'ลูกค้า',
      cell: item => (
        <div className="flex flex-col">
          <span className="text-heading font-medium">{item.customer_name}</span>
          <span className="text-muted text-xs">{item.customer_email}</span>
        </div>
      )
    },
    {
      header: 'ยอดรวมสุทธิ',
      cell: item => (
        <span className="font-mono font-medium text-green-600 dark:text-green-400">
          {(item.net_total / 100).toLocaleString('th-TH', {
            minimumFractionDigits: 2
          })}{' '}
          THB
        </span>
      )
    },
    {
      header: 'สถานะ',
      cell: item => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            item.status === 'PAID'
              ? 'badge-success'
              : item.status === 'PENDING'
                ? 'badge-warning'
                : 'badge-danger'
          }`}
        >
          {item.status}
        </span>
      )
    },
    {
      header: 'วันที่สร้าง',
      cell: item => (
        <span className="text-muted text-xs">
          {new Date(item.created_at).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      )
    },
    {
      header: 'จัดการ',
      cell: item => (
        <div className="flex items-center gap-3">
          <CopyLinkButton id={item.id} />
          <button
            onClick={() => {
              if (
                confirm(
                  `ยืนยันการลบใบแจ้งหนี้ของ "${item.customer_name}" ใช่หรือไม่?`
                )
              ) {
                deleteMutation.mutate(item.id)
              }
            }}
            className="p-1 text-muted hover:text-danger transition-colors"
            title="ลบใบแจ้งหนี้"
            disabled={item.status === 'PAID'}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-heading">รายการใบแจ้งหนี้</h3>
        <Link href="/dashboard/invoices/new">
          <Button size="sm" className="!rounded-lg gap-1">
            <Plus size={16} />
            สร้างใบแจ้งหนี้
          </Button>
        </Link>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        keyExtractor={item => item.id}
        isLoading={isLoading}
        error={isError}
        emptyMessage="ไม่พบใบแจ้งหนี้"
        errorMessage="ไม่สามารถโหลดข้อมูลใบแจ้งหนี้ได้"
        title="รายการใบแจ้งหนี้"
      />
    </div>
  )
}
