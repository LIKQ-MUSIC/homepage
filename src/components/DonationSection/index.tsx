'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'

type PaymentMethod = 'promptpay' | 'credit_card'
type Focused = 'number' | 'name' | 'expiry' | 'cvc' | ''

declare global {
  interface Window {
    Omise: any
  }
}

const PRESET_AMOUNTS = [20, 50, 100, 200, 500]

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

const createOmiseToken = (cardData: {
  name: string
  number: string
  expiration_month: number
  expiration_year: number
  security_code: string
}): Promise<string> => {
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

const DonationSection = () => {
  const [amount, setAmount] = useState<number>(100)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay')
  const [donorName, setDonorName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'successful' | 'failed'
  >('pending')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Credit card state
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardFocused, setCardFocused] = useState<Focused>('')

  const effectiveAmount = isCustom ? Number(customAmount) : amount

  const handlePresetClick = (value: number) => {
    setIsCustom(false)
    setAmount(value)
    setError('')
  }

  const handleCustomChange = (value: string) => {
    setIsCustom(true)
    setCustomAmount(value)
    setError('')
  }

  const resetAll = useCallback(() => {
    setAmount(100)
    setCustomAmount('')
    setIsCustom(false)
    setPaymentMethod('promptpay')
    setDonorName('')
    setEmail('')
    setPhoneNumber('')
    setLoading(false)
    setResult(null)
    setError('')
    setSubmitted(false)
    setCardNumber('')
    setCardName('')
    setCardExpiry('')
    setCardCvc('')
    setCardFocused('')
    setPaymentStatus('pending')
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }, [])

  // Polling for PromptPay status
  useEffect(() => {
    if (
      submitted &&
      paymentMethod === 'promptpay' &&
      result?.data?.orderId &&
      paymentStatus === 'pending'
    ) {
      const checkStatus = async () => {
        try {
          const { data } = await apiClient.get(
            `/donations/${result.data.orderId}/status`
          )
          if (data.success && data.data?.status) {
            const status = data.data.status
            if (status === 'successful' || status === 'failed') {
              setPaymentStatus(status)
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
                pollingIntervalRef.current = null
              }
            }
          }
        } catch (error) {
          console.error('Failed to check payment status:', error)
        }
      }

      // Start polling every 3 seconds
      pollingIntervalRef.current = setInterval(checkStatus, 3000)
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [submitted, paymentMethod, result, paymentStatus])

  const handleDonate = async () => {
    if (effectiveAmount < 20 || effectiveAmount > 2000) {
      setError('ยอดโดเนทต้องอยู่ระหว่าง 20 - 2,000 บาท')
      return
    }

    // Validate email and phone for credit card payments
    if (paymentMethod === 'credit_card') {
      if (!email) {
        setError('กรุณากรอกอีเมลสำหรับการชำระเงินด้วยบัตรเครดิต')
        return
      }
      if (!phoneNumber) {
        setError('กรุณากรอกหมายเลขโทรศัพท์สำหรับการชำระเงินด้วยบัตรเครดิต')
        return
      }
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      let cardToken: string | undefined

      if (paymentMethod === 'credit_card') {
        const [monthStr, yearStr] = cardExpiry.split('/')
        const month = parseInt(monthStr, 10)
        const year = parseInt(yearStr, 10)

        if (!cardNumber || !cardName || !month || !year || !cardCvc) {
          setError('กรุณากรอกข้อมูลบัตรให้ครบถ้วน')
          setLoading(false)
          return
        }

        await loadOmiseScript()
        cardToken = await createOmiseToken({
          name: cardName,
          number: cardNumber.replace(/\s/g, ''),
          expiration_month: month,
          expiration_year: year + 2000,
          security_code: cardCvc
        })
      }

      const { data } = await apiClient.post('/donations', {
        amount: effectiveAmount,
        paymentMethod,
        donorName: donorName || undefined,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        ...(cardToken && { cardToken })
      })

      setResult(data)
      setSubmitted(true)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'เกิดข้อผิดพลาด กรุณาลองใหม่'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="donation"
      className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#f8f9fb] to-white"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#7B68AE] mb-3">
            Support Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#153051] mb-3">
            สนับสนุนพวกเรา
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            ร่วมเป็นส่วนหนึ่งในการสร้างเสียงเพลง
            ทุกบาทของคุณจะช่วยให้เราผลิตผลงานดนตรีที่มีคุณภาพต่อไป
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10">
          {submitted && result?.success ? (
            /* Summary Screen */
            <div className="space-y-5">
              {paymentStatus === 'successful' ? (
                <div className="flex items-center gap-2 mb-2 p-3 bg-green-50 text-green-700 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                  <span className="font-semibold text-sm">
                    ชำระเงินสำเร็จ ขอบคุณสำหรับการสนับสนุน
                  </span>
                </div>
              ) : paymentStatus === 'failed' ? (
                <div className="flex items-center gap-2 mb-2 p-3 bg-red-50 text-red-700 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span className="font-semibold text-sm">
                    การชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2 p-3 bg-blue-50 text-blue-700 rounded-lg">
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  <span className="font-semibold text-sm">
                    รอการชำระเงิน (กรุณาดำเนินการต่อ)
                  </span>
                </div>
              )}

              <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">วิธีชำระเงิน</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-[#153051]">
                    {paymentMethod === 'promptpay' ? (
                      <>
                        <Image
                          src="/images/promptpay-logo.png"
                          alt="PromptPay"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                        PromptPay
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <rect x="1" y="4" width="22" height="16" rx="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        บัตรเครดิต
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">จำนวน</span>
                  <span className="text-sm font-semibold text-[#153051]">
                    ฿{effectiveAmount.toLocaleString()}
                  </span>
                </div>
                {donorName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">ชื่อผู้โดเนท</span>
                    <span className="text-sm font-medium text-[#153051]">
                      {donorName}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="text-xs font-mono text-gray-400">
                    {result.data?.orderId}
                  </span>
                </div>
              </div>

              {/* QR Code for PromptPay — only show while pending */}
              {paymentStatus === 'pending' &&
                result.data?.payment?.qrCodeUrl && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">
                      สแกน QR Code เพื่อชำระเงิน:
                    </p>
                    <img
                      src={result.data.payment.qrCodeUrl}
                      alt="QR Code"
                      className="mx-auto w-48 h-48 rounded-lg"
                    />
                  </div>
                )}

              {/* Authorize URI for Credit Card — only show while pending */}
              {paymentStatus === 'pending' && result.data?.authorizeUri && (
                <div className="text-center">
                  <a href={result.data.authorizeUri}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full dark:bg-primary dark:hover:bg-primary-hover"
                    >
                      ดำเนินการชำระเงิน
                    </Button>
                  </a>
                </div>
              )}

              <Button
                variant="outline"
                size="lg"
                className="w-full dark:border-primary dark:text-primary dark:hover:bg-primary-light"
                onClick={resetAll}
              >
                {paymentStatus === 'pending' ? 'ยกเลิก' : 'โดเนทอีกครั้ง'}
              </Button>
            </div>
          ) : (
            /* Donation Form */
            <>
              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#153051] mb-3">
                  เลือกจำนวน (บาท)
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {PRESET_AMOUNTS.map(val => (
                    <button
                      key={val}
                      onClick={() => handlePresetClick(val)}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        !isCustom && amount === val
                          ? 'bg-[#153051] text-white shadow-md scale-105'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      ฿{val}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mt-3">
                  <input
                    type="number"
                    placeholder="กรอกจำนวนเอง..."
                    value={isCustom ? customAmount : ''}
                    onChange={e => handleCustomChange(e.target.value)}
                    onFocus={() => setIsCustom(true)}
                    min={20}
                    max={2000}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B4A7D6] ${
                      isCustom
                        ? 'border-[#B4A7D6] bg-[#f5f3ff]'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#153051] mb-3">
                  วิธีชำระเงิน
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                      paymentMethod === 'promptpay'
                        ? 'bg-[#153051] text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Image
                      src="/images/promptpay-logo.png"
                      alt="PromptPay"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    PromptPay
                  </button>
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'bg-[#153051] text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    บัตรเครดิต
                  </button>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'credit_card' && (
                <div className="mb-6 space-y-4">
                  <div className="flex justify-center">
                    <Cards
                      number={cardNumber}
                      name={cardName}
                      expiry={cardExpiry}
                      cvc={cardCvc}
                      focused={cardFocused || undefined}
                    />
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="หมายเลขบัตร"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      onFocus={() => setCardFocused('number')}
                      maxLength={19}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]"
                    />
                    <input
                      type="text"
                      placeholder="ชื่อบนบัตร"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      onFocus={() => setCardFocused('name')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        onFocus={() => setCardFocused('expiry')}
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        onFocus={() => setCardFocused('cvc')}
                        maxLength={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Donor Info */}
              <div className="mb-6 space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    ชื่อผู้โดเนท (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    placeholder="ชื่อของคุณ"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      อีเมล{' '}
                      {paymentMethod === 'credit_card' && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      เบอร์โทร{' '}
                      {paymentMethod === 'credit_card' && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="0812345678"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                variant="primary"
                size="lg"
                className="w-full dark:bg-primary dark:hover:bg-primary-hover"
                onClick={handleDonate}
                disabled={
                  loading || effectiveAmount < 20 || effectiveAmount > 2000
                }
              >
                {loading
                  ? 'กำลังดำเนินการ...'
                  : `โดเนท ฿${effectiveAmount.toLocaleString()}`}
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default DonationSection
