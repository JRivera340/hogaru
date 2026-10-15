import { useState } from 'react'
import ConfirmDialog from '../../../components/ConfirmDialog'
import { services, dayLabels } from '../../../data/seed'
import { getProfessionals } from '../../../store/proStore'
import { OPEN_STATUSES, getBookings, statusLabel, updateBookingStatus } from '../../../store/bookingStore'

const statuses = ['todos', 'pendiente', 'confirmada', 'en_camino', 'completada', 'rechazada', 'cancelada']

export default function BookingsTab({ onChange }) {
  const [bookings, setBookings] = useState(() => getBookings())
  const [status, setStatus] = useState('todos')
  const [proFilter, setProFilter] = useState('todos')
  const [toCancel, setToCancel] = useState(null)
  const professionals = getProfessionals()

  const visible = bookings
    .filter((b) => status === 'todos' || b.status === status)
    .filter((b) => proFilter === 'todos' || b.professionalId === proFilter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  function cancel() {
    updateBookingStatus(toCancel.id, 'cancelada', { by: 'admin' })
    setBookings(getBookings())
    setToCancel(null)
    onChange()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                status === s ? 'border-pine bg-pine-soft text-pine-deep' : 'border-line text-ink-soft hover:border-pine'
              }`}
            >
              {s === 'todos' ? 'Todos' : statusLabel[s]}
            </button>
          ))}
        </div>
        <select
          value={proFilter}
          onChange={(e) => setProFilter(e.target.value)}
          aria-label="Filtrar por profesional"
          className="input !w-auto !py-1.5 text-xs"
        >
          <option value="todos">Todas las profesionales</option>
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft">
              <th className="py-2 pr-4 font-medium">Cliente</th>
              <th className="py-2 pr-4 font-medium">Profesional</th>
              <th className="py-2 pr-4 font-medium">Servicio</th>
              <th className="py-2 pr-4 font-medium">Fecha</th>
              <th className="py-2 pr-4 font-medium">Estado</th>
              <th className="py-2 pr-4 font-medium">Precio</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => {
              const pro = professionals.find((p) => p.id === b.professionalId)
              return (
                <tr key={b.id} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-ink">{b.userName}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{pro?.name ?? 'Cuenta eliminada'}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{services.find((s) => s.id === b.service)?.label}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">
                    {dayLabels[b.day]} {b.date}, {b.time}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="rounded-full bg-paper-warm px-2 py-0.5 text-xs text-ink-soft">{statusLabel[b.status] ?? b.status}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-ink-soft">${b.price.toLocaleString('es-CO')}</td>
                  <td className="py-2.5">
                    {OPEN_STATUSES.includes(b.status) && (
                      <button
                        type="button"
                        onClick={() => setToCancel(b)}
                        className="rounded-full border border-line px-2.5 py-1 text-xs text-brick-deep hover:border-brick"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {visible.length === 0 && <p className="py-8 text-center text-ink-soft">Sin reservas para este filtro.</p>}
      </div>

      {toCancel && (
        <ConfirmDialog
          title="Cancelar reserva"
          confirmLabel="Cancelar reserva"
          danger
          onCancel={() => setToCancel(null)}
          onConfirm={cancel}
        >
          Se cancela la reserva de {toCancel.userName} del {toCancel.date} a las {toCancel.time} y la franja queda libre.
        </ConfirmDialog>
      )}
    </div>
  )
}
