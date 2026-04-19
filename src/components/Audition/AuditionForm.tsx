'use client'

import React from 'react'
import { ChevronRight, ChevronLeft, Send, Trash2, Info } from 'lucide-react'
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
    alert('Application submitted! We will review your audition and get back to you.')
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
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            Idol Audition
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            We&apos;re building something new. If you have the passion, the voice,
            and the vision — we want to hear from you.
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
                    <span className="hidden sm:inline">{step.label}</span>
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
                Personal Information
              </h2>
              <p className="text-sm text-neutral-500">
                Tell us about yourself. All fields marked with * are required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
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
                <Label htmlFor="nickname">Nickname / Stage Name *</Label>
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
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
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
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="phone">Phone Number *</Label>
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
                Portfolio / Demo Reel Link (optional)
              </Label>
              <Input
                id="portfolioLink"
                name="portfolioLink"
                placeholder="https://youtube.com/... or https://soundcloud.com/..."
                value={data.portfolioLink}
                onChange={handleChange}
              />
              <p className="text-xs text-neutral-400 mt-1">
                YouTube, SoundCloud, Google Drive, or any link to your work.
              </p>
            </div>
          </section>
        )}

        {/* ====== STEP 2: Attitude & Mindset ====== */}
        {currentStep === 2 && (
          <section className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">
                Your Mindset
              </h2>
              <p className="text-sm text-neutral-500">
                We want to understand how you think, not just what you can do.
                Be honest — there are no wrong answers.
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
                  What does being an idol mean to you, beyond performing on stage? *
                </Label>
                <Textarea
                  id="idolMeaning"
                  name="idolMeaning"
                  rows={4}
                  placeholder="Share your perspective on the idol industry, the relationship with fans, and the responsibilities that come with it..."
                  value={data.idolMeaning}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="creativeProject">
                  Describe a creative project you&apos;ve worked on that you&apos;re most
                  proud of. What was your role and what did you learn? *
                </Label>
                <Textarea
                  id="creativeProject"
                  name="creativeProject"
                  rows={4}
                  placeholder="This can be anything — a song you wrote, a video you edited, a dance cover, an art piece, a school project..."
                  value={data.creativeProject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="handleCriticism">
                  How do you handle criticism of your creative work? Tell us about
                  a specific time it happened. *
                </Label>
                <Textarea
                  id="handleCriticism"
                  name="handleCriticism"
                  rows={4}
                  placeholder="We're looking for honesty and self-awareness, not a perfect answer..."
                  value={data.handleCriticism}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="bg-secondary-light p-5 rounded-xl border border-secondary/20">
                <Label htmlFor="oneYearVision" className="!text-primary font-bold !mb-3">
                  Where do you see yourself in one year? *
                </Label>
                <p className="text-xs text-neutral-500 mb-3">
                  Think about your growth as an artist, your skills, your place in
                  the group, and the kind of music you want to create.
                </p>
                <Textarea
                  id="oneYearVision"
                  name="oneYearVision"
                  rows={5}
                  placeholder="In one year, I see myself..."
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
                Audio Assignments
              </h2>
              <p className="text-sm text-neutral-500">
                Listen carefully, then tell us what you hear and what you&apos;d
                create.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="flex gap-3 p-4 bg-warning/5 border border-warning/20 rounded-xl">
              <Info size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Important Note
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  We do not expect perfection on your first attempt. We want to
                  see your <strong>creative ideas</strong> and understand your{' '}
                  <strong>current capabilities</strong>. Show us how you think
                  about music.
                </p>
              </div>
            </div>

            {/* Section A: The Demo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  A
                </span>
                <h3 className="text-lg font-bold text-primary">The Demo</h3>
              </div>

              <div className="bg-white rounded-xl border border-neutral-100 p-5 space-y-4">
                <p className="text-sm text-neutral-600">
                  This is a <strong>raw demo with lyrics</strong>, unmixed, and
                  without full instrumentation. Listen to it as a starting point,
                  not a finished product.
                </p>

                <AudioPlayer
                  src={DEMO_TRACK_SRC}
                  title="Demo Track"
                  subtitle="Raw demo — lyrics included, unmixed"
                />

                <div>
                  <Label htmlFor="demoAnalysis">
                    What potential do you see in this track, and what direction
                    would you take to develop it into a full song? *
                  </Label>
                  <Textarea
                    id="demoAnalysis"
                    name="demoAnalysis"
                    rows={5}
                    placeholder="Talk about the melody, the lyrics, the arrangement, the mood — anything that stands out to you. Then describe how you'd develop it further..."
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
                  The Commercial Beat
                </h3>
              </div>

              <div className="bg-white rounded-xl border border-neutral-100 p-5 space-y-4">
                <p className="text-sm text-neutral-600">
                  This is a <strong>product-promotion beat</strong>. Your task:
                  write new lyrics, extend, or modify the track in any way you
                  see fit. Record your version and upload it below.
                </p>

                <AudioPlayer
                  src={COMMERCIAL_BEAT_SRC}
                  title="Commercial Beat"
                  subtitle="Product-promotion beat — open for your interpretation"
                />

                <div>
                  <Label htmlFor="commercialResponse">
                    Describe your creative approach — what did you change or add,
                    and why? *
                  </Label>
                  <Textarea
                    id="commercialResponse"
                    name="commercialResponse"
                    rows={4}
                    placeholder="Explain your thought process: the lyrics you wrote, the modifications you made, the direction you chose..."
                    value={data.commercialResponse}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Upload Your Audio Submission *</Label>
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
                Review & Submit
              </h2>
              <p className="text-sm text-neutral-500">
                Please review your answers before submitting. You can go back to
                any section to make changes.
              </p>
            </div>

            {/* Summary cards */}
            <div className="space-y-4">
              <ReviewCard
                title="Personal Information"
                step={1}
                onEdit={() => goToStep(1)}
                items={[
                  { label: 'Name', value: data.fullName },
                  { label: 'Nickname', value: data.nickname },
                  { label: 'Date of Birth', value: data.dateOfBirth },
                  { label: 'Email', value: data.email },
                  { label: 'Phone', value: data.phone },
                  { label: 'Social Media', value: data.socialMedia || '—' },
                ]}
              />
              <ReviewCard
                title="Your Mindset"
                step={2}
                onEdit={() => goToStep(2)}
                items={[
                  { label: 'Idol meaning', value: data.idolMeaning, truncate: true },
                  { label: 'Creative project', value: data.creativeProject, truncate: true },
                  { label: 'Handling criticism', value: data.handleCriticism, truncate: true },
                  { label: 'One-year vision', value: data.oneYearVision, truncate: true },
                ]}
              />
              <ReviewCard
                title="Audio Assignments"
                step={3}
                onEdit={() => goToStep(3)}
                items={[
                  { label: 'Demo analysis', value: data.demoAnalysis, truncate: true },
                  { label: 'Commercial approach', value: data.commercialResponse, truncate: true },
                  {
                    label: 'Audio file',
                    value: uploadedFile ? uploadedFile.name : 'No file uploaded',
                  },
                ]}
              />
            </div>

            {/* Disclaimer repeat */}
            <div className="flex gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-neutral-600">
                By submitting this form, you confirm that all information is
                accurate and that the audio submission is your own work. Your
                data will only be used for the audition process.
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
                Back
              </Button>
            )}
            {lastSaved && (
              <button
                type="button"
                onClick={clearDraft}
                className="text-xs text-neutral-400 hover:text-danger flex items-center gap-1 transition-colors ml-2"
              >
                <Trash2 size={12} />
                Clear draft
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
              Continue
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
              Submit Application
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
          Edit
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
              {item.value || 'Not provided'}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
