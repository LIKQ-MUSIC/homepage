'use client'

import { useCallback, useEffect, useState } from 'react'
import { LINES, SIGN_OFF } from './lines'

/**
 * A letter that arrives one line at a time, paced by whoever is reading it.
 *
 * The whole screen is the control. Not a button in a corner: this is read on a
 * phone held close, probably one-handed, probably while the person who made it
 * is watching. Anything that has to be aimed at would break that.
 *
 * Lines accumulate rather than replace, and the older ones dim as new ones
 * arrive. Replacing would make each line a separate card; accumulating makes
 * the last line land on top of everything already said, which is the whole
 * point of a last line.
 */
export function Letter() {
  const [shown, setShown] = useState(1)
  const done = shown >= LINES.length

  const advance = useCallback(() => {
    setShown((n) => (n < LINES.length ? n + 1 : n))
  }, [])

  // Keyboard and screen-reader users get the same pacing. Space and Enter are
  // what a button would answer to, so the region answers to them too.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance])

  return (
    <main
      onClick={done ? undefined : advance}
      role={done ? undefined : 'button'}
      tabIndex={done ? undefined : 0}
      aria-label={done ? undefined : 'แตะเพื่ออ่านบรรทัดต่อไป'}
      className={`bibi-stage ${done ? '' : 'cursor-pointer'}`}
    >
      {/* Warmth behind the words. Two slow blooms rather than particles: a
          phone screen in a dark room is the light source here, and it should
          feel like one lamp, not weather. */}
      <div className="bibi-glow bibi-glow-a" aria-hidden />
      <div className="bibi-glow bibi-glow-b" aria-hidden />

      <div className="bibi-sheet">
        {LINES.slice(0, shown).map((line, i) => {
          const isLast = i === LINES.length - 1
          const isNewest = i === shown - 1
          return (
            <p
              key={i}
              className={[
                'bibi-line',
                isLast ? 'bibi-line-final' : '',
                // Everything but the newest line steps back, so the eye always
                // knows where the letter is up to.
                isNewest ? '' : 'bibi-line-past',
              ].join(' ')}
            >
              {line}
            </p>
          )
        })}

        {done && SIGN_OFF ? <p className="bibi-signoff">{SIGN_OFF}</p> : null}
      </div>

      {/* One quiet instruction, and only while it is still true. */}
      <p className={`bibi-hint ${done ? 'bibi-hint-gone' : ''}`} aria-hidden>
        แตะ
      </p>

      {done ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShown(1)
          }}
          className="bibi-replay"
        >
          อ่านอีกครั้ง
        </button>
      ) : null}
    </main>
  )
}
