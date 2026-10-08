import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Stars from '../../components/Stars'
import { professionals, services, dayLabels } from '../../data/seed'
import { getBookings, getReviews, professionalRatingSummary } from '../../store/bookingStore'
import { isAdminAuthed } from './AdminLogin'

const tabs = ['Empleados', 'Reservas', 'Valoraciones']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />

  function logout() {
    sessionStorage.removeItem('hogaru_admin_session')
    navigate('/admin/login')
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Panel administrativo</h1>
        <button onClick={logout} className="btn-secondary !px-3 !py-1.5 text-xs">
          Cerrar sesión
        </button>
      </div>

      <div className="mt-6 flex gap-1 border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium ${
              tab === i ? 'border-pine text-ink' : 'border-transparent text-ink-soft'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 0 && <EmployeesTab />}
        {tab === 1 && <BookingsTab />}
        {tab === 2 && <ReviewsTab />}
      </div>
    </div>
  )
}

function EmployeesTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink-soft">
            <th className="py-2 pr-4 font-medium">Nombre</th>
            <th className="py-2 pr-4 font-medium">Zona</th>
            <th className="py-2 pr-4 font-medium">Servicios</th>
            <th className="py-2 pr-4 font-medium">Verificada</th>
            <th className="py-2 pr-4 font-medium">Rating</th>
          </tr>
        </thead>
        <tbody>
          {professionals.map((p) => {
            const { rating, count } = professionalRatingSummary(p.id, p.rating, p.reviewCount)
            return (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="py-2.5 pr-4 font-medium text-ink">{p.name}</td>
                <td className="py-2.5 pr-4 text-ink-soft">{p.zone}</td>
                <td className="py-2.5 pr-4 text-ink-soft">
                  {p.services.map((s) => services.find((sv) => sv.id === s)?.label).join(', ')}
                </td>
                <td className="py-2.5 pr-4">
                  {p.verified ? (
                    <span className="stamp !py-0.5">Verificada</span>
                  ) : (
                    <span className="text-ink-soft">Pendiente</span>
                  )}
                </td>
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-1.5">
                    <Stars value={rating} size="text-xs" />
                    <span className="text-ink-soft">
                      {rating} ({count})
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function BookingsTab() {
  const bookings = getBookings().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink-soft">
            <th className="py-2 pr-4 font-medium">Cliente</th>
            <th className="py-2 pr-4 font-medium">Profesional</th>
            <th className="py-2 pr-4 font-medium">Servicio</th>
            <th className="py-2 pr-4 font-medium">Fecha</th>
            <th className="py-2 pr-4 font-medium">Estado</th>
            <th className="py-2 pr-4 font-medium">Precio</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const pro = professionals.find((p) => p.id === b.professionalId)
            return (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="py-2.5 pr-4 font-medium text-ink">{b.userName}</td>
                <td className="py-2.5 pr-4 text-ink-soft">{pro?.name}</td>
                <td className="py-2.5 pr-4 text-ink-soft">
                  {services.find((s) => s.id === b.service)?.label}
                </td>
                <td className="py-2.5 pr-4 text-ink-soft">
                  {dayLabels[b.day]} {b.date}, {b.time}
                </td>
                <td className="py-2.5 pr-4">
                  <span className="rounded-full bg-paper-warm px-2 py-0.5 text-xs capitalize text-ink-soft">
                    {b.status}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-ink-soft">${b.price.toLocaleString('es-CO')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {bookings.length === 0 && <p className="py-8 text-center text-ink-soft">Sin reservas todavía.</p>}
    </div>
  )
}

function ReviewsTab() {
  const reviews = getReviews().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return (
    <ul className="space-y-3">
      {reviews.map((r) => {
        const pro = professionals.find((p) => p.id === r.professionalId)
        return (
          <li key={r.id} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">
                {r.userName} → {pro?.name}
              </p>
              <Stars value={r.rating} size="text-xs" />
            </div>
            {r.comment && <p className="mt-1.5 text-sm text-ink-soft">{r.comment}</p>}
          </li>
        )
      })}
      {reviews.length === 0 && <p className="py-8 text-center text-ink-soft">Sin valoraciones todavía.</p>}
    </ul>
  )
}
