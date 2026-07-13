import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PartnerPayoutCalculator from '@/components/PartnerPayoutCalculator/PartnerPayoutCalculator'
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Receipt,
  Store,
  Truck,
  MessageSquareWarning,
  Wallet,
  LayoutPanelLeft,
  Users,
  Star,
  Percent,
  Sparkles,
  Headset,
  QrCode
} from 'lucide-react'

const storeShots = [
  { src: '/images/nekowink/neko-home.png', label: 'หน้าร้าน', alt: 'หน้าร้าน NekoWink' },
  { src: '/images/nekowink/neko-product.png', label: 'เลือกสินค้า', alt: 'หน้าเลือกสินค้าและเมมเบอร์' },
  { src: '/images/nekowink/neko-cart.png', label: 'ตะกร้า', alt: 'ตะกร้าสินค้า' },
  { src: '/images/nekowink/neko-checkout.png', label: 'ชำระเงิน', alt: 'หน้าชำระเงิน PromptPay และบัตร' }
]

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'ฝากขายสินค้าสำหรับศิลปินอิสระ',
  description:
    'หน้าร้านของคุณเองบนระบบที่พร้อมใช้ ดีไซน์ตามแบรนด์ จ่ายเงินผ่าน PromptPay และบัตรเครดิตด้วย Omise ระบบสมาชิกและคูปองพร้อมใช้ เริ่มต้นฟรี จ่าย commission เฉพาะตอนขายได้จริง',
  alternates: { canonical: '/partner' },
  openGraph: {
    title: 'ฝากขายสินค้าสำหรับศิลปินอิสระ | LiKQ MUSIC',
    description:
      'หน้าร้านของคุณเองบนระบบที่พร้อมใช้ เริ่มต้นฟรี จ่าย commission เฉพาะตอนขายได้จริง',
    url: 'https://www.likqmusic.com/partner',
    type: 'website'
  }
}

const pains = [
  {
    num: '01',
    icon: MessageSquareWarning,
    title: 'ออเดอร์ล้นแชท',
    desc: 'จดเองในโน้ต ไล่ตอบทีละคน ตกหล่นง่าย พอของเยอะก็จัดการแทบไม่ทัน'
  },
  {
    num: '02',
    icon: Wallet,
    title: 'ลูกค้าไม่กล้าโอน',
    desc: 'โอนเข้าบัญชีส่วนตัว ไม่มีระบบอะไรรองรับ ลูกค้าใหม่เลยไม่กล้าจ่าย'
  },
  {
    num: '03',
    icon: Store,
    title: 'ไม่มีหน้าร้านเป็นของตัวเอง',
    desc: 'อยากมีเว็บสวย ๆ มีระบบจ่ายเงิน แต่ทำเองก็แพงและกินเวลาทำเพลง'
  }
]

const features = [
  {
    icon: LayoutPanelLeft,
    title: 'หน้าเว็บร้านดีไซน์ตามแบรนด์',
    desc: 'ดีไซน์ให้ใหม่ทั้งร้านตามสไตล์ของแต่ละวง อยู่ที่ likqmusic.com/ชื่อร้านคุณ'
  },
  {
    icon: ShieldCheck,
    title: 'ระบบจ่ายเงินอัตโนมัติ',
    desc: 'PromptPay และบัตรเครดิตผ่าน Omise ลูกค้าใหม่ก็กล้าจ่าย'
  },
  {
    icon: Sparkles,
    title: 'ระบบสมาชิก & คูปองพร้อมใช้',
    desc: 'ระบบ member แต้มสะสม ส่วนลด เปิดร้านมาก็มีให้เลย แคมเปญเรา manage ให้'
  },
  {
    icon: Headset,
    title: 'ทีม Tech คอยซัพพอร์ต',
    desc: 'ระบบมีปัญหาอะไร ทีม dev ก็จัดการให้ ไม่ต้องปวดหัวเรื่องเทคนิคเอง'
  }
]

const ecosystem = [
  {
    icon: Users,
    title: 'Cross-discovery',
    desc: 'แฟนของศิลปินคนอื่นเดินมาเจอร้านคุณได้เอง ได้ฐานแฟนใหม่แบบไม่ต้องยิงแอดเพิ่ม'
  },
  {
    icon: Star,
    title: 'แต้มสะสมข้ามร้าน',
    desc: 'แฟน ๆ เก็บแต้มจากร้านไหนก็ได้ในแพลตฟอร์ม มีแต้มติดมือ เดี๋ยวก็กลับมาซื้อซ้ำ'
  },
  {
    icon: Percent,
    title: 'คูปองที่เรา manage ให้',
    desc: 'แคมเปญส่วนลดทั้งระบบ เราคิดให้ รันให้ ไม่ต้องทำอะไรเพิ่มเอง'
  }
]

const caseStats = [
  { value: '8', label: 'เมมเบอร์ในร้านเดียว' },
  { value: 'QR', label: 'PromptPay & บัตรเครดิต' },
  { value: '100%', label: 'custom design ตามแบรนด์' }
]

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] text-neutral-900 font-sans overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-secondary/10 pointer-events-none" />
        <div className="absolute top-24 right-44 w-6 h-6 rounded-full bg-secondary pointer-events-none" />
        <div className="absolute bottom-32 right-32 w-4 h-4 rounded-full bg-secondary/70 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-36 md:pt-44 pb-20 md:pb-28">
          <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-secondary/30 text-secondary text-xs font-bold tracking-wider uppercase">
            <Sparkles size={13} />
            Merchant Partnership 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            ฝากขายสินค้า
            <br />
            สำหรับศิลปินอิสระ
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-secondary max-w-2xl">
            หน้าร้านของตัวเอง บนระบบที่พร้อมใช้ เราสร้างให้ ดูแลให้ ไปโฟกัสทำเพลงได้เลย
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="mailto:contact@likqmusic.com"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-full hover:bg-neutral-100 transition-colors active:scale-95 shadow-lg"
            >
              เริ่มคุยกับเรา
              <ArrowRight size={18} />
            </a>
            <a
              href="/pitch/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white ring-1 ring-white/40 hover:bg-white/10 transition-colors active:scale-95"
            >
              ดู Pitch Deck
            </a>
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <p className="text-sm tracking-[0.3em] uppercase text-secondary-dark mb-3">
          The problem
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-primary leading-snug">
          ขายของผ่าน DM มันเหนื่อยกว่าที่คิด
        </h2>
        <p className="mt-3 text-base md:text-lg text-neutral-500 max-w-2xl">
          ขายผ่านแชทเสียเวลาก็เรื่องนึง ที่แย่กว่าคือแฟน ๆ เริ่มไม่มั่นใจเวลาต้องโอน
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {pains.map(({ num, icon: Icon, title, desc }) => (
            <div
              key={num}
              className="bg-white rounded-2xl p-7 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-xl font-bold text-secondary tabular-nums">
                  {num}
                </span>
                <Icon className="text-secondary" size={26} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-primary mb-2">
                {title}
              </h3>
              <p className="text-neutral-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <p className="text-sm tracking-[0.3em] uppercase text-secondary-dark mb-3">
            What LiKQ does
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-primary leading-snug max-w-2xl">
            หน้าร้านของคุณเอง บนระบบที่พร้อมใช้
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10 items-start">
            <div className="space-y-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-secondary/20 text-primary flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-primary">
                      {title}
                    </h3>
                    <p className="text-neutral-500 leading-relaxed mt-1">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary text-white rounded-2xl p-8 md:p-10">
              <p className="text-secondary font-bold tracking-wide mb-6">
                คุณทำแค่ 2 อย่าง
              </p>
              <div className="space-y-5">
                <div className="flex items-center gap-4 text-lg">
                  <Check className="text-secondary flex-shrink-0" size={22} />
                  <span>เตรียมรูป + ข้อมูลสินค้า</span>
                </div>
                <div className="flex items-center gap-4 text-lg">
                  <Truck className="text-secondary flex-shrink-0" size={22} />
                  <span>จัดส่งสินค้าเองถึงมือแฟน ๆ</span>
                </div>
              </div>
              <p className="mt-8 pt-6 border-t border-white/15 text-white/70 leading-relaxed">
                เราไม่ถือสต็อก ไม่ยุ่งกับ logistics ส่วนเว็บกับระบบจ่ายเงิน
                ปล่อยให้เราดูแล
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── No risk / Pricing ── */}
      <section className="bg-primary text-white">
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28 overflow-hidden">
          <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-secondary/10 pointer-events-none" />
          <p className="text-sm tracking-[0.3em] uppercase text-secondary mb-5">
            Starter tier · ไม่มีค่าธรรมเนียมรายเดือน
          </p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            ขายไม่ได้ <span className="text-secondary">= ไม่เสียอะไร</span>
          </h2>
          <p className="mt-6 text-lg md:text-2xl text-secondary max-w-xl">
            เปิดร้านฟรี มี commission เฉพาะออเดอร์ที่ขายได้จริง
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="inline-flex items-center gap-3 rounded-full ring-1 ring-white/25 px-7 py-4">
              <span className="text-3xl font-bold text-secondary">0฿</span>
              <span className="text-white/80">ค่าเปิดร้าน / รายเดือน</span>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full ring-1 ring-white/25 px-7 py-4">
              <span className="text-3xl font-bold text-secondary">15%</span>
              <span className="text-white/80">commission เมื่อขายได้</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Payout calculator ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <p className="text-sm tracking-[0.3em] uppercase text-secondary-dark mb-3">
          Payout calculator
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-primary leading-snug">
          ตั้งราคาเท่านี้ วงได้รับเท่าไหร่?
        </h2>
        <p className="mt-3 text-base md:text-lg text-neutral-500 max-w-2xl">
          กรอกราคาตั้งขายหรือยอดที่อยากได้มา อีกฝั่งก็คำนวณให้เอง
          แตกให้ดูทุกบาทว่าหักอะไรบ้าง
        </p>

        <div className="mt-10">
          <PartnerPayoutCalculator />
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <p className="text-sm tracking-[0.3em] uppercase text-secondary-dark mb-3">
          Trust &amp; transparency
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-primary leading-snug">
          เงินเข้าปลอดภัย เช็คได้ทุกบาท
        </h2>
        <p className="mt-3 text-base md:text-lg text-neutral-500">
          เงินไม่ได้โอนเข้าบัญชีส่วนตัวใคร วิ่งผ่านระบบ payment จริงต่างหาก
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-secondary" size={26} />
              <span className="text-sm font-bold tracking-wider uppercase text-secondary-dark">
                Secure payments
              </span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              รับเงินผ่านระบบมาตรฐาน
            </h3>
            <p className="text-neutral-500 leading-relaxed">
              PromptPay สแกน QR และบัตรเครดิต/เดบิตแบบ 3D Secure ผ่าน Omise
              ลูกค้าใหม่กล้าจ่ายเต็มจำนวน
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['PromptPay', 'Visa', 'Mastercard', 'JCB', 'Omise'].map(b => (
                <span
                  key={b}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-primary bg-[#f0f4f8] ring-1 ring-black/5"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3 mb-4">
              <Receipt className="text-secondary" size={26} />
              <span className="text-sm font-bold tracking-wider uppercase text-secondary-dark">
                Transparent commission
              </span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              คำนวณ commission อัตโนมัติ
            </h3>
            <p className="text-neutral-500 leading-relaxed">
              เห็นยอดขายทุกออเดอร์ ระบบหัก commission ให้เอง ย้อนดูได้ตลอด
              ไม่ต้องมานั่งไล่เช็คยอดเอง
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['ยอดขายเรียลไทม์', 'สรุปอัตโนมัติ'].map(b => (
                <span
                  key={b}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-primary bg-secondary/20"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <p className="text-sm tracking-[0.3em] uppercase text-secondary-dark mb-3">
            One ecosystem
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-primary leading-snug">
            ecosystem เดียวกัน แฟน ๆ เจอกันเอง
          </h2>
          <p className="mt-3 text-base md:text-lg text-neutral-500 max-w-2xl">
            ทุกร้านของศิลปินใช้ฐานแฟนเดียวกัน และกระเป๋าแต้มเดียวกัน
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {ecosystem.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-7 bg-[#f8f9fb] ring-1 ring-black/5">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 text-primary flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-2">
                  {title}
                </h3>
                <p className="text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Note rewards ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-white p-8 md:p-12">
          <div className="absolute -top-16 -right-12 w-64 h-64 rounded-full bg-secondary/10 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 mb-4 text-secondary text-xs font-bold tracking-wider uppercase">
                <Sparkles size={13} /> ♪ Note · ระบบแต้มกลาง
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-snug">
                แต้มเดียว ใช้ได้กับศิลปินทุกคนในค่าย
              </h2>
              <p className="mt-3 text-secondary leading-relaxed">
                ลูกค้าช้อปร้านไหนในค่าย ก็สะสม Note เข้ากระเป๋าใบเดียวกัน เก็บจากร้านนึง
                ไปใช้อีกร้านได้ ตอนนี้ใช้จริงแล้วที่ NekoWink ร้านอื่นกำลังตามมา
              </p>
            </div>
            <Link
              href="/note"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-full hover:bg-neutral-100 transition-colors active:scale-95 shadow-lg shrink-0"
            >
              ระบบ Note คืออะไร
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* ── Case study ── */}
      <section className="bg-primary text-white">
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 overflow-hidden">
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-secondary/10 pointer-events-none" />
          <p className="text-sm tracking-[0.3em] uppercase text-secondary mb-3">
            Live case study
          </p>
          <h2 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
            NekoWink
          </h2>
          <p className="mt-2 text-xl md:text-2xl text-secondary font-semibold">
            ร้านจริงที่เปิดอยู่ตอนนี้
          </p>
          <p className="mt-4 text-white/70 max-w-xl leading-relaxed">
            ทุกอย่างในหน้านี้รันอยู่จริง ตั้งแต่ดีไซน์ ระบบ member ยัน PromptPay / Omise
          </p>

          {/* Real store screenshots */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {storeShots.map(({ src, label, alt }, idx) => (
              <figure
                key={src}
                className={`flex flex-col items-center ${idx % 2 === 1 ? 'lg:translate-y-7' : ''}`}
              >
                <div className="w-full rounded-[20px] border-[5px] border-[#0d1322] bg-[#0d1322] shadow-2xl shadow-black/40 overflow-hidden">
                  <Image
                    src={src}
                    alt={alt}
                    width={520}
                    height={1130}
                    className="w-full h-auto block"
                    sizes="(max-width: 1024px) 45vw, 22vw"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-white/60">{label}</figcaption>
              </figure>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14">
            {caseStats.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl p-7 bg-white/5 ring-1 ring-white/10"
              >
                <div className="text-4xl md:text-5xl font-bold text-secondary leading-none flex items-center gap-2">
                  {value === 'QR' ? <QrCode size={40} /> : value}
                </div>
                <p className="mt-3 text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#f8f9fb]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">
            มาเปิดร้านด้วยกันไหม?
          </h2>
          <p className="mt-5 text-lg text-neutral-500 max-w-xl mx-auto">
            ทักมาคุยก่อนได้ ยังไม่ต้องตัดสินใจอะไรทั้งนั้น
          </p>
          <div className="mt-9 flex flex-wrap justify-center items-center gap-4">
            <a
              href="mailto:contact@likqmusic.com"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary-hover transition-colors active:scale-95 shadow-lg"
            >
              contact@likqmusic.com
              <ArrowRight size={18} />
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-primary ring-1 ring-primary/20 hover:bg-primary/5 transition-colors active:scale-95"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
