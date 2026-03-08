import React from 'react'

export interface DonationsSummaryProps {
  totals: {
    amount: number
    fee: number
    vat: number
    net: number
    splits: Record<string, number>
  }
}

export function DonationsSummary({ totals }: DonationsSummaryProps) {
  return (
    <div className="card-base p-4">
      <h3 className="text-sm font-semibold text-heading mb-2">Page Summary</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted">Total Amount</span>
          <p className="font-mono font-medium">
            {totals.amount.toFixed(2)} THB
          </p>
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
  )
}
