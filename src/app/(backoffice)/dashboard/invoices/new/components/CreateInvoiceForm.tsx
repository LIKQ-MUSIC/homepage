import React, { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Button from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  createInvoice,
  type CreateInvoiceDTO
} from '@/services/invoice-service'
import { getServices, type Service } from '@/services/service-service'
import { getDonationSettings } from '@/services/donation-service'
import { calcFeeBreakdown } from '../../../donations/utils/fee-calculator'

interface InvoiceItemForm {
  id: string
  service_id?: string
  name: string
  price: number // UI edits in THB
}

export function CreateInvoiceForm() {
  const router = useRouter()

  const { data: services = [] } = useQuery({
    queryKey: ['admin-services'],
    queryFn: getServices
  })

  // We reuse donation settings for generic platform fees (like Omise PromptPay/Credit Card fees)
  const { data: feeSettings = [] } = useQuery({
    queryKey: ['donation-settings'],
    queryFn: getDonationSettings
  })

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [isWhtEnabled, setIsWhtEnabled] = useState(false)

  const [items, setItems] = useState<InvoiceItemForm[]>([
    { id: crypto.randomUUID(), name: '', price: 0 }
  ])

  // Calculate totals in THB
  const { subtotalTHB, whtTHB, netTotalTHB, promptPayFees, creditCardFees } =
    useMemo(() => {
      const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0)
      const wht = isWhtEnabled ? subtotal * 0.03 : 0
      const net = subtotal - wht

      // Convert net to Satang for the calculator
      const netSatang = Math.round(net * 100)

      const ppBreakdown = calcFeeBreakdown(netSatang, 'promptpay', feeSettings)
      const ccBreakdown = calcFeeBreakdown(
        netSatang,
        'credit_card',
        feeSettings
      )

      return {
        subtotalTHB: subtotal,
        whtTHB: wht,
        netTotalTHB: net,
        promptPayFees: {
          fee: ppBreakdown.fee,
          vat: ppBreakdown.vat,
          netReceived: ppBreakdown.net
        },
        creditCardFees: {
          fee: ccBreakdown.fee,
          vat: ccBreakdown.vat,
          netReceived: ccBreakdown.net
        }
      }
    }, [items, isWhtEnabled, feeSettings])

  const createMutation = useMutation({
    mutationFn: (dto: CreateInvoiceDTO) => createInvoice(dto),
    onSuccess: () => {
      router.push('/dashboard/invoices')
    }
  })

  function handleAddItem() {
    setItems(prev => [...prev, { id: crypto.randomUUID(), name: '', price: 0 }])
  }

  function handleRemoveItem(id: string) {
    if (items.length === 1) return // Keep at least one item
    setItems(prev => prev.filter(item => item.id !== id))
  }

  function handleItemChange(
    id: string,
    field: keyof InvoiceItemForm,
    value: any
  ) {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item

        let newValue = value
        let updatedItem = { ...item, [field]: newValue }

        // If selecting a predefined service, auto-fill name and price
        if (field === 'service_id' && value !== '') {
          const service = services.find(s => s.id === value)
          if (service) {
            updatedItem.name = service.name
            updatedItem.price = service.default_price / 100 // Satang to THB
          }
        }

        return updatedItem
      })
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (items.length === 0 || netTotalTHB <= 0) {
      alert('กรุณาเพิ่มรายการอย่างน้อย 1 รายการ และระบุราคาให้ถูกต้อง')
      return
    }

    // Prepare DTO (convert all money to Satang)
    const dto: CreateInvoiceDTO = {
      customer_name: customerName,
      customer_email: customerEmail,
      subtotal: Math.round(subtotalTHB * 100),
      is_wht_enabled: isWhtEnabled,
      wht_amount: Math.round(whtTHB * 100),
      net_total: Math.round(netTotalTHB * 100),
      items: items.map(item => ({
        service_id: item.service_id || undefined,
        name: item.name,
        price: Math.round(item.price * 100)
      }))
    }

    createMutation.mutate(dto)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard/invoices"
          className="text-muted hover:text-heading transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-lg font-semibold">ข้อมูลลูกค้า</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            ชื่อลูกค้า <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="เช่น สมชาย ใจดี"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            อีเมลลูกค้า <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            required
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            placeholder="เช่น somchai@example.com"
          />
        </div>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">รายการในใบแจ้งหนี้</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="gap-2"
          >
            <Plus size={16} /> เพิ่มรายการ
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg"
            >
              <div className="w-full md:w-1/3 space-y-2">
                <label className="text-xs font-medium text-muted">
                  บริการ (ไม่บังคับ)
                </label>
                <select
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                  value={item.service_id || ''}
                  onChange={e =>
                    handleItemChange(item.id, 'service_id', e.target.value)
                  }
                >
                  <option value="">กำหนดเอง</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.default_price / 100} THB)
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/3 space-y-2">
                <label className="text-xs font-medium text-muted">
                  รายละเอียด / ชื่อบริการ{' '}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={item.name}
                  onChange={e =>
                    handleItemChange(item.id, 'name', e.target.value)
                  }
                  placeholder="รายละเอียดบริการ"
                />
              </div>

              <div className="w-full md:w-1/4 space-y-2">
                <label className="text-xs font-medium text-muted">
                  ราคา (THB) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={e =>
                    handleItemChange(item.id, 'price', Number(e.target.value))
                  }
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                disabled={items.length === 1}
                className="p-2 mb-1 text-muted hover:text-danger disabled:opacity-50 transition-colors"
                title="ลบรายการ"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg w-full md:w-96">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isWhtEnabled}
              onChange={e => setIsWhtEnabled(e.target.checked)}
              className="w-5 h-5 rounded border-zinc-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">
              หักภาษี ณ ที่จ่าย (WHT 3%)
            </span>
          </label>
          <p className="text-xs text-muted ml-8">
            เลือกเมื่อลูกค้าหักภาษี ณ ที่จ่าย 3%
          </p>
        </div>

        <div className="w-full md:w-72 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">ยอดรวม:</span>
            <span className="font-mono">
              {subtotalTHB.toLocaleString('th-TH', {
                minimumFractionDigits: 2
              })}{' '}
              THB
            </span>
          </div>
          {isWhtEnabled && (
            <div className="flex justify-between text-danger">
              <span>หัก ณ ที่จ่าย 3%:</span>
              <span className="font-mono">
                -{whtTHB.toLocaleString('th-TH', { minimumFractionDigits: 2 })}{' '}
                THB
              </span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 text-lg font-bold">
            <span>ยอดสุทธิ:</span>
            <span className="font-mono text-primary">
              {netTotalTHB.toLocaleString('th-TH', {
                minimumFractionDigits: 2
              })}{' '}
              THB
            </span>
          </div>

          {/* Fee Previews */}
          {netTotalTHB > 0 && feeSettings.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50 space-y-2 text-xs">
              <p className="font-semibold text-blue-800 dark:text-blue-300 border-b border-blue-200 dark:border-blue-800/50 pb-1 mb-2">
                ประมาณการยอดเงินที่ได้รับ (หลังหักค่าธรรมเนียม)
              </p>

              <div className="flex justify-between text-blue-900 dark:text-blue-200">
                <span>ผ่านพร้อมเพย์:</span>
                <span className="font-mono font-medium">
                  {promptPayFees.netReceived.toLocaleString('th-TH', {
                    minimumFractionDigits: 2
                  })}{' '}
                  THB
                </span>
              </div>
              <div className="flex justify-between text-blue-700 dark:text-blue-400 text-[10px]">
                <span>ค่าธรรมเนียม + VAT:</span>
                <span className="font-mono">
                  -
                  {(promptPayFees.fee + promptPayFees.vat).toLocaleString(
                    'th-TH',
                    { minimumFractionDigits: 2 }
                  )}{' '}
                  THB
                </span>
              </div>

              <div className="flex justify-between text-blue-900 dark:text-blue-200 mt-2">
                <span>ผ่านบัตรเครดิต:</span>
                <span className="font-mono font-medium">
                  {creditCardFees.netReceived.toLocaleString('th-TH', {
                    minimumFractionDigits: 2
                  })}{' '}
                  THB
                </span>
              </div>
              <div className="flex justify-between text-blue-700 dark:text-blue-400 text-[10px]">
                <span>ค่าธรรมเนียม + VAT:</span>
                <span className="font-mono">
                  -
                  {(creditCardFees.fee + creditCardFees.vat).toLocaleString(
                    'th-TH',
                    { minimumFractionDigits: 2 }
                  )}{' '}
                  THB
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          disabled={createMutation.isPending || netTotalTHB <= 0}
          className="w-full md:w-auto px-8"
        >
          {createMutation.isPending
            ? 'กำลังสร้างใบแจ้งหนี้...'
            : 'สร้างใบแจ้งหนี้และลิงก์ชำระเงิน'}
        </Button>
      </div>
    </form>
  )
}
