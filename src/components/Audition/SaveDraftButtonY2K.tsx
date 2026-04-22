'use client'

import React from 'react'
import { Save, Check } from 'lucide-react'

interface SaveDraftButtonY2KProps {
  onSave: () => void
  lastSaved: string | null
  showFlash: boolean
}

export default function SaveDraftButtonY2K({
  onSave,
  lastSaved,
  showFlash,
}: SaveDraftButtonY2KProps) {
  const formatSavedTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {lastSaved && (
        <span className="font-pixel text-[9px] uppercase tracking-wider text-y2k-ink bg-y2k-yellow border-[2px] border-y2k-ink px-2.5 py-1"
              style={{ boxShadow: '2px 2px 0 0 #0D0A2C' }}>
          SAVED · {formatSavedTime(lastSaved)}
        </span>
      )}
      <button
        type="button"
        onClick={onSave}
        className={`flex items-center gap-2 px-5 py-3 font-pixel text-[11px] uppercase tracking-wider border-[3px] border-y2k-ink text-white transition-all active:translate-x-[3px] active:translate-y-[3px] y2k-focus-ring ${
          showFlash ? 'bg-y2k-mint text-y2k-ink' : 'bg-y2k-pink hover:bg-y2k-cobalt'
        }`}
        style={{ boxShadow: '4px 4px 0 0 #0D0A2C' }}
        aria-label="บันทึก draft"
      >
        {showFlash ? (
          <>
            <Check size={16} />
            <span>SAVED!</span>
          </>
        ) : (
          <>
            <Save size={16} />
            <span>SAVE</span>
          </>
        )}
      </button>
    </div>
  )
}
