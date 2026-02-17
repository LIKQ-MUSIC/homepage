'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Input } from '@/ui/Input'
import { Textarea } from '@/ui/Textarea'
import { Label } from '@/ui/Label'

interface PartyFormData {
  party_type: 'Individual' | 'Legal'
  legal_name: string
  display_name: string
  tax_id: string
  address: string
}

export default function PartyFormPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const isNew = params.id === 'new'

  const [formData, setFormData] = useState<PartyFormData>({
    party_type: 'Individual',
    legal_name: '',
    display_name: '',
    tax_id: '',
    address: ''
  })
  const [error, setError] = useState<string | null>(null)

  // Fetch party details if in edit mode
  const { data: party, isLoading: isLoadingParty } = useQuery({
    queryKey: ['party', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/parties/${params.id}`)
      return res.data
    },
    enabled: !isNew
  })

  // Update form data when party is loaded
  useEffect(() => {
    if (party) {
      setFormData({
        party_type: party.party_type,
        legal_name: party.legal_name,
        display_name: party.display_name || '',
        tax_id: party.tax_id || '',
        address: party.address || ''
      })
    }
  }, [party])

  // Create/Update mutation
  const { mutate: saveParty, isPending } = useMutation({
    mutationFn: async (data: PartyFormData) => {
      if (isNew) {
        await apiClient.post('/parties', data)
      } else {
        await apiClient.put(`/parties/${params.id}`, data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] })
      router.push('/dashboard/parties')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save party')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    saveParty(formData)
  }

  if (!isNew && isLoadingParty) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-neutral-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/parties"
          className="p-2 hover:bg-[#f0f2f6] dark:hover:bg-[#1E293B] rounded-lg transition-colors"
        >
          <ArrowLeft
            size={20}
            className="text-neutral-500 dark:text-neutral-400"
          />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {isNew ? 'New Party' : 'Edit Party'}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {isNew ? 'Create a new party' : 'Update party details'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-[#e5e8ed] dark:border-[#1E293B] p-6 space-y-6">
          <div>
            <Label>Party Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="party_type"
                  value="Individual"
                  checked={formData.party_type === 'Individual'}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      party_type: e.target.value as 'Individual' | 'Legal'
                    })
                  }
                  className="text-indigo-600 focus:ring-indigo-500 bg-[#f8f9fb] dark:bg-[#0F172A] border-[#e0e4ea] dark:border-[#334155]"
                />
                <span className="text-neutral-900 dark:text-white">
                  Individual
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="party_type"
                  value="Legal"
                  checked={formData.party_type === 'Legal'}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      party_type: e.target.value as 'Individual' | 'Legal'
                    })
                  }
                  className="text-indigo-600 focus:ring-indigo-500 bg-[#f8f9fb] dark:bg-[#0F172A] border-[#e0e4ea] dark:border-[#334155]"
                />
                <span className="text-neutral-900 dark:text-white">
                  Legal Entity
                </span>
              </label>
            </div>
          </div>

          <div>
            <Label>Legal Name *</Label>
            <Input
              type="text"
              value={formData.legal_name}
              onChange={e =>
                setFormData({ ...formData, legal_name: e.target.value })
              }
              placeholder={
                formData.party_type === 'Individual'
                  ? 'e.g. John Doe'
                  : 'e.g. Acme Corp Ltd.'
              }
              required
            />
          </div>

          <div>
            <Label>Display Name</Label>
            <Input
              type="text"
              value={formData.display_name}
              onChange={e =>
                setFormData({ ...formData, display_name: e.target.value })
              }
              placeholder="e.g. Artist Name or Trading Name"
            />
          </div>

          <div>
            <Label>Tax ID</Label>
            <Input
              type="text"
              value={formData.tax_id}
              onChange={e =>
                setFormData({ ...formData, tax_id: e.target.value })
              }
              placeholder="Tax Identification Number"
            />
          </div>

          <div>
            <Label>Address</Label>
            <Textarea
              className="min-h-[100px]"
              value={formData.address}
              onChange={e =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Full physical address"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/parties"
            className="px-6 py-2 border border-[#e0e4ea] dark:border-[#334155] text-neutral-500 dark:text-neutral-400 rounded-lg hover:bg-[#f0f2f6] dark:hover:bg-[#1E293B] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{isPending ? 'Saving...' : 'Save Party'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
