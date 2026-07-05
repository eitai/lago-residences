/**
 * Procedural placeholder frame generator for the LAGO flythrough.
 *
 * Renders NUMBERED WebP frames (gradient sky→water + horizon + a growing
 * tower + facade floor-lines + lit dusk windows + a frame counter) into
 * public/seq/flythrough/, so the pinned scroll-scrub scene is fully built
 * and verifiable BEFORE the real AI video exists.
 *
 * The 3-beat palette mirrors the storyboard (PRD §4):
 *   approach (golden hour) → facade (glass daylight) → penthouse (dusk).
 *
 * When the real Kling take is extracted to the same folder/names, delete
 * these and set USE_DUMMY_FRAMES=false in src/lib/flythroughConfig.ts.
 *
 * Usage:  node scripts/gen-dummy-frames.mjs
 * Requires ffmpeg on PATH (drawtext-enabled build).
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'seq', 'flythrough')

const COUNT = 125 // keep in sync with DUMMY_FRAME_COUNT in flythroughConfig.ts
const W = 1280
const H = 720
const HORIZON = 430
const FONT_BOLD = "fontfile='C\\:/Windows/Fonts/arialbd.ttf'"
const FONT_REG = "fontfile='C\\:/Windows/Fonts/arial.ttf'"

/* ---- colour helpers ------------------------------------------------- */
const hex = (n) => n.toString(16).padStart(2, '0')
const toFF = ([r, g, b]) => `0x${hex(r)}${hex(g)}${hex(b)}`
const lerp = (a, b, t) => a + (b - a) * t
const mix = (c0, c1, t) => c0.map((v, i) => Math.round(lerp(v, c1[i], t)))

/** Palette keyframes: [t, sky, water]. */
const SKY = [
  [0.0, [240, 200, 137]], // warm gold
  [0.4, [200, 216, 224]], // glass daylight blue
  [0.7, [231, 161, 90]], // orange dusk onset
  [1.0, [74, 58, 99]], // deep purple dusk
]
const WATER = [
  [0.0, [46, 90, 95]],
  [0.4, [62, 112, 118]],
  [0.7, [36, 72, 77]],
  [1.0, [14, 34, 38]],
]

function sample(stops, t) {
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i]
    const [t1, c1] = stops[i + 1]
    if (t <= t1) return mix(c0, c1, (t - t0) / (t1 - t0))
  }
  return stops[stops.length - 1][1]
}

function beatLabel(t) {
  if (t < 0.4) return 'APPROACH'
  if (t < 0.7) return 'FACADE'
  return 'PENTHOUSE'
}

/* ---- per-frame filtergraph ----------------------------------------- */
function buildGradient(i) {
  const t = COUNT <= 1 ? 0 : i / (COUNT - 1)
  const sky = toFF(sample(SKY, t))
  const water = toFF(sample(WATER, t))
  return `gradients=s=${W}x${H}:c0=${sky}:c1=${water}:x0=0:y0=0:x1=0:y1=${H}:nb_colors=2`
}

function buildOverlays(i) {
  const t = COUNT <= 1 ? 0 : i / (COUNT - 1)

  const parts = [
    // horizon
    `drawbox=x=0:y=${HORIZON}:w=${W}:h=2:color=0xC8A86A@0.45:t=fill`,
  ]

  // water ripples
  for (let k = 0; k < 4; k++) {
    const y = HORIZON + 40 + k * 55
    const inset = 120 + k * 90
    parts.push(
      `drawbox=x=${inset}:y=${y}:w=${W - inset * 2}:h=1:color=0xEDE6D6@0.10:t=fill`,
    )
  }

  // tower — grows / climbs with t
  const towerH = Math.round(110 + t * 900)
  const towerW = Math.round(100 + t * 250)
  const cx = Math.round(640 + Math.sin(t * Math.PI) * 42)
  const bottom = 472
  const top = Math.max(18, bottom - towerH)
  const x = Math.round(cx - towerW / 2)
  parts.push(
    `drawbox=x=${x}:y=${top}:w=${towerW}:h=${bottom - top}:color=0x0A1416@0.62:t=fill`,
  )
  // tower edge highlight (glass)
  parts.push(
    `drawbox=x=${x}:y=${top}:w=${towerW}:h=${bottom - top}:color=0x4F9199@0.35:t=2`,
  )

  // facade floor lines once we start climbing
  if (t > 0.32) {
    const rows = Math.min(26, Math.floor((bottom - top) / 30))
    for (let r = 1; r <= rows; r++) {
      const y = Math.round(top + (r * (bottom - top)) / (rows + 1))
      parts.push(
        `drawbox=x=${x}:y=${y}:w=${towerW}:h=1:color=0xEDE6D6@0.14:t=fill`,
      )
    }
  }

  // lit windows at dusk
  if (t > 0.66) {
    const glow = Math.min(1, (t - 0.66) / 0.34)
    const cols = 4
    const rows = 8
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if ((c + r + i) % 3 !== 0) continue
        const wx = Math.round(x + 10 + (c * (towerW - 20)) / cols)
        const wy = Math.round(top + 14 + (r * (bottom - top - 20)) / rows)
        parts.push(
          `drawbox=x=${wx}:y=${wy}:w=8:h=6:color=0xF0C889@${(0.7 * glow).toFixed(2)}:t=fill`,
        )
      }
    }
  }

  // counter + labels
  const num = String(i + 1).padStart(3, '0')
  parts.push(
    `drawtext=${FONT_BOLD}:text='${num} / ${COUNT}':x=w-tw-48:y=h-th-40:fontsize=46:fontcolor=0xEDE6D6@0.85`,
  )
  parts.push(
    `drawtext=${FONT_REG}:text='LAGO RESIDENCES':x=48:y=44:fontsize=24:fontcolor=0xC8A86A@0.85`,
  )
  parts.push(
    `drawtext=${FONT_REG}:text='PLACEHOLDER SEQUENCE  -  ${beatLabel(t)}':x=48:y=78:fontsize=17:fontcolor=0xEDE6D6@0.45`,
  )

  return parts.join(',')
}

/** Clean, text-free hero/poster frame (golden approach, no HUD). */
function buildPosterOverlays() {
  const t = 0.05
  const parts = [`drawbox=x=0:y=${HORIZON}:w=${W}:h=2:color=0xC8A86A@0.4:t=fill`]
  for (let k = 0; k < 4; k++) {
    const y = HORIZON + 40 + k * 55
    const inset = 120 + k * 90
    parts.push(
      `drawbox=x=${inset}:y=${y}:w=${W - inset * 2}:h=1:color=0xEDE6D6@0.10:t=fill`,
    )
  }
  const towerH = Math.round(110 + t * 900)
  const towerW = Math.round(100 + t * 250)
  const cx = Math.round(640 + Math.sin(t * Math.PI) * 42)
  const bottom = 472
  const top = Math.max(18, bottom - towerH)
  const x = Math.round(cx - towerW / 2)
  parts.push(
    `drawbox=x=${x}:y=${top}:w=${towerW}:h=${bottom - top}:color=0x0A1416@0.55:t=fill`,
  )
  parts.push(
    `drawbox=x=${x}:y=${top}:w=${towerW}:h=${bottom - top}:color=0x4F9199@0.30:t=2`,
  )
  return parts.join(',')
}

/* ---- run ------------------------------------------------------------ */
mkdirSync(OUT_DIR, { recursive: true })
// clear any previous frames / test artifacts
for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith('.webp')) rmSync(join(OUT_DIR, f))
}

console.log(`Generating ${COUNT} placeholder frames → ${OUT_DIR}`)
for (let i = 0; i < COUNT; i++) {
  const out = join(OUT_DIR, `frame_${String(i + 1).padStart(4, '0')}.webp`)
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'lavfi',
      '-i',
      buildGradient(i),
      '-vf',
      buildOverlays(i),
      '-frames:v',
      '1',
      '-c:v',
      'libwebp',
      '-quality',
      '80',
      out,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  )
  if ((i + 1) % 25 === 0 || i === COUNT - 1) {
    console.log(`  ${i + 1}/${COUNT}`)
  }
}

// clean hero/poster frame (no baked HUD text)
execFileSync(
  'ffmpeg',
  [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'lavfi', '-i', buildGradient(6), // ≈ golden approach
    '-vf', buildPosterOverlays(),
    '-frames:v', '1', '-c:v', 'libwebp', '-quality', '86',
    join(OUT_DIR, 'poster.webp'),
  ],
  { stdio: ['ignore', 'ignore', 'inherit'] },
)
console.log('Poster frame written.')
console.log('Done.')
