import { useEffect, useMemo, useState } from 'react'
import {
  APARTMENT_TYPES,
  FLOOR_BANDS,
  bandById,
  formatPrice,
  startingPrice,
  topPrice,
  type BandId,
  type PlanId,
} from '../lib/apartments'
import ApartmentPlan from './ApartmentPlan'
import { requestBooking } from '../lib/leadPrefill'
import { scrollToId } from '../lib/smoothScroll'

export default function ApartmentSelector() {
  const [typeId, setTypeId] = useState<PlanId>('r4')
  const [bandId, setBandId] = useState<BandId>('mid')

  const type = useMemo(
    () => APARTMENT_TYPES.find((t) => t.id === typeId)!,
    [typeId],
  )

  // Keep the floor band valid for the chosen type (auto-correct on switch).
  useEffect(() => {
    if (!type.bands.includes(bandId)) {
      setBandId(type.bands[0])
    }
  }, [type, bandId])

  const band = bandById(type.bands.includes(bandId) ? bandId : type.bands[0])
  const from = startingPrice(type, band)
  const to = topPrice(type, band)

  const handleBook = () => {
    const priceNote =
      from == null
        ? 'בליווי אישי'
        : `${formatPrice(from)}–${formatPrice(to!)}`
    requestBooking(
      `מתעניין/ת ב${type.name}, ${band.label} (${band.view}). טווח מחיר: ${priceNote}. [דמו LAGO]`,
    )
    scrollToId('lead', -20)
  }

  return (
    <section
      id="apartments"
      aria-label="בוחר הדירות"
      className="relative border-t hairline bg-ink px-6 py-24 md:px-[8vw] md:py-32"
    >
      <div className="max-w-3xl">
        <p className="eyebrow-he">בוחר הדירות</p>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-tight text-sand">
          מצאו את הדירה שלכם בגובה
        </h2>
        <p className="mt-6 text-lg font-light leading-8 text-sand/65">
          בחרו טיפוס דירה ומפלס קומות — והנוף, השטח והמחיר מתעדכנים בהתאם.
        </p>
      </div>

      {/* Step 1 — type tabs */}
      <div className="mt-14">
        <p className="mb-4 text-xs tracking-[0.2em] text-sand/45">
          שלב א׳ · טיפוס הדירה
        </p>
        <div
          role="tablist"
          aria-label="טיפוס דירה"
          className="flex flex-nowrap gap-2 overflow-x-auto pb-2"
        >
          {APARTMENT_TYPES.map((t) => {
            const active = t.id === typeId
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setTypeId(t.id)}
                className={`flex-none whitespace-nowrap border px-5 py-2.5 text-sm transition-colors duration-300 ${
                  active
                    ? 'border-gold bg-gold text-ink'
                    : 'border-sand/20 text-sand/70 hover:border-sand/50'
                }`}
              >
                {t.tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2 — floor band */}
      <div className="mt-10">
        <p className="mb-4 text-xs tracking-[0.2em] text-sand/45">
          שלב ב׳ · מפלס הקומות
        </p>
        <div
          role="tablist"
          aria-label="מפלס קומות"
          className="flex flex-wrap gap-2"
        >
          {FLOOR_BANDS.map((b) => {
            const available = type.bands.includes(b.id)
            const active = b.id === band.id
            return (
              <button
                key={b.id}
                role="tab"
                type="button"
                aria-selected={active}
                disabled={!available}
                onClick={() => setBandId(b.id)}
                className={`border px-4 py-2 text-sm transition-colors duration-300 ${
                  active
                    ? 'border-gold text-gold'
                    : available
                      ? 'border-sand/20 text-sand/70 hover:border-sand/50'
                      : 'cursor-not-allowed border-sand/10 text-sand/25'
                }`}
              >
                {b.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Card */}
      <div className="mt-12 grid grid-cols-1 items-stretch gap-px overflow-hidden border hairline bg-hairline lg:grid-cols-2">
        {/* plan */}
        <div className="flex items-center justify-center bg-bg p-8 md:p-12">
          <ApartmentPlan
            plan={type.id}
            className="h-auto w-full max-w-md"
          />
        </div>

        {/* details */}
        <div className="flex flex-col justify-between gap-8 bg-bg p-8 md:p-12">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-3xl font-light text-sand md:text-4xl">
                {type.name}
              </h3>
              <span className="text-sm text-sand/45">{type.rooms}</span>
            </div>
            <p className="mt-3 text-[0.95rem] leading-7 text-sand/60">
              {type.note}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              <Spec label="שטח פנים" value={`${type.area} מ״ר`} />
              <Spec label="מרפסת" value={`${type.balcony} מ״ר`} />
              <Spec label="כיווני אוויר" value={type.aspect} />
              <Spec label="הנוף" value={band.view} />
            </div>
          </div>

          <div className="border-t hairline pt-6">
            {from == null ? (
              <p className="numeral-luxe text-3xl text-gold">בליווי אישי</p>
            ) : (
              <>
                <p className="text-xs tracking-[0.15em] text-sand/45">
                  החל מ־
                </p>
                <p className="numeral-luxe mt-1 text-4xl">
                  {formatPrice(from)}
                  <span className="mr-2 align-baseline text-base text-sand/45">
                    · טווח {formatPrice(from)}–{formatPrice(to!)}
                  </span>
                </p>
              </>
            )}
            <button
              type="button"
              onClick={handleBook}
              className="mt-6 w-full border border-gold bg-gold px-6 py-3.5 text-sm font-semibold tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-gold sm:w-auto sm:px-10"
            >
              לתיאום סיור
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs tracking-[0.12em] text-sand/45">{label}</p>
      <p className="mt-1.5 text-base text-sand/85">{value}</p>
    </div>
  )
}
