import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { listUsers } from '../../store/authStore'
import useStorageVersion from '../../store/useStorageVersion'
import { isAdminAuthed } from './AdminLogin'
import OverviewTab from './tabs/OverviewTab'
import UsersTab from './tabs/UsersTab'
import BookingsTab from './tabs/BookingsTab'
import ReviewsTab from './tabs/ReviewsTab'

const tabs = ['Resumen', 'Usuarios', 'Reservas', 'Valoraciones']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  // `setRefresh` re-renderiza el panel cuando el admin cambia algo (actualiza el
  // contador de pendientes sin perder filtros). `remote` sube cuando OTRA pestaña
  // modifica datos (p. ej. un registro nuevo) y vuelve a montar la pestaña activa.
  const [, setRefresh] = useState(0)
  const remote = useStorageVersion()

  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />

  const pending = listUsers().filter((u) => !u.verified && !u.suspended).length
  const onChange = () => setRefresh((n) => n + 1)

  function logout() {
    sessionStorage.removeItem('hogaru_admin_session')
    navigate('/admin/login')
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Panel administrativo</h1>
        <button onClick={logout} className="btn-secondary !px-3 !py-1.5 text-xs">
          Cerrar sesión
        </button>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${
              tab === i ? 'border-pine text-ink' : 'border-transparent text-ink-soft'
            }`}
          >
            {t}
            {t === 'Usuarios' && pending > 0 && (
              <span className="rounded-full bg-gold px-1.5 text-xs font-semibold text-white">{pending}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6" key={`${tab}-${remote}`}>
        {tab === 0 && <OverviewTab onChange={onChange} goToUsers={() => setTab(1)} />}
        {tab === 1 && <UsersTab onChange={onChange} />}
        {tab === 2 && <BookingsTab onChange={onChange} />}
        {tab === 3 && <ReviewsTab onChange={onChange} />}
      </div>
    </div>
  )
}
