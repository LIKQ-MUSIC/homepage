import { apiClient } from '@/lib/api-client'

export interface InvoiceItem {
  id: string
  invoice_id: string
  service_id: string | null
  name: string
  price: number
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  customer_name: string
  customer_email: string
  subtotal: number
  is_wht_enabled: boolean
  wht_amount: number
  net_total: number
  status: 'PENDING' | 'PAID' | 'EXPIRED'
  omise_charge_id: string | null
  created_at: string
  updated_at: string
  items?: InvoiceItem[]
}

export interface CreateInvoiceDTO {
  customer_name: string
  customer_email: string
  subtotal: number
  is_wht_enabled?: boolean
  wht_amount?: number
  net_total: number
  items: Array<{
    service_id?: string
    name: string
    price: number
  }>
}

export async function getInvoices() {
  const response = await apiClient.get<Invoice[]>('/invoices')
  return response.data
}

export async function getInvoice(id: string) {
  const response = await apiClient.get<Invoice>(`/invoices/${id}`)
  return response.data
}

export async function getInvoiceStatus(id: string) {
  const response = await apiClient.get<{ status: string }>(
    `/invoices/${id}/status`
  )
  return response.data
}

export async function createInvoice(dto: CreateInvoiceDTO) {
  const response = await apiClient.post<Invoice>('/invoices', dto)
  return response.data
}

export async function payInvoice(
  id: string,
  dto: { paymentMethod: 'promptpay' | 'credit_card'; cardToken?: string }
) {
  const response = await apiClient.post(`/invoices/${id}/pay`, dto)
  return response.data
}

// Test environments only: asks the gateway to force-complete this invoice's
// pending Omise charge. Omise then fires charge.complete, payment-service calls
// the gateway back, and the invoice flips to PAID — so the page's existing poll
// is what reports success, exactly as it would after a real scan. Answers 403
// anywhere the account is on live Omise keys.
export async function devMarkInvoicePaid(id: string) {
  const response = await apiClient.post(`/invoices/${id}/dev-mark-paid`)
  return response.data
}

export async function deleteInvoice(id: string) {
  const response = await apiClient.delete<{ success: boolean }>(
    `/invoices/${id}`
  )
  return response.data
}
