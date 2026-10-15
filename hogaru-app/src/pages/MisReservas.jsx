import { useState } from 'react'
import { Link } from 'react-router-dom'
import { services, dayLabels } from '../data/seed'
import { getProfessionals } from '../store/proStore'
import useStorageVersion from '../store/useStorageVersion'
import { useAuth } from '../store/AuthContext'
import { getBookings, getReviews, updateBookingStatus } from '../store/bookingStore'

const statusLabel = {
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

// Se vuelve a montar cuando otra pestaña cambia datos (p. ej. la profesional completa un servicio).
export default function MisReservas() {
  return <MisReservasView key={useStorageVersion()} />
}

function MisReservasView() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState(() => loadBookings(user.id))
  const professionals = getProfessionals()
  const reviewedBookingIds = new Set(getReviews().map((r) => r.bookingId))

  function cancel(id) {
    updateBookingStatus(id, 'cancelada')
    setBookings(loadBookings(user.id))
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-3xl text-ink">Mis reservas</h1>
      <p className="mt-1 text-sm text-ink-soft">{user.name} · {user.email}</p>

      {!user.verified && (
        <p className="mt-4 rounded-lg border border-dashed border-pine bg-pine-soft p-3 text-sm text-pine-deep">
          Tu cuenta está pendiente de verificación. Podrás reservar cuando Hogarú la apruebe.
        </p>
      )}

      {bookings.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-line p-8 text-center">
          <p className="text-ink-soft">Todavía no tienes reservas.</p>
          <Link to="/explorar" className="btn-primary mt-4 inline-block">
            Buscar profesional
          </Link>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {bookings.map((b) => {
          const pro = professionals.find((p) => p.id === b.professionalId)
          const alreadyReviewed = reviewedBookingIds.has(b.id)
          return (
            <li key={b.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg text-ink">{pro?.name ?? 'Profesional'}</p>
                  <p className="text-sm text-ink-soft">
                    {services.find((s) => s.id === b.service)?.label} · {dayLabels[b.day]} {b.date}, {b.time}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">{b.address}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    b.status === 'completada'
                      ? 'bg-pine-soft text-pine-deep'
                      : b.status === 'cancelada'
                        ? 'bg-paper-warm text-ink-soft'
                        : 'bg-gold/15 text-gold'
                  }`}
                >
                  {statusLabel[b.status] ?? b.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {b.status === 'confirmada' && (
                  <>
                    <span className="text-xs text-ink-soft">
                      {pro?.name ?? 'La profesional'} marcará el servicio como realizado.
                    </span>
                    <button
                      type="button"
                      onClick={() => cancel(b.id)}
                      className="btn-secondary !px-3 !py-1.5 text-xs"
                    >
                      Cancelar reserva
                    </button>
                  </>
                )}
                {b.status === 'completada' && !alreadyReviewed && (
                  <Link to={`/valorar/${b.id}`} className="btn-primary !px-3 !py-1.5 text-xs">
                    Valorar servicio
                  </Link>
                )}
                {b.status === 'completada' && alreadyReviewed && (
                  <span className="text-xs text-ink-soft">Ya valoraste este servicio ✓</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function loadBookings(userId) {
  return getBookings()
    .filter((b) => b.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
