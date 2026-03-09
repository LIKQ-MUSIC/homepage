'use client'

import React from 'react'
import PermissionGate from '@/components/dashboard/PermissionGate'
import { ServiceList } from './components/ServiceList'

export default function ServicesPage() {
  return (
    <PermissionGate>
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-title">จัดการบริการ (Services)</h1>
        </div>

        <ServiceList />
      </div>
    </PermissionGate>
  )
}
