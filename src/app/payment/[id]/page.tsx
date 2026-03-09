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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-10 w-10 text-[#153051]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-[#153051] font-medium text-lg">
            กำลังโหลดข้อมูลใบแจ้งหนี้...
          </p>
        </div>
      </div>
    )

  if (invoiceError || !invoice)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-red-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-gray-500">
            ไม่พบใบแจ้งหนี้ หรือ ลิงก์นี้หมดอายุแล้ว
          </p>
        </div>
      </div>
    )

  const isPaid = paymentStatus === 'successful' || invoice.status === 'PAID'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#153051] selection:text-white font-sans">
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100/50 backdrop-blur-sm relative transition-all duration-500">
        {/* Header Section */}
        <div className="relative p-8 pb-10 text-center bg-gradient-to-b from-[#153051] to-[#0f2340] text-white overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-blue-400/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 drop-shadow-lg transform transition-transform duration-500 hover:scale-105">
              <Image
                src="/logo-hover.svg"
                alt="LIKQ Logo"
                width={140}
                height={46}
                className="brightness-0 invert object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              ใบแจ้งหนี้{' '}
              <span className="text-blue-200 opacity-90 font-mono">
                #{invoice.id.split('-')[0]}
              </span>
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm shadow-inner backdrop-blur-md">
              <span className="opacity-80">เรียกเก็บจาก</span>
              <span className="font-medium">{invoice.customer_name}</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 relative z-20 bg-white rounded-t-3xl -mt-6">
          {/* Order Summary */}
          <div className="space-y-4 rounded-2xl bg-slate-50 p-6 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200">
            <h3 className="text-sm font-bold text-[#153051] mb-5 flex items-center gap-2">
              <svg
                className="w-5 h-5 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              สรุปรายการสั่งซื้อ
            </h3>
            <div className="space-y-3.5">
              {invoice.items?.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm group"
                >
                  <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                    {item.name}
                  </span>
                  <span className="font-mono text-slate-900 relative">
                    {(item.price / 100).toLocaleString('th-TH', {
                      minimumFractionDigits: 2
                    })}
                    <span className="text-xs text-slate-500 font-sans ml-1">
                      THB
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200/80 pt-4 mt-5 space-y-3.5 text-sm">
              <div className="flex justify-between items-center text-slate-500">
                <span>ยอดรวม</span>
                <span className="font-mono">
                  {(invoice.subtotal / 100).toLocaleString('th-TH', {
                    minimumFractionDigits: 2
                  })}
                  <span className="text-xs ml-1">THB</span>
                </span>
              </div>
              {invoice.is_wht_enabled && (
                <div className="flex justify-between items-center text-rose-500/90 font-medium bg-rose-50/50 p-2 -mx-2 rounded-lg">
                  <span>หักภาษี ณ ที่จ่าย (3%)</span>
                  <span className="font-mono">
                    -
                    {(invoice.wht_amount / 100).toLocaleString('th-TH', {
                      minimumFractionDigits: 2
                    })}
                    <span className="text-xs ml-1">THB</span>
                  </span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-4 border-t border-slate-200/80">
                <span className="text-base font-bold text-slate-900">
                  ยอดชำระสุทธิ
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-[#153051] font-mono tracking-tight drop-shadow-sm">
                    {(invoice.net_total / 100).toLocaleString('th-TH', {
                      minimumFractionDigits: 2
                    })}
                  </span>
                  <span className="text-sm font-bold text-slate-500 uppercase">
                    THB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isPaid ? (
            <div className="text-center py-10 px-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 transform transition-all duration-500 scale-100">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6 shadow-sm shadow-emerald-200/50 animate-[bounce_1s_ease-in-out_infinite]">
                <svg
                  className="h-10 w-10 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
                ชำระเงินสำเร็จ
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                ขอบคุณครับ/ค่ะ! เราได้รับยอดชำระเงินของท่านเรียบร้อยแล้ว
                <br />
                ใบเสร็จรับเงินจะถูกจัดส่งไปยังอีเมลของท่าน
              </p>
            </div>
          ) : result ? (
            /* Pending Payment Status Screen */
            <div className="text-center py-4 space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {paymentStatus === 'pending' &&
                result.data?.payment?.qrCodeUrl && (
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-sky-50 text-sky-700 rounded-full text-sm font-medium mb-8 border border-sky-100 shadow-sm">
                      <svg
                        className="w-5 h-5 animate-spin text-sky-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      รอการยืนยันชำระเงิน...
                    </div>

                    <div className="relative p-8 bg-white rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 w-full max-w-[320px] transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)]">
                      <Image
                        src="/images/promptpay-logo.png"
                        alt="PromptPay"
                        width={140}
                        height={46}
                        className="mx-auto mb-8 object-contain"
                      />
                      <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 mb-6 relative group overflow-hidden">
                        <img
                          src={result.data.payment.qrCodeUrl}
                          alt="PromptPay QR Code"
                          className="mx-auto w-full aspect-square object-contain group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                      <p className="text-sm font-medium text-slate-500 bg-slate-50 py-3.5 px-4 rounded-xl border border-slate-100">
                        กรุณาแสกนคิวอาร์โค้ด
                        <br />
                        ด้วยแอปพลิเคชันธนาคารของท่าน
                      </p>
                    </div>
                  </div>
                )}

              {paymentStatus === 'pending' && result.data?.authorizeUri && (
                <div className="py-12 bg-slate-50 rounded-3xl border border-slate-100 px-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 mx-auto mb-8 relative rotate-3 group-hover:rotate-6 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-[#153051]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    <span className="absolute -top-2 -right-2 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500 border-2 border-white"></span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    ตรวจสอบสิทธิ์การชำระเงิน
                  </h3>
                  <p className="text-sm text-slate-500 mb-8 max-w-[280px] mx-auto leading-relaxed">
                    ระบบจะนำท่านไปยังหน้ายืนยันการชำระเงินด้วยบัตรเครดิตของธนาคาร
                    เพื่อความปลอดภัยสูงสุด
                  </p>
                  <a href={result.data.authorizeUri} className="block w-full">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full text-lg py-5 shadow-xl shadow-blue-900/10 hover:shadow-2xl transition-all bg-[#153051] hover:bg-[#0f2340] rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      ดำเนินการต่อ <span className="text-xl">→</span>
                    </Button>
                  </a>
                </div>
              )}

              <button
                onClick={() => {
                  setResult(null)
                  setPaymentStatus(null)
                }}
                className="text-sm font-medium text-slate-400 hover:text-slate-700 underline underline-offset-4 transition-colors p-2"
              >
                ยกเลิก หรือ เปลี่ยนวิธีชำระเงิน
              </button>
            </div>
          ) : (
            /* Payment Form */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
              <div>
                <h3 className="text-sm font-bold text-[#153051] mb-5 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 opacity-70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  เลือกวิธีการชำระเงิน
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      paymentMethod === 'promptpay'
                        ? 'border-[#153051] bg-[#153051]/[0.03] shadow-[0_8px_30px_-10px_rgba(21,48,81,0.15)] scale-[1.02] ring-1 ring-[#153051]/10'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 bg-white hover:shadow-sm'
                    }`}
                  >
                    {paymentMethod === 'promptpay' && (
                      <span className="absolute top-3 right-3 text-[#153051] bg-blue-50/80 rounded-full p-0.5 animate-in zoom-in duration-300">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                    <Image
                      src="/images/promptpay-logo.png"
                      alt="PromptPay"
                      width={90}
                      height={34}
                      className={`mb-4 object-contain transition-all duration-300 ${paymentMethod === 'promptpay' ? 'scale-110 drop-shadow-md' : 'group-hover:scale-105 grayscale opacity-60 mix-blend-luminosity'}`}
                    />
                    <span
                      className={`font-semibold text-sm transition-colors ${paymentMethod === 'promptpay' ? 'text-[#153051]' : 'text-slate-500 group-hover:text-slate-700'}`}
                    >
                      พร้อมเพย์
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      paymentMethod === 'credit_card'
                        ? 'border-[#153051] bg-[#153051]/[0.03] shadow-[0_8px_30px_-10px_rgba(21,48,81,0.15)] scale-[1.02] ring-1 ring-[#153051]/10'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 bg-white hover:shadow-sm'
                    }`}
                  >
                    {paymentMethod === 'credit_card' && (
                      <span className="absolute top-3 right-3 text-[#153051] bg-blue-50/80 rounded-full p-0.5 animate-in zoom-in duration-300">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                    <div
                      className={`mb-4 transition-all duration-300 ${paymentMethod === 'credit_card' ? 'scale-110 text-[#153051] drop-shadow-md' : 'group-hover:scale-105 text-slate-300 group-hover:text-slate-400'}`}
                    >
                      <svg
                        className="w-11 h-11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="2" y="5" width="20" height="14" rx="2.5" />
                        <line
                          x1="2"
                          y1="10"
                          x2="22"
                          y2="10"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M7 15h2"
                          strokeLinecap="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-semibold text-sm transition-colors ${paymentMethod === 'credit_card' ? 'text-[#153051]' : 'text-slate-500 group-hover:text-slate-700'}`}
                    >
                      บัตรเครดิต
                    </span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-6 pt-2 animate-in slide-in-from-bottom-8 duration-500 pb-2">
                  <div className="flex justify-center transform scale-[0.85] sm:scale-100 origin-top transition-all -my-4 sm:-my-2 drop-shadow-xl relative z-10">
                    <Cards
                      number={cardNumber}
                      name={cardName}
                      expiry={cardExpiry}
                      cvc={cardCvc}
                      focused={cardFocused}
                    />
                  </div>

                  <div className="space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100 shadow-inner relative z-0 -mt-16 pt-20">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400 group-focus-within:text-[#153051] transition-colors"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="หมายเลขบัตร"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        onFocus={() => setCardFocused('number')}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#153051] focus:ring-4 focus:ring-[#153051]/10 transition-all shadow-sm bg-white"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400 group-focus-within:text-[#153051] transition-colors"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="ชื่อบนบัตร"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        onFocus={() => setCardFocused('name')}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#153051] focus:ring-4 focus:ring-[#153051]/10 transition-all shadow-sm bg-white uppercase"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="ดด/ปป"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          onFocus={() => setCardFocused('expiry')}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#153051] focus:ring-4 focus:ring-[#153051]/10 transition-all shadow-sm text-center bg-white"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="รหัสหลังบัตร"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          onFocus={() => setCardFocused('cvc')}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#153051] focus:ring-4 focus:ring-[#153051]/10 transition-all shadow-sm text-center bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-4 text-sm text-rose-600 bg-rose-50 rounded-xl border border-rose-100 animate-in slide-in-from-top-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full py-5 text-lg shadow-[0_10px_20px_-10px_rgba(21,48,81,0.5)] font-bold bg-[#153051] hover:bg-[#0f2340] border-none transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-10px_rgba(21,48,81,0.6)] active:translate-y-0 active:scale-[0.99] rounded-2xl flex items-center justify-center gap-3 overflow-hidden relative group"
                onClick={handlePay}
                disabled={loading}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white/80"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>กำลังดำเนินการ...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 text-blue-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    <span>
                      ชำระเงิน{' '}
                      {(invoice.net_total / 100).toLocaleString('th-TH', {
                        minimumFractionDigits: 2
                      })}{' '}
                      บาท
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
