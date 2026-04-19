import Link from 'next/link'
import { Mic } from 'lucide-react'

export default function AuditionCTA() {
  return (
    <section className="px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 md:px-12 md:py-14">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-secondary/10 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Mic size={28} className="text-secondary" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Idol Audition — Now Open
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-lg">
                We&apos;re looking for voices, visionaries, and creators to join
                our new idol group. No experience required — just passion and
                potential.
              </p>
            </div>

            <Link
              href="/audition"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-full hover:bg-neutral-100 transition-colors active:scale-95"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
