// Store simple sobre localStorage. Hidrata desde seed la primera vez,
// después el usuario manda: nuevas reservas y valoraciones se agregan aquí.
//
// Ciclo de una reserva:
//   pendiente → confirmada → en_camino → completada
//   pendiente → rechazada            (la profesional no puede)
//   cualquiera abierta → cancelada

import { dayLabels, seedBookings, seedReviews } from '../data/seed'
import { getProfessional } from './proStore'
import { notify } from './notificationStore'

const BOOKINGS_KEY = 'hogaru_bookings_v3'
const REVIEWS_KEY = 'hogaru_reviews_v2'

// Reservas que todavía ocupan la franja y que impiden borrar una cuenta.
export const OPEN_STATUSES = ['pendiente', 'confirmada', 'en_camino']

const transitions = {
  pendiente: ['confirmada', 'rechazada', 'cancelada'],
  confirmada: ['en_camino', 'completada', 'cancelada'],
  en_camino: ['completada', 'cancelada'],
}

export const statusLabel = {
  pendiente: 'Pendiente de confirmación',
  confirmada: 'Confirmada',
  en_camino: 'En camino',
  completada: 'Completada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
}

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
  const now = booking.createdAt ?? new Date().toISOString()
  const withId = {
    ...booking,
    id: booking.id ?? `b${Date.now()}`,
    statusHistory: booking.statusHistory ?? [{ status: booking.status, at: now }],
  }
  writeList(BOOKINGS_KEY, [...list, withId])
  return withId
}

function noticeFor(booking, status, extra) {
  const pro = getProfessional(booking.professionalId)
  const who = pro?.name ?? 'La profesional'
  const when = `${dayLabels[booking.day] ?? ''} ${booking.date}, ${booking.time}`.trim()
  const notices = {
    confirmada: {
      title: 'Reserva aceptada',
      body: `${who} aceptó tu reserva del ${when}.`,
    },
    rechazada: {
      title: 'Reserva no disponible',
      body: `${who} no puede atender tu reserva del ${when}. Elige otro horario o profesional.`,
    },
    en_camino: {
      title: 'Tu profesional va en camino',
      body: extra?.etaMinutes
        ? `${who} va en camino y llega en unos ${extra.etaMinutes} minutos.`
        : `${who} va en camino a tu dirección.`,
    },
    completada: {
      title: 'Servicio realizado',
      body: `${who} terminó el servicio. Cuéntanos qué tal estuvo y valóralo.`,
    },
    cancelada: {
      title: 'Reserva cancelada',
      body: `La reserva del ${when} con ${who} fue cancelada.`,
    },
  }
  return notices[status]
}

// Cambia el estado solo si la transición es válida y avisa al cliente.
// `by` indica quién actúa: 'cliente' no genera aviso para sí mismo.
export function updateBookingStatus(bookingId, status, { by, etaMinutes } = {}) {
  const list = getBookings()
  let changed = null
  const next = list.map((b) => {
    if (b.id !== bookingId || !transitions[b.status]?.includes(status)) return b
    changed = {
      ...b,
      status,
      ...(status === 'en_camino' ? { etaMinutes: etaMinutes ?? null } : {}),
      statusHistory: [...(b.statusHistory ?? [{ status: b.status, at: b.createdAt }]), { status, at: new Date().toISOString() }],
    }
    return changed
  })
  if (!changed) return next
  writeList(BOOKINGS_KEY, next)
  const notice = noticeFor(changed, status, { etaMinutes })
  if (notice && by !== 'cliente' && changed.userId) {
    notify({ userId: changed.userId, bookingId, type: status, ...notice })
  }
  return next
}

export const acceptBooking = (id) => updateBookingStatus(id, 'confirmada', { by: 'profesional' })
export const rejectBooking = (id) => updateBookingStatus(id, 'rechazada', { by: 'profesional' })
export const markOnTheWay = (id, etaMinutes) => updateBookingStatus(id, 'en_camino', { by: 'profesional', etaMinutes })
export const completeBooking = (id) => updateBookingStatus(id, 'completada', { by: 'profesional' })

export function getBookingsForProfessional(professionalId) {
  return getBookings().filter((b) => b.professionalId === professionalId)
}

// Una franja está ocupada mientras haya una reserva abierta para esa profesional, fecha y hora.
export function isSlotTaken(professionalId, date, time) {
  return getBookings().some(
    (b) =>
      b.professionalId === professionalId &&
      b.date === date &&
      b.time === time &&
      OPEN_STATUSES.includes(b.status),
  )
}

export function hasReviewForBooking(bookingId) {
  return getReviews().some((r) => r.bookingId === bookingId)
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

export function deleteReview(reviewId) {
  writeList(REVIEWS_KEY, getReviews().filter((r) => r.id !== reviewId))
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
