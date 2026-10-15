import Stars from '../../../components/Stars'
import { listUsers, setUserVerified } from '../../../store/authStore'
import { getBookings, getReviews } from '../../../store/bookingStore'

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className={`mt-1 font-display text-2xl ${tone === 'alert' ? 'text-gold' : 'text-ink'}`}>{value}</p>
    </div>
  )
}

export default function OverviewTab({ onChange, goToUsers }) {
  const users = listUsers()
  const bookings = getBookings()
  const reviews = getReviews()

  const pending = users.filter((u) => !u.verified && !u.suspended)
  const suspended = users.filter((u) => u.suspended)
  const byStatus = (s) => bookings.filter((b) => b.status === s).length
  const revenue = bookings.filter((b) => b.status === 'completada').reduce((acc, b) => acc + b.price, 0)
  const average = reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0

  function verify(id) {
    setUserVerified(id, true)
    onChange()
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Usuarios" value={users.length} />
        <Stat label="Clientes" value={users.filter((u) => u.role === 'cliente').length} />
        <Stat label="Profesionales" value={users.filter((u) => u.role === 'profesional').length} />
        <Stat label="Pendientes de verificar" value={pending.length} tone={pending.length ? 'alert' : undefined} />
        <Stat label="Suspendidos" value={suspended.length} />
        <Stat label="Reservas confirmadas" value={byStatus('confirmada')} />
        <Stat label="Reservas completadas" value={byStatus('completada')} />
        <Stat label="Ingresos completados" value={`$${revenue.toLocaleString('es-CO')}`} />
      </div>

      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <span>Valoración promedio de la plataforma:</span>
        <Stars value={average} size="text-xs" />
        <span>{reviews.length ? `${average.toFixed(1)} (${reviews.length})` : 'sin valoraciones'}</span>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Pendientes por verificar</h2>
          <button type="button" onClick={goToUsers} className="text-sm font-semibold text-pine-deep underline">
            Ver todos los usuarios
          </button>
        </div>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">No hay cuentas esperando verificación.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-surface">
            {pending.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{u.name}</p>
                  <p className="text-xs text-ink-soft">
                    {u.email} · {u.role === 'profesional' ? 'Profesional' : 'Cliente'} · registro{' '}
                    {new Date(u.createdAt).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <button type="button" onClick={() => verify(u.id)} className="btn-primary !px-3 !py-1.5 text-xs">
                  Verificar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
