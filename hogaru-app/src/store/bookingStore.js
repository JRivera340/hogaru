// Store simple sobre localStorage. Hidrata desde seed la primera vez,
// después el usuario manda: nuevas reservas y valoraciones se agregan aquí.

import { seedBookings, seedReviews } from '../data/seed'

const BOOKINGS_KEY = 'hogaru_bookings'
const REVIEWS_KEY = 'hogaru_reviews'

function readList(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // localStorage no disponible (modo privado, etc.) — la sesión sigue
    // funcionando en memoria, solo no persiste al recargar.
  }
}

export function getBookings() {
  return readList(BOOKINGS_KEY, seedBookings)
}

export function saveBooking(booking) {
  const list = getBookings()
  const withId = { ...booking, id: booking.id ?? `b${Date.now()}` }
  const next = [...list, withId]
  writeList(BOOKINGS_KEY, next)
  return withId
}

export function updateBookingStatus(bookingId, status) {
  const list = getBookings()
  const next = list.map((b) => (b.id === bookingId ? { ...b, status } : b))
  writeList(BOOKINGS_KEY, next)
  return next
}

export function getReviews() {
  return readList(REVIEWS_KEY, seedReviews)
}

export function saveReview(review) {
  const list = getReviews()
  const withId = { ...review, id: review.id ?? `r${Date.now()}` }
  const next = [...list, withId]
  writeList(REVIEWS_KEY, next)
  return withId
}

export function getReviewsForProfessional(professionalId) {
  return getReviews().filter((r) => r.professionalId === professionalId)
}

export function professionalRatingSummary(professionalId, baseRating, baseCount) {
  const reviews = getReviewsForProfessional(professionalId)
  if (reviews.length === 0) return { rating: baseRating, count: baseCount }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0) + baseRating * baseCount
  const count = reviews.length + baseCount
  return { rating: Math.round((sum / count) * 10) / 10, count }
}
