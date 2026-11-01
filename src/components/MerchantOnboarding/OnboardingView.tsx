'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { isAxiosError } from 'axios'
import { ArrowRight, Check, Loader2, RefreshCw } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

// Merchant-facing Stripe Connect onboarding (COM-150). The invite token in the
// URL is the only credential; the gateway never returns secrets here.

type OnboardingState = 'not_started' | 'incomplete' | 'in_review' | 'ready'

type Invite = {
  merchantName: string
  contactEmail: string
  state: OnboardingState
  expiresAt: string
}

type LinkProblem = 'not_found' | 'expired' | 'revoked' | 'unavailable' | 'error'

type Mode = 'landing' | 'return' | 'refresh'

const STEPS: { title: string; detail: string }[] = [
  {
    title: 'สร้างบัญชี Stripe ของร้าน',
    detail: 'ระบบสร้างบัญชีให้ทันทีที่กดเริ่ม ใช้ชื่อร้านและอีเมลที่ LIKQ ตั้งไว้'
  },
  {
    title: 'กรอกข้อมูลธุรกิจกับ Stripe',
    detail:
      'ข้อมูลเจ้าของร้าน เลขผู้เสียภาษี และบัญชีธนาคารที่จะรับเงิน กรอกบนหน้าของ Stripe โดยตรง'
  },
  {
    title: 'Stripe ตรวจสอบ แล้วเปิดรับเงิน',
    detail: 'ส่วนใหญ่ใช้เวลาไม่นาน ถ้า Stripe ขอเอกสารเพิ่ม จะแจ้งทางอีเมลของร้าน'
  }
]

// Which steps are done for a given state: 0 = nothing yet, 3 = all done.
const DONE_COUNT: Record<OnboardingState, number> = {
  not_started: 0,
  incomplete: 1,
  in_review: 2,
  ready: 3
}

function problemOf(error: unknown): LinkProblem {
  if (isAxiosError(error)) {
    const status = error.response?.status
    const message = String(error.response?.data?.error ?? '')
    if (status === 404) return 'not_found'
    if (status === 410) return message.includes('revoked') ? 'revoked' : 'expired'
    if (status === 503) return 'unavailable'
  }
  return 'error'
}

const PROBLEM_COPY: Record<LinkProblem, { title: string; body: string }> = {
  not_found: {
    title: 'ไม่พบลิงก์นี้',
    body: 'ลิงก์อาจคัดลอกมาไม่ครบ ลองเปิดจากข้อความที่ได้รับอีกครั้ง หรือขอลิงก์ใหม่จาก LIKQ'
  },
  expired: {
    title: 'ลิงก์นี้หมดอายุแล้ว',
    body: 'ลิงก์เชิญมีอายุ 30 วัน ติดต่อ LIKQ เพื่อขอลิงก์ใหม่ได้เลย ข้อมูลที่เคยกรอกไว้กับ Stripe ไม่หาย'
  },
  revoked: {
    title: 'ลิงก์นี้ถูกยกเลิกแล้ว',
    body: 'LIKQ ยกเลิกลิงก์นี้ไปแล้ว ถ้ายังต้องการเชื่อม Stripe ติดต่อทีมงานเพื่อขอลิงก์ใหม่'
  },
  unavailable: {
    title: 'ยังเชื่อม Stripe ไม่ได้ในตอนนี้',
    body: 'ระบบ Stripe ของ LIKQ ยังไม่เปิดในสภาพแวดล้อมนี้ ติดต่อทีมงานได้เลย'
  },
  error: {
    title: 'โหลดข้อมูลไม่สำเร็จ',
    body: 'อาจเป็นที่อินเทอร์เน็ตหรือระบบขัดข้องชั่วคราว ลองโหลดหน้านี้ใหม่อีกครั้ง'
  }
}

export default function OnboardingView({ token, mode }: { token: string; mode: Mode }) {
  const [invite, setInvite] = useState<Invite | null>(null)
  const [problem, setProblem] = useState<LinkProblem | null>(null)
  const [starting, setStarting] = useState(false)
  const [checking, setChecking] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)
  const autoStarted = useRef(false)

  const base = `/public/merchant-onboarding/${encodeURIComponent(token)}`

  const load = useCallback(async () => {
    setChecking(true)
    try {
      const { data } = await apiClient.get(base)
      let next: Invite = data.data
      // Coming back from Stripe: ask Stripe directly, the stored flags may be
      // a few seconds behind what was just submitted.
      if (mode === 'return' && next.state !== 'not_started') {
        const { data: s } = await apiClient.get(`${base}/status`)
        next = { ...next, state: s.data.state }
      }
      setInvite(next)
      setProblem(null)
    } catch (error) {
      setProblem(problemOf(error))
    } finally {
      setChecking(false)
    }
  }, [base, mode])

  const start = useCallback(async () => {
    setStarting(true)
    setStartError(null)
    try {
      const { data } = await apiClient.post(`${base}/start`)
      window.location.assign(data.data.url)
    } catch (error) {
      const p = problemOf(error)
      if (p === 'error') {
        setStartError('เปิดหน้า Stripe ไม่สำเร็จ ลองกดอีกครั้ง')
        setStarting(false)
      } else {
        setProblem(p)
      }
    }
  }, [base])

  useEffect(() => {
    load()
  }, [load])

  // Stripe sends the merchant to /refresh when its one-time link expired:
  // fetch a fresh one and go straight back.
  useEffect(() => {
    if (mode === 'refresh' && invite && invite.state !== 'ready' && !autoStarted.current) {
      autoStarted.current = true
      start()
    }
  }, [mode, invite, start])

  return (
    <main className="min-h-dvh bg-likq-paper text-likq-obsidian">
      <header className="mx-auto flex max-w-xl items-center px-5 pt-8 md:pt-12">
        <Link href="/" aria-label="LIKQ Music หน้าแรก" className="inline-flex">
          <Image src="/logo-hover.svg" alt="LIKQ Music" width={96} height={32} priority />
        </Link>
      </header>

      <div className="mx-auto max-w-xl px-5 pb-16 pt-8 md:pt-12">
        {problem ? (
          <ProblemPanel problem={problem} />
        ) : !invite ? (
          <LoadingPanel />
        ) : (
          <>
            <section className="panel-ink rounded-[2rem] px-7 py-9 shadow-[0_24px_48px_-24px_rgba(16,6,159,0.55)] md:px-10 md:py-11">
              <h1 className="copy-th text-3xl leading-snug md:text-4xl [text-wrap:balance]">
                {invite.state === 'ready'
                  ? `${invite.merchantName} พร้อมรับเงินผ่าน Stripe แล้ว`
                  : `เชื่อมบัญชี Stripe ให้ ${invite.merchantName}`}
              </h1>
              <p className="copy-th mt-4 max-w-[34rem] text-base text-white/85">
                {LEDE[invite.state]}
              </p>

              <ol className="mt-8 space-y-5">
                {STEPS.map((step, i) => {
                  const done = i < DONE_COUNT[invite.state]
                  const current = i === DONE_COUNT[invite.state]
                  return (
                    <li key={step.title} className="flex gap-4">
                      <span
                        aria-hidden
                        className={
                          done
                            ? 'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-likq-beam6 text-likq-ink'
                            : current
                              ? 'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-likq-beam6 text-sm text-white'
                              : 'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ring-white/35 text-sm text-white/60'
                        }
                      >
                        {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
                      </span>
                      <div>
                        <p className={done || current ? 'copy-th text-white' : 'copy-th text-white/70'}>
                          {step.title}
                          <span className="sr-only">{done ? ' (เสร็จแล้ว)' : current ? ' (ขั้นตอนปัจจุบัน)' : ''}</span>
                        </p>
                        <p className="copy-th text-sm text-white/70">{step.detail}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                {invite.state === 'not_started' || invite.state === 'incomplete' ? (
                  <button
                    type="button"
                    onClick={start}
                    disabled={starting}
                    className="copy-th inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-likq-ink transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-likq-beam6 disabled:translate-y-0 disabled:opacity-70"
                  >
                    {starting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        กำลังเปิดหน้า Stripe
                      </>
                    ) : (
                      <>
                        {invite.state === 'not_started' ? 'เริ่มเชื่อม Stripe' : 'กรอกข้อมูลกับ Stripe ต่อ'}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </>
                    )}
                  </button>
                ) : null}

                {invite.state === 'in_review' || (mode === 'return' && invite.state === 'incomplete') ? (
                  <button
                    type="button"
                    onClick={load}
                    disabled={checking}
                    className="copy-th inline-flex items-center gap-2 rounded-full px-5 py-3 text-white ring-1 ring-white/45 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-likq-beam6 disabled:opacity-70"
                  >
                    <RefreshCw className={checking ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden />
                    เช็คสถานะอีกครั้ง
                  </button>
                ) : null}
              </div>
              {startError ? (
                <p role="alert" className="copy-th mt-4 text-sm text-likq-beam6">
                  {startError}
                </p>
              ) : null}
            </section>

            <div className="copy-th mt-8 space-y-3 px-1 text-base text-likq-obsidian/85">
              <p>
                เงินจากการขายเข้าบัญชี Stripe ของร้านโดยตรง LIKQ หักค่าบริการตามที่ตกลงกันไว้จากแต่ละรายการ
                ร้านดูยอดและถอนเงินได้เองใน Stripe Dashboard
              </p>
              <p>ข้อมูลที่กรอกกับ Stripe ส่งตรงไปที่ Stripe ไม่ผ่านเซิร์ฟเวอร์ของ LIKQ</p>
              <p>
                ติดปัญหาตรงไหน ทักทีมงานได้ที่{' '}
                <a className="text-likq-navy underline underline-offset-4" href="mailto:contact@likqmusic.com">
                  contact@likqmusic.com
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

const LEDE: Record<OnboardingState, string> = {
  not_started:
    'LIKQ ย้ายระบบรับเงินของร้านไปที่ Stripe ร้านจะมีบัญชี Stripe เป็นของตัวเอง กดเริ่มแล้วทำตาม 3 ขั้นตอนนี้ ใช้เวลาประมาณ 10 นาที',
  incomplete: 'ยังกรอกข้อมูลกับ Stripe ไม่ครบ กดกรอกต่อได้เลย ข้อมูลที่กรอกไว้แล้วยังอยู่ครบ',
  in_review: 'กรอกข้อมูลครบแล้ว ตอนนี้ Stripe กำลังตรวจสอบ ปิดหน้านี้ได้เลย ทีมงาน LIKQ จะเห็นสถานะเดียวกัน',
  ready: 'Stripe เปิดรับเงินให้ร้านแล้ว ทีมงาน LIKQ จะสลับหน้าร้านมาใช้ Stripe และแจ้งให้ทราบอีกครั้ง'
}

function LoadingPanel() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="panel-ink flex min-h-[22rem] items-center justify-center rounded-[2rem]"
    >
      <Loader2 className="h-6 w-6 animate-spin text-likq-beam6" aria-hidden />
      <span className="sr-only">กำลังโหลด</span>
    </section>
  )
}

function ProblemPanel({ problem }: { problem: LinkProblem }) {
  const copy = PROBLEM_COPY[problem]
  return (
    <section role="alert" className="panel-lavender rounded-[2rem] px-7 py-9 md:px-10 md:py-11">
      <h1 className="copy-th text-3xl leading-snug md:text-4xl">{copy.title}</h1>
      <p className="copy-th mt-4 max-w-[34rem]">{copy.body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {problem === 'error' ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="copy-th inline-flex items-center gap-2 rounded-full bg-likq-ink px-6 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-likq-ink"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            โหลดใหม่
          </button>
        ) : null}
        <a
          href="mailto:contact@likqmusic.com"
          className="copy-th inline-flex items-center rounded-full px-6 py-3 text-likq-ink ring-1 ring-likq-ink/40 hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-likq-ink"
        >
          ติดต่อ LIKQ
        </a>
      </div>
    </section>
  )
}
