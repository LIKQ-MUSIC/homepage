'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import Button from '@/ui/Button'
import {
  getInvoice,
  getInvoiceStatus,
  payInvoice
} from '@/services/invoice-service'

// Helpers for Omise
declare global {
  interface Window {
    Omise: any
  }
}

const loadOmiseScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Omise) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.omise.co/omise.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Omise.js'))
    document.head.appendChild(script)
  })
}

const createOmiseToken = (cardData: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    window.Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY)
    window.Omise.createToken(
      'card',
      cardData,
      (statusCode: number, response: any) => {
        if (statusCode === 200) {
          resolve(response.id)
        } else {
          reject(new Error(response.message || 'Omise tokenization failed'))
        }
      }
    )
  })
}

export default function InvoicePaymentPage() {
  const { id } = useParams()
  const invoiceId = id as string

  const {
    data: invoice,
    isLoading: isInvoiceLoading,
    error: invoiceError
  } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => getInvoice(invoiceId),
    retry: false
  })

  const [paymentMethod, setPaymentMethod] = useState<
    'promptpay' | 'credit_card'
  >('promptpay')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  // Actually, we can use React Query to poll the status if the invoice is pending payment but we submitted
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'successful' | 'failed' | null
  >(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Credit card state
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardFocused, setCardFocused] = useState<any>('')

  // Poll for PromptPay status updates
  useEffect(() => {
    if (
      result?.data?.orderId &&
      paymentMethod === 'promptpay' &&
      paymentStatus === 'pending'
    ) {
      const checkStatus = async () => {
        try {
          const res = await getInvoiceStatus(invoiceId)
          if (res.status === 'PAID') {
            setPaymentStatus('successful')
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current)
              pollingIntervalRef.current = null
            }
          } else if (res.status === 'EXPIRED') {
            setPaymentStatus('failed')
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current)
              pollingIntervalRef.current = null
            }
          }
        } catch (error) {
          console.error('Failed to check invoice status:', error)
        }
      }
      pollingIntervalRef.current = setInterval(checkStatus, 3000)
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [result, paymentMethod, paymentStatus, invoiceId])

  useEffect(() => {
    if (invoice && invoice.status === 'PAID') {
      setPaymentStatus('successful')
    }
  }, [invoice])

  const handlePay = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      let cardToken: string | undefined

      if (paymentMethod === 'credit_card') {
        const [monthStr, yearStr] = cardExpiry.split('/')
        if (!cardNumber || !cardName || !monthStr || !yearStr || !cardCvc) {
          setError('กรุณากรอกข้อมูลบัตรให้ครบถ้วน')
          setLoading(false)
          return
        }

        await loadOmiseScript()
        cardToken = await createOmiseToken({
          name: cardName,
          number: cardNumber.replace(/\s/g, ''),
          expiration_month: parseInt(monthStr, 10),
          expiration_year: parseInt(yearStr, 10) + 2000,
          security_code: cardCvc
        })
      }

      const response = await payInvoice(invoiceId, {
        paymentMethod,
        cardToken
      })

      setResult(response)
      setPaymentStatus('pending')
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          'เกิดข้อผิดพลาดในการชำระเงิน'
      )
    } finally {
      setLoading(false)
    }
  }

  if (isInvoiceLoading)
    return (
      <div className="p-12 text-center text-muted">
        Loading invoice details...
      </div>
    )
  if (invoiceError || !invoice)
    return (
      <div className="p-12 text-center text-danger">
        Invoice not found or expired.
      </div>
    )

  const isPaid = paymentStatus === 'successful' || invoice.status === 'PAID'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center bg-[#153051] text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Invoice #{invoice.id.split('-')[0]}
          </h2>
          <p className="mt-2 opacity-80">{invoice.customer_name}</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Invoice Summary */}
          <div className="space-y-4 rounded-xl bg-gray-50 p-6 border border-gray-100">
            <h3 className="font-semibold text-[#153051] border-b border-gray-200 pb-2">
              Order Summary
            </h3>
            {invoice.items?.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-medium text-gray-900">
                  {(item.price / 100).toLocaleString('th-TH', {
                    minimumFractionDigits: 2
                  })}{' '}
                  THB
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>
                  {(invoice.subtotal / 100).toLocaleString('th-TH', {
                    minimumFractionDigits: 2
                  })}{' '}
                  THB
                </span>
              </div>
              {invoice.is_wht_enabled && (
                <div className="flex justify-between text-red-500">
                  <span>Withholding Tax (3%)</span>
                  <span>
                    -
                    {(invoice.wht_amount / 100).toLocaleString('th-TH', {
                      minimumFractionDigits: 2
                    })}{' '}
                    THB
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[#153051] pt-2">
                <span>Net Total</span>
                <span>
                  {(invoice.net_total / 100).toLocaleString('th-TH', {
                    minimumFractionDigits: 2
                  })}{' '}
                  THB
                </span>
              </div>
            </div>
          </div>

          {isPaid ? (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Payment Successful
              </h3>
              <p className="text-sm text-gray-500">
                Thank you! Your payment has been received successfully.
              </p>
            </div>
          ) : result ? (
            /* Pending Payment Status Screen */
            <div className="text-center py-6 space-y-6">
              {paymentStatus === 'pending' &&
                result.data?.payment?.qrCodeUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Please scan the QR Code using your banking app
                    </p>
                    <img
                      src={result.data.payment.qrCodeUrl}
                      alt="PromptPay QR Code"
                      className="mx-auto w-64 h-64 rounded-xl shadow-sm border border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-4 animate-pulse">
                      Waiting for payment confirmation...
                    </p>
                  </div>
                )}

              {paymentStatus === 'pending' && result.data?.authorizeUri && (
                <div className="py-8">
                  <a href={result.data.authorizeUri}>
                    <Button variant="primary" size="lg" className="w-full">
                      Authorize Payment
                    </Button>
                  </a>
                  <p className="text-xs text-gray-500 mt-4">
                    You will be redirected to securely complete your credit card
                    payment.
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  setResult(null)
                  setPaymentStatus(null)
                }}
              >
                Cancel or Change Payment Method
              </Button>
            </div>
          ) : (
            /* Payment Form */
            <div className="space-y-6">
              <h3 className="font-semibold text-[#153051]">
                Select Payment Method
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('promptpay')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'promptpay'
                      ? 'border-[#153051] bg-[#153051]/5 text-[#153051]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <Image
                    src="/images/promptpay-logo.png"
                    alt="PromptPay"
                    width={40}
                    height={40}
                    className="mb-2 object-contain hidden"
                  />
                  <span className="font-medium">PromptPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#153051] bg-[#153051]/5 text-[#153051]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <svg
                    className="w-8 h-8 mb-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span className="font-medium">Credit Card</span>
                </button>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="flex justify-center mb-4">
                    <Cards
                      number={cardNumber}
                      name={cardName}
                      expiry={cardExpiry}
                      cvc={cardCvc}
                      focused={cardFocused}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    onFocus={() => setCardFocused('number')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#153051] focus:ring-1 focus:ring-[#153051]"
                  />
                  <input
                    type="text"
                    placeholder="Name on Card"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    onFocus={() => setCardFocused('name')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#153051] focus:ring-1 focus:ring-[#153051]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      onFocus={() => setCardFocused('expiry')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#153051] focus:ring-1 focus:ring-[#153051]"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      onFocus={() => setCardFocused('cvc')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#153051] focus:ring-1 focus:ring-[#153051]"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full py-4 text-base shadow-md font-semibold dark:bg-[#153051] dark:hover:bg-[#1f477a]"
                onClick={handlePay}
                disabled={loading}
              >
                {loading
                  ? 'Processing...'
                  : `Pay ${(invoice.net_total / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })} THB`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
