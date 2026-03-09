import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json'
  }
})
