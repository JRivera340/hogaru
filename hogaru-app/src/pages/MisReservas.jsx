import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { professionals, services, dayLabels } from '../data/seed'
import { useAuth } from '../store/AuthContext'
import { getBookings, getReviews, updateBookingStatus } from '../store/bookingStore'

const statusLabel = {
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

export default function MisReservas() {
  const { user } = useAuth()
  const [, forceRefresh] = useState(0)

  const bookings = useMemo(
    () =>
      getBookings()
        .filter((b) => b.userId === user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    // refrescamos cuando cambia el contador
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [forceRefresh],
  )
  const reviews = getReviews()
  const reviewedBookingIds = new Set(reviews.map((r) => r.bookingId))

  function markCompleted(id) {
    updateBookingStatus(id, 'completada')
    forceRefresh((n) => n + 1)
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-3xl text-ink">Mis reservas</h1>
      <p className="mt-1 text-sm text-ink-soft">{user.name} · {user.email}</p>

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
                  <button
                    type="button"
                    onClick={() => markCompleted(b.id)}
                    className="btn-secondary !px-3 !py-1.5 text-xs"
                  >
                    Marcar como realizada
                  </button>
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
