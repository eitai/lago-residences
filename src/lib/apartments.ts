/* ================================================================== *
 *  Apartment selector data — static, frontend-only (PRD §6).
 *  No server, no DB. Prices are fictional (portfolio demo).
 * ================================================================== */

export type PlanId = 'r3' | 'r4' | 'r5' | 'mini' | 'penthouse'

export interface ApartmentType {
  id: PlanId
  /** Tab label, e.g. "4 חדרים". */
  tab: string
  /** Full name for the card headline. */
  name: string
  rooms: string
  /** Interior area (m²). */
  area: number
  /** Balcony area (m²). */
  balcony: number
  /** Air directions / aspect. */
  aspect: string
  /** Base price range in ₪ millions; null = "בליווי אישי". */
  priceFrom: number | null
  priceTo: number | null
  /** Floor bands this type is offered on. */
  bands: BandId[]
  /** One-line character note. */
  note: string
}

export type BandId = 'low' | 'mid' | 'high' | 'top'

export interface FloorBand {
  id: BandId
  label: string
  floors: string
  view: string
  /** Multiplier applied to the type's base price (higher = pricier). */
  factor: number
}

export const FLOOR_BANDS: FloorBand[] = [
  {
    id: 'low',
    label: 'קומות 3–8',
    floors: '3–8',
    view: 'נוף עיר וגגות טבריה',
    factor: 1.0,
  },
  {
    id: 'mid',
    label: 'קומות 9–16',
    floors: '9–16',
    view: 'נוף אגם חלקי מעל קו הרקיע',
    factor: 1.08,
  },
  {
    id: 'high',
    label: 'קומות 17–23',
    floors: '17–23',
    view: 'נוף אגם פתוח — עד רמת הגולן',
    factor: 1.18,
  },
  {
    id: 'top',
    label: 'קומה 24',
    floors: '24',
    view: 'נוף אגם מלא — קומת הפנטהאוז',
    factor: 1.28,
  },
]

export const APARTMENT_TYPES: ApartmentType[] = [
  {
    id: 'r3',
    tab: '3 חדרים',
    name: 'דירת 3 חדרים',
    rooms: '3 חדרים',
    area: 82,
    balcony: 13,
    aspect: 'מזרח–מערב · 2 כיווני אוויר',
    priceFrom: 2.4,
    priceTo: 2.9,
    bands: ['low', 'mid', 'high'],
    note: 'כניסה מושלמת לפרויקט — קומפקטית, מוארת, עם מרפסת שמש פונה לאגם.',
  },
  {
    id: 'r4',
    tab: '4 חדרים',
    name: 'דירת 4 חדרים',
    rooms: '4 חדרים',
    area: 112,
    balcony: 17,
    aspect: '3 כיווני אוויר',
    priceFrom: 3.2,
    priceTo: 3.9,
    bands: ['low', 'mid', 'high'],
    note: 'הלב של הפרויקט — סלון פתוח, מטבח אי ומרפסת מוארכת מול קו המים.',
  },
  {
    id: 'r5',
    tab: '5 חדרים',
    name: 'דירת 5 חדרים',
    rooms: '5 חדרים',
    area: 146,
    balcony: 23,
    aspect: '3 כיווני אוויר · פינתי',
    priceFrom: 4.5,
    priceTo: 5.6,
    bands: ['mid', 'high'],
    note: 'למשפחה שרוצה מרחב — סוויטת הורים, ממ"ד וחדר עבודה נפרד.',
  },
  {
    id: 'mini',
    tab: 'מיני-פנטהאוז',
    name: 'מיני-פנטהאוז',
    rooms: '4.5 חדרים · דופלקס',
    area: 178,
    balcony: 46,
    aspect: 'פינתי · 3 כיווני אוויר',
    priceFrom: 6.8,
    priceTo: 8.2,
    bands: ['high', 'top'],
    note: 'דופלקס עם מרפסת פינתית רחבה — הרגשה של בית פרטי בגובה.',
  },
  {
    id: 'penthouse',
    tab: 'פנטהאוז',
    name: 'פנטהאוז LAGO',
    rooms: '5 חדרים · גג פרטי',
    area: 240,
    balcony: 120,
    aspect: 'פנורמי · 4 כיווני אוויר',
    priceFrom: null,
    priceTo: null,
    bands: ['top'],
    note: 'יחידה אחת בלבד. מרפסת 120 מ״ר וגג פרטי מעל האגם — בליווי אישי.',
  },
]

/** ₪ millions → "₪2.6M". */
export function formatPrice(m: number): string {
  return `₪${m.toFixed(1)}M`
}

/** Band-adjusted starting price for a type, or null for "בליווי אישי". */
export function startingPrice(type: ApartmentType, band: FloorBand): number | null {
  if (type.priceFrom == null) return null
  return Math.round(type.priceFrom * band.factor * 10) / 10
}

export function topPrice(type: ApartmentType, band: FloorBand): number | null {
  if (type.priceTo == null) return null
  return Math.round(type.priceTo * band.factor * 10) / 10
}

export const bandById = (id: BandId): FloorBand =>
  FLOOR_BANDS.find((b) => b.id === id)!
