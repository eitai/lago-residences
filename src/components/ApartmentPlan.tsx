import type { PlanId } from '../lib/apartments'

/* ------------------------------------------------------------------ *
 *  Coded architectural floor plans — schematic line drawings, zero    *
 *  external assets / images. One layout per apartment type.           *
 *  viewBox 0 0 400 300. Balconies (lake tint) always face the water   *
 *  (drawn on the west / left edge here).                              *
 * ------------------------------------------------------------------ */

interface PlanProps {
  plan: PlanId
  className?: string
}

const wall = { fill: 'none', stroke: 'var(--lago-sand)', strokeWidth: 2 }
const thin = {
  fill: 'none',
  stroke: 'var(--lago-sand)',
  strokeWidth: 1,
  opacity: 0.45,
}
const balcony = {
  fill: 'var(--lago-lake)',
  opacity: 0.12,
  stroke: 'var(--lago-lake)',
  strokeWidth: 1,
}

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      style={{
        fill: 'var(--lago-sand)',
        opacity: 0.5,
        fontSize: 11,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </text>
  )
}

/** Small NW compass rose (water is west). */
function Compass() {
  return (
    <g transform="translate(366 34)" opacity={0.6}>
      <circle r="13" fill="none" stroke="var(--lago-gold)" strokeWidth="1" />
      <path d="M0 -13 L3 0 L0 4 L-3 0 Z" fill="var(--lago-gold)" />
      <text
        x="0"
        y="-16"
        textAnchor="middle"
        style={{ fill: 'var(--lago-gold)', fontSize: 8, fontFamily: 'var(--font-sans)' }}
      >
        N
      </text>
    </g>
  )
}

function PlanBody({ plan }: { plan: PlanId }) {
  switch (plan) {
    case 'r3':
      return (
        <>
          <rect x="70" y="40" width="270" height="220" {...wall} />
          {/* balcony (west) */}
          <rect x="40" y="60" width="30" height="180" {...balcony} />
          {/* living + kitchen */}
          <line x1="70" y1="160" x2="230" y2="160" {...thin} />
          <line x1="230" y1="40" x2="230" y2="260" {...thin} />
          {/* bedrooms split */}
          <line x1="230" y1="150" x2="340" y2="150" {...thin} />
          <Label x={150} y={110}>
            סלון
          </Label>
          <Label x={150} y={215}>
            מטבח
          </Label>
          <Label x={285} y={100}>
            חדר שינה
          </Label>
          <Label x={285} y={210}>
            חדר
          </Label>
          <Label x={55} y={155}>
            מרפסת
          </Label>
        </>
      )
    case 'r4':
      return (
        <>
          <rect x="60" y="36" width="290" height="228" {...wall} />
          <rect x="30" y="56" width="30" height="188" {...balcony} />
          <line x1="60" y1="150" x2="210" y2="150" {...thin} />
          <line x1="210" y1="36" x2="210" y2="264" {...thin} />
          <line x1="210" y1="120" x2="350" y2="120" {...thin} />
          <line x1="210" y1="192" x2="350" y2="192" {...thin} />
          <Label x={135} y={100}>
            סלון
          </Label>
          <Label x={135} y={210}>
            מטבח
          </Label>
          <Label x={280} y={82}>
            שינה הורים
          </Label>
          <Label x={280} y={160}>
            חדר
          </Label>
          <Label x={280} y={232}>
            חדר
          </Label>
          <Label x={45} y={150}>
            מרפסת
          </Label>
        </>
      )
    case 'r5':
      return (
        <>
          {/* corner / L-shape */}
          <path
            d="M60 36 H350 V180 H210 V264 H60 Z"
            fill="none"
            stroke="var(--lago-sand)"
            strokeWidth="2"
          />
          <rect x="30" y="56" width="30" height="208" {...balcony} />
          <line x1="60" y1="150" x2="210" y2="150" {...thin} />
          <line x1="210" y1="36" x2="210" y2="180" {...thin} />
          <line x1="280" y1="36" x2="280" y2="180" {...thin} />
          <line x1="60" y1="210" x2="210" y2="210" {...thin} />
          <Label x={135} y={100}>
            סלון
          </Label>
          <Label x={135} y={185}>
            מטבח
          </Label>
          <Label x={135} y={245}>
            עבודה
          </Label>
          <Label x={245} y={112}>
            שינה
          </Label>
          <Label x={315} y={112}>
            שינה
          </Label>
          <Label x={45} y={160}>
            מרפסת
          </Label>
        </>
      )
    case 'mini':
      return (
        <>
          <rect x="60" y="40" width="290" height="220" {...wall} />
          {/* wide corner balcony (west + south) */}
          <path d="M26 60 H60 V236 H210 V262 H26 Z" {...balcony} />
          <line x1="60" y1="150" x2="230" y2="150" {...thin} />
          <line x1="230" y1="40" x2="230" y2="260" {...thin} />
          <line x1="230" y1="150" x2="350" y2="150" {...thin} />
          {/* stair hint (duplex) */}
          <g {...thin}>
            <line x1="300" y1="200" x2="340" y2="200" />
            <line x1="300" y1="215" x2="340" y2="215" />
            <line x1="300" y1="230" x2="340" y2="230" />
            <line x1="300" y1="245" x2="340" y2="245" />
          </g>
          <Label x={145} y={100}>
            סלון כפול
          </Label>
          <Label x={145} y={210}>
            מטבח אי
          </Label>
          <Label x={285} y={100}>
            סוויטה
          </Label>
          <Label x={265} y={190}>
            גרם מדרגות
          </Label>
          <Label x={43} y={150}>
            מרפסת
          </Label>
        </>
      )
    case 'penthouse':
      return (
        <>
          <rect x="70" y="52" width="280" height="196" {...wall} />
          {/* wraparound roof terrace */}
          <path
            d="M20 30 H370 V270 H20 Z M70 52 H350 V248 H70 Z"
            fill="var(--lago-lake)"
            opacity="0.10"
            stroke="var(--lago-lake)"
            strokeWidth="1"
            fillRule="evenodd"
          />
          <line x1="200" y1="52" x2="200" y2="248" {...thin} />
          <line x1="70" y1="150" x2="200" y2="150" {...thin} />
          <line x1="200" y1="140" x2="350" y2="140" {...thin} />
          <Label x={135} y={110}>
            סלון פנורמי
          </Label>
          <Label x={135} y={205}>
            מטבח שף
          </Label>
          <Label x={275} y={100}>
            סוויטת הורים
          </Label>
          <Label x={275} y={200}>
            2 חדרים
          </Label>
          <Label x={45} y={155}>
            גג פרטי
          </Label>
        </>
      )
  }
}

export default function ApartmentPlan({ plan, className }: PlanProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="תרשים תוכנית דירה סכמטי"
    >
      <PlanBody plan={plan} />
      <Compass />
    </svg>
  )
}
