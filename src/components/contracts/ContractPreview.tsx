'use client'

import React, {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  useCallback
} from 'react'
import { formatDateThaiLong } from '@/utils/date'

interface ContractPreviewProps {
  content: string
  contractNumber: string
  title?: string
  contentRef?: React.RefObject<HTMLDivElement>
  parties?: Array<{
    legal_name: string
    role: string
    signed_date?: string
    sign_label?: string
    signature_url?: string
  }>
  isActive?: boolean // New prop to trigger measurement when tab becomes active
}

export default function ContractPreview({
  content,
  contractNumber,
  title,
  contentRef,
  parties = [],
  isActive = true
}: ContractPreviewProps) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [paginatedPages, setPaginatedPages] = useState<
    { content: string; hasSignature: boolean }[]
  >([])
  const [isReady, setIsReady] = useState(false)
  const [todayISO, setTodayISO] = useState('')

  // A4 dimensions in pixels (approx. 210mm x 297mm at 96dpi)
  const A4_HEIGHT_PX = 1123
  const PADDING_PX = 75.6 // 20mm
  const USABLE_HEIGHT_PX = A4_HEIGHT_PX - 2 * PADDING_PX

  const findPartyByRole = (role: string) => {
    // 1. Try exact match (Thai or English)
    const exact = parties.find(party => party.role === role)
    if (exact) return exact

    // 2. Try loose match
    // If we are looking for 'พยาน 1', try finding 'witness_1' or 'Witness 1'
    if (role === 'พยาน 1') {
      return parties.find(p =>
        ['witness_1', 'witness 1', 'พยาน 1'].includes(p.role?.toLowerCase())
      )
    }
    if (role === 'พยาน 2') {
      return parties.find(p =>
        ['witness_2', 'witness 2', 'พยาน 2'].includes(p.role?.toLowerCase())
      )
    }
    if (role === 'ผู้ว่าจ้าง') {
      return parties.find(p =>
        ['party_a', 'employer', 'ผู้ว่าจ้าง'].includes(p.role?.toLowerCase())
      )
    }
    if (role === 'ผู้รับจ้าง') {
      return parties.find(p =>
        ['party_b', 'contractor', 'ผู้รับจ้าง'].includes(p.role?.toLowerCase())
      )
    }

    return undefined
  }

  useEffect(() => {
    setTodayISO(new Date().toISOString())
  }, [])

  // Measurement function - can be called manually
  const measureAndPaginate = useCallback(() => {
    if (!measureRef.current || !content || !content.trim()) {
      setPaginatedPages([])
      setIsReady(false)
      return
    }

    const container = measureRef.current

    const header = container.querySelector('#measure-header')
    const footer = container.querySelector('#measure-footer')

    const headerHeight = header?.getBoundingClientRect().height || 150
    const footerHeight = footer?.getBoundingClientRect().height || 50
    const signaturesHeight = 400

    const contentDiv = container.querySelector('#measure-content')
    if (!contentDiv) {
      setPaginatedPages([{ content, hasSignature: true }])
      setIsReady(true)
      return
    }

    const children = Array.from(contentDiv.children) as HTMLElement[]

    if (children.length === 0) {
      setPaginatedPages([{ content, hasSignature: true }])
      setIsReady(true)
      return
    }

    // Add extra buffer (60px) so page breaks happen before footer overlaps last content line
    const FOOTER_OVERLAP_BUFFER = 60
    const effectiveUsableHeight = USABLE_HEIGHT_PX - headerHeight - footerHeight - FOOTER_OVERLAP_BUFFER

    const newPages: { content: string; hasSignature: boolean }[] = []
    let currentPageContent = ''
    let currentHeight = 0

    children.forEach(child => {
      const rect = child.getBoundingClientRect()
      const style = window.getComputedStyle(child)
      const marginTop = parseFloat(style.marginTop) || 0
      const marginBottom = parseFloat(style.marginBottom) || 0
      const height = rect.height + marginTop + marginBottom

      if (currentHeight + height > effectiveUsableHeight) {
        if (currentPageContent) {
          newPages.push({ content: currentPageContent, hasSignature: false })
        }
        currentPageContent = child.outerHTML
        currentHeight = height
      } else {
        currentPageContent += child.outerHTML
        currentHeight += height
      }
    })

    if (currentHeight + signaturesHeight > effectiveUsableHeight) {
      if (currentPageContent) {
        newPages.push({ content: currentPageContent, hasSignature: false })
      }
      newPages.push({ content: '', hasSignature: true })
    } else {
      newPages.push({ content: currentPageContent, hasSignature: true })
    }

    setPaginatedPages(newPages)
    setIsReady(true)
  }, [content, USABLE_HEIGHT_PX])

  // Measure when content changes (with delay for DOM to update)
  useEffect(() => {
    if (!content || !content.trim()) {
      setPaginatedPages([])
      setIsReady(false)
      return
    }

    // Reset ready state when content changes
    setIsReady(false)

    const timer = setTimeout(() => {
      measureAndPaginate()
    }, 150)

    return () => clearTimeout(timer)
  }, [content, measureAndPaginate])

  // Re-measure when becoming active (tab switch)
  useEffect(() => {
    if (isActive && content && content.trim()) {
      // Small delay to ensure the container is visible and measurable
      const timer = setTimeout(() => {
        measureAndPaginate()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isActive, measureAndPaginate, content])

  return (
    <div
      className="w-full bg-zinc-800/50 p-8 rounded-lg border border-zinc-700"
      style={{
        maxHeight: 'calc(100vh - 300px)',
        overflowY: 'auto',
        overflowX: 'auto',
        position: 'relative'
      }}
    >
      {/* Measurement Container - Always rendered, always hidden but measurable */}
      <div
        ref={measureRef}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '210mm',
          padding: '20mm',
          boxSizing: 'border-box',
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <div
          id="measure-header"
          style={{
            marginBottom: '2rem',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ height: '3rem', width: '3rem' }}></div>
            <div>
              <h1 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                LiKQ MUSIC
              </h1>
              <p style={{ fontSize: '0.75rem' }}>Music Production</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              CONTRACT
            </h2>
            <p style={{ fontSize: '0.875rem' }}>Title</p>
            <p style={{ fontSize: '0.75rem' }}>Page 1 / 1</p>
          </div>
        </div>

        <div
          id="measure-content"
          className="prose-sm max-w-none font-sarabun text-[14pt] leading-normal text-black [&_p]:mb-2 [&_h1]:text-[20pt] [&_h1]:font-bold [&_h1]:!text-[#000000] [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-[18pt] [&_h2]:font-bold [&_h2]:!text-[#000000] [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-[16pt] [&_h3]:font-bold [&_h3]:!text-[#000000] [&_h3]:mt-2 [&_h3]:mb-1 [&_p:empty]:min-h-[1em] [&_p:empty]:mb-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div
          id="measure-footer"
          style={{
            padding: '2mm 20mm 15mm 20mm',
            borderTop: '1px solid #f3f4f6',
            textAlign: 'center',
            fontSize: '10px'
          }}
        >
          LiKQ MUSIC - Contract ID
        </div>
      </div>

      {/* Display States */}
      {!content || !content.trim() ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5rem 0'
          }}
        >
          <div className="text-zinc-400">No content to preview</div>
        </div>
      ) : !isReady ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5rem 0'
          }}
        >
          <div className="text-white animate-pulse">Processing Layout...</div>
        </div>
      ) : (
        <div ref={contentRef} style={{ display: 'block' }}>
          {paginatedPages.map((page, index) => {
            const isLastPage = index === paginatedPages.length - 1
            return (
              <div
                key={index}
                style={{
                  width: '210mm',
                  height: '297mm',
                  padding: '20mm',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                  position: 'relative',
                  pageBreakAfter: !isLastPage ? 'always' : 'auto',
                  marginBottom: '2rem'
                }}
              >
                {/* Header */}
                <div
                  style={{
                    marginBottom: '2rem',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    fontFamily: '"TH Sarabun New", sans-serif'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <img
                      src="/logo-hover.svg"
                      alt="LiKQ"
                      style={{ height: '3rem', width: 'auto' }}
                    />
                    <div>
                      <h1
                        style={{
                          fontWeight: 'bold',
                          fontSize: '1.25rem',
                          color: '#312e81',
                          margin: 0,
                          fontFamily: '"TH Sarabun New", sans-serif'
                        }}
                      >
                        LiKQ MUSIC
                      </h1>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          margin: 0,
                          fontFamily: '"TH Sarabun New", sans-serif'
                        }}
                      >
                        Music Production & Entertainment
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: 0,
                        fontFamily: '"TH Sarabun New", sans-serif'
                      }}
                    >
                      CONTRACT
                    </h2>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#4b5563',
                        margin: 0,
                        fontFamily: '"TH Sarabun New", sans-serif'
                      }}
                    >
                      สัญญาจ้าง
                    </p>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#312e81',
                        marginTop: '0.25rem',
                        fontFamily: '"TH Sarabun New", sans-serif'
                      }}
                    >
                      {contractNumber || 'DRAFT'}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '0.25rem',
                        fontFamily: '"TH Sarabun New", sans-serif'
                      }}
                    >
                      Page {index + 1} / {paginatedPages.length}
                    </p>
                  </div>
                </div>

                {/* Title section (Page 1 only) */}
                {index === 0 && (
                  <div
                    style={{
                      marginBottom: '2rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #f3f4f6',
                      paddingBottom: '1.5rem',
                      fontFamily: '"TH Sarabun New", sans-serif'
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: '#6b7280',
                          display: 'block',
                          fontFamily: '"TH Sarabun New", sans-serif'
                        }}
                      >
                        Title (เรื่อง):
                      </span>
                      <span
                        style={{
                          fontWeight: '600',
                          fontFamily: '"TH Sarabun New", sans-serif'
                        }}
                      >
                        {title || '-'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          color: '#6b7280',
                          display: 'block',
                          fontFamily: '"TH Sarabun New", sans-serif'
                        }}
                      >
                        Date (วันที่):
                      </span>
                      <span
                        style={{ fontFamily: '"TH Sarabun New", sans-serif' }}
                      >
                        {todayISO ? formatDateThaiLong(todayISO, '—') : '—'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose-sm max-w-none font-sarabun text-[14pt] leading-normal text-black [&_p]:mb-2 [&_h1]:text-[20pt] [&_h1]:font-bold [&_h1]:!text-[#000000] [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-[18pt] [&_h2]:font-bold [&_h2]:!text-[#000000] [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-[16pt] [&_h3]:font-bold [&_h3]:!text-[#000000] [&_h3]:mt-2 [&_h3]:mb-1 [&_p:empty]:min-h-[1em] [&_p:empty]:mb-2"
                  style={{
                    flexGrow: 1
                  }}
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />

                {/* Signatures */}
                {page.hasSignature && (
                  <div
                    style={{
                      marginTop: page.content ? 'auto' : '1rem',
                      paddingTop: '2rem',
                      borderTop: '1px solid #e5e7eb',
                      paddingBottom: '3rem'
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        columnGap: '2rem',
                        rowGap: '3rem'
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            borderBottom: '1px solid #9ca3af',
                            width: '75%',
                            margin: '0 auto 0.5rem',
                            height: '3rem',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center'
                          }}
                        >
                          {findPartyByRole('ผู้ว่าจ้าง')?.signature_url && (
                            <img
                              src={findPartyByRole('ผู้ว่าจ้าง')?.signature_url}
                              alt="Signature"
                              style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                paddingBottom: '2px'
                              }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            margin: 0
                          }}
                        >
                          ผู้ว่าจ้าง (Employer)
                        </p>
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginTop: '0.25rem'
                          }}
                        >
                          ({' '}
                          {findPartyByRole('ผู้ว่าจ้าง')?.legal_name ||
                            '................................................'}{' '}
                          )
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          Date:{' '}
                          {formatDateThaiLong(
                            findPartyByRole('ผู้ว่าจ้าง')?.signed_date,
                            '..../..../....'
                          )}
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            borderBottom: '1px solid #9ca3af',
                            width: '75%',
                            margin: '0 auto 0.5rem',
                            height: '3rem',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center'
                          }}
                        >
                          {findPartyByRole('ผู้รับจ้าง')?.signature_url && (
                            <img
                              src={findPartyByRole('ผู้รับจ้าง')?.signature_url}
                              alt="Signature"
                              style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                paddingBottom: '2px'
                              }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            margin: 0
                          }}
                        >
                          ผู้รับจ้าง (Contractor)
                        </p>
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginTop: '0.25rem'
                          }}
                        >
                          ({' '}
                          {findPartyByRole('ผู้รับจ้าง')?.legal_name ||
                            '................................................'}{' '}
                          )
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          Date:{' '}
                          {formatDateThaiLong(
                            findPartyByRole('ผู้รับจ้าง')?.signed_date,
                            '..../..../....'
                          )}
                        </p>
                      </div>
                      {findPartyByRole('พยาน 1') && (
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              borderBottom: '1px solid #9ca3af',
                              width: '75%',
                              margin: '0 auto 0.5rem',
                              height: '3rem',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'center'
                            }}
                          >
                            {findPartyByRole('พยาน 1')?.signature_url && (
                              <img
                                src={findPartyByRole('พยาน 1')?.signature_url}
                                alt="Signature"
                                style={{
                                  maxHeight: '100%',
                                  maxWidth: '100%',
                                  objectFit: 'contain',
                                  paddingBottom: '2px'
                                }}
                              />
                            )}
                          </div>
                          <p
                            style={{
                              fontWeight: '600',
                              fontSize: '0.875rem',
                              margin: 0
                            }}
                          >
                            พยาน (Witness)
                          </p>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              marginTop: '0.25rem'
                            }}
                          >
                            ({' '}
                            {findPartyByRole('พยาน 1')?.legal_name ||
                              '................................................'}{' '}
                            )
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            Date:{' '}
                            {formatDateThaiLong(
                              findPartyByRole('พยาน 1')?.signed_date,
                              '..../..../....'
                            )}
                          </p>
                        </div>
                      )}
                      {findPartyByRole('พยาน 2') && (
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              borderBottom: '1px solid #9ca3af',
                              width: '75%',
                              margin: '0 auto 0.5rem',
                              height: '3rem',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'center'
                            }}
                          >
                            {findPartyByRole('พยาน 2')?.signature_url && (
                              <img
                                src={findPartyByRole('พยาน 2')?.signature_url}
                                alt="Signature"
                                style={{
                                  maxHeight: '100%',
                                  maxWidth: '100%',
                                  objectFit: 'contain',
                                  paddingBottom: '2px'
                                }}
                              />
                            )}
                          </div>
                          <p
                            style={{
                              fontWeight: '600',
                              fontSize: '0.875rem',
                              margin: 0
                            }}
                          >
                            พยาน (Witness)
                          </p>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              marginTop: '0.25rem'
                            }}
                          >
                            ({' '}
                            {findPartyByRole('พยาน 2')?.legal_name ||
                              '................................................'}{' '}
                            )
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            Date:{' '}
                            {formatDateThaiLong(
                              findPartyByRole('พยาน 2')?.signed_date,
                              '..../..../....'
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Page footer - Fixed at bottom of ALL pages */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2mm 20mm 15mm 20mm',
                    borderTop: '1px solid #f3f4f6',
                    textAlign: 'center',
                    fontSize: '10px',
                    color: '#9ca3af',
                    fontFamily: 'system-ui, sans-serif',
                    backgroundColor: 'white'
                  }}
                >
                  LiKQ MUSIC - Contract ID: {contractNumber}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
