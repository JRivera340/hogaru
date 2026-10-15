import { useState } from 'react'
import { Link } from 'react-router-dom'
import { services, dayLabels } from '../data/seed'
import { getProfessionals } from '../store/proStore'
import useStorageVersion from '../store/useStorageVersion'
import { useAuth } from '../store/AuthContext'
import { getBookings, getReviews, statusLabel, updateBookingStatus } from '../store/bookingStore'

const badgeStyle = {
  pendiente: 'bg-gold/15 text-gold',
  confirmada: 'bg-pine-soft text-pine-deep',
  en_camino: 'bg-pine text-surface',
  completada: 'bg-pine-soft text-pine-deep',
  rechazada: 'bg-paper-warm text-ink-soft',
  cancelada: 'bg-paper-warm text-ink-soft',
}

// Pasos que ve el cliente; cada uno se marca cuando la reserva ya pasó por ese estado.
const timeline = [
  { status: 'pendiente', label: 'Reservada' },
  { status: 'confirmada', label: 'Aceptada' },
  { status: 'en_camino', label: 'En camino' },
  { status: 'completada', label: 'Realizada' },
]

function reachedStatuses(b) {
  const reached = new Set((b.statusHistory ?? []).map((h) => h.status))
  reached.add('pendiente')
  const order = timeline.map((t) => t.status)
  const idx = order.indexOf(b.status)
  if (idx >= 0) order.slice(0, idx + 1).forEach((st) => reached.add(st))
  return reached
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
    updateBookingStatus(id, 'cancelada', { by: 'cliente' })
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
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyle[b.status]}`}>
                  {statusLabel[b.status] ?? b.status}
                </span>
              </div>

              {['pendiente', 'confirmada', 'en_camino', 'completada'].includes(b.status) && (
                <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  {timeline.map((t, i) => {
                    const done = reachedStatuses(b).has(t.status)
                    return (
                      <li key={t.status} className="flex items-center gap-2">
                        <span className={done ? 'font-semibold text-pine-deep' : 'text-ink-soft/60'}>
                          {done ? '●' : '○'} {t.label}
                        </span>
                        {i < timeline.length - 1 && <span className="h-px w-4 bg-line" />}
                      </li>
                    )
                  })}
                </ol>
              )}
              {b.status === 'en_camino' && (
                <p className="mt-2 text-sm font-semibold text-pine-deep">
                  {pro?.name ?? 'Tu profesional'} va en camino
                  {b.etaMinutes ? ` · llega en unos ${b.etaMinutes} min` : ''}.
                </p>
              )}
              {b.status === 'pendiente' && (
                <p className="mt-2 text-xs text-ink-soft">
                  Esperando que {pro?.name ?? 'la profesional'} acepte tu reserva.
                </p>
              )}
              {b.status === 'rechazada' && (
                <p className="mt-2 text-xs text-ink-soft">
                  No pudo atender esta reserva. <Link to="/explorar" className="underline">Elige otra profesional</Link>.
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {['pendiente', 'confirmada'].includes(b.status) && (
                  <>
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
