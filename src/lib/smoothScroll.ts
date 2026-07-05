import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth-scroll foundation (Eitai's signature feel: flick → glide).
 *
 * Lenis drives the scroll, GSAP's ticker drives Lenis, and every Lenis
 * scroll event pings ScrollTrigger so pins/scrubs stay in sync.
 *
 * HARD RULES (studio recipe):
 *   - Desktop only — `pointer: fine`. On touch we keep native scrolling.
 *   - `syncTouch: false` ALWAYS — hijacking touch froze iOS Safari.
 *   - Disabled under `prefers-reduced-motion`.
 *
 * Returns a cleanup function.
 */
let lenisInstance: Lenis | null = null

export function initSmoothScroll(): () => void {
  // Re-measure pins once the display fonts have loaded (layout shifts).
  document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {})

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches

  // Touch or reduced-motion → native scrolling, no Lenis. ScrollTrigger still
  // works against the native scroll position.
  if (reduced || !finePointer) {
    return () => {}
  }

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
  })
  lenisInstance = lenis

  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenisInstance = null
  }
}

/**
 * Scroll to an element by id. Uses Lenis when active (desktop), otherwise
 * falls back to native smooth scrolling (touch / reduced-motion).
 */
export function scrollToId(id: string, offset = 0): void {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.4 })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
