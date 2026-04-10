'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'

type PaymentMethod = 'promptpay' | 'credit_card'
type Focused = 'number' | 'name' | 'expiry' | 'cvc' | ''
type Step = 'tiers' | 'info' | 'summary' | 'result'

declare global {
  interface Window {
    Omise: any
  }
}

interface SeasonalDropTier {
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

  if (prevValue.length > value.length) {
    if (prevValue.includes('/') && !value.includes('/')) {
      return digits.slice(0, 1)
    }
    return digits.length <= 2 ? digits : digits.slice(0, 2) + '/' + digits.slice(2)
  }

  if (digits.length === 0) return ''
  if (digits.length <= 2) {
    if (digits.length === 2) return digits + '/'
    return digits
  }
  return digits.slice(0, 2) + '/' + digits.slice(2)
}

const DonationSection = () => {
  const [step, setStep] = useState<Step>('tiers')
  const [tiers, setTiers] = useState<SeasonalDropTier[]>([])
  const [tiersLoading, setTiersLoading] = useState(true)
  const [tiersError, setTiersError] = useState('')
  const [selectedTier, setSelectedTier] = useState<SeasonalDropTier | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay')
  const [buyerName, setBuyerName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
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

  const priceInBaht = selectedTier ? selectedTier.price / 100 : 0

  // Fetch tiers on mount
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const { data } = await apiClient.get<{ success: boolean; data: SeasonalDropTier[] }>('/seasonal-drops/tiers')
        setTiers(data.data)
      } catch {
        setTiersError('ไม่สามารถโหลดข้อมูลสินค้าได้')
      } finally {
        setTiersLoading(false)
      }
    }
    fetchTiers()
  }, [])

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
    setStep('tiers')
    setSelectedTier(null)
    setPaymentMethod('promptpay')
    setBuyerName('')
    setEmail('')
    setPhoneNumber('')
    setShippingAddress('')
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
            `/seasonal-drops/${result.data.orderId}/status`
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

  const handleSelectTier = (tier: SeasonalDropTier) => {
    setSelectedTier(tier)
    setStep('info')
    setError('')
  }

  const handleGoToSummary = () => {
    if (!email) {
      setError('กรุณากรอกอีเมล')
      return
    }
    if (selectedTier?.requires_shipping && !phoneNumber) {
      setError('กรุณากรอกหมายเลขโทรศัพท์สำหรับการจัดส่ง')
      return
    }
    if (selectedTier?.requires_shipping && !shippingAddress) {
      setError('กรุณากรอกที่อยู่จัดส่ง')
      return
    }
    if (paymentMethod === 'credit_card' && !phoneNumber) {
      setError('กรุณากรอกหมายเลขโทรศัพท์สำหรับการชำระเงินด้วยบัตรเครดิต')
      return
    }
    setError('')
    setStep('summary')
  }

  const handlePurchase = async () => {
    if (!selectedTier) return
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

      const { data } = await apiClient.post('/seasonal-drops/purchase', {
        tierId: selectedTier.id,
        paymentMethod,
        email,
        buyerName: buyerName || undefined,
        phoneNumber: phoneNumber || undefined,
        shippingAddress: shippingAddress || undefined,
        locale: navigator.language,
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

  // ─── Step indicator ───
  const stepNumber = (n: number, label: string) => (
    <h3 className="text-sm font-semibold text-[#153051] mb-3 flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-[#153051] text-white text-xs flex items-center justify-center">{n}</span>
      {label}
    </h3>
  )

  // ─── Back button ───
  const backButton = (onClick: () => void) => (
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-[#153051] transition-colors"
      aria-label="กลับ"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
      </svg>
    </button>
  )

  // ─── Error block ───
  const errorBlock = error ? (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {error}
    </div>
  ) : null

  // ─── Payment method selector (reused) ───
  const paymentMethodSelector = (
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
  )

  // ─── Payment method display (for summaries) ───
  const paymentMethodDisplay = (
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
  )

  return (
    <section
      id="seasonal-drop"
      className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#f8f9fb] to-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#7B68AE] mb-3">
            Seasonal Drop
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#153051] mb-3">
            สินค้าพิเศษประจำซีซัน
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            เลือกแพ็กเกจที่คุณต้องการ ไฟล์ดิจิทัลจะถูกส่งไปยังอีเมลของคุณ
          </p>
        </div>

        {step === 'tiers' && (
          /* ───────── Step 1: Tier Selection ───────── */
          <>
            {tiersLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B68AE]" />
              </div>
            ) : tiersError ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">{tiersError}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  ลองใหม่
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {tiers
                  .filter(t => t.is_active)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map(tier => (
                    <div
                      key={tier.id}
                      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                      {/* Image */}
                      <div className="relative w-full aspect-square bg-gray-100">
                        {tier.image_url ? (
                          <Image
                            src={tier.image_url}
                            alt={tier.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#B4A7D6]/20 to-[#153051]/10">
                            <svg className="w-16 h-16 text-[#B4A7D6]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                        {tier.requires_shipping && (
                          <span className="absolute top-3 right-3 bg-[#7B68AE] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                            Physical + Digital
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-bold text-[#153051] mb-1">{tier.name}</h3>
                        {tier.description && (
                          <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{tier.description}</p>
                        )}
                        {!tier.description && <div className="flex-1" />}
                        <div className="flex items-end justify-between mt-auto">
                          <p className="text-2xl font-bold text-[#153051]">
                            ฿{(tier.price / 100).toLocaleString()}
                          </p>
                          <Button
                            variant="primary"
                            size="sm"
                            className="dark:bg-primary dark:hover:bg-primary-hover"
                            onClick={() => handleSelectTier(tier)}
                          >
                            ซื้อเลย
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {step === 'info' && selectedTier && (
          /* ───────── Step 2: Buyer Info ───────── */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Selected tier banner */}
              <div className="bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] px-6 py-4 border-b border-[#B4A7D6]/20">
                <div className="flex items-center gap-3">
                  {backButton(() => setStep('tiers'))}
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#153051]">{selectedTier.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      ฿{priceInBaht.toLocaleString()}
                      {selectedTier.requires_shipping && ' — รวมจัดส่งสินค้า'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10 space-y-8">
                {/* ── Buyer Info ── */}
                <div>
                  {stepNumber(1, 'ข้อมูลผู้ซื้อ')}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        ชื่อ <span className="text-gray-400">(ไม่บังคับ)</span>
                      </label>
                      <input
                        type="text"
                        value={buyerName}
                        onChange={e => setBuyerName(e.target.value)}
                        placeholder="ชื่อของคุณ"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Shipping (conditional) ── */}
                {selectedTier.requires_shipping && (
                  <div>
                    {stepNumber(2, 'ข้อมูลจัดส่ง')}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          เบอร์โทร <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          placeholder="0812345678"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          ที่อยู่จัดส่ง <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          value={shippingAddress}
                          onChange={e => setShippingAddress(e.target.value)}
                          placeholder="ที่อยู่สำหรับจัดส่งสินค้า"
                          rows={3}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Payment Method ── */}
                <div>
                  {stepNumber(selectedTier.requires_shipping ? 3 : 2, 'วิธีชำระเงิน')}
                  {paymentMethodSelector}
                  {/* Phone number for credit card (if not already shown for shipping) */}
                  {paymentMethod === 'credit_card' && !selectedTier.requires_shipping && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        เบอร์โทร <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="0812345678"
                        className={inputClass}
                      />
                    </div>
                  )}
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

                {errorBlock}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full dark:bg-primary dark:hover:bg-primary-hover"
                  onClick={handleGoToSummary}
                  disabled={!acceptedTerms}
                >
                  ดำเนินการต่อ
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'summary' && selectedTier && (
          /* ───────── Step 3: Summary + Credit Card ───────── */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  {backButton(() => setStep('info'))}
                  <h3 className="text-lg font-bold text-[#153051]">สรุปคำสั่งซื้อ</h3>
                </div>

                {/* Line items */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center gap-4 p-4 bg-white">
                    <div className="w-12 h-12 rounded-xl bg-[#153051]/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {selectedTier.image_url ? (
                        <Image src={selectedTier.image_url} alt={selectedTier.name} width={48} height={48} className="object-cover w-full h-full" />
                      ) : (
                        <svg className="w-5 h-5 text-[#153051]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#153051]">{selectedTier.name}</p>
                      {selectedTier.description && (
                        <p className="text-xs text-gray-400 truncate">{selectedTier.description}</p>
                      )}
                      {selectedTier.requires_shipping && (
                        <span className="inline-block mt-1 text-[10px] bg-[#7B68AE]/10 text-[#7B68AE] font-medium px-2 py-0.5 rounded-full">
                          Physical + Digital
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-[#153051] tabular-nums flex-shrink-0">
                      ฿{priceInBaht.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Summary details */}
                <div className="space-y-3 p-5 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">วิธีชำระเงิน</span>
                    {paymentMethodDisplay}
                  </div>
                  {buyerName && (
                    <>
                      <div className="h-px bg-gray-200" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">ชื่อ</span>
                        <span className="text-sm font-medium text-[#153051]">{buyerName}</span>
                      </div>
                    </>
                  )}
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">อีเมล</span>
                    <span className="text-sm font-medium text-[#153051]">{email}</span>
                  </div>
                  {phoneNumber && (
                    <>
                      <div className="h-px bg-gray-200" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">เบอร์โทร</span>
                        <span className="text-sm font-medium text-[#153051]">{phoneNumber}</span>
                      </div>
                    </>
                  )}
                  {shippingAddress && (
                    <>
                      <div className="h-px bg-gray-200" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">ที่อยู่จัดส่ง</span>
                        <span className="text-sm font-medium text-[#153051] text-right max-w-[60%]">{shippingAddress}</span>
                      </div>
                    </>
                  )}
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#153051]">ยอดรวม</span>
                    <span className="text-xl font-bold text-[#153051]">฿{priceInBaht.toLocaleString()}</span>
                  </div>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit_card' && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#153051] mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      กรอกข้อมูลบัตรเครดิต
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
                  </div>
                )}

                {errorBlock}

                {/* Pay button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full dark:bg-primary dark:hover:bg-primary-hover"
                  onClick={handlePurchase}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {paymentMethod === 'credit_card' ? 'กำลังเปลี่ยนหน้า...' : 'กำลังดำเนินการ...'}
                    </span>
                  ) : (
                    `ชำระเงิน ฿${priceInBaht.toLocaleString()}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'result' && result?.success && (
          /* ───────── Step 4: Result ───────── */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
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
                      <p className="text-xs text-emerald-600">ขอบคุณสำหรับการสั่งซื้อ</p>
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
                    <span className="text-sm text-gray-500">สินค้า</span>
                    <span className="text-sm font-medium text-[#153051]">{selectedTier?.name}</span>
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">วิธีชำระเงิน</span>
                    {paymentMethodDisplay}
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">จำนวน</span>
                    <span className="text-lg font-bold text-[#153051]">
                      ฿{priceInBaht.toLocaleString()}
                    </span>
                  </div>
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
                  {paymentStatus === 'pending' ? 'ยกเลิก' : 'ซื้อสินค้าอื่น'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default DonationSection
