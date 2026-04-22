import Link from 'next/link'
import { Mic, Sparkles } from 'lucide-react'

export default function AuditionCTA() {
  return (
    <section className="px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 md:px-12 md:py-14 ring-2 ring-secondary/30 shadow-2xl shadow-primary/20">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-secondary/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          {/* Soft pulse glow around the banner — honors reduced-motion */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl ring-1 ring-secondary/40 motion-safe:animate-pulse pointer-events-none"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Mic size={28} className="text-secondary" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-secondary text-primary text-[11px] font-bold tracking-wider uppercase shadow-md motion-safe:animate-pulse">
                <Sparkles size={12} />
                เปิดรับสมัครแล้ว
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                ออดิชั่น Idol — LiKQ Music
              </h2>
              <p className="text-white/70 text-sm md:text-base max-w-lg">
                เรากำลังมองหาเสียงร้อง ความคิดสร้างสรรค์ และศิลปินหน้าใหม่
                มาร่วมวง idol ของเรา · ไม่ต้องมีประสบการณ์ ขอแค่แพสชั่นและศักยภาพ
              </p>
            </div>

            <Link
              href="/audition"
              className="relative flex-shrink-0 inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-colors active:scale-95 shadow-lg"
            >
              {/* Outer pulse ring for attention — absolute so it doesn't
                  shift layout; motion-safe so reduced-motion users skip it */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full ring-2 ring-white/70 motion-safe:animate-ping"
              />
              <span className="relative">สมัครเลย →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
