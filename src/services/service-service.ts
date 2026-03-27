import { apiClient } from '@/lib/api-client'

export interface Service {
  id: string
  name: string
  default_price: number
  created_at: string
  updated_at: string
}

export interface CreateServiceDTO {
  name: string
  default_price: number
}

export interface UpdateServiceDTO {
  name?: string
  default_price?: number
}

export async function getServices() {
  const response = await apiClient.get<Service[]>('/services')
  return response.data
}

export async function createService(dto: CreateServiceDTO) {
  const response = await apiClient.post<Service>('/services', dto)
  return response.data
}

export async function updateService(id: string, dto: UpdateServiceDTO) {
  const response = await apiClient.put<Service>(`/services/${id}`, dto)
  return response.data
}

export async function deleteService(id: string) {
  const response = await apiClient.delete<{ success: boolean }>(
    `/services/${id}`
  )
  return response.data
}
