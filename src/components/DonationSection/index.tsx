'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'

type PaymentMethod = 'promptpay' | 'credit_card'
type Focused = 'number' | 'name' | 'expiry' | 'cvc' | ''
type Step = 'form' | 'result'

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

/** Format card number with spaces every 4 digits */
const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

/** Format expiry as MM/YY with auto slash */
const formatExpiry = (value: string, prevValue: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4)

  // If user is deleting and we had a slash, let them delete cleanly
  if (prevValue.length > value.length) {
    // If they deleted the slash, remove the last month digit too
    if (prevValue.includes('/') && !value.includes('/')) {
      return digits.slice(0, 1)
    }
    return digits.length <= 2 ? digits : digits.slice(0, 2) + '/' + digits.slice(2)
  }

  if (digits.length === 0) return ''
  if (digits.length <= 2) {
    // Auto-add slash after 2 digits
    if (digits.length === 2) return digits + '/'
    return digits
  }
  return digits.slice(0, 2) + '/' + digits.slice(2)
}

const DonationSection = () => {
  const [step, setStep] = useState<Step>('form')
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
  const [acceptedTerms, setAcceptedTerms] = useState(false)

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

  const handleCardNumberChange = (value: string) => {
    setCardNumber(formatCardNumber(value))
  }

  const handleExpiryChange = (value: string) => {
    setCardExpiry(formatExpiry(value, cardExpiry))
  }

  const handleCvcChange = (value: string) => {
    setCardCvc(value.replace(/\D/g, '').slice(0, 4))
  }

  const resetAll = useCallback(() => {
    setStep('form')
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
    setCardNumber('')
    setCardName('')
    setCardExpiry('')
    setCardCvc('')
    setCardFocused('')
    setAcceptedTerms(false)
    setPaymentStatus('pending')
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }, [])

  // Polling for PromptPay status
  useEffect(() => {
    if (
      step === 'result' &&
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

      pollingIntervalRef.current = setInterval(checkStatus, 3000)
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [step, paymentMethod, result, paymentStatus])

  const handleDonate = async () => {
    if (effectiveAmount < 20 || effectiveAmount > 2000) {
      setError('ยอดโดเนทต้องอยู่ระหว่าง 20 - 2,000 บาท')
      return
    }

    if (!email) {
      setError('กรุณากรอกอีเมลเพื่อรับของสมนาคุณ')
      return
    }

    if (paymentMethod === 'credit_card') {
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

      // Credit card: auto-redirect to 3DS authorize page
      if (paymentMethod === 'credit_card' && data.data?.authorizeUri) {
        window.location.href = data.data.authorizeUri
        return
      }

      setResult(data)
      setStep('result')
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

  // ─── Shared input class ───
  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]/60 focus:border-[#B4A7D6] placeholder:text-gray-400'

  return (
    <section
      id="donation"
      className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#f8f9fb] to-white"
    >
      <div className="max-w-3xl mx-auto">
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

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {step === 'result' && result?.success ? (
            /* ───────── Result Screen ───────── */
            <div className="p-6 md:p-10 space-y-5">
              {/* Status Banner */}
              {paymentStatus === 'successful' ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">ชำระเงินสำเร็จ</p>
                    <p className="text-xs text-emerald-600">ขอบคุณสำหรับการสนับสนุน</p>
                  </div>
                </div>
              ) : paymentStatus === 'failed' ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">การชำระเงินล้มเหลว</p>
                    <p className="text-xs text-red-600">กรุณาลองใหม่อีกครั้ง</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">รอการชำระเงิน</p>
                    <p className="text-xs text-blue-600">กรุณาดำเนินการชำระเงินด้านล่าง</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-3 p-5 rounded-2xl bg-gray-50/80 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">วิธีชำระเงิน</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-[#153051]">
                    {paymentMethod === 'promptpay' ? (
                      <>
                        <Image src="/images/promptpay-logo.png" alt="PromptPay" width={20} height={20} className="object-contain" />
                        PromptPay
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <rect x="1" y="4" width="22" height="16" rx="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        บัตรเครดิต
                      </>
                    )}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">จำนวน</span>
                  <span className="text-lg font-bold text-[#153051]">
                    ฿{effectiveAmount.toLocaleString()}
                  </span>
                </div>
                {donorName && (
                  <>
                    <div className="h-px bg-gray-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">ชื่อผู้โดเนท</span>
                      <span className="text-sm font-medium text-[#153051]">{donorName}</span>
                    </div>
                  </>
                )}
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="text-xs font-mono text-gray-400">{result.data?.orderId}</span>
                </div>
              </div>

              {/* QR Code for PromptPay */}
              {paymentStatus === 'pending' && result.data?.payment?.qrCodeUrl && (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-500 mb-3">สแกน QR Code เพื่อชำระเงิน</p>
                  <img
                    src={result.data.payment.qrCodeUrl}
                    alt="QR Code"
                    className="mx-auto w-52 h-52 rounded-xl border border-gray-100"
                  />
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
            /* ───────── Donation Form ───────── */
            <>
              {/* Reward Banner */}
              <div className="bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] px-6 py-4 border-b border-[#B4A7D6]/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#B4A7D6]/20 rounded-lg flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#7B68AE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
                      <path d="M2 8h20v4H2z" />
                      <path d="M12 2l3 6H9l3-6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#153051]">ของสมนาคุณสำหรับผู้ Donate</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      รับอาร์ตเวิร์ก เพลงคาปิบาราไม่ได้นอน - KIMYORA พร้อมไฟล์ WAV
                      uncompressed และ Backing Track ทาง email ภายใน 3 วันทำการ
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10 space-y-8">
                {/* ── Section 1: Amount ── */}
                <div>
                  <h3 className="text-sm font-semibold text-[#153051] mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#153051] text-white text-xs flex items-center justify-center">1</span>
                    เลือกจำนวน (บาท)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AMOUNTS.map(val => (
                      <button
                        key={val}
                        onClick={() => handlePresetClick(val)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                          !isCustom && amount === val
                            ? 'bg-[#153051] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        ฿{val}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">฿</span>
                    <input
                      type="number"
                      placeholder="กรอกจำนวนเอง (20 - 2,000)"
                      value={isCustom ? customAmount : ''}
                      onChange={e => handleCustomChange(e.target.value)}
                      onFocus={() => setIsCustom(true)}
                      min={20}
                      max={2000}
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]/60 focus:border-[#B4A7D6] ${
                        isCustom
                          ? 'border-[#B4A7D6] bg-[#f5f3ff]/50'
                          : 'border-gray-200 bg-gray-50/60'
                      }`}
                    />
                  </div>
                </div>

                {/* ── Section 2: Payment Method ── */}
                <div>
                  <h3 className="text-sm font-semibold text-[#153051] mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#153051] text-white text-xs flex items-center justify-center">2</span>
                    วิธีชำระเงิน
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('promptpay')}
                      className={`relative flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-medium transition-all border-2 ${
                        paymentMethod === 'promptpay'
                          ? 'border-[#153051] bg-[#153051]/[0.03] text-[#153051] shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'promptpay' && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-[#153051] rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                      <Image src="/images/promptpay-logo.png" alt="PromptPay" width={24} height={24} className="object-contain" />
                      PromptPay
                    </button>
                    <button
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`relative flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-medium transition-all border-2 ${
                        paymentMethod === 'credit_card'
                          ? 'border-[#153051] bg-[#153051]/[0.03] text-[#153051] shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'credit_card' && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-[#153051] rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      บัตรเครดิต
                    </button>
                  </div>

                  {/* Credit Card Form */}
                  {paymentMethod === 'credit_card' && (
                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      {/* Card Preview */}
                      <div className="flex justify-center lg:sticky lg:top-8">
                        <Cards
                          number={cardNumber}
                          name={cardName}
                          expiry={cardExpiry.replace('/', '')}
                          cvc={cardCvc}
                          focused={cardFocused || undefined}
                        />
                      </div>
                      {/* Card Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">หมายเลขบัตร</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={e => handleCardNumberChange(e.target.value)}
                            onFocus={() => setCardFocused('number')}
                            maxLength={19}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">ชื่อบนบัตร</label>
                          <input
                            type="text"
                            placeholder="JOHN DOE"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            onFocus={() => setCardFocused('name')}
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">วันหมดอายุ</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={e => handleExpiryChange(e.target.value)}
                              onFocus={() => setCardFocused('expiry')}
                              maxLength={5}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">CVC</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="123"
                              value={cardCvc}
                              onChange={e => handleCvcChange(e.target.value)}
                              onFocus={() => setCardFocused('cvc')}
                              maxLength={4}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Section 3: Your Info ── */}
                <div>
                  <h3 className="text-sm font-semibold text-[#153051] mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#153051] text-white text-xs flex items-center justify-center">3</span>
                    ข้อมูลผู้โดเนท
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        ชื่อ <span className="text-gray-400">(ไม่บังคับ)</span>
                      </label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={e => setDonorName(e.target.value)}
                        placeholder="ชื่อของคุณ"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        อีเมล <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        เบอร์โทร{' '}
                        {paymentMethod === 'credit_card' && (
                          <span className="text-red-400">*</span>
                        )}
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="0812345678"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms & Policies */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#153051] focus:ring-[#B4A7D6] cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    ฉันยอมรับ{' '}
                    <a href="/merch/th/policy/terms" target="_blank" rel="noopener noreferrer" className="text-[#7B68AE] underline underline-offset-2 hover:text-[#153051]">ข้อกำหนดและเงื่อนไข</a>
                    {', '}
                    <a href="/merch/th/policy/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#7B68AE] underline underline-offset-2 hover:text-[#153051]">นโยบายความเป็นส่วนตัว</a>
                    {', '}
                    <a href="/merch/th/policy/refund-policy" target="_blank" rel="noopener noreferrer" className="text-[#7B68AE] underline underline-offset-2 hover:text-[#153051]">นโยบายการคืนเงิน</a>
                    {' และ '}
                    <a href="/merch/th/policy/shipping-policy" target="_blank" rel="noopener noreferrer" className="text-[#7B68AE] underline underline-offset-2 hover:text-[#153051]">นโยบายการจัดส่ง</a>
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
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
                    loading || !acceptedTerms || effectiveAmount < 20 || effectiveAmount > 2000
                  }
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {paymentMethod === 'credit_card' ? 'กำลังเปลี่ยนหน้า...' : 'กำลังดำเนินการ...'}
                    </span>
                  ) : (
                    `โดเนท ฿${effectiveAmount.toLocaleString()}`
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default DonationSection
