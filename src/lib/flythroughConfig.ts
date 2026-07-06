import { asset } from './asset'

/* ================================================================== *
 *  FLYTHROUGH SEQUENCE — SINGLE SOURCE OF TRUTH
 * ================================================================== *
 *
 *  The cinematic tour is a single scroll-scrubbed WebP frame sequence
 *  (~12.5fps stills, per PRD §4/§8) living in `public/seq/flythrough/`.
 *  It is now stitched from THREE approved AI takes into one continuous
 *  scrub — no cuts, no coded camera moves:
 *
 *    frame_0001..0126  drone flythrough  (approach over water → facade
 *                                         → penthouse crown, golden hour)
 *    frame_0127..0199  door crossing     (Seedance: crown → through the
 *                                         glass doors → into the living
 *                                         room; the take's duplicate
 *                                         anchor frame was dropped so the
 *                                         scrub never stalls)
 *    frame_0200..0203  seam crossfade    (4-frame ffmpeg blend easing the
 *                                         door-end → orbit-start camera pop)
 *    frame_0204..0302  interior orbit    (Kling v2: ~180° arc around the
 *                                         sofa, ending on the lake view)
 *
 *  A real entry shot now replaces the old coded end push-in, which has
 *  been removed — the scrub is pure frame playback across the whole pin.
 * ================================================================== */

/** true = on-disk placeholder frames + a "placeholder" marker overlay. */
export const USE_DUMMY_FRAMES = false

/** Folder under /public that holds frame_####.webp (base-aware at runtime). */
export const FRAME_DIR = 'seq/flythrough'

/**
 * Full stitched sequence on disk: 126 flythrough + 73 door crossing
 * (d_0002..d_0074) + 4 seam crossfade + 99 interior orbit (o_0003..o_0101)
 * = 302 frames. See the header map above for the segment ranges.
 */
export const REAL_FRAME_COUNT = 302

/** Frames the placeholder generator writes (kept in sync with the script). */
export const DUMMY_FRAME_COUNT = 125

/** Frames currently on disk / to request. */
export const FRAME_COUNT = USE_DUMMY_FRAMES ? DUMMY_FRAME_COUNT : REAL_FRAME_COUNT

/** Zero-padded frame filename, e.g. frame_0007.webp. */
export const framePath = (i: number): string =>
  `${FRAME_DIR}/frame_${String(i + 1).padStart(4, '0')}.webp`

/** Ordered, base-aware URLs for every frame in the sequence. */
export const frameUrls = (): string[] =>
  Array.from({ length: FRAME_COUNT }, (_, i) => asset(framePath(i)))

/* ---- Pinned-stage tuning (PRD §4: ~15–25px scroll / frame) ------------- *
 * heightVh drives the whole pin length, and frames now scrub across the
 * FULL pin [0..1] (the old push-in tail is gone). Scroll-per-frame math:
 *   on a 1080-tall viewport, 1vh ≈ 10.8px, so 620vh ≈ 6696px of scroll,
 *   spread over 302 frames ≈ 22px/frame — inside the 15–25px target band.
 * (126 frames used ~350vh; ~2.4× the frames needs ~2.4× the scroll, hence
 * the jump to 620vh so the extended sequence keeps the same glassy density.)
 */
export const PIN_HEIGHT_VH = 620

/** Numeric scrub weight (never `true`) — heavy, eased glide. */
export const SCRUB_WEIGHT = 1.1

/**
 * Poster still for the Hero. In placeholder mode this is a dedicated
 * text-free frame (no baked-in HUD counter); once real frames land the
 * switch makes it the genuine opening frame.
 */
export const posterUrl = (): string =>
  asset(USE_DUMMY_FRAMES ? `${FRAME_DIR}/poster.webp` : framePath(0))
