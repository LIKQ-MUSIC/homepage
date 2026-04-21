'use client'

import React from 'react'
import Image from 'next/image'
import { ChevronRight, ChevronLeft, Send, Trash2, Info, Sparkles } from 'lucide-react'
import { useAuditionForm } from './useAuditionForm'
import AudioPlayerY2K from './AudioPlayerY2K'
import FileUploadY2K from './FileUploadY2K'
import SaveDraftButtonY2K from './SaveDraftButtonY2K'
import { STEPS } from './types'

const DEMO_TRACK_SRC = '/audio/demo-track.mp3'
const COMMERCIAL_BEAT_SRC = '/audio/commercial-beat.wav'

interface AuditionFormY2KProps {
  logoSrc?: string
  heroImageSrc?: string
  accentImageSrc?: string
}

function PixelHeart({ filled, color = '#FF3AA5', size = 22 }: { filled: boolean; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      {filled ? (
        <>
          <rect x="2" y="3" width="3" height="1" fill={color} />
          <rect x="11" y="3" width="3" height="1" fill={color} />
          <rect x="1" y="4" width="5" height="1" fill={color} />
          <rect x="10" y="4" width="5" height="1" fill={color} />
          <rect x="1" y="5" width="14" height="2" fill={color} />
          <rect x="2" y="7" width="12" height="1" fill={color} />
          <rect x="3" y="8" width="10" height="1" fill={color} />
          <rect x="4" y="9" width="8" height="1" fill={color} />
          <rect x="5" y="10" width="6" height="1" fill={color} />
          <rect x="6" y="11" width="4" height="1" fill={color} />
          <rect x="7" y="12" width="2" height="1" fill={color} />
        </>
      ) : (
        <>
          <rect x="2" y="3" width="3" height="1" fill="#0D0A2C" />
          <rect x="11" y="3" width="3" height="1" fill="#0D0A2C" />
          <rect x="1" y="4" width="1" height="1" fill="#0D0A2C" />
          <rect x="5" y="4" width="1" height="1" fill="#0D0A2C" />
          <rect x="10" y="4" width="1" height="1" fill="#0D0A2C" />
          <rect x="14" y="4" width="1" height="1" fill="#0D0A2C" />
          <rect x="1" y="5" width="1" height="2" fill="#0D0A2C" />
          <rect x="14" y="5" width="1" height="2" fill="#0D0A2C" />
          <rect x="2" y="6" width="1" height="1" fill="#0D0A2C" />
          <rect x="13" y="6" width="1" height="1" fill="#0D0A2C" />
          <rect x="2" y="7" width="1" height="1" fill="#0D0A2C" />
          <rect x="13" y="7" width="1" height="1" fill="#0D0A2C" />
          <rect x="3" y="8" width="1" height="1" fill="#0D0A2C" />
          <rect x="12" y="8" width="1" height="1" fill="#0D0A2C" />
          <rect x="4" y="9" width="1" height="1" fill="#0D0A2C" />
          <rect x="11" y="9" width="1" height="1" fill="#0D0A2C" />
          <rect x="5" y="10" width="1" height="1" fill="#0D0A2C" />
          <rect x="10" y="10" width="1" height="1" fill="#0D0A2C" />
          <rect x="6" y="11" width="1" height="1" fill="#0D0A2C" />
          <rect x="9" y="11" width="1" height="1" fill="#0D0A2C" />
          <rect x="7" y="12" width="2" height="1" fill="#0D0A2C" />
        </>
      )}
    </svg>
  )
}

export default function AuditionFormY2K({
  logoSrc = '/logo.png',
  heroImageSrc,
  accentImageSrc,
}: AuditionFormY2KProps) {
  const {
    data,
    currentStep,
    lastSaved,
    saveFlash,
    uploadedFile,
    setUploadedFile,
    handleChange,
    saveDraft,
    clearDraft,
    nextStep,
    prevStep,
    goToStep,
  } = useAuditionForm()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveDraft()
    alert('ส่งใบสมัครเรียบร้อย! เราจะตรวจสอบและติดต่อกลับเร็วๆ นี้')
  }

  return (
    <div className="theme-y2k min-h-screen">
      {/* ═══ HERO ═══ */}
      <header className="relative bg-y2k-cobalt text-white overflow-hidden y2k-scanlines">
        <div className="absolute inset-0 pointer-events-none opacity-40"
             style={{
               backgroundImage:
                 'radial-gradient(circle at 10% 20%, #FF3AA5 0%, transparent 25%), radial-gradient(circle at 90% 80%, #2DE8C3 0%, transparent 30%), radial-gradient(circle at 50% 50%, #FFE14C 0%, transparent 18%)',
             }}
        />
        <div className="relative max-w-3xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="border-[2px] border-white/80 p-1 bg-white">
              <Image src={logoSrc} alt="LiKQ Music" width={32} height={32} />
            </div>
            <span className="font-pixel text-[10px] tracking-wider uppercase text-y2k-mint">
              LiKQ MUSIC
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 mb-5 y2k-badge bg-y2k-yellow !text-y2k-ink">
            <Sparkles size={11} />
            NOW RECRUITING
          </div>

          <h1 className="font-pixel text-[26px] sm:text-[34px] md:text-[44px] leading-[1.15] text-y2k-mint mb-3">
            AUDITION
          </h1>
          <p className="font-pixel-mono text-[22px] md:text-[26px] text-y2k-yellow leading-tight mb-4">
            ออดิชั่น Idol — ครั้งแรกของคุณเริ่มที่นี่
          </p>
          <p className="font-prompt text-white/90 text-base md:text-lg max-w-xl leading-relaxed">
            เรากำลังสร้างสิ่งใหม่ ถ้าคุณมีแพสชั่น เสียงร้อง และวิสัยทัศน์ —
            เราอยากรู้จักคุณ
          </p>

          {heroImageSrc && (
            <div className="mt-8 border-[4px] border-white bg-white/10 p-2 animate-y2k-bob motion-reduce:animate-none inline-block"
                 style={{ boxShadow: '6px 6px 0 0 #0D0A2C' }}>
              <Image
                src={heroImageSrc}
                alt="Audition hero"
                width={720}
                height={460}
                className="block w-full max-w-md"
              />
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 font-pixel text-[10px] tracking-wider text-y2k-pink-soft">
            <span className="w-2 h-2 bg-y2k-pink animate-y2k-blink" />
            PRESS START TO CONTINUE
          </div>
        </div>
      </header>

      {/* ═══ PROGRESS (sticky) ═══ */}
      <div className="sticky top-0 z-30 bg-y2k-cream border-b-[3px] border-y2k-ink">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {STEPS.map((step, i) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              return (
                <React.Fragment key={step.id}>
                  {i > 0 && (
                    <div
                      className={`hidden sm:block flex-1 h-[3px] ${
                        isCompleted ? 'bg-y2k-mint' : 'bg-y2k-ink/20'
                      }`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`group flex items-center gap-2 px-3 py-2 font-pixel text-[9px] uppercase tracking-wider whitespace-nowrap border-[2px] border-y2k-ink transition-all y2k-focus-ring ${
                      isActive
                        ? 'bg-y2k-pink text-white'
                        : isCompleted
                          ? 'bg-y2k-mint text-y2k-ink'
                          : 'bg-white text-y2k-ink/60'
                    }`}
                    style={{
                      boxShadow: isActive
                        ? '3px 3px 0 0 #0D0A2C'
                        : isCompleted
                          ? '2px 2px 0 0 #0D0A2C'
                          : 'none',
                    }}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <PixelHeart
                      filled={isActive || isCompleted}
                      color={isActive ? '#FFE14C' : isCompleted ? '#FF3AA5' : '#0D0A2C'}
                      size={14}
                    />
                    <span className="font-pixel-mono text-[14px] leading-none">
                      {step.id}
                    </span>
                    <span className="hidden sm:inline font-prompt text-[11px] font-bold">
                      {step.labelTh}
                    </span>
                  </button>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══ FORM BODY ═══ */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-10">
        {currentStep === 1 && (
          <section className="space-y-8 animate-fade-in">
            <SectionHeader
              kicker="STAGE 01"
              title="ข้อมูลส่วนตัว"
              desc="เล่าเกี่ยวกับตัวคุณ · ช่องที่มี * จำเป็นต้องกรอก"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Y2KField id="fullName" label="ชื่อ-นามสกุล *">
                <input
                  id="fullName"
                  name="fullName"
                  className="y2k-input"
                  placeholder="ชื่อ-นามสกุล"
                  value={data.fullName}
                  onChange={handleChange}
                  required
                />
              </Y2KField>
              <Y2KField id="nickname" label="ชื่อเล่น / STAGE NAME *">
                <input
                  id="nickname"
                  name="nickname"
                  className="y2k-input"
                  placeholder="ชื่อเล่น / ชื่อบนเวที"
                  value={data.nickname}
                  onChange={handleChange}
                  required
                />
              </Y2KField>
              <Y2KField id="dateOfBirth" label="วันเกิด *">
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  className="y2k-input"
                  value={data.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Y2KField>
              <Y2KField id="email" label="อีเมล *">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="y2k-input"
                  placeholder="your@email.com"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </Y2KField>
              <Y2KField id="phone" label="เบอร์โทรศัพท์ *">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="y2k-input"
                  placeholder="0XX-XXX-XXXX"
                  value={data.phone}
                  onChange={handleChange}
                  required
                />
              </Y2KField>
              <Y2KField id="socialMedia" label="SOCIAL MEDIA">
                <input
                  id="socialMedia"
                  name="socialMedia"
                  className="y2k-input"
                  placeholder="@yourhandle"
                  value={data.socialMedia}
                  onChange={handleChange}
                />
              </Y2KField>
            </div>

            <Y2KField id="portfolioLink" label="PORTFOLIO / DEMO LINK">
              <input
                id="portfolioLink"
                name="portfolioLink"
                className="y2k-input"
                placeholder="https://youtube.com/... หรือ https://soundcloud.com/..."
                value={data.portfolioLink}
                onChange={handleChange}
              />
              <p className="font-prompt text-xs text-y2k-ink/60 mt-2">
                YouTube, SoundCloud, Google Drive หรือลิงก์ผลงานอะไรก็ได้
              </p>
            </Y2KField>
          </section>
        )}

        {currentStep === 2 && (
          <section className="space-y-8 animate-fade-in">
            <SectionHeader
              kicker="STAGE 02"
              title="ทัศนคติของคุณ"
              desc="เราอยากเข้าใจวิธีคิดของคุณ ไม่ใช่แค่ว่าทำอะไรเป็น — ตอบตามความจริง ไม่มีคำตอบไหนผิด"
            />

            {accentImageSrc && (
              <div className="border-[3px] border-y2k-ink overflow-hidden" style={{ boxShadow: '4px 4px 0 0 #0D0A2C' }}>
                <Image
                  src={accentImageSrc}
                  alt="Brand accent"
                  width={700}
                  height={200}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            <div className="space-y-6">
              <Y2KField id="idolMeaning" label="การเป็น IDOL คืออะไร? *">
                <textarea
                  id="idolMeaning"
                  name="idolMeaning"
                  rows={4}
                  className="y2k-input resize-y"
                  placeholder="แชร์มุมมองของคุณต่อวงการ idol ความสัมพันธ์กับแฟน และความรับผิดชอบที่มาพร้อมกัน..."
                  value={data.idolMeaning}
                  onChange={handleChange}
                  required
                />
              </Y2KField>

              <Y2KField id="creativeProject" label="โปรเจ็กต์สร้างสรรค์ที่ภูมิใจที่สุด *">
                <textarea
                  id="creativeProject"
                  name="creativeProject"
                  rows={4}
                  className="y2k-input resize-y"
                  placeholder="เพลงที่แต่ง, วิดีโอที่ตัด, แดนซ์คัฟเวอร์, งานศิลปะ, โปรเจ็กต์นักเรียน — อะไรก็ได้..."
                  value={data.creativeProject}
                  onChange={handleChange}
                  required
                />
              </Y2KField>

              <Y2KField id="handleCriticism" label="รับมือกับคำวิจารณ์ยังไง? *">
                <textarea
                  id="handleCriticism"
                  name="handleCriticism"
                  rows={4}
                  className="y2k-input resize-y"
                  placeholder="เราอยากเห็นความจริงใจและการรู้จักตัวเอง ไม่ใช่คำตอบที่สมบูรณ์แบบ..."
                  value={data.handleCriticism}
                  onChange={handleChange}
                  required
                />
              </Y2KField>

              <div className="y2k-card-mint p-5">
                <div className="flex items-center gap-2 mb-2">
                  <PixelHeart filled color="#FF3AA5" size={16} />
                  <label htmlFor="oneYearVision" className="font-pixel text-[11px] uppercase tracking-wider text-y2k-ink">
                    BOSS QUESTION · อีก 1 ปี คุณคือใคร? *
                  </label>
                </div>
                <p className="font-prompt text-xs text-y2k-ink/70 mb-3">
                  คิดถึงการเติบโตในฐานะศิลปิน ทักษะ ตำแหน่งในกลุ่ม และแนวเพลงที่อยากทำ
                </p>
                <textarea
                  id="oneYearVision"
                  name="oneYearVision"
                  rows={5}
                  className="y2k-input resize-y"
                  placeholder="ในอีก 1 ปี ฉันเห็นตัวเอง..."
                  value={data.oneYearVision}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <section className="space-y-10 animate-fade-in">
            <SectionHeader
              kicker="STAGE 03"
              title="โจทย์เสียงเพลง"
              desc="ฟังให้ตั้งใจ แล้วเล่าให้ฟังว่าได้ยินอะไร และคุณจะต่อยอดเป็นอะไร"
            />

            <div className="flex gap-3 p-4 bg-y2k-yellow/50 border-[3px] border-y2k-ink"
                 style={{ boxShadow: '4px 4px 0 0 #0D0A2C' }}>
              <Info size={20} className="text-y2k-ink flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-pixel text-[10px] uppercase tracking-wider text-y2k-ink">
                  IMPORTANT NOTE
                </p>
                <p className="font-prompt text-sm text-y2k-ink/90 mt-1.5 leading-relaxed">
                  เราไม่ได้คาดหวังว่าครั้งแรกจะต้องสมบูรณ์แบบ · เราอยากเห็น{' '}
                  <strong>ไอเดียสร้างสรรค์</strong> และเข้าใจ{' '}
                  <strong>ความสามารถปัจจุบัน</strong> ของคุณ โชว์ให้เราเห็นว่าคุณคิดกับดนตรียังไง
                </p>
              </div>
            </div>

            {/* Section A */}
            <div className="space-y-4">
              <TrackBadge letter="A" title="เพลง DEMO" />
              <div className="y2k-card p-5 space-y-4">
                <p className="font-prompt text-sm text-y2k-ink/80 leading-relaxed">
                  นี่คือ <strong>เดโม่ดิบพร้อมเนื้อร้อง</strong> ยังไม่ได้มิกซ์ ยังไม่มีดนตรีเต็ม ·
                  ฟังในฐานะจุดเริ่มต้น ไม่ใช่ผลงานที่เสร็จสมบูรณ์
                </p>
                <AudioPlayerY2K
                  src={DEMO_TRACK_SRC}
                  title="DEMO TRACK"
                  subtitle="เดโม่ดิบ — มีเนื้อร้อง ยังไม่ได้มิกซ์"
                />
                <Y2KField id="demoAnalysis" label="เห็นศักยภาพอะไร? จะต่อยอดยังไง? *">
                  <textarea
                    id="demoAnalysis"
                    name="demoAnalysis"
                    rows={5}
                    className="y2k-input resize-y"
                    placeholder="พูดถึงเมโลดี้ เนื้อร้อง การเรียบเรียง อารมณ์ — อะไรก็ได้ที่สะดุดหู แล้วบอกว่าจะต่อยอดยังไง..."
                    value={data.demoAnalysis}
                    onChange={handleChange}
                    required
                  />
                </Y2KField>
              </div>
            </div>

            {/* Section B */}
            <div className="space-y-4">
              <TrackBadge letter="B" title="บีท COMMERCIAL" tone="mint" />
              <div className="y2k-card p-5 space-y-4">
                <p className="font-prompt text-sm text-y2k-ink/80 leading-relaxed">
                  นี่คือ <strong>บีทสำหรับโปรโมตสินค้า</strong> · โจทย์ของคุณ:
                  แต่งเนื้อร้องใหม่ ต่อเพลง หรือปรับแต่งตามสไตล์ที่คุณคิด แล้วอัดผลงานอัพโหลดด้านล่าง
                </p>
                <AudioPlayerY2K
                  src={COMMERCIAL_BEAT_SRC}
                  title="COMMERCIAL BEAT"
                  subtitle="บีทสำหรับโปรโมตสินค้า — เปิดให้ตีความ"
                />
                <Y2KField id="commercialResponse" label="แนวทางสร้างสรรค์ของคุณ *">
                  <textarea
                    id="commercialResponse"
                    name="commercialResponse"
                    rows={4}
                    className="y2k-input resize-y"
                    placeholder="อธิบายกระบวนการคิด: เนื้อที่แต่ง การปรับแก้ ทิศทางที่เลือก..."
                    value={data.commercialResponse}
                    onChange={handleChange}
                    required
                  />
                </Y2KField>
                <div>
                  <label className="y2k-label">อัพโหลดไฟล์เสียง *</label>
                  <FileUploadY2K
                    file={uploadedFile}
                    onFileChange={setUploadedFile}
                    accept="audio/*"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {currentStep === 4 && (
          <section className="space-y-8 animate-fade-in">
            <SectionHeader
              kicker="STAGE 04 · FINAL"
              title="ตรวจสอบและส่ง"
              desc="กรุณาตรวจคำตอบก่อนส่ง · สามารถกลับไปแก้ไขในแต่ละขั้นตอนได้"
            />

            <div className="space-y-5">
              <ReviewCardY2K
                title="ข้อมูลส่วนตัว"
                step={1}
                onEdit={() => goToStep(1)}
                items={[
                  { label: 'ชื่อ-นามสกุล', value: data.fullName },
                  { label: 'ชื่อเล่น', value: data.nickname },
                  { label: 'วันเกิด', value: data.dateOfBirth },
                  { label: 'อีเมล', value: data.email },
                  { label: 'เบอร์โทร', value: data.phone },
                  { label: 'Social Media', value: data.socialMedia || '—' },
                ]}
              />
              <ReviewCardY2K
                title="ทัศนคติของคุณ"
                step={2}
                onEdit={() => goToStep(2)}
                items={[
                  { label: 'ความหมาย idol', value: data.idolMeaning, truncate: true },
                  { label: 'โปรเจ็กต์สร้างสรรค์', value: data.creativeProject, truncate: true },
                  { label: 'การรับมือคำวิจารณ์', value: data.handleCriticism, truncate: true },
                  { label: 'วิสัยทัศน์ 1 ปี', value: data.oneYearVision, truncate: true },
                ]}
              />
              <ReviewCardY2K
                title="โจทย์เสียงเพลง"
                step={3}
                onEdit={() => goToStep(3)}
                items={[
                  { label: 'วิเคราะห์ Demo', value: data.demoAnalysis, truncate: true },
                  { label: 'แนวทาง Commercial', value: data.commercialResponse, truncate: true },
                  { label: 'ไฟล์เสียง', value: uploadedFile ? uploadedFile.name : 'ยังไม่ได้อัพโหลด' },
                ]}
              />
            </div>

            <div className="flex gap-3 p-4 y2k-card-mint">
              <Info size={18} className="text-y2k-ink flex-shrink-0 mt-0.5" />
              <p className="font-prompt text-sm text-y2k-ink/80 leading-relaxed">
                การส่งแบบฟอร์มนี้ถือว่าคุณยืนยันว่าข้อมูลทั้งหมดเป็นความจริง และ
                ไฟล์เสียงเป็นผลงานของคุณเอง · ข้อมูลจะใช้สำหรับการออดิชั่นเท่านั้น
              </p>
            </div>
          </section>
        )}

        {/* ═══ NAV ═══ */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t-[3px] border-y2k-ink gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="y2k-btn-ghost y2k-focus-ring">
                <ChevronLeft size={14} />
                BACK
              </button>
            )}
            {lastSaved && (
              <button
                type="button"
                onClick={clearDraft}
                className="inline-flex items-center gap-1 font-pixel text-[9px] uppercase tracking-wider text-y2k-ink/60 hover:text-y2k-pink transition-colors"
              >
                <Trash2 size={12} />
                CLEAR DRAFT
              </button>
            )}
          </div>

          {currentStep < 4 ? (
            <button type="button" onClick={nextStep} className="y2k-btn-primary y2k-focus-ring">
              NEXT
              <ChevronRight size={14} />
            </button>
          ) : (
            <button type="submit" className="y2k-btn-primary y2k-focus-ring">
              <Send size={14} />
              SUBMIT
            </button>
          )}
        </div>
      </form>

      <SaveDraftButtonY2K onSave={saveDraft} lastSaved={lastSaved} showFlash={saveFlash} />
    </div>
  )
}

function SectionHeader({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <div>
      <span className="y2k-badge mb-3">{kicker}</span>
      <h2 className="font-prompt font-extrabold text-2xl md:text-3xl text-y2k-ink mt-3 mb-2">
        {title}
      </h2>
      <p className="font-prompt text-sm text-y2k-ink/70 leading-relaxed">{desc}</p>
    </div>
  )
}

function Y2KField({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="y2k-label">
        {label}
      </label>
      {children}
    </div>
  )
}

function TrackBadge({ letter, title, tone = 'pink' }: { letter: string; title: string; tone?: 'pink' | 'mint' }) {
  const bg = tone === 'mint' ? 'bg-y2k-mint' : 'bg-y2k-pink'
  const fg = tone === 'mint' ? 'text-y2k-ink' : 'text-white'
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-10 h-10 ${bg} ${fg} border-[3px] border-y2k-ink flex items-center justify-center font-pixel text-[14px]`}
        style={{ boxShadow: '3px 3px 0 0 #0D0A2C' }}
      >
        {letter}
      </span>
      <h3 className="font-pixel text-[14px] uppercase tracking-wider text-y2k-ink">
        {title}
      </h3>
    </div>
  )
}

function ReviewCardY2K({
  title,
  step,
  onEdit,
  items,
}: {
  title: string
  step: number
  onEdit: () => void
  items: { label: string; value: string; truncate?: boolean }[]
}) {
  return (
    <div className="y2k-card p-5">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-y2k-mint border-[2px] border-y2k-ink flex items-center justify-center font-pixel text-[10px] text-y2k-ink">
            {step}
          </span>
          <h3 className="font-prompt font-extrabold text-sm text-y2k-ink">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="font-pixel text-[9px] uppercase tracking-wider text-y2k-pink hover:text-y2k-cobalt transition-colors"
        >
          EDIT ▸
        </button>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="font-pixel text-[9px] uppercase tracking-wider text-y2k-ink/60 mb-1">
              {item.label}
            </dt>
            <dd
              className={`font-prompt text-sm text-y2k-ink ${
                item.truncate ? 'line-clamp-2' : ''
              } ${!item.value ? 'text-y2k-ink/30 italic' : ''}`}
            >
              {item.value || 'ยังไม่ระบุ'}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
