'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PermissionGate from '@/components/dashboard/PermissionGate'
import { Settings, List } from 'lucide-react'
import { getDonationSettings } from '@/services/donation-service'
import { DonationListTab } from './components/DonationListTab'
import { SettingsTab } from './components/SettingsTab'

// --- Main Page ---
export default function DonationsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list')

  const { data: settings = [], isLoading: settingsLoading } = useQuery({
    queryKey: ['donation-settings'],
    queryFn: getDonationSettings
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
          <div className="text-center py-12 text-muted">
            Loading settings...
          </div>
        ) : activeTab === 'list' ? (
          <DonationListTab settings={settings} />
        ) : (
          <SettingsTab settings={settings} />
        )}
      </div>
    </PermissionGate>
  )
}
