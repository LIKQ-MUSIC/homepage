import React from 'react'

/**
 * The record in the Q.
 *
 * Redrawn from the supplied artwork rather than shipped as-is: the original was
 * a 432KB Gravit export that approximated every groove with a several-hundred
 * point polyline, in flat black and pillarbox red. This is the same object as
 * real geometry — concentric <circle> strokes — at about 3KB, in the label's
 * own palette.
 *
 * The disc spins; the light does not. The sheen is a fixed overlay clipped to
 * the disc, so the record turns underneath a stationary highlight the way a
 * real one does on a deck. A sheen that rotates with the disc reads as a
 * spinning graphic; one that stays put reads as a spinning object.
 */

/** Groove field: dense near the rim, opening out toward the label. */
const GROOVES = Array.from({ length: 34 }, (_, i) => {
  const t = i / 33
  const r = 44 + t * 51 // 44 → 95
  // Vinyl land between tracks: a few rings read brighter than their neighbours.
  const isBand = i % 7 === 0
  return {
    r,
    opacity: isBand ? 0.22 : 0.05 + (1 - t) * 0.045,
    width: isBand ? 0.7 : 0.45
  }
})

const VinylDisc = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    role="img"
    aria-label="แผ่นเสียงของ LIKQ Music กำลังหมุน"
  >
    <defs>
      <radialGradient id="vinyl-body" cx="50%" cy="42%" r="62%">
        <stop offset="0%" stopColor="#191243" />
        <stop offset="55%" stopColor="#0B0826" />
        <stop offset="100%" stopColor="#04020F" />
      </radialGradient>
      <radialGradient id="vinyl-label" cx="38%" cy="32%" r="78%">
        <stop offset="0%" stopColor="#D9A6F0" />
        <stop offset="60%" stopColor="#C075E4" />
        <stop offset="100%" stopColor="#A557CE" />
      </radialGradient>
      {/* The beam, caught on the record. */}
      <linearGradient id="vinyl-sheen" x1="8%" y1="0%" x2="82%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="26%" stopColor="#ffffff" stopOpacity="0.16" />
        <stop offset="35%" stopColor="#E0C4F2" stopOpacity="0.3" />
        <stop offset="44%" stopColor="#ffffff" stopOpacity="0.06" />
        <stop offset="62%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="84%" stopColor="#C075E4" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <clipPath id="vinyl-clip">
        <circle cx="100" cy="100" r="99" />
      </clipPath>
    </defs>

    <g className="vinyl-spin">
      <circle cx="100" cy="100" r="99" fill="url(#vinyl-body)" />

      {GROOVES.map(({ r, opacity, width }) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#E4DBFF"
          strokeOpacity={opacity}
          strokeWidth={width}
        />
      ))}

      {/* Run-out groove, then the label. */}
      <circle
        cx="100"
        cy="100"
        r="41.5"
        fill="none"
        stroke="#E4DBFF"
        strokeOpacity="0.28"
        strokeWidth="0.6"
      />
      <circle cx="100" cy="100" r="39" fill="url(#vinyl-label)" />
      <circle
        cx="100"
        cy="100"
        r="39"
        fill="none"
        stroke="#10069F"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />

      {/* The label carries the wordmark, which is also what makes the rotation
          legible — a plain disc of concentric rings looks still when it spins. */}
      <path
        id="vinyl-label-arc"
        d="M 100 76 m -17 0 a 17 17 0 1 1 34 0"
        fill="none"
      />
      <text
        fill="#10069F"
        fontSize="10.5"
        letterSpacing="2.4"
        fontFamily="var(--font-nunito), system-ui, sans-serif"
        fontWeight="600"
      >
        <textPath href="#vinyl-label-arc" startOffset="50%" textAnchor="middle">
          LikQ
        </textPath>
      </text>
      {/* Spindle hole. */}
      <circle cx="100" cy="100" r="4.2" fill="#04020F" />
      <circle
        cx="100"
        cy="100"
        r="4.2"
        fill="none"
        stroke="#10069F"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
    </g>

    {/* Fixed light. Outside the spinning group on purpose. */}
    <g clipPath="url(#vinyl-clip)" style={{ pointerEvents: 'none' }}>
      <rect width="200" height="200" fill="url(#vinyl-sheen)" />
    </g>
  </svg>
)

export default VinylDisc
