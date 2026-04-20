'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { apiClient } from '@/lib/api-client'
import Button from '@/ui/Button'

type PaymentMethod = 'promptpay' | 'credit_card'
type Focused = 'number' | 'name' | 'expiry' | 'cvc' | ''
type Step = 'product' | 'summary' | 'result'

declare global {
  interface Window {
    Omise: any
  }
}

export interface SeasonalDropTier {
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

export interface SeasonalDropImage {
  id: string
  public_url: string
  filename: string
}

interface SeasonalDropSectionProps {
  initialTiers: SeasonalDropTier[]
  initialImages: SeasonalDropImage[]
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

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

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

const SeasonalDropSection = ({ initialTiers, initialImages }: SeasonalDropSectionProps) => {
  const [step, setStep] = useState<Step>('product')
  const [tiers] = useState<SeasonalDropTier[]>(initialTiers)
  const [selectedTier, setSelectedTier] = useState<SeasonalDropTier | null>(initialTiers[0] || null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('promptpay')
  const [buyerName, setBuyerName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'successful' | 'failed'>('pending')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardFocused, setCardFocused] = useState<Focused>('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [heroImages] = useState<SeasonalDropImage[]>(initialImages)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const priceInBaht = selectedTier ? selectedTier.price / 100 : 0

  // Auto-advance carousel
  useEffect(() => {
    if (heroImages.length <= 1) return
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  const handleCardNumberChange = (value: string) => setCardNumber(formatCardNumber(value))
  const handleExpiryChange = (value: string) => setCardExpiry(formatExpiry(value, cardExpiry))
  const handleCvcChange = (value: string) => setCardCvc(value.replace(/\D/g, '').slice(0, 4))

  const resetAll = useCallback(() => {
    setStep('product')
    setSelectedTier(tiers.length > 0 ? tiers[0] : null)
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
  }, [tiers])

  // Polling for PromptPay status
  useEffect(() => {
    if (step === 'result' && paymentMethod === 'promptpay' && result?.data?.orderId && paymentStatus === 'pending') {
      const checkStatus = async () => {
        try {
          const { data } = await apiClient.get(`/seasonal-drops/${result.data.orderId}/status`)
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
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    }
  }, [step, paymentMethod, result, paymentStatus])

  const handleGoToSummary = () => {
    if (!selectedTier) {
      setError('กรุณาเลือกราคา')
      return
    }
    if (!email) {
      setError('กรุณากรอกอีเมล')
      return
    }
    if (selectedTier.requires_shipping && !phoneNumber) {
      setError('กรุณากรอกหมายเลขโทรศัพท์สำหรับการจัดส่ง')
      return
    }
    if (selectedTier.requires_shipping && !shippingAddress) {
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

      if (paymentMethod === 'credit_card' && data.data?.authorizeUri) {
        window.location.href = data.data.authorizeUri
        return
      }

      setResult(data)
      setStep('result')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B4A7D6]/60 focus:border-[#B4A7D6] placeholder:text-gray-400'

  const stepNumber = (n: number, label: string) => (
    <h3 className="text-sm font-semibold text-[#153051] mb-3 flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-[#153051] text-white text-xs flex items-center justify-center">{n}</span>
      {label}
    </h3>
  )

  const backButton = (onClick: () => void) => (
    <button onClick={onClick} className="text-gray-400 hover:text-[#153051] transition-colors" aria-label="กลับ">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
      </svg>
    </button>
  )

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
        className={`relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl text-sm font-medium transition-all border-2 ${
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
        <div className={`flex items-center gap-1 transition-all ${paymentMethod !== 'credit_card' ? 'grayscale opacity-40' : ''}`}>
          <svg viewBox="0 0 38 24" className="h-4 w-auto" fill="none" aria-label="Visa">
            <rect width="38" height="24" rx="4" fill="#1A1F71"/>
            <path d="M16.2 17H14l1.4-9h2.2L16.2 17ZM11.7 8 9.5 14.1l-.2-1-.8-4.2C8.4 8.4 8 8.1 7.5 8H3.8l-.1.3c.9.2 1.7.6 2.4 1.1L8.1 17H10.4L13.9 8H11.7ZM22.4 12.7c0-1-.6-1.7-1.9-2.3-.8-.4-1.3-.7-1.3-1.1 0-.4.4-.8 1.3-.8.7 0 1.2.2 1.7.4l.2.1.3-1.9C22.2 6.9 21.5 6.7 20.6 6.7c-2.2 0-3.7 1.1-3.7 2.7 0 1.2 1 1.9 1.9 2.3.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.3.9-.9 0-1.5-.2-2.2-.5l-.2-.1-.3 2c.5.2 1.4.4 2.4.4 2.4 0 3.8-1.1 4-2.8ZM27.3 17H29.2L27.6 8H25.8c-.5 0-.9.3-1.1.7L21.6 17H23.9l.5-1.3H27.1L27.3 17ZM24.9 14 26 10.9l.6 3.1H24.9Z" fill="white"/>
          </svg>
          <svg viewBox="0 0 38 24" className="h-4 w-auto" fill="none" aria-label="Mastercard">
            <rect width="38" height="24" rx="4" fill="#1D1D1D"/>
            <circle cx="14.5" cy="12" r="6.5" fill="#EB001B"/>
            <circle cx="23.5" cy="12" r="6.5" fill="#F79E1B"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M19 5.68a6.5 6.5 0 0 1 0 12.64A6.5 6.5 0 0 1 19 5.68Z" fill="#FF5F00"/>
          </svg>
          <svg viewBox="0 0 38 24" className="h-4 w-auto" fill="none" aria-label="JCB">
            <rect width="38" height="24" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
            <rect x="5" y="3.5" width="8.5" height="17" rx="3.5" fill="#003087"/>
            <rect x="14.75" y="3.5" width="8.5" height="17" rx="3.5" fill="#007B40"/>
            <rect x="24.5" y="3.5" width="8.5" height="17" rx="3.5" fill="#CC0000"/>
          </svg>
        </div>
        Credit / Debit
      </button>
    </div>
  )

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

  const goToPrevImage = () => setCarouselIndex(prev => (prev - 1 + heroImages.length) % heroImages.length)
  const goToNextImage = () => setCarouselIndex(prev => (prev + 1) % heroImages.length)

  return (
    <section
      id="seasonal-drop"
      className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#f8f9fb] to-white"
    >
      <div className="max-w-4xl mx-auto">
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

        {tiers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">ยังไม่มีสินค้าในขณะนี้</p>
          </div>
        ) : step === 'product' ? (
          /* ───────── Product Page ───────── */
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Top: Image Carousel — landscape, full width */}
            <div className="relative w-full aspect-[2/1] bg-gray-100">
              {heroImages.length > 0 ? (
                <>
                  {heroImages.map((img, i) => (
                    <div
                      key={img.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        i === carouselIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <Image src={img.public_url} alt={img.filename} fill className="object-cover" priority={i === 0} />
                    </div>
                  ))}
                  {heroImages.length > 1 && (
                    <>
                      <button onClick={goToPrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors" aria-label="Previous">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button onClick={goToNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors" aria-label="Next">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {heroImages.map((_, i) => (
                          <button key={i} onClick={() => setCarouselIndex(i)} className={`h-2 rounded-full transition-all ${i === carouselIndex ? 'bg-white w-6' : 'bg-white/50 w-2'}`} aria-label={`Image ${i + 1}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#B4A7D6]/20 to-[#153051]/10">
                  <svg className="w-20 h-20 text-[#B4A7D6]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom: 2-column content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-gray-100">
              {/* Left column: Product info + Price */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-[#153051] mb-1">LIKQ Music Seasonal Drop</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  รับไฟล์เพลงดิจิทัล อาร์ตเวิร์ก และของสมนาคุณพิเศษตามระดับราคาที่เลือก ส่งตรงถึงอีเมลของคุณ
                </p>

                {/* Price pills */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#153051] mb-2 uppercase tracking-wide">เลือกแพ็กเกจ</p>
                  <div className="flex flex-wrap gap-2">
                    {tiers.map(tier => (
                      <button
                        key={tier.id}
                        onClick={() => { setSelectedTier(tier); setError('') }}
                        className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                          selectedTier?.id === tier.id
                            ? 'bg-[#153051] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        ฿{(tier.price / 100).toLocaleString()}
                        {tier.requires_shipping && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#7B68AE] rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tier detail card */}
                {selectedTier && (
                  <div className="px-4 py-3 rounded-xl bg-[#f5f3ff]/60 border border-[#B4A7D6]/20">
                    <p className="text-sm font-semibold text-[#153051]">{selectedTier.name}</p>
                    {selectedTier.description && <p className="text-xs text-gray-500 mt-0.5">{selectedTier.description}</p>}
                    {selectedTier.requires_shipping && (
                      <span className="inline-block mt-1.5 text-[10px] bg-[#7B68AE] text-white font-semibold px-2 py-0.5 rounded-full">Physical + Digital</span>
                    )}
                    <p className="text-2xl font-bold text-[#153051] mt-2">฿{priceInBaht.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Right column: Form */}
              <div className="p-6 md:p-8 space-y-4">
                {/* Email & Name */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">อีเมล <span className="text-red-400">*</span></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">ชื่อ <span className="text-gray-400">(ไม่บังคับ)</span></label>
                    <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="ชื่อของคุณ" className={inputClass} />
                  </div>
                </div>

                {/* Shipping (conditional) */}
                {selectedTier?.requires_shipping && (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <p className="text-xs font-semibold text-[#153051] uppercase tracking-wide">ข้อมูลจัดส่ง</p>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">เบอร์โทร <span className="text-red-400">*</span></label>
                      <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0812345678" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">ที่อยู่จัดส่ง <span className="text-red-400">*</span></label>
                      <textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="ที่อยู่สำหรับจัดส่งสินค้า" rows={2} className={inputClass} />
                    </div>
                  </div>
                )}

                {/* Payment method */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-[#153051] mb-2 uppercase tracking-wide">วิธีชำระเงิน</p>
                  {paymentMethodSelector}
                  {paymentMethod === 'credit_card' && !selectedTier?.requires_shipping && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">เบอร์โทร <span className="text-red-400">*</span></label>
                      <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0812345678" className={inputClass} />
                    </div>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#153051] focus:ring-[#B4A7D6] cursor-pointer flex-shrink-0" />
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

                <Button variant="primary" size="lg" className="w-full dark:bg-primary dark:hover:bg-primary-hover" onClick={handleGoToSummary} disabled={!acceptedTerms || !selectedTier}>
                  {selectedTier ? `ซื้อเลย ฿${priceInBaht.toLocaleString()}` : 'เลือกราคา'}
                </Button>
              </div>
            </div>
          </div>
        ) : step === 'summary' && selectedTier ? (
          /* ───────── Summary + Credit Card ───────── */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  {backButton(() => setStep('product'))}
                  <h3 className="text-lg font-bold text-[#153051]">สรุปคำสั่งซื้อ</h3>
                </div>

                {/* Line item */}
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

                {/* Details */}
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
                      <div className="flex items-start justify-between">
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
                      <div className="flex justify-center lg:sticky lg:top-8">
                        <Cards
                          number={cardNumber}
                          name={cardName}
                          expiry={cardExpiry.replace('/', '')}
                          cvc={cardCvc}
                          focused={cardFocused || undefined}
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">หมายเลขบัตร</label>
                          <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => handleCardNumberChange(e.target.value)} onFocus={() => setCardFocused('number')} maxLength={19} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">ชื่อบนบัตร</label>
                          <input type="text" placeholder="JOHN DOE" value={cardName} onChange={e => setCardName(e.target.value)} onFocus={() => setCardFocused('name')} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">วันหมดอายุ</label>
                            <input type="text" inputMode="numeric" placeholder="MM/YY" value={cardExpiry} onChange={e => handleExpiryChange(e.target.value)} onFocus={() => setCardFocused('expiry')} maxLength={5} className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">CVC</label>
                            <input type="text" inputMode="numeric" placeholder="123" value={cardCvc} onChange={e => handleCvcChange(e.target.value)} onFocus={() => setCardFocused('cvc')} maxLength={4} className={inputClass} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {errorBlock}

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
        ) : step === 'result' && result?.success && selectedTier ? (
          /* ───────── Result ───────── */
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
                    <span className="text-sm font-medium text-[#153051]">{selectedTier.name}</span>
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">วิธีชำระเงิน</span>
                    {paymentMethodDisplay}
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">จำนวน</span>
                    <span className="text-lg font-bold text-[#153051]">฿{priceInBaht.toLocaleString()}</span>
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
                  {paymentStatus === 'pending' ? 'ยกเลิก' : 'สั่งซื้ออีกครั้ง'}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default SeasonalDropSection
