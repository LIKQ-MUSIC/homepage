import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataTable, type Column } from '@/components/dashboard/DataTable'
import Button from '@/ui/Button'
import { Input } from '@/ui/Input'
import { Plus, Trash2, Pencil } from 'lucide-react'
import {
  getServices,
  createService,
  updateService,
  deleteService,
  type Service,
  type CreateServiceDTO
} from '@/services/service-service'

export function ServiceList() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<CreateServiceDTO>({
    name: '',
    default_price: 0
  })

  const {
    data: services = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['admin-services'],
    queryFn: getServices
  })

  const createMutation = useMutation({
    mutationFn: (dto: CreateServiceDTO) => createService(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      closeModal()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateServiceDTO> }) =>
      updateService(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      closeModal()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
    }
  })

  function closeModal() {
    setIsModalOpen(false)
    setEditingService(null)
    setFormData({ name: '', default_price: 0 })
  }

  function openCreate() {
    setEditingService(null)
    setFormData({ name: '', default_price: 0 })
    setIsModalOpen(true)
  }

  function openEdit(s: Service) {
    setEditingService(s)
    setFormData({
      name: s.name,
      default_price: s.default_price / 100 // Convert Satang to THB for form
    })
    setIsModalOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dto = {
      name: formData.name,
      default_price: Math.round(formData.default_price * 100) // Convert THB to Satang
    }

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, dto })
    } else {
      createMutation.mutate(dto)
    }
  }

  const columns: Column<Service>[] = [
    {
      header: 'ชื่อบริการ',
      cell: item => (
        <span className="text-heading font-medium">{item.name}</span>
      )
    },
    {
      header: 'ราคาเริ่มต้น',
      cell: item => (
        <span className="font-mono font-medium text-green-600 dark:text-green-400">
          {(item.default_price / 100).toLocaleString('th-TH', {
            minimumFractionDigits: 2
          })}{' '}
          THB
        </span>
      )
    },
    {
      header: 'จัดการ',
      cell: item => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => openEdit(item)}
            className="p-1 text-muted hover:text-heading transition-colors"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => {
              if (confirm(`ยืนยันการลบบริการ "${item.name}" ใช่หรือไม่?`)) {
                deleteMutation.mutate(item.id)
              }
            }}
            className="p-1 text-muted hover:text-danger transition-colors"
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
        <h3 className="text-lg font-semibold text-heading">รายการบริการ</h3>
        <Button onClick={openCreate} size="sm" className="!rounded-lg gap-1">
          <Plus size={16} />
          เพิ่มบริการใหม่
        </Button>
      </div>

      <DataTable
        data={services}
        columns={columns}
        keyExtractor={item => item.id}
        isLoading={isLoading}
        error={isError}
        emptyMessage="ไม่พบบริการ"
        errorMessage="ไม่สามารถโหลดข้อมูลบริการได้"
        title="รายการบริการ"
      />

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {editingService ? 'แก้ไขบริการ' : 'เพิ่มบริการใหม่'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  ชื่อบริการ
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="เช่น บันทึกเสียงร้อง"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  ราคาเริ่มต้น (บาท)
                </label>
                <Input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.default_price}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      default_price: Number(e.target.value)
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" type="button" onClick={closeModal}>
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'กำลังบันทึก...'
                    : editingService
                      ? 'บันทึกการแก้ไข'
                      : 'เพิ่มบริการ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
