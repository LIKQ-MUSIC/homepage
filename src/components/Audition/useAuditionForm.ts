'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  AuditionFormData,
  AuditionFormState,
  INITIAL_FORM_DATA,
  STORAGE_KEY,
} from './types'

function loadFromStorage(): AuditionFormState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuditionFormState
  } catch {
    return null
  }
}

function saveToStorage(state: AuditionFormState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function useAuditionForm() {
  const [data, setData] = useState<AuditionFormData>(INITIAL_FORM_DATA)
  const [currentStep, setCurrentStep] = useState(1)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [saveFlash, setSaveFlash] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const initialized = useRef(false)

  // Load draft from localStorage on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const saved = loadFromStorage()
    if (saved) {
      setData(saved.data)
      setCurrentStep(saved.currentStep)
      setLastSaved(saved.lastSaved)
    }
  }, [])

  const updateField = useCallback(
    (field: keyof AuditionFormData, value: string) => {
      setData(prev => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target
      updateField(name as keyof AuditionFormData, value)
    },
    [updateField]
  )

  const saveDraft = useCallback(() => {
    const now = new Date().toISOString()
    const state: AuditionFormState = {
      data,
      currentStep,
      lastSaved: now,
    }
    saveToStorage(state)
    setLastSaved(now)
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 2000)
  }, [data, currentStep])

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
    setData(INITIAL_FORM_DATA)
    setCurrentStep(1)
    setLastSaved(null)
    setUploadedFile(null)
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
    saveDraft()
  }, [saveDraft])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  return {
    data,
    currentStep,
    lastSaved,
    saveFlash,
    uploadedFile,
    setUploadedFile,
    updateField,
    handleChange,
    saveDraft,
    clearDraft,
    nextStep,
    prevStep,
    goToStep,
    setCurrentStep,
  }
}
