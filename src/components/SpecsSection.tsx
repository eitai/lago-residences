import type { ReactNode } from 'react'

/* Inline line icons — stroke = currentColor, no external assets. */
const icon = {
  lobby: (
    <>
      <path d="M4 21h16M6 21V8l6-4 6 4v13M9 21v-5h6v5" />
      <path d="M9 11h.01M15 11h.01" />
    </>
  ),
  pool: (
    <>
      <path d="M3 16c1.5 0 1.5-1.2 3-1.2S8.5 16 10 16s1.5-1.2 3-1.2S15.5 16 17 16s1.5-1.2 3-1.2" />
      <path d="M3 20c1.5 0 1.5-1.2 3-1.2S8.5 20 10 20s1.5-1.2 3-1.2S15.5 20 17 20s1.5-1.2 3-1.2" />
      <path d="M8 13V5a2 2 0 0 1 4 0M12 13V5" />
    </>
  ),
  spa: (
    <>
      <path d="M12 21c4-2 7-5 7-9a5 5 0 0 0-7-4.6A5 5 0 0 0 5 12c0 4 3 7 7 9Z" />
      <path d="M12 12c0-2 1-3.5 2.5-4.5M12 12c0-2-1-3.5-2.5-4.5" />
    </>
  ),
  lounge: (
    <>
      <path d="M4 18v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5M4 18h16M6 11V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M7 18v2M17 18v2" />
    </>
  ),
  concierge: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6" />
      <path d="M9 11.5 7.5 21M15 11.5 16.5 21" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 16V8h4a2.5 2.5 0 0 1 0 5H9" />
    </>
  ),
  smart: (
    <>
      <rect x="4" y="5" width="16" height="12" rx="2" />
      <path d="M9 21h6M12 17v4M8 9h4M8 12h6" />
    </>
  ),
}

interface Amenity {
  title: string
  desc: string
  path: ReactNode
}

const AMENITIES: Amenity[] = [
  { title: 'לובי מעוצב', desc: 'כניסה כפולת-גובה בגימור אבן ואלון, אור רך לאורך היום.', path: icon.lobby },
  { title: 'בריכת אינפיניטי', desc: 'קו מים שנמזג עם האגם, על גג האמניטיז הפונה מערבה.', path: icon.pool },
  { title: 'ספא וחדר כושר', desc: 'סאונה רטובה, חדר טיפולים וסטודיו כושר עם נוף.', path: icon.spa },
  { title: 'ביזנס-לאונג׳', desc: 'חלל עבודה שקט לדיירים, עם חדרי ישיבות פרטיים.', path: icon.lounge },
  { title: 'קונסיירז׳', desc: 'שירות דיירים 24/7 — קבלה, משלוחים ותיאום סיורים.', path: icon.concierge },
  { title: 'חניון רובוטי', desc: 'החניה מגיעה אליכם — ללא רמפות, בזמן קצר.', path: icon.parking },
  { title: 'בית חכם', desc: 'תאורה, אקלים וכניסה בשליטה מהאפליקציה, בכל דירה.', path: icon.smart },
]

const FIGURES = [
  { value: '24', unit: 'קומות' },
  { value: '89', unit: 'דירות' },
  { value: '300', unit: 'מ׳ מהטיילת' },
  { value: 'מערב', unit: 'כל המרפסות' },
]

export default function SpecsSection() {
  return (
    <section
      id="specs"
      aria-label="מפרט ואמניטיז"
      className="relative border-t hairline bg-bg px-6 py-24 md:px-[8vw] md:py-32"
    >
      <div className="max-w-3xl">
        <p className="eyebrow-he">המפרט</p>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-tight text-sand">
          כל פרט, במפלס של האגם
        </h2>
        <p className="mt-6 text-lg font-light leading-8 text-sand/65">
          LAGO תוכנן סביב דבר אחד — הנוף. חומרים חמים, קווים נקיים ואמניטיז
          שנועדו להאריך את הרגע שבו אתם עוצרים מול המים.
        </p>
      </div>

      {/* key figures */}
      <div className="mt-16 grid grid-cols-2 gap-8 border-y hairline py-10 md:grid-cols-4">
        {FIGURES.map((f) => (
          <div key={f.unit}>
            <p className="numeral-luxe text-[clamp(2.4rem,5vw,3.6rem)]">{f.value}</p>
            <p className="mt-2 text-sm tracking-[0.12em] text-sand/55">{f.unit}</p>
          </div>
        ))}
      </div>

      {/* amenities grid */}
      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {AMENITIES.map((a) => (
          <div key={a.title} className="flex gap-5">
            <svg
              viewBox="0 0 24 24"
              className="mt-1 h-8 w-8 flex-none text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {a.path}
            </svg>
            <div>
              <h3 className="font-display text-2xl font-light text-sand">
                {a.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-7 text-sand/60">
                {a.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
