import { scrollToId } from '../lib/smoothScroll'

const NAV = [
  { id: 'flythrough', label: 'הסיור' },
  { id: 'specs', label: 'המפרט' },
  { id: 'apartments', label: 'הדירות' },
  { id: 'gallery', label: 'גלריה' },
  { id: 'location', label: 'מיקום' },
  { id: 'lead', label: 'תיאום סיור' },
]

export default function Footer() {
  return (
    <footer
      className="border-t hairline bg-bg px-6 py-14 md:px-[8vw]"
      aria-label="כותרת תחתונה"
    >
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="font-display text-3xl font-light tracking-[0.25em] text-sand">
            LAGO
          </p>
          <p className="mt-1 text-xs tracking-[0.4em] text-gold/80">
            RESIDENCES · טבריה
          </p>
        </div>
        <nav
          aria-label="ניווט"
          className="flex flex-wrap gap-x-8 gap-y-3 text-[0.72rem] tracking-[0.18em] text-sand/55"
        >
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => scrollToId(n.id, -20)}
              className="transition-colors duration-500 hover:text-gold"
            >
              {n.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-12 border-t hairline pt-8">
        <p className="max-w-2xl text-[0.72rem] font-light leading-6 text-sand/50">
          LAGO Residences הוא פרויקט פורטפוליו; הפרויקט בדיוני. אין דירות
          המוצעות למכירה, וכל הנתונים, המחירים והתמונות הם להמחשה בלבד.
        </p>
        <p className="mt-4 text-[0.72rem] tracking-[0.15em] text-sand/55">
          נבנה על ידי{' '}
          <a
            href="https://www.enmstudio.co.il/?utm_source=lago-demo&utm_medium=footer-credit"
            target="_blank"
            rel="noopener"
            className="text-gold/85 transition-colors duration-500 hover:text-gold"
          >
            E&M Studio
          </a>
        </p>
        <p className="mt-2 text-[0.68rem] tracking-[0.15em] text-sand/40">
          © {new Date().getFullYear()} LAGO Residences — אתר הדגמה.
        </p>
      </div>
    </footer>
  )
}
