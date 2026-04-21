'use client'

import React from 'react'
import { ChevronRight, ChevronLeft, Send, Trash2, Info, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useAuditionForm } from './useAuditionForm'
import AudioPlayer from './AudioPlayer'
import FileUpload from './FileUpload'
import SaveDraftButton from './SaveDraftButton'
import { STEPS } from './types'
import { Label } from '@/ui/Label'
import { Input } from '@/ui/Input'
import { Textarea } from '@/ui/Textarea'
import Button from '@/ui/Button'

// --- Config: Replace these paths with actual .mp3 assets ---
const DEMO_TRACK_SRC = '/audio/demo-track.mp3'
const COMMERCIAL_BEAT_SRC = '/audio/commercial-beat.wav'

// --- Brand asset slots (swap with provided assets) ---
interface AuditionFormProps {
  logoSrc?: string
  heroImageSrc?: string
  accentImageSrc?: string
}

export default function AuditionForm({
  logoSrc = '/logo.png',
  heroImageSrc,
  accentImageSrc,
}: AuditionFormProps) {
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
    // TODO: Wire to API endpoint
    saveDraft()
    alert('ส่งใบสมัครเรียบร้อย! เราจะตรวจสอบและติดต่อกลับเร็วๆ นี้')
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src={logoSrc}
              alt="LiKQ Music"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-sm font-medium tracking-wider uppercase text-white/60">
              LiKQ Music
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-secondary text-primary text-[11px] font-bold tracking-wider uppercase shadow-md motion-safe:animate-pulse">
            <Sparkles size={12} />
            เปิดรับสมัครแล้ว
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            ออดิชั่น Idol
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            เรากำลังสร้างสิ่งใหม่ ถ้าคุณมีแพสชั่น เสียงร้อง และวิสัยทัศน์ —
            เราอยากรู้จักคุณ
          </p>
          {heroImageSrc && (
            <div className="mt-8 rounded-xl overflow-hidden">
              <Image
                src={heroImageSrc}
                alt="Audition hero"
                width={800}
                height={320}
                className="w-full h-48 md:h-64 object-cover"
              />
            </div>
          )}
        </div>
      </header>

      {/* Progress Steps */}
      <div className="sticky top-0 z-30 bg-white border-b border-neutral-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center py-3 gap-1 overflow-x-auto">
            {STEPS.map((step, i) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              return (
                <React.Fragment key={step.id}>
                  {i > 0 && (
                    <div
                      className={`hidden sm:block flex-1 h-px mx-2 ${
                        isCompleted ? 'bg-primary' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : isCompleted
                          ? 'bg-primary/10 text-primary'
                          : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        isActive
                          ? 'bg-white text-primary'
                          : isCompleted
                            ? 'bg-primary text-white'
                            : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      {isCompleted ? '✓' : step.id}
                    </span>
                    <span className="hidden sm:inline">{step.labelTh}</span>
                  </button>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-10">
        {/* ====== STEP 1: Personal Info ====== */}
        {currentStep === 1 && (
          <section className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">
                ข้อมูลส่วนตัว
              </h2>
              <p className="text-sm text-neutral-500">
                เล่าเกี่ยวกับตัวคุณ · ช่องที่มี * จำเป็นต้องกรอก
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="fullName">ชื่อ-นามสกุล *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="ชื่อ-นามสกุล"
                  value={data.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nickname">ชื่อเล่น / Stage Name *</Label>
                <Input
                  id="nickname"
                  name="nickname"
                  placeholder="ชื่อเล่น / ชื่อบนเวที"
                  value={data.nickname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">วันเกิด *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={data.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">อีเมล *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0XX-XXX-XXXX"
                  value={data.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="socialMedia">Social Media (IG / X / TikTok)</Label>
                <Input
                  id="socialMedia"
                  name="socialMedia"
                  placeholder="@yourhandle"
                  value={data.socialMedia}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="portfolioLink">
                ลิงก์ Portfolio / Demo (ถ้ามี)
              </Label>
              <Input
                id="portfolioLink"
                name="portfolioLink"
                placeholder="https://youtube.com/... หรือ https://soundcloud.com/..."
                value={data.portfolioLink}
                onChange={handleChange}
              />
              <p className="text-xs text-neutral-400 mt-1">
                YouTube, SoundCloud, Google Drive หรือลิงก์ผลงานอะไรก็ได้
              </p>
            </div>
          </section>
        )}

        {/* ====== STEP 2: Attitude & Mindset ====== */}
        {currentStep === 2 && (
          <section className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">
                ทัศนคติของคุณ
              </h2>
              <p className="text-sm text-neutral-500">
                เราอยากเข้าใจวิธีคิดของคุณ ไม่ใช่แค่ว่าทำอะไรเป็น ·
                ตอบตามความจริง — ไม่มีคำตอบไหนผิด
              </p>
            </div>

            {accentImageSrc && (
              <div className="rounded-xl overflow-hidden">
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
              <div>
                <Label htmlFor="idolMeaning">
                  การเป็น idol สำหรับคุณคืออะไร นอกเหนือจากการขึ้นเวทีแสดง? *
                </Label>
                <Textarea
                  id="idolMeaning"
                  name="idolMeaning"
                  rows={4}
                  placeholder="แชร์มุมมองของคุณต่อวงการ idol ความสัมพันธ์กับแฟน และความรับผิดชอบที่มาพร้อมกัน..."
                  value={data.idolMeaning}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="creativeProject">
                  เล่าโปรเจ็กต์สร้างสรรค์ที่ภูมิใจที่สุดที่เคยทำ
                  บทบาทของคุณคืออะไร ได้เรียนรู้อะไรบ้าง? *
                </Label>
                <Textarea
                  id="creativeProject"
                  name="creativeProject"
                  rows={4}
                  placeholder="เพลงที่แต่ง, วิดีโอที่ตัด, แดนซ์คัฟเวอร์, งานศิลปะ, โปรเจ็กต์นักเรียน — อะไรก็ได้..."
                  value={data.creativeProject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="handleCriticism">
                  คุณรับมือกับคำวิจารณ์ผลงานสร้างสรรค์ของตัวเองยังไง?
                  เล่าเหตุการณ์ครั้งที่เคยเกิดขึ้นจริง *
                </Label>
                <Textarea
                  id="handleCriticism"
                  name="handleCriticism"
                  rows={4}
                  placeholder="เราอยากเห็นความจริงใจและการรู้จักตัวเอง ไม่ใช่คำตอบที่สมบูรณ์แบบ..."
                  value={data.handleCriticism}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="bg-secondary-light p-5 rounded-xl border border-secondary/20">
                <Label htmlFor="oneYearVision" className="!text-primary font-bold !mb-3">
                  อีก 1 ปี คุณเห็นตัวเองเป็นแบบไหน? *
                </Label>
                <p className="text-xs text-neutral-500 mb-3">
                  คิดถึงการเติบโตในฐานะศิลปิน ทักษะ ตำแหน่งในกลุ่ม และ
                  แนวเพลงที่อยากทำ
                </p>
                <Textarea
                  id="oneYearVision"
                  name="oneYearVision"
                  rows={5}
                  placeholder="ในอีก 1 ปี ฉันเห็นตัวเอง..."
                  value={data.oneYearVision}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>
        )}

        {/* ====== STEP 3: Audio Assignments ====== */}
        {currentStep === 3 && (
          <section className="space-y-10 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">
                โจทย์เสียงเพลง
              </h2>
              <p className="text-sm text-neutral-500">
                ฟังให้ตั้งใจ แล้วเล่าให้ฟังว่าได้ยินอะไร และคุณจะต่อยอดเป็นอะไร
              </p>
            </div>

            {/* Disclaimer */}
            <div className="flex gap-3 p-4 bg-warning/5 border border-warning/20 rounded-xl">
              <Info size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  หมายเหตุสำคัญ
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  เราไม่ได้คาดหวังว่าครั้งแรกจะต้องสมบูรณ์แบบ ·
                  เราอยากเห็น <strong>ไอเดียสร้างสรรค์</strong> และเข้าใจ{' '}
                  <strong>ความสามารถปัจจุบัน</strong> ของคุณ
                  โชว์ให้เราเห็นว่าคุณคิดกับดนตรียังไง
                </p>
              </div>
            </div>

            {/* Section A: The Demo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  A
                </span>
                <h3 className="text-lg font-bold text-primary">เพลง Demo</h3>
              </div>

              <div className="bg-white rounded-xl border border-neutral-100 p-5 space-y-4">
                <p className="text-sm text-neutral-600">
                  นี่คือ <strong>เดโม่ดิบพร้อมเนื้อร้อง</strong>
                  ยังไม่ได้มิกซ์ และยังไม่มีดนตรีเต็ม ·
                  ฟังในฐานะจุดเริ่มต้น ไม่ใช่ผลงานที่เสร็จสมบูรณ์
                </p>

                <AudioPlayer
                  src={DEMO_TRACK_SRC}
                  title="Demo Track"
                  subtitle="เดโม่ดิบ — มีเนื้อร้อง ยังไม่ได้มิกซ์"
                />

                <div>
                  <Label htmlFor="demoAnalysis">
                    คุณเห็นศักยภาพอะไรในเพลงนี้
                    และจะพัฒนาต่อให้เป็นเพลงเต็มไปในทิศทางไหน? *
                  </Label>
                  <Textarea
                    id="demoAnalysis"
                    name="demoAnalysis"
                    rows={5}
                    placeholder="พูดถึงเมโลดี้ เนื้อร้อง การเรียบเรียง อารมณ์ — อะไรก็ได้ที่สะดุดหู แล้วบอกว่าจะต่อยอดยังไง..."
                    value={data.demoAnalysis}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section B: The Commercial Beat */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-secondary text-primary text-xs font-bold flex items-center justify-center">
                  B
                </span>
                <h3 className="text-lg font-bold text-primary">
                  บีทสำหรับงานโปรโมต
                </h3>
              </div>

              <div className="bg-white rounded-xl border border-neutral-100 p-5 space-y-4">
                <p className="text-sm text-neutral-600">
                  นี่คือ <strong>บีทสำหรับโปรโมตสินค้า</strong> · โจทย์ของคุณ:
                  แต่งเนื้อร้องใหม่ ต่อเพลง หรือปรับแต่งตามสไตล์ที่คุณคิด
                  แล้วอัดผลงานอัพโหลดที่ด้านล่าง
                </p>

                <AudioPlayer
                  src={COMMERCIAL_BEAT_SRC}
                  title="Commercial Beat"
                  subtitle="บีทสำหรับโปรโมตสินค้า — เปิดให้ตีความตามสไตล์"
                />

                <div>
                  <Label htmlFor="commercialResponse">
                    เล่าแนวทางสร้างสรรค์ของคุณ —
                    เปลี่ยนหรือเพิ่มอะไรไปบ้าง ทำไมถึงเลือกแบบนี้? *
                  </Label>
                  <Textarea
                    id="commercialResponse"
                    name="commercialResponse"
                    rows={4}
                    placeholder="อธิบายกระบวนการคิด: เนื้อที่แต่ง การปรับแก้ ทิศทางที่เลือก..."
                    value={data.commercialResponse}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>อัพโหลดไฟล์เสียงที่บันทึกไว้ *</Label>
                  <FileUpload
                    file={uploadedFile}
                    onFileChange={setUploadedFile}
                    accept="audio/*"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====== STEP 4: Review & Submit ====== */}
        {currentStep === 4 && (
          <section className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">
                ตรวจสอบและส่ง
              </h2>
              <p className="text-sm text-neutral-500">
                กรุณาตรวจคำตอบก่อนส่ง · สามารถกลับไปแก้ไขในแต่ละขั้นตอนได้
              </p>
            </div>

            {/* Summary cards */}
            <div className="space-y-4">
              <ReviewCard
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
              <ReviewCard
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
              <ReviewCard
                title="โจทย์เสียงเพลง"
                step={3}
                onEdit={() => goToStep(3)}
                items={[
                  { label: 'วิเคราะห์ Demo', value: data.demoAnalysis, truncate: true },
                  { label: 'แนวทาง Commercial', value: data.commercialResponse, truncate: true },
                  {
                    label: 'ไฟล์เสียง',
                    value: uploadedFile ? uploadedFile.name : 'ยังไม่ได้อัพโหลด',
                  },
                ]}
              />
            </div>

            {/* Disclaimer repeat */}
            <div className="flex gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-neutral-600">
                การส่งแบบฟอร์มนี้ถือว่าคุณยืนยันว่าข้อมูลทั้งหมดเป็นความจริง และ
                ไฟล์เสียงเป็นผลงานของคุณเอง · ข้อมูลจะใช้สำหรับการออดิชั่นเท่านั้น
              </p>
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={prevStep}
                className="gap-1"
              >
                <ChevronLeft size={16} />
                ย้อนกลับ
              </Button>
            )}
            {lastSaved && (
              <button
                type="button"
                onClick={clearDraft}
                className="text-xs text-neutral-400 hover:text-danger flex items-center gap-1 transition-colors ml-2"
              >
                <Trash2 size={12} />
                ล้าง draft
              </button>
            )}
          </div>

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={nextStep}
              className="gap-1"
            >
              ถัดไป
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="gap-2"
            >
              <Send size={16} />
              ส่งใบสมัคร
            </Button>
          )}
        </div>
      </form>

      {/* Sticky Save Draft */}
      <SaveDraftButton
        onSave={saveDraft}
        lastSaved={lastSaved}
        showFlash={saveFlash}
      />
    </div>
  )
}

// --- Review Card sub-component ---
function ReviewCard({
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
    <div className="bg-white border border-neutral-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
            {step}
          </span>
          <h3 className="text-sm font-bold text-primary">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-primary hover:underline font-medium"
        >
          แก้ไข
        </button>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {items.map(item => (
          <div key={item.label}>
            <dt className="text-[11px] uppercase tracking-wider text-neutral-400 mb-0.5">
              {item.label}
            </dt>
            <dd
              className={`text-sm text-neutral-700 ${
                item.truncate ? 'line-clamp-2' : ''
              } ${!item.value ? 'text-neutral-300 italic' : ''}`}
            >
              {item.value || 'ยังไม่ระบุ'}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
