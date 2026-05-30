'use client'

import React, { useMemo, useState } from 'react'
import { QrCode, CreditCard, ArrowDown, Info } from 'lucide-react'

type Method = 'qr' | 'card'
type Field = 'sale' | 'payout'

const LIKQ_RATE = 0.15

// Rates are VAT-inclusive (already contain the 7% VAT on the processing fee).
const OMISE: Record<Method, { rate: number; label: string; icon: typeof QrCode }> = {
  qr: { rate: 0.0165, label: 'PromptPay QR', icon: QrCode },
  card: { rate: 0.0365, label: 'บัตรเครดิต / เดบิต', icon: CreditCard }
}

// All money is computed in integer satang (1 บาท = 100 สตางค์) so there is no
// floating-point drift; we only divide by 100 at display time.
const toSatang = (s: string): number => {
  const n = parseFloat(s)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100)
}

// Pretty format with thousands separators — for read-only display (breakdown).
const fmtSatang = (sat: number): string =>
  (sat / 100).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

// Plain format (no separators) — safe as the value of <input type="number">,
// which blanks itself if the value contains a comma.
const plainBaht = (sat: number): string => (sat / 100).toFixed(2)

// Forward: sale → { omise fee, after-omise, likq fee, payout }, all in satang.
const forward = (saleSat: number, rate: number) => {
  const omiseFee = Math.round(saleSat * rate)
  const afterOmise = saleSat - omiseFee
  const likqFee = Math.round(afterOmise * LIKQ_RATE)
  const payout = afterOmise - likqFee
  return { omiseFee, afterOmise, likqFee, payout }
}

// Inverse: given a target payout in satang, find the sale price (satang) whose
// forward calculation lands exactly on that payout. The closed-form estimate
// can be off by a satang because of the two rounding steps, so we nudge it into
// the exact match when one exists in range.
const saleForPayout = (payoutSat: number, rate: number): number => {
  const estimate = Math.round(payoutSat / ((1 - rate) * (1 - LIKQ_RATE)))
  for (const cand of [estimate, estimate + 1, estimate - 1, estimate + 2, estimate - 2]) {
    if (cand >= 0 && forward(cand, rate).payout === payoutSat) return cand
  }
  return Math.max(0, estimate)
}

const PartnerPayoutCalculator = () => {
  const [method, setMethod] = useState<Method>('qr')
  // The field the user last typed into is authoritative; the other is derived.
  // We keep the raw typed string so the active input is never overwritten by a
  // rounded round-trip while the user is still typing.
  const [editing, setEditing] = useState<Field>('sale')
  const [draft, setDraft] = useState<string>('500')

  const rate = OMISE[method].rate

  const { saleSat, payoutSat, breakdown } = useMemo(() => {
    const typed = toSatang(draft)
    const sale = editing === 'sale' ? typed : saleForPayout(typed, rate)
    const bd = forward(sale, rate)
    return { saleSat: sale, payoutSat: bd.payout, breakdown: bd }
  }, [draft, editing, rate])

  const saleValue =
    editing === 'sale' ? draft : saleSat === 0 ? '' : plainBaht(saleSat)
  const payoutValue =
    editing === 'payout' ? draft : payoutSat === 0 ? '' : plainBaht(payoutSat)

  const onEdit = (field: Field, value: string) => {
    setEditing(field)
    setDraft(value)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 ring-1 ring-black/5 p-6 md:p-10">
      {/* Payment-method toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <span className="text-sm font-bold tracking-wider uppercase text-secondary-dark">
          วิธีจ่ายเงิน
        </span>
        <div className="inline-flex rounded-full bg-[#f0f4f8] p-1 ring-1 ring-black/5">
          {(Object.keys(OMISE) as Method[]).map(key => {
            const { label, icon: Icon, rate: r } = OMISE[key]
            const active = method === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMethod(key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                <Icon size={16} />
                {label}
                <span className={active ? 'text-secondary' : 'text-primary/40'}>
                  {(r * 100).toLocaleString('th-TH', { maximumFractionDigits: 2 })}%
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Linked inputs */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-end gap-5 mt-8">
        <label className="block">
          <span className="text-sm font-medium text-neutral-500">
            ราคาตั้งขาย (ลูกค้าจ่าย)
          </span>
          <div className="mt-2 flex items-center rounded-2xl ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-primary bg-[#f8f9fb] overflow-hidden">
            <span className="pl-4 pr-2 text-lg font-bold text-secondary-dark">฿</span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={saleValue}
              onChange={e => onEdit('sale', e.target.value)}
              className="w-full bg-transparent py-3.5 pr-4 text-2xl font-bold text-primary outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>
        </label>

        <div className="hidden md:flex items-center justify-center pb-4 text-secondary-dark">
          <ArrowDown size={22} className="rotate-[-90deg]" />
        </div>

        <label className="block">
          <span className="text-sm font-medium text-neutral-500">
            ยอดที่วงได้รับ
          </span>
          <div className="mt-2 flex items-center rounded-2xl ring-1 ring-primary/30 focus-within:ring-2 focus-within:ring-primary bg-primary/5 overflow-hidden">
            <span className="pl-4 pr-2 text-lg font-bold text-primary">฿</span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={payoutValue}
              onChange={e => onEdit('payout', e.target.value)}
              className="w-full bg-transparent py-3.5 pr-4 text-2xl font-bold text-primary outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>
        </label>
      </div>

      {/* Transparent breakdown */}
      <div className="mt-8 rounded-2xl bg-[#f8f9fb] ring-1 ring-black/5 divide-y divide-black/5">
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-neutral-600">ราคาตั้งขาย</span>
          <span className="font-semibold text-primary tabular-nums">
            {fmtSatang(saleSat)} ฿
          </span>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-neutral-600">
            หัก Omise fee · {OMISE[method].label} ({(rate * 100).toLocaleString('th-TH', { maximumFractionDigits: 2 })}%)
          </span>
          <span className="font-semibold text-rose-500 tabular-nums">
            −{fmtSatang(breakdown.omiseFee)} ฿
          </span>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-neutral-600">หัก LiKQ commission (15%)</span>
          <span className="font-semibold text-rose-500 tabular-nums">
            −{fmtSatang(breakdown.likqFee)} ฿
          </span>
        </div>
        <div className="flex items-center justify-between px-5 py-4 bg-primary/5">
          <span className="font-bold text-primary">ยอดที่วงได้รับสุทธิ</span>
          <span className="text-xl font-bold text-primary tabular-nums">
            {fmtSatang(breakdown.payout)} ฿
          </span>
        </div>
      </div>

      {/* Policy note */}
      <div className="mt-6 flex gap-3 rounded-2xl bg-secondary/15 p-4 md:p-5">
        <Info className="flex-shrink-0 text-primary mt-0.5" size={20} />
        <p className="text-sm md:text-base text-primary/80 leading-relaxed">
          เราแนะนำให้ตั้งราคาเผื่อค่าธรรมเนียมให้ครอบคลุมทั้ง 2 แบบไปเลยตั้งแต่แรก
          นโยบายของเราคือไม่อยากให้ลูกค้าต้องจ่ายแพงกว่าราคาที่เห็น
          ค่าธรรมเนียมจึงควรรวมอยู่ในราคาตั้งขายตั้งแต่ต้น
        </p>
      </div>
    </div>
  )
}

export default PartnerPayoutCalculator
