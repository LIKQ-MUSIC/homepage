'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Button from '@/ui/Button'

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading'
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Get callback parameters from URL
    const chargeId = searchParams.get('charge_id')
    const orderId = searchParams.get('order_id')

    if (!orderId) {
      setStatus('failed')
      setMessage('ไม่พบข้อมูลการชำระเงิน')
      return
    }

    // Check payment status
    // In a real implementation, you might want to verify the status with your backend
    setStatus('success')
    setMessage('การชำระเงินสำเร็จ')
  }, [searchParams])

  const handleBackToHome = () => {
    router.push('/#donation')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f9fb] to-white px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7B68AE]"></div>
            </div>
            <h1 className="text-2xl font-bold text-[#153051] mb-2">
              กำลังตรวจสอบ...
            </h1>
            <p className="text-gray-500">กรุณารอสักครู่</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              ชำระเงินสำเร็จ!
            </h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <p className="text-sm text-gray-400 mb-6">
              ขอบคุณสำหรับการสนับสนุน
              เราจะนำเงินของคุณไปใช้ในการผลิตผลงานดนตรีที่มีคุณภาพต่อไป
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full dark:bg-primary dark:hover:bg-primary-hover"
              onClick={handleBackToHome}
            >
              กลับสู่หน้าหลัก
            </Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">
              การชำระเงินล้มเหลว
            </h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Button
              variant="primary"
              size="lg"
              className="w-full dark:bg-primary dark:hover:bg-primary-hover"
              onClick={handleBackToHome}
            >
              ลองใหม่อีกครั้ง
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f9fb] to-white px-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7B68AE] mb-4"></div>
            <p className="text-[#153051] font-medium">กำลังโหลด...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  )
}
