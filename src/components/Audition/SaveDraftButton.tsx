'use client'

import React from 'react'
import { Save, Check } from 'lucide-react'

interface SaveDraftButtonProps {
  onSave: () => void
  lastSaved: string | null
  showFlash: boolean
}

export default function SaveDraftButton({
  onSave,
  lastSaved,
  showFlash,
}: SaveDraftButtonProps) {
  const formatSavedTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1.5">
      {lastSaved && (
        <span className="text-[11px] text-neutral-400 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
          บันทึกล่าสุด {formatSavedTime(lastSaved)}
        </span>
      )}
      <button
        type="button"
        onClick={onSave}
        className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all duration-300 font-medium text-sm ${
          showFlash
            ? 'bg-success text-white scale-105'
            : 'bg-primary text-white hover:bg-primary-hover hover:shadow-xl active:scale-95'
        }`}
        aria-label="บันทึก draft"
      >
        {showFlash ? (
          <>
            <Check size={16} />
            <span>บันทึกแล้ว!</span>
          </>
        ) : (
          <>
            <Save size={16} />
            <span>บันทึก draft</span>
          </>
        )}
      </button>
    </div>
  )
}
