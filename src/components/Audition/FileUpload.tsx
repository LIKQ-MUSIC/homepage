'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Upload, X, FileAudio } from 'lucide-react'

interface FileUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
}

export default function FileUpload({
  file,
  onFileChange,
  accept = 'audio/*',
}: FileUploadProps) {
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
      <div className="border border-primary/15 bg-primary/[0.02] rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileAudio size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-800 truncate">
            {file.name}
          </p>
          <p className="text-xs text-neutral-400">{formatSize(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={removeFile}
          className="w-8 h-8 rounded-full hover:bg-red-50 text-neutral-400 hover:text-danger flex items-center justify-center transition-colors"
          aria-label="Remove file"
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
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-neutral-200 hover:border-primary/30 hover:bg-primary/[0.02]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
      <Upload
        size={24}
        className={`mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-neutral-300'}`}
      />
      <p className="text-sm text-neutral-500">
        Drag & drop your audio file here, or{' '}
        <span className="text-primary font-medium">browse</span>
      </p>
      <p className="text-xs text-neutral-400 mt-1">MP3, WAV, M4A up to 50MB</p>
    </div>
  )
}
