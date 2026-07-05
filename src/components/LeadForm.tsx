import { useEffect, useRef, useState } from 'react'
import { BOOK_EVENT, type BookDetail } from '../lib/leadPrefill'

interface Errors {
  name?: string
  phone?: string
}

const PHONE_RE = /^0(5\d|[2-4]|[8-9]|7\d)[-\s]?\d{3}[-\s]?\d{4}$/

export default function LeadForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const messageRef = useRef<HTMLTextAreaElement>(null)

  // Prefill + focus when a card requests a booking.
  useEffect(() => {
    const onBook = (e: Event) => {
      const detail = (e as CustomEvent<BookDetail>).detail
      if (!detail) return
      setSent(false)
      setMessage(detail.message)
      // let the scroll settle, then focus the name field
      window.setTimeout(() => {
        const el = document.getElementById('lead-name') as HTMLInputElement | null
        el?.focus()
      }, 700)
    }
    window.addEventListener(BOOK_EVENT, onBook)
    return () => window.removeEventListener(BOOK_EVENT, onBook)
  }, [])

  const validate = (): boolean => {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'נא להזין שם מלא.'
    if (!PHONE_RE.test(phone.trim())) next.phone = 'נא להזין מספר טלפון תקין.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    // Demo only — no network, no real WhatsApp. Show a mock success screen.
    setSent(true)
  }

  return (
    <section
      id="lead"
      aria-label="טופס לתיאום סיור"
      className="relative border-t hairline bg-ink px-6 py-24 md:px-[8vw] md:py-32"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="eyebrow-he">לתיאום סיור</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-tight text-sand">
            בואו לראות את הנוף מקרוב
          </h2>
          <p className="mt-6 text-lg font-light leading-8 text-sand/65">
            השאירו פרטים ונחזור אליכם לתיאום סיור פרטי בדירה לדוגמה — במועד
            שנוח לכם.
          </p>
          <p className="mt-8 text-sm leading-7 text-sand/45">
            זהו אתר הדגמה — הפרויקט בדיוני. הטופס אינו שולח הודעה אמיתית; הוא
            מדגים את חוויית פניית הליד.
          </p>
        </div>

        <div className="relative">
          {sent ? (
            <div
              role="status"
              className="flex h-full flex-col justify-center border hairline bg-bg p-10 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 className="mt-6 font-display text-3xl font-light text-sand">
                תודה, {name.split(' ')[0] || 'שלכם'}!
              </h3>
              <p className="mt-4 text-sand/65">
                קיבלנו את הפנייה. במציאות היינו חוזרים אליכם לתיאום סיור —
                כאן זהו מסך הדגמה בלבד.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setName('')
                  setPhone('')
                  setMessage('')
                }}
                className="mx-auto mt-8 border border-sand/25 px-8 py-3 text-sm text-sand/80 transition-colors hover:border-gold hover:text-gold"
              >
                שליחה נוספת
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <Field
                id="lead-name"
                label="שם מלא"
                value={name}
                onChange={setName}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                id="lead-phone"
                label="טלפון"
                type="tel"
                value={phone}
                onChange={setPhone}
                error={errors.phone}
                autoComplete="tel"
                placeholder="050-000-0000"
              />
              <div>
                <label
                  htmlFor="lead-message"
                  className="mb-2 block text-xs tracking-[0.15em] text-sand/55"
                >
                  הודעה
                </label>
                <textarea
                  id="lead-message"
                  ref={messageRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full resize-none border border-sand/20 bg-bg px-4 py-3 text-sand outline-none transition-colors focus:border-gold"
                  placeholder="מתעניין/ת בדירת 4 חדרים…"
                />
              </div>
              <button
                type="submit"
                className="w-full border border-gold bg-gold px-6 py-4 text-sm font-semibold tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-transparent hover:text-gold"
              >
                שליחת פנייה
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  autoComplete?: string
  placeholder?: string
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  placeholder,
}: FieldProps) {
  const errId = `${id}-err`
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs tracking-[0.15em] text-sand/55"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`w-full border bg-bg px-4 py-3 text-sand outline-none transition-colors focus:border-gold ${
          error ? 'border-red-400/70' : 'border-sand/20'
        }`}
      />
      {error && (
        <p id={errId} role="alert" className="mt-2 text-xs text-red-300/90">
          {error}
        </p>
      )}
    </div>
  )
}
