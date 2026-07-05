import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { posterUrl } from '../lib/flythroughConfig'
import { scrollToId } from '../lib/smoothScroll'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * Cinematic opening. The first flythrough frame is a static poster image
 * (fast LCP — no waiting on the sequence), a deep-water scrim over it, then
 * the LAGO wordmark settles in with a hairline and tagline.
 */
export default function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const overlineRef = useRef<HTMLParagraphElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const cueRef = useRef<HTMLButtonElement>(null)
  const cueLineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          [
            overlineRef.current,
            wordmarkRef.current,
            subRef.current,
            taglineRef.current,
            cueRef.current,
          ],
          { opacity: 1, y: 0 },
        )
        gsap.set(ruleRef.current, { scaleX: 1 })
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        delay: 0.3,
      })

      tl.fromTo(overlineRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 })
        .fromTo(
          wordmarkRef.current,
          { opacity: 0, y: 26, letterSpacing: '0.5em' },
          {
            opacity: 1,
            y: 0,
            letterSpacing: '0.28em',
            duration: 1.8,
            ease: 'expo.out',
          },
          0.3,
        )
        .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.4 }, 1)
        .fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: 'expo.out' },
          1.3,
        )
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 1.4 },
          1.6,
        )
        .fromTo(cueRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 2.2)

      gsap.fromTo(
        cueLineRef.current,
        { scaleY: 0.25, opacity: 0.35 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 1.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 2.6,
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <header
      ref={sectionRef}
      className="grain relative flex h-svh flex-col items-center justify-center overflow-hidden bg-bg"
      aria-label="LAGO Residences — מגורים מעל הכנרת"
    >
      {/* poster frame — LCP image, cover-fit */}
      <img
        src={posterUrl()}
        alt="מבט קולנועי אל מגדל LAGO Residences מעל מי הכנרת בשעת זהב"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      {/* deep-water scrim for legibility + mood */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/45 to-ink/90"
      />
      {/* corner vignette — keeps the centre clear, sinks the corners
          (also masks the placeholder frame's baked HUD text) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 95% at 50% 44%, transparent 42%, rgba(6,16,15,0.78) 100%)',
        }}
      />

      {/* wordmark block */}
      <div className="relative z-10 px-6 text-center">
        <p ref={overlineRef} className="eyebrow-he opacity-0">
          טבריה · על קו המים של הכנרת
        </p>
        <h1
          ref={wordmarkRef}
          className="mt-8 font-display text-[clamp(3.4rem,13vw,10rem)] font-light leading-none tracking-[0.28em] text-sand opacity-0"
          style={{ paddingRight: '0.28em' }}
        >
          LAGO
        </h1>
        <p
          ref={subRef}
          className="mt-2 text-[0.82rem] font-semibold uppercase tracking-[0.55em] text-gold opacity-0 md:text-sm"
          style={{ paddingRight: '0.55em' }}
        >
          RESIDENCES
        </p>
        <div
          ref={ruleRef}
          className="mx-auto mt-9 h-px w-40 origin-center bg-gold/60"
          style={{ transform: 'scaleX(0)' }}
        />
        <p
          ref={taglineRef}
          className="mt-8 text-base font-light tracking-[0.15em] text-sand/75 opacity-0 md:text-lg"
        >
          מגורים מעל האגם — נוף שלא נגמר
        </p>
      </div>

      {/* scroll cue */}
      <button
        ref={cueRef}
        type="button"
        onClick={() => scrollToId('flythrough')}
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0"
        aria-label="גללו אל הסיור הקולנועי"
      >
        <span className="text-[0.62rem] tracking-[0.35em] text-sand/60">גללו</span>
        <div
          ref={cueLineRef}
          className="h-14 w-px origin-top bg-gradient-to-b from-sand/60 to-transparent"
        />
      </button>
    </header>
  )
}
