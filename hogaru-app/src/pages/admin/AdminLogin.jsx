import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

// MVP local: credenciales fijas en código, sin backend de autenticación.
const ADMIN_USER = 'admin@hogaru.com'
const ADMIN_PASS = 'hogaru2026'
const SESSION_KEY = 'hogaru_admin_session'

export function isAdminAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === 'ok'
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  if (isAdminAuthed()) return <Navigate to="/admin" replace />

  function submit(e) {
    e.preventDefault()
    if (user.trim().toLowerCase() === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, 'ok')
      navigate('/admin')
    } else {
      setError('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <h1 className="font-display text-2xl text-ink">Panel administrativo</h1>
      <p className="mt-1 text-sm text-ink-soft">Acceso interno de Hogaru.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Correo</span>
          <input type="email" value={user} onChange={(e) => setUser(e.target.value)} className="input" autoFocus />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Contraseña</span>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="input"
          />
        </label>
        {error && <p className="text-sm text-brick">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Entrar
        </button>
        <p className="text-xs text-ink-soft">Demo local: admin@hogaru.com / hogaru2026</p>
      </form>
    </div>
  )
}
