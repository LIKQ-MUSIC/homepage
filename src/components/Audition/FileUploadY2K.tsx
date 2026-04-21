'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Upload, X, FileAudio } from 'lucide-react'

interface FileUploadY2KProps {
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
}

export default function FileUploadY2K({
  file,
  onFileChange,
  accept = 'audio/*',
}: FileUploadY2KProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.type.startsWith('audio/')) {
        onFileChange(droppedFile)
      }
    },
    [onFileChange]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] ?? null
      onFileChange(selectedFile)
    },
    [onFileChange]
  )

  const removeFile = useCallback(() => {
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [onFileChange])

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (file) {
    return (
      <div className="y2k-card-mint p-4 flex items-center gap-3">
        <div className="w-11 h-11 border-[2px] border-y2k-ink bg-y2k-yellow flex items-center justify-center flex-shrink-0">
          <FileAudio size={20} className="text-y2k-ink" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-pixel-mono text-[18px] text-y2k-ink truncate leading-tight">
            {file.name}
          </p>
          <p className="font-pixel text-[9px] text-y2k-ink/70 uppercase tracking-wider mt-1">
            {formatSize(file.size)}
          </p>
        </div>
        <button
          type="button"
          onClick={removeFile}
          className="w-9 h-9 border-[2px] border-y2k-ink bg-white hover:bg-y2k-pink hover:text-white text-y2k-ink flex items-center justify-center transition-colors y2k-focus-ring"
          style={{ boxShadow: '2px 2px 0 0 #0D0A2C' }}
          aria-label="ลบไฟล์"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="อัพโหลดไฟล์เสียง"
      className={`border-[3px] border-dashed rounded-none p-8 text-center cursor-pointer transition-all y2k-focus-ring ${
        isDragging
          ? 'border-y2k-pink bg-y2k-pink/10'
          : 'border-y2k-cobalt bg-y2k-mint/20 hover:bg-y2k-yellow/30'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 border-[3px] border-y2k-ink bg-y2k-pink flex items-center justify-center"
             style={{ boxShadow: '3px 3px 0 0 #0D0A2C' }}>
          <Upload size={26} className="text-white" />
        </div>
      </div>
      <p className="font-pixel text-[11px] text-y2k-ink uppercase tracking-wider">
        INSERT AUDIO
      </p>
      <p className="font-pixel-mono text-[18px] text-y2k-ink/80 mt-2 leading-tight">
        ลากไฟล์มาวาง หรือกดเพื่อเลือก
      </p>
      <p className="font-pixel text-[9px] text-y2k-ink/60 uppercase tracking-wider mt-3">
        MP3 · WAV · M4A · MAX 50MB
      </p>
    </div>
  )
}
