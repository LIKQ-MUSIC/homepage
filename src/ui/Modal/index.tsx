'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
  /** Accessible name when no visible title is passed. */
  label?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  label
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Remember what opened the dialog so focus can go back there on close.
  useEffect(() => {
    if (!isOpen) return
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
    return () => restoreFocusRef.current?.focus?.()
  }, [isOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      // Keep Tab inside the dialog; without this the focus ring walks out
      // into the page behind the overlay and is never seen again.
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!nodes || nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose]
  )

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-likq-ink/70 p-4 backdrop-blur-sm transition-all duration-300"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || label || 'รายละเอียด'}
        className={cn(
          'animate-modal relative w-full max-w-6xl overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_90px_-30px_rgba(16,6,159,0.6)]',
          className
        )}
      >
        <div className="absolute right-0 top-0 z-10 p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="rounded-full bg-white/80 p-1.5 text-likq-ink transition-colors hover:bg-likq-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-likq-ink"
          >
            <X size={20} />
          </button>
        </div>

        <div className="custom-scrollbar max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
