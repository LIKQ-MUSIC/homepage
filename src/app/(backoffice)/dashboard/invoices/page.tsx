'use client'

import React from 'react'
import PermissionGate from '@/components/dashboard/PermissionGate'
import { InvoiceList } from './components/InvoiceList'

export default function InvoicesPage() {
  return (
    <PermissionGate>
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-title">จัดการใบแจ้งหนี้ (Invoices)</h1>
        </div>

        <InvoiceList />
      </div>
    </PermissionGate>
  )
}
