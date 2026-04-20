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

/** Format card number with spaces every 4 digits */
const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

/** Format expiry as MM/YY with auto slash */
const formatExpiry = (value: string, prevValue: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4)

  if (prevValue.length > value.length) {
    if (prevValue.includes('/') && !value.includes('/')) {
      return digits.slice(0, 1)
    }
    return digits.length <= 2
      ? digits
      : digits.slice(0, 2) + '/' + digits.slice(2)
  }

  if (digits.length === 0) return ''
  if (digits.length <= 2) {
    if (digits.length === 2) return digits + '/'
    return digits
  }
  return digits.slice(0, 2) + '/' + digits.slice(2)
}

const inputClass =
  'w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-[#153051] focus:ring-2 focus:ring-[#153051]/10 transition-all placeholder:text-slate-400'

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
    retry: false,
    // Keep polling while PENDING — catches the case where Mobile Safari reloads
    // the page mid-payment (bfcache miss) and the manual setInterval is gone.
    refetchInterval: (query) =>
      query.state.data?.status === 'PENDING' ? 3000 : false,
  })

  const [paymentMethod, setPaymentMethod] = useState<
    'promptpay' | 'credit_card'
  >('promptpay')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

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
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleCardNumberChange = (value: string) => {
    setCardNumber(formatCardNumber(value))
  }

  const handleExpiryChange = (value: string) => {
    setCardExpiry(formatExpiry(value, cardExpiry))
  }

  const handleCvcChange = (value: string) => {
    setCardCvc(value.replace(/\D/g, '').slice(0, 4))
  }

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

      // Mobile Safari pauses setInterval when the app goes to background (e.g. user
      // switches to their banking app to scan the QR). Check immediately on return.
      const handleVisibilityChange = () => {
        if (!document.hidden) checkStatus()
      }
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
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

  const formatTHB = (satang: number) =>
    (satang / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })

  // ─── Loading State ───
  if (isInvoiceLoading)
    return (
      <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#153051] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#153051] font-medium">
            กำลังโหลดข้อมูลใบแจ้งหนี้...
          </p>
        </div>
      </div>
    )

  // ─── Error State ───
  if (invoiceError || !invoice)
    return (
      <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
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
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white flex flex-col items-center py-8 sm:py-12 px-4 selection:bg-[#153051] selection:text-white">
      <div className="max-w-xl w-full">
        {/* ─── Header ─── */}
        <div className="relative rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-[#153051] to-[#0f2340] text-white px-6 py-8 sm:px-8 sm:py-10 text-center overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-5">
              <Image
                src="/logo-hover.svg"
                alt="LIKQ Logo"
                width={120}
                height={40}
                className="brightness-0 invert object-contain mx-auto"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">
              ใบแจ้งหนี้{' '}
              <span className="text-blue-200 font-mono">
                #{invoice.id.split('-')[0]}
              </span>
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm">
              <span className="opacity-75">เรียกเก็บจาก</span>
              <span className="font-medium">{invoice.customer_name}</span>
            </div>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div className="bg-white rounded-b-2xl sm:rounded-b-3xl shadow-lg border border-gray-100 border-t-0">
          <div className="p-5 sm:p-8 space-y-6">
            {/* ─── Order Summary ─── */}
            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
              <h3 className="text-sm font-bold text-[#153051] mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                สรุปรายการ
              </h3>

              <div className="space-y-3">
                {invoice.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-mono text-slate-900 tabular-nums">
                      {formatTHB(item.price)}
                      <span className="text-xs text-slate-400 font-sans ml-1">THB</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>ยอดรวม</span>
                  <span className="font-mono tabular-nums">
                    {formatTHB(invoice.subtotal)}
                    <span className="text-xs ml-1">THB</span>
                  </span>
                </div>
                {invoice.is_wht_enabled && (
                  <div className="flex justify-between text-rose-600 bg-rose-50 px-3 py-2 -mx-1 rounded-lg">
                    <span>หักภาษี ณ ที่จ่าย (3%)</span>
                    <span className="font-mono tabular-nums">
                      -{formatTHB(invoice.wht_amount)}
                      <span className="text-xs ml-1">THB</span>
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1 pt-3 border-t border-slate-200">
                  <span className="text-base font-bold text-slate-900">ยอดชำระสุทธิ</span>
                  <div className="flex items-baseline gap-1.5 ml-auto">
                    <span className="text-2xl sm:text-3xl font-black text-[#153051] font-mono tabular-nums tracking-tight">
                      {formatTHB(invoice.net_total)}
                    </span>
                    <span className="text-sm font-bold text-slate-400">THB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Paid State ─── */}
            {isPaid ? (
              <div className="text-center py-8 px-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">ชำระเงินสำเร็จ</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                  ขอบคุณครับ/ค่ะ! เราได้รับยอดชำระเงินของท่านเรียบร้อยแล้ว
                  <br />
                  ใบเสร็จรับเงินจะถูกจัดส่งไปยังอีเมลของท่าน
                </p>
              </div>

            ) : result ? (
              /* ─── Pending Payment Result ─── */
              <div className="space-y-6">
                {/* PromptPay QR */}
                {paymentStatus === 'pending' && result.data?.payment?.qrCodeUrl && (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-full text-sm font-medium border border-sky-100">
                      <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      รอการยืนยันชำระเงิน...
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-[300px] mx-auto shadow-sm">
                      <Image
                        src="/images/promptpay-logo.png"
                        alt="PromptPay"
                        width={90}
                        height={30}
                        className="mx-auto mb-4 object-contain"
                      />
                      <div className="bg-white p-3 rounded-xl border border-slate-100 mb-4">
                        <img
                          src={result.data.payment.qrCodeUrl}
                          alt="PromptPay QR Code"
                          className="mx-auto w-full aspect-square object-contain"
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        กรุณาสแกน QR Code<br />
                        ด้วยแอปพลิเคชันธนาคารของท่าน
                      </p>
                    </div>
                  </div>
                )}

                {/* Credit Card Authorize */}
                {paymentStatus === 'pending' && result.data?.authorizeUri && (
                  <div className="text-center py-6 px-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mx-auto">
                      <svg className="w-8 h-8 text-[#153051]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5">ตรวจสอบสิทธิ์การชำระเงิน</h3>
                      <p className="text-sm text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                        ระบบจะนำท่านไปยังหน้ายืนยันการชำระเงินด้วยบัตรเครดิตของธนาคาร
                      </p>
                    </div>
                    <a href={result.data.authorizeUri} className="block">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full bg-[#153051] hover:bg-[#0f2340]"
                      >
                        ดำเนินการต่อ
                      </Button>
                    </a>
                  </div>
                )}

                <button
                  onClick={() => {
                    setResult(null)
                    setPaymentStatus(null)
                  }}
                  className="block mx-auto text-sm font-medium text-slate-400 hover:text-slate-600 underline underline-offset-4 transition-colors py-2 px-4"
                >
                  ยกเลิก หรือ เปลี่ยนวิธีชำระเงิน
                </button>
              </div>

            ) : (
              /* ─── Payment Form ─── */
              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-sm font-bold text-[#153051] mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    เลือกวิธีการชำระเงิน
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('promptpay')}
                      className={`relative flex flex-col items-center justify-center py-5 px-4 rounded-2xl border-2 transition-all duration-200 ${
                        paymentMethod === 'promptpay'
                          ? 'border-[#153051] bg-[#153051]/[0.03]'
                          : 'border-slate-150 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'promptpay' && (
                        <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#153051] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                      <Image
                        src="/images/promptpay-logo.png"
                        alt="PromptPay"
                        width={72}
                        height={24}
                        className={`mb-3 object-contain transition-all ${
                          paymentMethod !== 'promptpay' ? 'grayscale opacity-50' : ''
                        }`}
                      />
                      <span className={`font-semibold text-sm ${
                        paymentMethod === 'promptpay' ? 'text-[#153051]' : 'text-slate-400'
                      }`}>
                        พร้อมเพย์
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`relative flex flex-col items-center justify-center py-4 px-3 rounded-2xl border-2 transition-all duration-200 ${
                        paymentMethod === 'credit_card'
                          ? 'border-[#153051] bg-[#153051]/[0.03]'
                          : 'border-slate-150 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'credit_card' && (
                        <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#153051] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                      <div className={`flex items-center gap-1 mb-2 transition-all ${paymentMethod !== 'credit_card' ? 'grayscale opacity-40' : ''}`}>
                        {/* Visa */}
                        <svg viewBox="0 0 38 24" className="h-[18px] w-auto" fill="none" aria-label="Visa">
                          <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                          <path d="M16.2 17H14l1.4-9h2.2L16.2 17ZM11.7 8 9.5 14.1l-.2-1-.8-4.2C8.4 8.4 8 8.1 7.5 8H3.8l-.1.3c.9.2 1.7.6 2.4 1.1L8.1 17H10.4L13.9 8H11.7ZM22.4 12.7c0-1-.6-1.7-1.9-2.3-.8-.4-1.3-.7-1.3-1.1 0-.4.4-.8 1.3-.8.7 0 1.2.2 1.7.4l.2.1.3-1.9C22.2 6.9 21.5 6.7 20.6 6.7c-2.2 0-3.7 1.1-3.7 2.7 0 1.2 1 1.9 1.9 2.3.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.3.9-.9 0-1.5-.2-2.2-.5l-.2-.1-.3 2c.5.2 1.4.4 2.4.4 2.4 0 3.8-1.1 4-2.8ZM27.3 17H29.2L27.6 8H25.8c-.5 0-.9.3-1.1.7L21.6 17H23.9l.5-1.3H27.1L27.3 17ZM24.9 14 26 10.9l.6 3.1H24.9Z" fill="white"/>
                        </svg>
                        {/* Mastercard */}
                        <svg viewBox="0 0 38 24" className="h-[18px] w-auto" fill="none" aria-label="Mastercard">
                          <rect width="38" height="24" rx="4" fill="#1D1D1D"/>
                          <circle cx="14.5" cy="12" r="6.5" fill="#EB001B"/>
                          <circle cx="23.5" cy="12" r="6.5" fill="#F79E1B"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M19 5.68a6.5 6.5 0 0 1 0 12.64A6.5 6.5 0 0 1 19 5.68Z" fill="#FF5F00"/>
                        </svg>
                        {/* JCB */}
                        <svg viewBox="0 0 38 24" className="h-[18px] w-auto" fill="none" aria-label="JCB">
                          <rect width="38" height="24" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
                          <rect x="5" y="3.5" width="8.5" height="17" rx="3.5" fill="#003087"/>
                          <rect x="14.75" y="3.5" width="8.5" height="17" rx="3.5" fill="#CC0000"/>
                          <rect x="24.5" y="3.5" width="8.5" height="17" rx="3.5" fill="#007B40"/>
                        </svg>
                      </div>
                      <span className={`font-semibold text-sm ${
                        paymentMethod === 'credit_card' ? 'text-[#153051]' : 'text-slate-400'
                      }`}>
                        Credit / Debit
                      </span>
                      <span className={`text-[9px] font-medium mt-0.5 ${
                        paymentMethod === 'credit_card' ? 'text-[#153051]/50' : 'text-slate-300'
                      }`}>
                        3D Secure via Omise
                      </span>
                    </button>
                  </div>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-5">
                    {/* Card Preview */}
                    <div className="flex justify-center">
                      <div className="w-full max-w-[290px] sm:max-w-none">
                        <Cards
                          number={cardNumber}
                          name={cardName}
                          expiry={cardExpiry.replace('/', '')}
                          cvc={cardCvc}
                          focused={cardFocused}
                        />
                      </div>
                    </div>

                    {/* Card Fields */}
                    <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">หมายเลขบัตร</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={e => handleCardNumberChange(e.target.value)}
                          onFocus={() => setCardFocused('number')}
                          maxLength={19}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">ชื่อบนบัตร</label>
                        <input
                          type="text"
                          autoComplete="cc-name"
                          placeholder="JOHN DOE"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          onFocus={() => setCardFocused('name')}
                          className={`${inputClass} uppercase`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">วันหมดอายุ</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={e => handleExpiryChange(e.target.value)}
                            onFocus={() => setCardFocused('expiry')}
                            maxLength={5}
                            className={`${inputClass} text-center`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">CVC</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            placeholder="123"
                            value={cardCvc}
                            onChange={e => handleCvcChange(e.target.value)}
                            onFocus={() => setCardFocused('cvc')}
                            maxLength={4}
                            className={`${inputClass} text-center`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms & Policies */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#153051] focus:ring-[#153051]/30 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    ฉันยอมรับ{' '}
                    <a href="/merch/th/policy/terms" target="_blank" rel="noopener noreferrer" className="text-[#153051] underline underline-offset-2 hover:text-[#0f2340]">ข้อกำหนดและเงื่อนไข</a>
                    {', '}
                    <a href="/merch/th/policy/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#153051] underline underline-offset-2 hover:text-[#0f2340]">นโยบายความเป็นส่วนตัว</a>
                    {', '}
                    <a href="/merch/th/policy/refund-policy" target="_blank" rel="noopener noreferrer" className="text-[#153051] underline underline-offset-2 hover:text-[#0f2340]">นโยบายการคืนเงิน</a>
                    {' และ '}
                    <a href="/merch/th/policy/shipping-policy" target="_blank" rel="noopener noreferrer" className="text-[#153051] underline underline-offset-2 hover:text-[#0f2340]">นโยบายการจัดส่ง</a>
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 p-4 text-sm text-rose-600 bg-rose-50 rounded-xl border border-rose-100" role="alert">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full py-4 text-base sm:text-lg font-bold bg-[#153051] hover:bg-[#0f2340] rounded-2xl"
                  onClick={handlePay}
                  disabled={loading || !acceptedTerms}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      กำลังดำเนินการ...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      ชำระเงิน {formatTHB(invoice.net_total)} บาท
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
