import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Plus, Trash2, Pencil } from 'lucide-react'
import {
  createDonationSetting,
  updateDonationSetting,
  deleteDonationSetting,
  type DonationSetting,
  type CreateDonationSettingDTO
} from '@/services/donation-service'

export function SettingsTab({ settings }: { settings: DonationSetting[] }) {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<DonationSetting | null>(
    null
  )
  const [formData, setFormData] = useState<CreateDonationSettingDTO>({
    name: '',
    percentage: 0,
    type: 'split',
    payment_method: null
  })

  const createMutation = useMutation({
    mutationFn: (dto: CreateDonationSettingDTO) => createDonationSetting(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-settings'] })
      closeModal()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      dto
    }: {
      id: number
      dto: Partial<CreateDonationSettingDTO>
    }) => updateDonationSetting(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-settings'] })
      closeModal()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDonationSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donation-settings'] })
    }
  })

  function closeModal() {
    setIsModalOpen(false)
    setEditingSetting(null)
    setFormData({
      name: '',
      percentage: 0,
      type: 'split',
      payment_method: null
    })
  }

  function openCreate() {
    setEditingSetting(null)
    setFormData({
      name: '',
      percentage: 0,
      type: 'split',
      payment_method: null
    })
    setIsModalOpen(true)
  }

  function openEdit(s: DonationSetting) {
    setEditingSetting(s)
    setFormData({
      name: s.name,
      percentage: Number(s.percentage),
      type: s.type,
      payment_method: s.payment_method
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
        <h3 className="text-sm font-semibold text-heading mb-3">
          Payment Gateway Fees
        </h3>
        <div className="space-y-2">
          {feeSettings.map(s => (
            <div
              key={s.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
            >
              <div>
                <span className="text-heading font-medium text-sm">
                  {s.name}
                </span>
                {s.payment_method && (
                  <span className="ml-2 badge-info text-xs px-2 py-0.5 rounded-full">
                    {s.payment_method}
                  </span>
                )}
              </div>
              <span className="font-mono text-sm">
                {Number(s.percentage).toFixed(2)}%
              </span>
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
                  <span className="text-heading font-medium text-sm">
                    {s.name}
                  </span>
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
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                    setFormData({
                      ...formData,
                      percentage: Number(e.target.value)
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
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
