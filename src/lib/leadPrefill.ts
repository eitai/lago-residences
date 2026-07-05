/**
 * Lightweight bridge between the apartment selector and the lead form:
 * clicking "לתיאום סיור" on a card dispatches this event with a prefilled
 * message; the form listens, fills its textarea and focuses. Avoids
 * threading props through the whole section list.
 */
export const BOOK_EVENT = 'lago:book-tour'

export interface BookDetail {
  message: string
}

export function requestBooking(message: string): void {
  window.dispatchEvent(
    new CustomEvent<BookDetail>(BOOK_EVENT, { detail: { message } }),
  )
}
