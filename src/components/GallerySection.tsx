import { useCallback, useEffect, useState } from 'react'
import { asset } from '../lib/asset'
import { framePath, FRAME_COUNT, USE_DUMMY_FRAMES } from '../lib/flythroughConfig'

/* ------------------------------------------------------------------ *
 *  Gallery (PRD §5). Right now it pulls selected stills straight from  *
 *  the flythrough sequence — exactly what the final gallery does with  *
 *  the real video frames (plus up to 2 interior nano images later).    *
 *  Swap = the frames on disk change; these indices/captions stay.      *
 * ------------------------------------------------------------------ */

interface Shot {
  src: string
  caption: string
}

// Six moments spread across the 3 storyboard beats, interleaved with two
// approved stills (tower hero + penthouse terrace) delivered separately in
// public/img. Every src is base-aware via asset() so it resolves under the
// /lago-residences/ project path on GitHub Pages.
const pick = (frac: number) =>
  Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(frac * (FRAME_COUNT - 1))))

const frameShot = (frac: number, caption: string): Shot => ({
  src: asset(framePath(pick(frac))),
  caption,
})

const SHOTS: Shot[] = [
  frameShot(0.05, 'גישה מעל מי הכנרת'),
  frameShot(0.22, 'המגדל מתגלה על קו החוף'),
  { src: asset('img/tower-hero.webp'), caption: 'חזית המגדל מול האגם' },
  frameShot(0.45, 'חזית הזכוכית'),
  frameShot(0.62, 'מרפסות פונות מערב'),
  frameShot(0.82, 'שעת זהב מול האגם'),
  { src: asset('img/penthouse.webp'), caption: 'מרפסת הפנטהאוז בדמדומים' },
  frameShot(0.98, 'דמדומים · הפנטהאוז'),
]

export default function GallerySection() {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const go = useCallback(
    (dir: number) =>
      setOpen((i) => (i == null ? i : (i + dir + SHOTS.length) % SHOTS.length)),
    [],
  )

  useEffect(() => {
    if (open == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(-1) // RTL: right = previous
      if (e.key === 'ArrowLeft') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, go])

  return (
    <section
      id="gallery"
      aria-label="גלריה"
      className="relative border-t hairline bg-bg px-6 py-24 md:px-[8vw] md:py-32"
    >
      <div className="max-w-3xl">
        <p className="eyebrow-he">גלריה</p>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-tight text-sand">
          רגעים מתוך הסיור
        </h2>
        {USE_DUMMY_FRAMES && (
          <p className="mt-6 text-sm leading-7 text-sand/50">
            תצוגת פלייסהולדר — התמונות יוחלפו בפריימים הקולנועיים מהסרטון
            ובתמונות פנים (לובי ובריכת אינפיניטי).
          </p>
        )}
      </div>

      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {SHOTS.map((shot, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden bg-ink"
            aria-label={`הגדלת תמונה: ${shot.caption}`}
          >
            <img
              src={shot.src}
              alt={shot.caption}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-3 text-right text-xs text-sand/85">
              {shot.caption}
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open != null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={SHOTS[open].caption}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 p-4 md:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="סגירה"
            className="absolute right-5 top-5 text-3xl text-sand/70 hover:text-gold"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            aria-label="הקודם"
            className="absolute right-4 text-4xl text-sand/60 hover:text-gold md:right-10"
          >
            ›
          </button>
          <figure
            className="max-h-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={SHOTS[open].src}
              alt={SHOTS[open].caption}
              className="max-h-[80vh] w-full object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-sand/70">
              {SHOTS[open].caption}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            aria-label="הבא"
            className="absolute left-4 text-4xl text-sand/60 hover:text-gold md:left-10"
          >
            ‹
          </button>
        </div>
      )}
    </section>
  )
}
