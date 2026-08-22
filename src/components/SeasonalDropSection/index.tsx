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

// Shared field styling for the after-dark surface: inset field on the panel,
// bright typed text, lavender focus ring. Placeholder stays at ink-muted so it
// clears 4.5:1 yet still reads dimmer than the typed value.
const inputClass =
  'w-full px-4 py-3 rounded-xl border border-white/55 bg-likq-ink/60 text-sm text-white transition-all focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white focus:border-likq-lavender/70 placeholder:text-white/70'
const fieldLabelClass = 'block text-xs font-medium text-white/70 mb-1.5'
const groupLabelClass = 'text-xs font-semibold tracking-wide text-likq-beam6'
const panelClass =
  'rounded-[28px] border border-white/55 bg-likq-navy-deep shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85)] overflow-hidden motion-safe:animate-rise-in'

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

  const backButton = (onClick: () => void) => (
    <button onClick={onClick} className="text-white/70 hover:text-likq-beam6 transition-colors" aria-label="กลับ">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
      </svg>
    </button>
  )

  const errorBlock = error ? (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-danger/10 text-red-300 text-sm border border-danger/30">
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {error}
    </div>
  ) : null

  const paymentOptionClass = (active: boolean) =>
    `relative flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-medium transition-all border ${
      active
        ? 'border-likq-lavender bg-likq-lavender/[0.12] text-white'
        : 'border-white/55 bg-white/[0.02] text-white/70 hover:border-likq-lavender/40 hover:text-white'
    }`

  const paymentCheck = (
    <span className="absolute top-2 right-2 w-4 h-4 bg-likq-lavender rounded-full flex items-center justify-center">
      <svg className="w-2.5 h-2.5 text-likq-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  )

  const paymentMethodSelector = (
    <div className="grid grid-cols-2 gap-3">
      <button onClick={() => setPaymentMethod('promptpay')} className={paymentOptionClass(paymentMethod === 'promptpay')}>
        {paymentMethod === 'promptpay' && paymentCheck}
        <Image src="/images/promptpay-logo.png" alt="PromptPay" width={24} height={24} className="object-contain" />
        PromptPay
      </button>
      <button onClick={() => setPaymentMethod('credit_card')} className={paymentOptionClass(paymentMethod === 'credit_card')}>
        {paymentMethod === 'credit_card' && paymentCheck}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
        บัตรเครดิต
      </button>
    </div>
  )

  const paymentMethodDisplay = (
    <span className="flex items-center gap-2 text-sm font-medium text-white">
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
      className="station"
    >
      {/* A dense object on the pale lane: the drop keeps its own dark ground so
          the whole purchase flow inside it stays legible without restyling a
          live money path field by field. */}
      <div className="panel-ink mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] px-6 py-12 md:px-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <h2 className="station-title text-white">สินค้าพิเศษประจำซีซัน</h2>
          <p className="mt-6 text-white/70 text-base md:text-lg leading-relaxed">
            เลือกแพ็กเกจที่คุณต้องการ ไฟล์ดิจิทัลจะถูกส่งไปยังอีเมลของคุณ
          </p>
        </div>

        {tiers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/70">ยังไม่มีสินค้าในขณะนี้</p>
          </div>
        ) : step === 'product' ? (
          /* ───────── Product Page ───────── */
          <div className={panelClass}>
            {/* Top: Image Carousel — landscape, full width */}
            <div className="relative w-full aspect-[2/1] bg-likq-ink">
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
                  {/* Blend the image base into the panel so it doesn't read as a pasted-in card */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-likq-navy-deep to-transparent" />
                  {heroImages.length > 1 && (
                    <>
                      <button onClick={goToPrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors" aria-label="Previous">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button onClick={goToNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors" aria-label="Next">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {heroImages.map((_, i) => (
                          <button key={i} onClick={() => setCarouselIndex(i)} className={`h-2 rounded-full transition-all ${i === carouselIndex ? 'bg-likq-lavender w-6' : 'bg-white/50 w-2'}`} aria-label={`Image ${i + 1}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-likq-lavender/20 to-likq-navy/30">
                  <svg className="w-20 h-20 text-likq-beam6/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom: 2-column content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-white/15">
              {/* Left column: Product info + Price */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-white mb-1">LIKQ Music Seasonal Drop</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-5">
                  รับไฟล์เพลงดิจิทัล อาร์ตเวิร์ก และของสมนาคุณพิเศษตามระดับราคาที่เลือก ส่งตรงถึงอีเมลของคุณ
                </p>

                {/* Price pills */}
                <div className="mb-4">
                  <p className={`${groupLabelClass} mb-2`}>เลือกแพ็กเกจ</p>
                  <div className="flex flex-wrap gap-2">
                    {tiers.map(tier => {
                      const active = selectedTier?.id === tier.id
                      return (
                        <button
                          key={tier.id}
                          onClick={() => { setSelectedTier(tier); setError('') }}
                          className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                            active
                              ? 'bg-likq-lavender text-likq-ink shadow-md shadow-likq-lavender/25'
                              : 'bg-white/[0.04] text-white/70 border border-white/55 hover:border-likq-lavender/50 hover:text-white'
                          }`}
                        >
                          ฿{(tier.price / 100).toLocaleString()}
                          {tier.requires_shipping && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-likq-lavender rounded-full flex items-center justify-center ring-2 ring-likq-navy-deep">
                              <svg className="w-2.5 h-2.5 text-likq-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Tier detail */}
                {selectedTier && (
                  <div className="px-4 py-3.5 rounded-2xl bg-likq-ink/50 border border-white/55">
                    <p className="text-sm font-semibold text-white">{selectedTier.name}</p>
                    {selectedTier.description && <p className="text-xs text-white/70 mt-0.5">{selectedTier.description}</p>}
                    {selectedTier.requires_shipping && (
                      <span className="inline-block mt-1.5 text-[10px] bg-likq-lavender/15 text-likq-beam6 border border-likq-lavender/30 font-semibold px-2 py-0.5 rounded-full">Physical + Digital</span>
                    )}
                    <p className="text-2xl font-bold text-white mt-2 tabular-nums">฿{priceInBaht.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Right column: Form */}
              <div className="p-6 md:p-8 space-y-4">
                {/* Email & Name */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className={fieldLabelClass}>อีเมล <span className="text-likq-beam6">*</span></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={fieldLabelClass}>ชื่อ <span className="text-white/75">(ไม่บังคับ)</span></label>
                    <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="ชื่อของคุณ" className={inputClass} />
                  </div>
                </div>

                {/* Shipping (conditional) */}
                {selectedTier?.requires_shipping && (
                  <div className="space-y-3 pt-3 border-t border-white/55">
                    <p className={groupLabelClass}>ข้อมูลจัดส่ง</p>
                    <div>
                      <label className={fieldLabelClass}>เบอร์โทร <span className="text-likq-beam6">*</span></label>
                      <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0812345678" className={inputClass} />
                    </div>
                    <div>
                      <label className={fieldLabelClass}>ที่อยู่จัดส่ง <span className="text-likq-beam6">*</span></label>
                      <textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="ที่อยู่สำหรับจัดส่งสินค้า" rows={2} className={inputClass} />
                    </div>
                  </div>
                )}

                {/* Payment method */}
                <div className="pt-3 border-t border-white/55">
                  <p className={`${groupLabelClass} mb-2`}>วิธีชำระเงิน</p>
                  {paymentMethodSelector}
                  {paymentMethod === 'credit_card' && !selectedTier?.requires_shipping && (
                    <div className="mt-3">
                      <label className={fieldLabelClass}>เบอร์โทร <span className="text-likq-beam6">*</span></label>
                      <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0812345678" className={inputClass} />
                    </div>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-white/55 bg-likq-ink text-likq-beam6 accent-likq-lavender focus:ring-likq-lavender cursor-pointer flex-shrink-0" />
                  <span className="text-xs text-white/70 leading-relaxed">
                    ฉันยอมรับ{' '}
                    <a href="/merch/th/policy/terms" target="_blank" rel="noopener noreferrer" className="text-likq-beam6 underline underline-offset-2 hover:text-white">ข้อกำหนดและเงื่อนไข</a>
                    {', '}
                    <a href="/merch/th/policy/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-likq-beam6 underline underline-offset-2 hover:text-white">นโยบายความเป็นส่วนตัว</a>
                    {', '}
                    <a href="/merch/th/policy/refund-policy" target="_blank" rel="noopener noreferrer" className="text-likq-beam6 underline underline-offset-2 hover:text-white">นโยบายการคืนเงิน</a>
                    {' และ '}
                    <a href="/merch/th/policy/shipping-policy" target="_blank" rel="noopener noreferrer" className="text-likq-beam6 underline underline-offset-2 hover:text-white">นโยบายการจัดส่ง</a>
                  </span>
                </label>

                {errorBlock}

                <Button variant="onDark" size="lg" className="w-full" onClick={handleGoToSummary} disabled={!acceptedTerms || !selectedTier}>
                  {selectedTier ? `ซื้อเลย ฿${priceInBaht.toLocaleString()}` : 'เลือกราคา'}
                </Button>
              </div>
            </div>
          </div>
        ) : step === 'summary' && selectedTier ? (
          /* ───────── Summary + Credit Card ───────── */
          <div className="max-w-3xl mx-auto">
            <div className={panelClass}>
              <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  {backButton(() => setStep('product'))}
                  <h3 className="text-lg font-bold text-white">สรุปคำสั่งซื้อ</h3>
                </div>

                {/* Line item */}
                <div className="rounded-2xl border border-white/55 overflow-hidden">
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02]">
                    <div className="w-12 h-12 rounded-xl bg-likq-lavender/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {selectedTier.image_url ? (
                        <Image src={selectedTier.image_url} alt={selectedTier.name} width={48} height={48} className="object-cover w-full h-full" />
                      ) : (
                        <svg className="w-5 h-5 text-likq-beam6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{selectedTier.name}</p>
                      {selectedTier.description && (
                        <p className="text-xs text-white/70 truncate">{selectedTier.description}</p>
                      )}
                      {selectedTier.requires_shipping && (
                        <span className="inline-block mt-1 text-[10px] bg-likq-lavender/15 text-likq-beam6 font-medium px-2 py-0.5 rounded-full">
                          Physical + Digital
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-white tabular-nums flex-shrink-0">
                      ฿{priceInBaht.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 p-5 rounded-2xl bg-likq-ink/50 border border-white/55">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">วิธีชำระเงิน</span>
                    {paymentMethodDisplay}
                  </div>
                  {buyerName && (
                    <>
                      <div className="h-px bg-white/15" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">ชื่อ</span>
                        <span className="text-sm font-medium text-white">{buyerName}</span>
                      </div>
                    </>
                  )}
                  <div className="h-px bg-white/15" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">อีเมล</span>
                    <span className="text-sm font-medium text-white">{email}</span>
                  </div>
                  {phoneNumber && (
                    <>
                      <div className="h-px bg-white/15" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">เบอร์โทร</span>
                        <span className="text-sm font-medium text-white">{phoneNumber}</span>
                      </div>
                    </>
                  )}
                  {shippingAddress && (
                    <>
                      <div className="h-px bg-white/15" />
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-white/70">ที่อยู่จัดส่ง</span>
                        <span className="text-sm font-medium text-white text-right max-w-[60%]">{shippingAddress}</span>
                      </div>
                    </>
                  )}
                  <div className="h-px bg-white/15" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-white">ยอดรวม</span>
                    <span className="text-xl font-bold text-likq-beam6 tabular-nums">฿{priceInBaht.toLocaleString()}</span>
                  </div>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit_card' && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-likq-beam6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
                          <label className={fieldLabelClass}>หมายเลขบัตร</label>
                          <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => handleCardNumberChange(e.target.value)} onFocus={() => setCardFocused('number')} maxLength={19} className={inputClass} />
                        </div>
                        <div>
                          <label className={fieldLabelClass}>ชื่อบนบัตร</label>
                          <input type="text" placeholder="JOHN DOE" value={cardName} onChange={e => setCardName(e.target.value)} onFocus={() => setCardFocused('name')} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={fieldLabelClass}>วันหมดอายุ</label>
                            <input type="text" inputMode="numeric" placeholder="MM/YY" value={cardExpiry} onChange={e => handleExpiryChange(e.target.value)} onFocus={() => setCardFocused('expiry')} maxLength={5} className={inputClass} />
                          </div>
                          <div>
                            <label className={fieldLabelClass}>CVC</label>
                            <input type="text" inputMode="numeric" placeholder="123" value={cardCvc} onChange={e => handleCvcChange(e.target.value)} onFocus={() => setCardFocused('cvc')} maxLength={4} className={inputClass} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {errorBlock}

                <Button
                  variant="onDark"
                  size="lg"
                  className="w-full"
                  onClick={handlePurchase}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
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
            <div className={panelClass}>
              <div className="p-6 md:p-10 space-y-5">
                {/* Status Banner */}
                {paymentStatus === 'successful' ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-2xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/15 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-emerald-200">ชำระเงินสำเร็จ</p>
                      <p className="text-xs text-emerald-300/80">ขอบคุณสำหรับการสั่งซื้อ</p>
                    </div>
                  </div>
                ) : paymentStatus === 'failed' ? (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-300 border border-red-500/20 rounded-2xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-500/15 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-red-200">การชำระเงินล้มเหลว</p>
                      <p className="text-xs text-red-300/80">กรุณาลองใหม่อีกครั้ง</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-sky-500/10 text-sky-300 border border-sky-500/20 rounded-2xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-sky-500/15 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-sky-200">รอการชำระเงิน</p>
                      <p className="text-xs text-sky-300/80">กรุณาดำเนินการชำระเงินด้านล่าง</p>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="space-y-3 p-5 rounded-2xl bg-likq-ink/50 border border-white/55">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">สินค้า</span>
                    <span className="text-sm font-medium text-white">{selectedTier.name}</span>
                  </div>
                  <div className="h-px bg-white/15" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">วิธีชำระเงิน</span>
                    {paymentMethodDisplay}
                  </div>
                  <div className="h-px bg-white/15" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">จำนวน</span>
                    <span className="text-lg font-bold text-likq-beam6 tabular-nums">฿{priceInBaht.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-white/15" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Order ID</span>
                    <span className="text-xs font-mono text-white/75">{result.data?.orderId}</span>
                  </div>
                </div>

                {/* QR Code for PromptPay — kept on a white quiet-zone so it stays scannable */}
                {paymentStatus === 'pending' && result.data?.payment?.qrCodeUrl && (
                  <div className="text-center py-2">
                    <p className="text-xs text-white/70 mb-3">สแกน QR Code เพื่อชำระเงิน</p>
                    <img
                      src={result.data.payment.qrCodeUrl}
                      alt="QR Code"
                      className="mx-auto w-52 h-52 rounded-xl border border-white/55 bg-white p-3"
                    />
                  </div>
                )}

                <Button
                  variant="onDarkOutline"
                  size="lg"
                  className="w-full"
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
