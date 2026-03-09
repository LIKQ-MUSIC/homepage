'use client'

import React from 'react'
import PermissionGate from '@/components/dashboard/PermissionGate'
import { CreateInvoiceForm } from './components/CreateInvoiceForm'

export default function CreateInvoicePage() {
  return (
    <PermissionGate>
      <div className="p-8 w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="page-title text-2xl font-bold">สร้างใบแจ้งหนี้ใหม่</h1>
        </div>

        <CreateInvoiceForm />
      </div>
    </PermissionGate>
  )
}
