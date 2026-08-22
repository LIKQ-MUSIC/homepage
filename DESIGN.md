---
name: LIKQ Music Homepage
description: One continuous beam of light that splits at a prism into two audience lanes.
colors:
  ink: "#10069F"
  navy: "#2242DA"
  navy-deep: "#1A34B4"
  lavender: "#C075E4"
  lavender-pale: "#F2E9FB"
  obsidian: "#3B353C"
  paper: "#FAF8FF"
  beam1: "#10069F"
  beam2: "#2242DA"
  beam3: "#5766E0"
  beam4: "#9B6BE8"
  beam5: "#C075E4"
  beam6: "#E0C4F2"
  genre-gold: "#F7C46B"
  genre-mint: "#D9EBE7"
  genre-rose: "#F8CACA"
  genre-obsidian: "#3B353C"
  legacy-primary: "#153051"
  legacy-secondary: "#BEADC4"
typography:
  display:
    fontFamily: "var(--font-nunito), var(--font-line-seed), system-ui, sans-serif"
    fontWeight: 200
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  display-mixed:
    fontFamily: "var(--font-nunito), var(--font-line-seed), system-ui, sans-serif"
    fontWeight: 300
    lineHeight: 1.14
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "var(--font-line-seed), 'Noto Sans Thai', system-ui, sans-serif"
    fontWeight: 400
    fontSize: "clamp(2rem, 5.2vw, 3.75rem)"
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "var(--font-line-seed), 'Noto Sans Thai', system-ui, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.85
  body:
    fontFamily: "var(--font-line-seed), 'Noto Sans Thai', system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.85
rounded:
  full: "9999px"
  hero: "2.5rem"
  panel: "2rem"
  panel-sm: "1.75rem"
  card: "1.5rem"
spacing:
  station-block: "clamp(4.5rem, 11vw, 9rem)"
  station-inline: "1.25rem"
  station-inline-md: "3rem"
  station-max: "72rem"
  grid-gap: "1.5rem"
components:
  panel-ink:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
    rounded: "{rounded.panel}"
    padding: "2rem"
  panel-lavender:
    backgroundColor: "#E7D4F7"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel-sm}"
    padding: "1.75rem"
  cta-solid-on-dark:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "1rem 2rem"
  cta-outline-on-dark:
    backgroundColor: "transparent"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "0.875rem 2rem"
  filter-chip-active:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.5rem"
  filter-chip-idle:
    backgroundColor: "rgba(255,255,255,0.15)"
    textColor: "rgba(255,255,255,0.9)"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.5rem"
  status-badge:
    backgroundColor: "{colors.beam6}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0.375rem 1rem"
  genre-badge:
    backgroundColor: "{colors.genre-rose}"
    textColor: "{colors.obsidian}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
---

# Design System: LIKQ Music Homepage

> Scanned from the shipped code (`src/app/globals.css`, `tailwind.config.ts`,
> `src/components/home/*`, `src/app/page.tsx`). Where the code contradicts the
> intent, the code is recorded and the contradiction is named. Scope is `/`
> (the homepage and everything it renders). `/audition`, `/candidates`,
> `/blogs`, `/partner`, `/payment/*`, `/download/*` are **not** in this world;
> see "Scope and the token split".

## Overview

**Creative North Star: "The Beam"**

The page is not a stack of sections. It is one continuous field of light that
starts at its source — Pantone Blue 072 `#10069F`, the Foundation — passes
through a drawn prism where it splits into two audience paths, runs each path
down its own lane in its own colour, and finally lands on white paper where the
two rejoin. Content sits *in* the beam rather than on top of it. What separates
one passage from the next is space and a change in what the field is doing
behind it, never a rule, a border, or a header band.

The register is airy and confident. Weight is never the tool for emphasis at
display size — scale is, which is why the Latin display face runs at 200 and
300 and the Thai runs at 400. Density varies deliberately: the first work in
the grid runs double-wide, the trainee grid runs four-up, the audition call
takes a whole rounded panel to itself. Photography is held either in a circle
(the Q's counter, used as a lens) or in a generously rounded rectangle; there
is no third frame.

The confirmed anti-reference is the stacked-section brochure: equal-weight
blocks, tracked-uppercase eyebrows over every heading, section numbers, a
scrolling marquee, hairline dividers, gradient-filled text. The redesign
removed all of those and they do not come back.

**Key Characteristics:**
- One unbroken colour field, painted in segments that hand off to each other in content order
- Two text regimes, dark and pale, decided by which lane you are in
- Stations, not cards; panels, not borders
- The Q's counter used as a lens for single portraits
- A static film grain over the whole surface, and drawn four-point glints as the only sparkle
- Latin display in Nunito ExtraLight over Thai body in LINE Seed Sans TH

## Colors

The palette is the brand deck's (`LIKQ_AD-1.pdf`) read as a light spectrum:
a deep source, a bright foundation, a lavender glow, and paper where the light
lands.

### Primary
- **Bright Navy — "The Foundation"** (`#2242DA`): the brand's structural colour.
  Body-safe on white at 7.3:1. Used for panel grounds (`.panel-navy`), the
  drawn ring around the About lens, the closing display line on paper, and the
  nav's active pill when the bar is solid on a pale page.
- **Pantone Blue 072 C — "The Source"** (`#10069F`): the darkest stop and the
  page's default ink on pale ground (13.6:1 on white). It is the beam's origin
  colour, the ground of every `.panel-ink`, the tint of every shadow, and the
  only text colour permitted on a lavender field (4.5:1).

### Secondary
- **Lavender — "The Glow of Light"** (`#C075E4`): a **field and large-display**
  colour. 3.0:1 on white and 2.4:1 on navy, so it never carries body text
  anywhere. It appears as the beam's upper stops, as a bloom, as glint fill on
  dark panels, and as the lavender panel ground (which is mixed lighter,
  `#E7D4F7 → #D3B2EE`, precisely so ink clears AA on it).
- **Beam ramp** (`#10069F → #2242DA → #5766E0 → #9B6BE8 → #C075E4 → #E0C4F2`):
  the six stops the field travels through. `beam6` `#E0C4F2` is the *only*
  light tint sanctioned on a dark ground — the open-call badge, the service
  spine's lower half, work-title hover, and the shared button focus ring all
  use it.

### Tertiary
- **Genre and mood palette**: Sunset Gold `#F7C46B` (Inspiration & Folk), Hint
  of Mint `#D9EBE7` (Electronic & Innovation), Rose Quartz `#F8CACA` (Romance
  & Fan Song), Obsidian Grey `#3B353C` (Underground & Rock). Used as a
  *categorical* scale, never as decoration: the work-category badges map
  rose/gold/mint to video/event/link, and the quiz panel takes rose as a full
  ground. All three light genre tones are grounds carrying obsidian text, so a
  badge stays legible over any artwork without a scrim.

### Neutral
- **Obsidian** (`#3B353C`): the default text colour of `.likq` and the body
  colour on pale lanes. 11.9:1 on white.
- **Paper** (`#FAF8FF`) and pure white: the landing. `.likq` itself is white;
  the field is painted by the segment wrappers above it.
- **Lavender Pale** (`#F2E9FB`): image placeholder ground and the nav pill's
  hover state on transparent.

### Named Rules

**The Two Regimes Rule.** Every passage belongs to exactly one text regime, and
the regime is a property of the lane, not of the component. Dark lanes
(`.beam-source`, `.beam-lane-make`, and any `.panel-ink` island) take white and
dimmed white. Pale lanes (`.beam-lane-label`, `.beam-landing`, and any
`.panel-lavender` island) take ink `#10069F` for headings and links and
obsidian `#3B353C` for body. Never mix the two on one ground. Audit test: pick
any text node and name its lane — if you cannot, the layout is wrong, not the
colour.

**The Turn Is Silent Rule.** `.beam-turn` is `aria-hidden`, `min-height: 26vh`,
and carries no content at all. It is the only stretch of field that crosses the
band from `#4453D9` through `#C075E4` where *neither* white nor ink holds
4.5:1. Putting text there is the single most likely way to break this system.
Anything that needs to be read goes above or below it.

**The Lavender Is Not Ink Rule.** Lavender is a light, not a letter. It may fill,
bloom, ring, glint, and set display type on white at 3.0:1-tolerant sizes. It
may never be body text, and it may never sit on navy (2.4:1). When a dark
passage needs a light accent, use `beam6` `#E0C4F2`.

**The Dim Floor Rule (partially held).** Dimmed white on a dark ground is
written as no lighter than `/85`. The new home components hold this for
headings and ledes; two of them sit at `/80` (`ShopStation` body copy,
`Ignition`'s scroll cue, which recovers to full white on hover and focus). The
older sections re-skinned into the lanes do **not** hold it —
`SeasonalDropSection` runs `text-white/70` twenty-one times, `Works` sets its
lede at `/80`, `Footer` runs `/80`–`/90`. New work should hold `/85`; the
existing `/70`s are known debt, not precedent.

## Typography

**Display Font:** Nunito (variable 200–1000), Latin only
**Body Font:** LINE Seed Sans TH (self-hosted WOFF2, weights 300/400/700/800/900)
**Fallback chain:** Nunito → LINE Seed → system-ui; LINE Seed → Noto Sans Thai → system-ui

**Character:** A very light geometric Latin over a warm, even-colour Thai
grotesque. The pairing is airy and label-grade rather than editorial: the Latin
supplies scale and the Thai supplies rhythm. Line-height is generous
everywhere Thai appears (1.85) because Thai stacks marks above and below the
baseline and tight leading collides them.

### Hierarchy
- **Display lockup** (`.display-lockup`, Nunito 200, `line-height: 0.94`,
  `letter-spacing: -0.02em`): Latin-only lockups. It carries **no size of its
  own** — the caller supplies a clamp. The observed ladder is the wordmark
  `clamp(3rem, 29vw, 18rem)`, AUDITION `clamp(3rem, 10vw, 7.5rem)`, the closing
  line `clamp(2.25rem, 7vw, 5.5rem)`, the prism paths `clamp(2rem, 4.4vw,
  3.25rem)`, the service chain `clamp(1.75rem, 4.6vw, 3.25rem)`, the colour
  story `clamp(1.75rem, 3.4vw, 2.5rem)`, applied-work titles `clamp(1.5rem,
  3.2vw, 2.25rem)`, and the tagline `clamp(1.1rem, 3.2vw, 1.9rem)` with
  `tracking-[0.2em]`.
- **Display mixed** (`.display-mixed`, Nunito 300, `line-height: 1.14`): the
  sanctioned class for a display line that contains Thai. **Defined but
  currently unused** — every shipped display line is Latin-only. Use it rather
  than reaching for `.display-lockup` when Thai enters the line.
- **Station title** (`.station-title`, LINE Seed 400, `clamp(2rem, 5.2vw,
  3.75rem)`, `line-height: 1.18`, `text-wrap: balance`): every `<h2>` that opens
  a station, and the one `<h3>` that opens the colour story. Nine uses.
- **Station lede** (`.station-lede`, LINE Seed 400, 1rem → 1.125rem at 768px,
  `line-height: 1.85`, `max-width: 34rem`): the one-line answer under a station
  title. Four uses.
- **Body** (`.copy-th`, LINE Seed 400, `line-height: 1.85`): all Thai and all
  mixed running copy, plus nav links, chips, badges, and button labels.
  Forty-four uses — this is the workhorse class of the page.

### Named Rules

**The 200-Is-Latin-Only Rule.** Nunito reaches weight 200; LINE Seed Sans TH's
lightest cut is Thin **300**. A mixed Thai/Latin line set at 200 therefore
renders the Latin visibly lighter than the Thai and the line loses its colour.
So: `.display-lockup` (200) for Latin-only lockups, `.display-mixed` (300) the
moment Thai enters the line.

**The No-Eyebrow Rule.** A station opens with its title. There is no kicker,
no tracked-uppercase label, no number, and no rule above it. If a heading needs
context, the context is a `.station-lede` *below* it.

**The Emphasis-Is-Weight Rule.** On the dark lanes, emphasis inside body copy is
`font-bold` on the same colour, never a lavender tint — every lavender lands
under 4.5:1 at body size. `AboutStation` documents this in place.

## Layout

**The station is the only layout unit.** `.station` is a position in the beam,
not a box: `position: relative; z-index: 1`, inline padding `1.25rem` (`3rem`
from 768px), block padding `clamp(4.5rem, 11vw, 9rem)`, and
`scroll-margin-top: 7rem` so an anchor jump clears the fixed nav bar. It has no
background, no border, and no maximum width of its own. `.station-inner` does
the measuring: `max-width: 72rem`, auto margins.

**The field is segmented by content order, not page percentage.** `page.tsx`
wraps groups of stations in `.beam-source`, `.beam-lane-make`, `.beam-turn`,
`.beam-lane-label`, `.beam-landing`. Each segment's gradient **starts on the
colour the previous one ended**, so the field reads as one unbroken travel no
matter how much any single station grows. This is the load-bearing reason for
the segmentation: a single page-height gradient would let a station that grows
(more works, more trainees, more blog posts) drift onto a ground that no longer
matches its text regime. With segments, a station's ground is guaranteed by its
lane membership. **Adding a section means putting it inside the right lane
wrapper — not styling its own background.**

The assembly as shipped:

| Segment | Field | Regime | Contains |
|---|---|---|---|
| `.beam-source` | `#10069F → #2338CC` + lavender/blue bloom | dark | `Ignition`, `Prism` |
| `.beam-lane-make` | `#2338CC → #3646D6 → #4453D9` | dark | `MakeStation`, `Works`, `AboutStation` |
| `.beam-turn` | `#4453D9 → #9B6BE8 → #C075E4 → #EFE3FA` | none | nothing (`aria-hidden`, 26vh) |
| `.beam-lane-label` | `#EFE3FA → #F6F0FD` | pale | `ArtistStation`, `ShopStation`, `SeasonalDropSection`, `BlogSection`, `AuditionStation` |
| `.beam-landing` | `#F6F0FD → #FFFFFF` | pale | `HomeClose`, `Team` |
| (outside the beam) | `.panel-ink` | dark | `Footer` |

**Grids.** All gaps are on a 1.5rem base (`gap-6`), stretching to `gap-y-12`/
`gap-y-14` where a grid needs to breathe vertically. Observed shapes: two-up
(`md:grid-cols-2`) for prism paths, applied work, destinations and the colour
story; three-up (`lg:grid-cols-3`) for works with the first item spanning two
columns; four-up (`lg:grid-cols-4`) for trainees; a 7/5 split on a 12-column
grid for About; and a centred `flex-wrap` for the team so a short last row sits
balanced instead of stranded left.

**Breakpoints.** Tailwind defaults, used as: `sm` 640 (two-up starts for
trainees and applied work), `md` 768 (the main desktop switch — station gutters,
type step-ups, most grids), `lg` 1024 (nav switches from hamburger to inline
links; works go three-up), `xl` 1280 (nav socials appear, so the 1024–1280
range never overflows).

**Navigation chrome.** The bar is `fixed`, full width, `z-50`, and transitions
over 300ms. On the homepage it is passed `tone="dark"`: transparent with
`py-4` until scrolled past `#prism`'s offset minus 140px, then
`bg-likq-ink/90` with `backdrop-blur-md` and `py-2`. Because the homepage
passes `dark`, `NavbarLinks` receives `isScrolled={false}` permanently there —
only the bar's ground changes, the links stay in their white-on-transparent
treatment throughout. That is deliberate (white links stay legible on the
`likq-ink/90` bar) but it means the "scrolled" link styles in `NavbarLinks`
only ever render on pale pages like `/partner`.

## Elevation & Depth

Depth is **light and atmosphere, not stacked planes**. There is no elevation
scale and no neutral shadow anywhere in the beam. Three devices carry depth:

1. **The field itself.** A gradient plus a two-lobe radial bloom on
   `.beam-source` (lavender at 74%/12%, a cooler blue at 12%/30%, both held
   under 0.4 alpha so the Foundation still reads navy, not violet).
2. **A fixed film grain.** `.likq::after` is a `position: fixed`, full-viewport
   SVG `feTurbulence` tile (220px, `baseFrequency 0.82`, desaturated) at
   `opacity: 0.22`, `mix-blend-mode: overlay`, `z-index: 2`. It is **static by
   design** — moving grain reads as video noise and repaints every frame. Fixed
   and blended so it grips the saturated top without fogging the white close.
   Because it sits at `z-index: 2` above `.station`'s `z-index: 1`, it grains
   the content too; the nav (`z-50`) and portalled modals sit above it.
3. **Ink-tinted shadows with a large negative spread.** Every shadow is
   `#10069F` at low alpha, wide and soft, so a lifted surface looks like it is
   blocking the beam rather than sitting on a grey desk.

### Shadow Vocabulary
- **Panel lift** (`0 24px 60px -24px rgba(16,6,159,0.55)` on the prism paths;
  `-28px / 0.45` on the destinations): hover only, paired with `-translate-y-1`.
- **Lens drop** (`0 18px 50px -22px rgba(6,3,60,0.85)` on the About lens;
  `0 16px 40px -24px rgba(16,6,159,0.55)` on staff portraits): at rest, so the
  circle floats off the frame it overlaps.
- **Card rest** (`0 10px 36px -20px rgba(16,6,159,0.4)`): white blog cards on a
  pale field — the only rest-state shadow on a card, needed because white on
  `#F6F0FD` has almost no edge.
- **Bar and menu** (`0 10px 30px -18px rgba(16,6,159,0.9)`, mobile menu
  `0 24px 60px -20px … 0.85`): the fixed nav once it goes solid.
- **Modal** (`0 40px 90px -30px rgba(16,6,159,0.6)`): the one true overlay.
- **Off-system:** `SeasonalDropSection`'s panel uses
  `0 30px 70px -30px rgba(0,0,0,0.85)` — pure black, not ink. Known drift.

### Named Rules

**The Ring, Not The Border Rule.** Where a surface needs an edge, it gets a ring
of light, not a stroke: `ring-1 ring-inset ring-white/15` on the navy prism
panel, `ring-1 ring-white/35` on the service-spine nodes, `ring-[6px]
ring-likq-navy` around the About lens, and a raw `box-shadow: 0 0 0 2px
<accent>` around each trainee portrait. Real `border` is reserved for form
fields and outline buttons.

**The Lift Is Two Sizes Rule.** Hover lift is `-translate-y-1` (4px) for panels
and cards and `-translate-y-0.5` (2px) for pill CTAs, both over 500ms/300ms
`ease-out`, and both cancelled under `motion-reduce`. There is no third amount.

## Shapes

The form language is **circles and very soft rectangles**. Nothing on the page
has a sharp corner except the drawn prism triangle.

**Radius ladder** (the only values in the beam): `2.5rem` for a full-bleed hero
panel (audition call, seasonal drop), `2rem` for the primary two-up panels
(prism paths, destinations, the colour-story pair), `1.75rem` for a secondary
panel or a photo frame (applied work, the About group shot, the modal),
`1.5rem` for a grid card (work items, blog cards), and `rounded-full` for every
pill, chip, badge, node, and social button. `SeasonalDropSection` sits off this
ladder with `rounded-[28px]`, `rounded-2xl` and `rounded-xl`; treat it as
inherited, not as a pattern.

**The Q as a lens.** `.q-aperture` is the deck's own device: a `border-radius:
9999px` clip with `overflow: hidden` whose direct `<video>`/`<img>` child is
forced to `width/height: 100%; object-fit: cover`. It **sets no `position`** —
callers pass `relative` or `absolute` themselves. (This is deliberate; see the
layer note in Do's and Don'ts. `Ignition` passes `absolute inset-0`, everything
else passes `relative`.)

**The Q-Is-For-One-Face Rule.** The lens is for the wordmark and for **single
portraits** — the trainee grid, staff photos, the small studio shot. It was
tried on the wide group photo and cropped the subjects out of their own picture,
so group and landscape photography uses a `rounded-[1.75rem]` rectangle
instead, with the lens overlapping its lower-right corner at 44–52% width. Two
frames, and the choice is made by what is in the picture.

**Drawn geometry.** The prism is a stroked triangle (`stroke-width: 1.6`,
`stroke-linejoin: round`) with two gradient wedges beneath it whose ends land
over the inner halves of the two panels below — the light points at the thing
it is about. The Q's tail is a single `stroke-width: 6`, round-capped path from
inside the counter across the rim; it starts inside so the mark reads as a Q
and not as a magnifying glass.

## Components

### Marks (the authored icon set)
`src/components/home/marks.tsx` is the page's one drawing hand: a shared base of
`viewBox 0 0 24 24`, `fill: none`, `stroke: currentColor`, **`stroke-width:
1.25`**, round caps and round joins. Twelve marks: `MarkPen`, `MarkVoice`,
`MarkArrange`, `MarkMix`, `MarkBroadcast`, `MarkGift`, `MarkBag`, `MarkQuiz`,
`MarkArrow`, `MarkDescend`, and `Glint` — the deck's four-point spark, the one
solid-filled mark, "because a spark has no outline". Sizes in use: `h-5 w-5`
inline with text, `h-7 w-7`/`h-8 w-8` as a panel's opening mark, `h-4`–`h-7`
for glints. **Inconsistency to know:** the beam still renders three other icon
hands — `lucide-react` in `CategoriesBadge` and `Modal`, `react-icons` (`Si`)
for Instagram/TikTok on trainee cards, and inline `stroke-width: 2` SVGs inside
`SeasonalDropSection`. New work draws in `marks.tsx`.

### Panels
Character: a ground with a text regime attached, never a bordered box.
- **`.panel-ink`** — `linear-gradient(155deg, #10069F, #1A34B4)`, white text.
  Six uses: the prism's client path, both `ShopStation`/`AuditionStation`
  islands, the colour-story navy half, the seasonal drop, and the footer.
- **`.panel-lavender`** — `linear-gradient(155deg, #E7D4F7, #D3B2EE)`, ink text.
  Three uses: the prism's label path, the two applied-work panels, the
  colour-story lavender half.
- **`.panel-navy`** (`#2242DA → #1A34B4`, white) and **`.panel-paper`** (white,
  obsidian) are defined and currently **unused**. They are valid; nothing has
  needed them yet.
- All four set only ground and text colour. Radius, padding and shadow come
  from the caller, off the ladder above.

### Prism paths (the page's primary action pair)
The two largest interactive surfaces on the page and sized to say so:
`min-h-[17rem]` (`20rem` at md), `rounded-[2rem]`, `p-8`/`md:p-11`, one
`.panel-ink` and one `.panel-lavender`. Each holds a `.display-lockup` English
line, a bold Thai line, a Thai body paragraph, and a bottom-anchored action with
a `MarkArrow` that slides `translate-x-1.5` on group hover. Hover:
`-translate-y-1` plus the panel-lift shadow over 500ms `ease-out`. Focus:
`outline-2 outline-offset-4 outline-white`.

### Pill CTAs
- **Solid on dark** — `bg-white text-likq-ink`, `rounded-full`, `px-8 py-4`
  (`px-10 py-4 text-lg` for the audition call), bold, with a trailing
  `MarkArrow`. Hover `-translate-y-0.5` over 300ms. Focus `outline-2
  outline-offset-4 outline-white`.
- **Outline on dark** — `border border-white/45`, `px-8 py-3.5`, white text;
  hover fills to `bg-white text-likq-ink` over 300ms.
- **Quiet link on pale** — ink text, `underline-offset-8`, underline on hover
  only, with a `MarkArrow`. Used for "see all" affordances.
- The generic `<Button>` in `src/ui/Button` is **not** part of this vocabulary.
  It still resolves to the legacy `primary` `#153051`; the homepage uses it once
  (the footer submit, `variant="onDark"`), so that one button prints `#153051`
  text on white inside a `#10069F` panel. Its focus ring was moved to
  `ring-likq-beam6`, so it is a hybrid. Prefer a hand-built pill inside the
  beam.

### Chips, badges and filters
- **Filter chip** (`Works`): `rounded-full px-6 py-2`, active is `bg-white
  font-bold text-likq-ink`, idle is `bg-white/15 text-white/90` hovering to
  `/25`. Carries `aria-pressed`; the group carries `role="group"` and a Thai
  label.
- **Trait chip** (trainee cards): `bg-likq-ink/[0.09] text-likq-ink`,
  `text-[11px]`, `rounded-full px-2.5 py-0.5`. Max three shown.
- **Status badge** (open call): `bg-likq-beam6 text-likq-ink`, bold, with a
  1.5px ink dot. It sits *with* the heading as live status, not floating above
  it as a kicker.
- **Genre badge** (work category): a light genre ground with obsidian text,
  `rounded-full px-3 py-1`, absolutely positioned at `left-3 top-3` over the
  artwork.

### Portraits
- **Trainee** — `.q-aperture` square, `object-cover object-top`, a single 2px
  ring of the trainee's own accent (`box-shadow: 0 0 0 2px`), and `scale-[1.02]`
  on group hover over 700ms. The accents are the old Y2K theme colours
  (`#FF3AA5` / `#2DE8C3` / `#FFE14C`, falling back to lavender `#C075E4`) —
  deliberately kept as the trainee's personal identity light and nothing more.
- **Staff** — `.q-aperture`, `h-52 w-52`, lens drop shadow, bold ink name,
  obsidian/80 role.

### Work item
`rounded-[1.5rem]`, ground `bg-white/[0.06]` so it reads as a slightly denser
patch of field rather than a card. `aspect-[16/9]`, or `md:aspect-[2/1]` when
`wide` (the first item, which also spans two columns). Image scales `1.04` on
hover over 700ms; a lavender radial "rim of light"
(`rgba(192,117,228,0.55)` from 50%/110%) fades in over 500ms — a soft rim on
hover, not a border that is always on. Title goes `beam6` on hover.

### Blog card
The one white card in the system: `rounded-[1.5rem] bg-white` with the card-rest
shadow, on the pale lane. Image `aspect-video` over a `lavender-pale`
placeholder; if there is no thumbnail, the first character is set in
`.display-lockup` at `text-6xl text-white/40` over a `navy → lavender` gradient.

### Contact form (footer)
Inside `.panel-ink`. Fields are `bg-white/10` with `border border-white/55`,
`rounded-lg px-4 py-3`, white text, `placeholder-white/75`, and focus
`outline-2 outline-offset-2 outline-white`. Labels are `sr-only` with visible
placeholders. Success and error states are tinted `green-500/20` and
`red-500/20` blocks — the only two colours on the homepage that come from
neither the brand nor the genre palette.

### Modal
Portalled to `document.body`, so it is **above the grain**. Overlay
`bg-likq-ink/70` with `backdrop-blur-sm`; panel `rounded-[1.75rem] bg-white`,
`max-w-6xl`, `max-h-[90vh]` with the custom scrollbar; close button is a
`rounded-full bg-white/80` ink icon that inverts to ink-on-white on hover.

### Motion
- **The one authored moment** is the load: `animate-ignite` (1.6s, from
  `scale(1.35) blur(28px)`) on the "Lik", and `animate-aperture-open` (1.4s,
  `clip-path: circle(0% → 50%)`) on the Q's lens. Both use
  `cubic-bezier(0.16, 1, 0.3, 1)`. Everything after that is the light
  travelling, not another entrance.
- **Ambient:** `animate-glint` (4s, `ease-in-out`, infinite) on the four-point
  sparks, always with a per-instance `animationDelay` so two sparks never pulse
  in lockstep.
- **Durations:** 300ms for colour, 500ms for transform and shadow, 700ms for
  image scale. Easing is `ease-out` for interaction;
  `cubic-bezier(0.22, 1, 0.36, 1)` for `rise-in`.
- **Reduced motion is handled twice, on purpose.** The CSS block in
  `globals.css` forces `animate-aperture-open`/`animate-ignite` to their
  finished state (including `clip-path: circle(50%)`, because the class starts
  at `opacity: 0` and merely pausing it would ship a blank hero) and pins
  `animate-glint` at `opacity: 0.6`. Separately, `Ignition` watches
  `matchMedia('(prefers-reduced-motion: reduce)')` and swaps the `<video>` for
  the poster `<Image>` entirely. Every hover transform carries
  `motion-reduce:transition-none motion-reduce:hover:translate-y-0`.
  (`--beam-shift` is set to `0%` in that block but is not read anywhere — dead
  leftover, harmless.)

## Do's and Don'ts

### Do:
- **Do** put a new section inside one of the five lane wrappers in `page.tsx`
  and give it `className="station"` + an inner `.station-inner`. Its ground is
  then guaranteed by its lane, and the field stays continuous however much the
  section grows.
- **Do** pick the text regime from the lane: white and `/85` dimmed white on
  `.beam-source`/`.beam-lane-make`/`.panel-ink`; `#10069F` for headings and
  links and `#3B353C` for body on `.beam-lane-label`/`.beam-landing`/
  `.panel-lavender`.
- **Do** put any new class in `src/app/globals.css` **inside
  `@layer components`**. Unlayered CSS in this file is emitted after
  `@tailwind utilities` and silently outranks every utility. This actually
  broke the build twice: `.q-aperture { position: relative }` beat `absolute`
  in the hero, and `.copy-th { font-weight: 400 }` killed every `font-bold` on
  the page. Inside the layer, utilities win as expected.
- **Do** let callers own position, size, radius and padding. `.q-aperture` sets
  no `position` for exactly this reason; `.panel-*` set only ground and text
  colour; `.display-lockup` sets no font-size.
- **Do** use `.display-mixed` (Nunito 300) the moment Thai appears on a display
  line, and reserve `.display-lockup` (200) for Latin-only lockups.
- **Do** reach for `beam6` `#E0C4F2` when a dark passage needs a light accent,
  and for `#10069F` when a lavender field needs text.
- **Do** draw new icons in `src/components/home/marks.tsx` at `stroke-width:
  1.25` with round caps in a 24px box.
- **Do** hold single portraits in `.q-aperture` and everything wide in a
  `rounded-[1.75rem]` rectangle.
- **Do** guard every hover transform with `motion-reduce:transition-none
  motion-reduce:hover:translate-y-0`, and force any `opacity: 0` entrance class
  to its finished state under `prefers-reduced-motion`, never merely pause it.

### Don't:
- **Don't** put text — or anything readable — inside `.beam-turn`. It is
  `aria-hidden` and text-free because it is the only stretch where neither
  white nor ink clears 4.5:1.
- **Don't** use lavender `#C075E4` for body text, or on a navy ground at all
  (3.0:1 and 2.4:1 respectively).
- **Don't** add an eyebrow, kicker, tracked-uppercase label, or section number
  above a heading. A station opens with its title.
- **Don't** add a marquee, a hairline section rule, a gradient-filled text
  effect, or a unicode glyph standing in for an icon.
- **Don't** give a station its own background colour. Backgrounds belong to the
  lane wrapper; a station that paints its own ground breaks the beam.
- **Don't** put the Q lens on a group or landscape photo — it crops the subjects
  out. That is the whole reason the rectangle frame exists.
- **Don't** reach for `src/ui/Button`, the `primary`/`secondary`/`ink.*` tokens,
  or the `y2k.*` tokens inside the beam. Build the pill by hand from the
  vocabulary above.
- **Don't** introduce a neutral or black shadow. Every shadow in this world is
  `#10069F` at low alpha with a large negative spread.
- **Don't** animate the grain, and don't add a second entrance animation. The
  ignition and the aperture are the page's one authored moment.

---

## Scope and the token split

`tailwind.config.ts` deliberately carries three generations of tokens at once.
Only the first belongs to this document.

| Token group | Status | Used by |
|---|---|---|
| `likq.*` (navy, lavender, ink, obsidian, paper, `beam1`–`beam6`) | **Current.** The beam world. | `/` and everything it renders, plus `ui/Modal` and `ui/Button`'s focus ring |
| `genre.*` (gold, mint, rose, obsidian) | **Current.** Categorical scale only. | Work-category badges; the quiz panel ground. `genre.obsidian` is defined but unused — it duplicates `likq.obsidian`. |
| `primary` / `secondary` / `danger` / `warning` / `success` / `disabled` / `ink.*` | **Legacy, still live.** `#153051` / `#BEADC4`. | `ui/Button` variants, `ui/Input`, `ui/Select`, the shared `.text-*`/`.bg-*`/`.input-base` utilities, `/blogs`, `/partner`, `/artists`, `/core`, `/note`, contracts and quotations |
| `y2k.*` (`#3B1EFF`, `#FF3AA5`, `#2DE8C3`, `#FFE14C`, `#FFF6E6`, `#0D0A2C`) | **A separate, intact world.** | `/audition` and `/candidates` (`.theme-y2k` scope in `globals.css`). Deliberately untouched by the redesign. Its three accent hues survive in the beam only as the 2px identity ring on a trainee portrait. |

`/audition` keeps the Y2K set on purpose — do not "harmonise" it.
`/payment/*` and `/download/*` inherit the shared token layer and were not
redesigned. Removing the legacy groups would break those routes; they stay
until each route is brought over on its own.
