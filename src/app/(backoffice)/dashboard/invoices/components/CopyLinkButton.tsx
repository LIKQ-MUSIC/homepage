'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyLinkButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const link = `${window.location.origin}/payment/${id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`p-1 transition-colors flex items-center gap-1 text-xs ${
        copied ? 'text-green-500 font-medium' : 'text-muted hover:text-primary'
      }`}
      title="คัดลอกลิงก์ชำระเงิน"
    >
      {copied ? (
        <>
          <Check size={16} /> คัดลอกเรียบร้อย
        </>
      ) : (
        <>
          <Copy size={16} /> คัดลอกลิงก์
        </>
      )}
    </button>
  )
}
