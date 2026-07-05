/* ------------------------------------------------------------------ *
 *  Location (PRD §6) — a stylised, coded SVG of the Kinneret shoreline  *
 *  at Tiberias with the project point + distances. No external map, no  *
 *  iframe. West shore (city) on the left, the lake filling the east.    *
 * ------------------------------------------------------------------ */

interface Poi {
  label: string
  dist: string
  /** marker coords in the SVG viewBox */
  x: number
  y: number
}

const POIS: Poi[] = [
  { label: 'הטיילת', dist: '300 מ׳', x: 470, y: 250 },
  { label: 'המרינה', dist: '700 מ׳', x: 505, y: 360 },
  { label: 'בתי קפה ומסעדות', dist: '400 מ׳', x: 360, y: 205 },
  { label: 'כביש 90', dist: '1.2 ק״מ', x: 150, y: 250 },
]

// The project sits right on the water line.
const PROJECT = { x: 430, y: 250 }

export default function LocationSection() {
  return (
    <section
      id="location"
      aria-label="מיקום"
      className="relative border-t hairline bg-ink px-6 py-24 md:px-[8vw] md:py-32"
    >
      <div className="max-w-3xl">
        <p className="eyebrow-he">מיקום</p>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-tight text-sand">
          על קו המים, במרכז טבריה
        </h2>
        <p className="mt-6 text-lg font-light leading-8 text-sand/65">
          הכל במרחק הליכה — הטיילת, המרינה והבילוי — כשמעבר לחלון נפרש האגם עד
          רמת הגולן.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        {/* coded map */}
        <div className="relative overflow-hidden border hairline bg-bg">
          <svg
            viewBox="0 0 800 500"
            className="h-full w-full"
            role="img"
            aria-label="מפה מסוגננת של קו החוף של הכנרת עם מיקום הפרויקט והמרחקים לנקודות עניין"
          >
            {/* lake */}
            <path
              d="M470 0 C430 90 470 160 440 250 C470 350 420 430 480 500 L800 500 L800 0 Z"
              fill="var(--lago-lake)"
              opacity="0.16"
            />
            {/* shoreline */}
            <path
              d="M470 0 C430 90 470 160 440 250 C470 350 420 430 480 500"
              fill="none"
              stroke="var(--lago-lake)"
              strokeWidth="2"
              opacity="0.7"
            />
            {/* water contour lines */}
            {[70, 140, 210].map((o) => (
              <path
                key={o}
                d={`M${470 + o} 0 C${430 + o} 90 ${470 + o} 160 ${440 + o} 250 C${470 + o} 350 ${420 + o} 430 ${480 + o} 500`}
                fill="none"
                stroke="var(--lago-lake)"
                strokeWidth="1"
                opacity="0.18"
              />
            ))}

            {/* highway 90 (N–S, west) */}
            <line
              x1="150"
              y1="0"
              x2="150"
              y2="500"
              stroke="var(--lago-sand)"
              strokeWidth="2"
              strokeDasharray="2 8"
              opacity="0.35"
            />
            {/* promenade (along shore) */}
            <path
              d="M452 60 C420 150 452 200 425 250 C452 330 415 400 460 470"
              fill="none"
              stroke="var(--lago-gold)"
              strokeWidth="1.5"
              strokeDasharray="1 6"
              opacity="0.5"
            />

            {/* connector lines project → POIs */}
            {POIS.map((p) => (
              <line
                key={p.label}
                x1={PROJECT.x}
                y1={PROJECT.y}
                x2={p.x}
                y2={p.y}
                stroke="var(--lago-sand)"
                strokeWidth="1"
                opacity="0.25"
              />
            ))}

            {/* POI markers */}
            {POIS.map((p) => (
              <g key={p.label}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="none"
                  stroke="var(--lago-sand)"
                  strokeWidth="1.5"
                  opacity="0.7"
                />
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  style={{
                    fill: 'var(--lago-sand)',
                    opacity: 0.75,
                    fontSize: 15,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {p.label}
                </text>
                <text
                  x={p.x}
                  y={p.y + 22}
                  textAnchor="middle"
                  style={{
                    fill: 'var(--lago-gold)',
                    fontSize: 12,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {p.dist}
                </text>
              </g>
            ))}

            {/* project marker */}
            <g>
              <circle
                cx={PROJECT.x}
                cy={PROJECT.y}
                r="16"
                fill="var(--lago-gold)"
                opacity="0.18"
                className="lago-pulse"
              />
              <circle cx={PROJECT.x} cy={PROJECT.y} r="7" fill="var(--lago-gold)" />
              <text
                x={PROJECT.x}
                y={PROJECT.y - 26}
                textAnchor="middle"
                style={{
                  fill: 'var(--lago-gold)',
                  fontSize: 17,
                  fontWeight: 700,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                LAGO
              </text>
            </g>

            {/* lake label */}
            <text
              x="660"
              y="260"
              textAnchor="middle"
              style={{
                fill: 'var(--lago-lake)',
                opacity: 0.7,
                fontSize: 22,
                letterSpacing: '0.3em',
                fontFamily: 'var(--font-sans)',
              }}
            >
              הכנרת
            </text>
          </svg>
        </div>

        {/* distances list (accessible text companion) */}
        <ul className="divide-y divide-[var(--lago-hairline)] border-y hairline">
          {POIS.map((p) => (
            <li key={p.label} className="flex items-baseline justify-between py-4">
              <span className="text-base text-sand/85">{p.label}</span>
              <span className="numeral-luxe text-lg text-gold">{p.dist}</span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .lago-pulse {
            transform-box: fill-box;
            transform-origin: center;
            animation: lago-pulse 3s var(--ease-luxe) infinite;
          }
          @keyframes lago-pulse {
            0%, 100% { transform: scale(1); opacity: 0.18; }
            50% { transform: scale(1.5); opacity: 0.05; }
          }
        }
      `}</style>
    </section>
  )
}
