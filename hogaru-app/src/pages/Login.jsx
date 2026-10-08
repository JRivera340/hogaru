import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const next = params.get('next') || location.state?.from || '/explorar'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    setError('')
    try {
      login({ email, password })
      navigate(next, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-pine">Paso previo a reservar</p>
      <h1 className="mt-1 font-display text-2xl text-ink">Inicia sesión</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Tus reservas, pagos y valoraciones quedan ligadas a tu cuenta.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="input"
            autoFocus
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-brick">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Entrar y continuar
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-soft">
        ¿Sin cuenta?{' '}
        <Link to={`/registro?next=${encodeURIComponent(next)}`} className="font-semibold text-pine-deep underline">
          Crea una en segundos
        </Link>
      </p>

      <div className="mt-6 rounded-lg border border-dashed border-line bg-surface p-3 text-xs text-ink-soft">
        Demo: <span className="font-semibold text-ink">juanc.restrepo@example.com</span> /{' '}
        <span className="font-semibold text-ink">demo1234</span> — así ves las reservas de ejemplo.
      </div>
    </div>
  )
}
