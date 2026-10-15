import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNotificationsFor, markAllRead, unreadCount } from '../store/notificationStore'
import useStorageVersion from '../store/useStorageVersion'

function timeAgo(iso) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso)) / 60000))
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

export default function NotificationBell({ userId }) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState(0)
  const remote = useStorageVersion()
  const ref = useRef(null)

  // `local` y `remote` solo fuerzan una nueva lectura del store en cada render.
  void local
  void remote
  const items = getNotificationsFor(userId)
  const unread = unreadCount(userId)

  useEffect(() => {
    if (!open) return undefined
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function toggle() {
    if (open && unread > 0) markAllRead(userId)
    setOpen(!open)
    setLocal((n) => n + 1)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-label={unread ? `Avisos, ${unread} sin leer` : 'Avisos'}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-pine-soft"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 01-3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
          <p className="border-b border-line px-4 py-2.5 text-sm font-semibold text-ink">Avisos</p>
          <ul className="max-h-80 divide-y divide-line overflow-y-auto">
            {items.map((n) => (
              <li key={n.id} className={`px-4 py-3 ${n.read ? '' : 'bg-pine-soft/60'}`}>
                <p className="text-sm font-semibold text-ink">{n.title}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{n.body}</p>
                <p className="mt-1 text-[11px] text-ink-soft/70">{timeAgo(n.createdAt)}</p>
              </li>
            ))}
            {items.length === 0 && <li className="px-4 py-6 text-center text-sm text-ink-soft">Sin avisos todavía.</li>}
          </ul>
          <Link
            to="/mis-reservas"
            onClick={() => setOpen(false)}
            className="block border-t border-line px-4 py-2.5 text-center text-sm font-semibold text-pine-deep hover:bg-pine-soft"
          >
            Ver mis reservas
          </Link>
        </div>
      )}
    </div>
  )
}
