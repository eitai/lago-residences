import { useCallback, useMemo, useRef } from 'react'
import FrameSequenceScrub from './FrameSequenceScrub'
import {
  frameUrls,
  posterUrl,
  PIN_HEIGHT_VH,
  SCRUB_WEIGHT,
  USE_DUMMY_FRAMES,
} from '../lib/flythroughConfig'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { scrollToId } from '../lib/smoothScroll'

/* ------------------------------------------------------------------ *
 *  Storyboard beats (PRD §4). Each caption is a DOM layer above the    *
 *  canvas, timed to a progress window and written directly (no React   *
 *  re-render) on every scrub tick.                                     *
 * ------------------------------------------------------------------ */

interface Beat {
  id: string
  eyebrow: string
  title: string
  lines: string[]
  /** visible window in scrub progress [0..1] */
  start: number
  end: number
  /** overlay placement (RTL-aware) */
  position: string
}

const BEATS: Beat[] = [
  {
    id: 'approach',
    eyebrow: 'הגישה',
    title: 'על קו המים של הכנרת',
    lines: ['רחיפה נמוכה מעל האגם בשעת זהב', '300 מ׳ מהטיילת'],
    start: 0.02,
    end: 0.36,
    position: 'right-[8vw] top-[20vh] text-right',
  },
  {
    id: 'facade',
    eyebrow: 'החזית',
    title: '24 קומות · 89 דירות',
    lines: ['חזית זכוכית בעיצוב אדריכלי', 'מרפסות פונות מערב — שקיעה כל ערב'],
    start: 0.44,
    end: 0.66,
    position: 'left-[8vw] top-[24vh] text-left',
  },
  {
    id: 'penthouse',
    eyebrow: 'הפנטהאוז',
    title: 'מרפסת 120 מ״ר מעל האגם',
    lines: ['האור עובר יום ← דמדומים', 'אורות העיר והאגם נדלקים'],
    start: 0.72,
    end: 0.9,
    position: 'right-[8vw] bottom-[26vh] text-right',
  },
]

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** Eased fade in → hold → fade out for a caption at progress `p`. */
function beatOpacity(p: number, start: number, end: number): number {
  const feather = 0.05
  return Math.min(
    smoothstep(start, start + feather, p),
    1 - smoothstep(end - feather, end, p),
  )
}

export default function FlythroughSection() {
  const reducedMotion = usePrefersReducedMotion()
  const urls = useMemo(() => frameUrls(), [])

  const beatRefs = useRef<(HTMLDivElement | null)[]>([])
  const introRef = useRef<HTMLDivElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const duskRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)

  // Direct DOM writes on every scrub tick — no React re-renders.
  const handleProgress = useCallback((p: number) => {
    BEATS.forEach((beat, i) => {
      const el = beatRefs.current[i]
      if (!el) return
      const o = beatOpacity(p, beat.start, beat.end)
      el.style.opacity = o.toFixed(3)
      el.style.transform = `translateY(${((1 - o) * 20).toFixed(2)}px)`
    })
    if (introRef.current) {
      introRef.current.style.opacity = (1 - smoothstep(0.01, 0.07, p)).toFixed(3)
    }
    if (ctaRef.current) {
      // Final beat — the "book a tour" cue fades in at the end and stays.
      ctaRef.current.style.opacity = smoothstep(0.9, 0.98, p).toFixed(3)
    }
    if (duskRef.current) {
      // Day → dusk: a warm-then-deep scrim that ramps in over the climb.
      duskRef.current.style.opacity = (smoothstep(0.55, 1, p) * 0.8).toFixed(3)
    }
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`
    }
  }, [])

  /* ---- Reduced motion: static poster + captions as a calm list ------ */
  if (reducedMotion) {
    return (
      <section id="flythrough" aria-label="סיור קולנועי מעל הפרויקט">
        <div className="relative h-svh w-full overflow-hidden bg-bg">
          <img
            src={posterUrl()}
            alt="מבט קולנועי אל מגדל LAGO Residences מעל מי הכנרת"
            className="absolute inset-0 h-full w-full object-cover"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/40" />
          <div className="absolute inset-x-0 bottom-[12vh] text-center">
            <p className="eyebrow-he">הסיור הקולנועי</p>
            <h2 className="mt-4 font-display text-3xl font-light text-sand md:text-5xl">
              מהאגם, לאורך החזית, אל הפנטהאוז
            </h2>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 border-t hairline px-8 py-20 sm:grid-cols-3">
          {BEATS.map((beat) => (
            <div key={beat.id}>
              <p className="eyebrow-he mb-3">{beat.eyebrow}</p>
              <h3 className="font-display text-2xl font-light text-sand">
                {beat.title}
              </h3>
              <ul className="mt-4 space-y-1 text-sm text-sand/60">
                {beat.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="flythrough" aria-label="סיור קולנועי מעל הפרויקט">
      <FrameSequenceScrub
        frameUrls={urls}
        heightVh={PIN_HEIGHT_VH}
        scrub={SCRUB_WEIGHT}
        onProgress={handleProgress}
      >
        {/* legibility scrim + day→dusk deepening */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
        <div
          ref={duskRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0,
            background:
              'linear-gradient(180deg, rgba(20,30,45,0.35) 0%, rgba(10,20,22,0.15) 40%, rgba(200,120,60,0.10) 78%, rgba(6,16,15,0.55) 100%)',
          }}
        />

        {/* intro cue — fades as the flight begins */}
        <div
          ref={introRef}
          className="absolute inset-x-0 top-[14vh] text-center"
        >
          <p className="eyebrow-he">הסיור הקולנועי</p>
          <p className="mt-4 font-display text-2xl font-light italic text-sand/60 md:text-3xl">
            גללו — וטוסו מעל הפרויקט
          </p>
        </div>

        {/* storyboard captions */}
        {BEATS.map((beat, i) => (
          <div
            key={beat.id}
            ref={(el) => {
              beatRefs.current[i] = el
            }}
            className={`absolute max-w-[80vw] will-change-transform ${beat.position}`}
            style={{ opacity: 0 }}
          >
            <p className="eyebrow-he mb-3">{beat.eyebrow}</p>
            <h2 className="font-display text-[clamp(1.8rem,4.5vw,3.4rem)] font-light leading-tight text-sand">
              {beat.title}
            </h2>
            <ul className="mt-4 space-y-1 text-sm text-sand/70 md:text-base">
              {beat.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <div className="mt-5 h-px w-20 bg-gold/60" />
          </div>
        ))}

        {/* final CTA cue */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-[16vh] text-center will-change-transform"
          style={{ opacity: 0 }}
        >
          <button
            type="button"
            onClick={() => scrollToId('lead', -20)}
            className="pointer-events-auto inline-flex flex-col items-center gap-3 text-sand transition-colors duration-500 hover:text-gold"
          >
            <span className="eyebrow-he">לתיאום סיור פרטי</span>
            <span aria-hidden="true" className="text-2xl">
              ↓
            </span>
          </button>
        </div>

        {/* placeholder marker — obvious until the real frames land */}
        {USE_DUMMY_FRAMES && (
          <div className="absolute left-4 top-4 rounded-full border border-gold/30 bg-ink/60 px-3 py-1 text-[0.6rem] tracking-[0.15em] text-gold/70 backdrop-blur-sm">
            רצף פלייסהולדר · הפריימים הקולנועיים בהמשך
          </div>
        )}

        {/* progress hairline */}
        <div className="absolute inset-x-[8vw] bottom-[7vh] h-px bg-sand/10">
          <div
            ref={progressRef}
            className="h-full w-full origin-right bg-gold/70"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </FrameSequenceScrub>
    </section>
  )
}
