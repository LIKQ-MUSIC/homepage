import { apiClient } from '@/lib/api-client'

export interface Donation {
  id: string
  amount: number
  currency: string
  payment_method: string
  status: string
  metadata: {
    feature: string
    donorName?: string
    email?: string
    phoneNumber?: string
  } | null
  created_at: string
  updated_at: string
}

export interface DonationSetting {
  id: number
  name: string
  percentage: number
  type: 'fee' | 'split'
  payment_method: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateDonationSettingDTO {
  name: string
  percentage: number
  type: 'fee' | 'split'
  payment_method?: string | null
}

export interface UpdateDonationSettingDTO {
  name?: string
  percentage?: number
  type?: 'fee' | 'split'
  payment_method?: string | null
  is_active?: boolean
}

export async function getDonations(params?: {
  search?: string
  status?: string
  paymentMethod?: string
  page?: number
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.status) query.set('status', params.status)
  if (params?.paymentMethod) query.set('paymentMethod', params.paymentMethod)
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))

  const response = await apiClient.get(`/admin/donations?${query.toString()}`)
  return response.data
}

export async function getDonationSettings() {
  const response = await apiClient.get<{ success: boolean; data: DonationSetting[] }>(
    '/admin/donations/settings'
  )
  return response.data.data
}

export async function createDonationSetting(dto: CreateDonationSettingDTO) {
  const response = await apiClient.post<{ success: boolean; data: DonationSetting }>(
    '/admin/donations/settings',
    dto
  )
  return response.data.data
}

export async function updateDonationSetting(id: number, dto: UpdateDonationSettingDTO) {
  const response = await apiClient.put<{ success: boolean; data: DonationSetting }>(
    `/admin/donations/settings/${id}`,
    dto
  )
  return response.data.data
}

export async function deleteDonationSetting(id: number) {
  const response = await apiClient.delete<{ success: boolean }>(
    `/admin/donations/settings/${id}`
  )
  return response.data
}

// ─── Seasonal Drop ───

export interface SeasonalDropTier {
  id: number
  name: string
  price: number // in satang
  description: string | null
  product_type: string
  drive_link: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  requires_shipping: boolean
}

export async function getSeasonalDropTiers(): Promise<SeasonalDropTier[]> {
  const response = await apiClient.get<{ success: boolean; data: SeasonalDropTier[] }>('/seasonal-drops/tiers')
  return response.data.data
}

export async function createSeasonalDropPurchase(data: {
  tierId: number
  paymentMethod: string
  cardToken?: string
  email: string
  buyerName?: string
  phoneNumber?: string
  shippingAddress?: string
  locale?: string
}) {
  const response = await apiClient.post('/seasonal-drops/purchase', data)
  return response.data
}

export async function getSeasonalDropOrderStatus(orderId: string) {
  const response = await apiClient.get(`/seasonal-drops/${orderId}/status`)
  return response.data
}
