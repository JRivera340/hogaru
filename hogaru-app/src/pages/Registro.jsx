import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function Registro() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const next = params.get('next') || location.state?.from || '/explorar'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    setError('')
    try {
      register({ name, email, password })
      navigate(next, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-pine">Empieza a reservar</p>
      <h1 className="mt-1 font-display text-2xl text-ink">Crea tu cuenta</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Sin llamadas ni papeleo: con tu cuenta reservas, pagas y valoras en minutos.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="¿Cómo te llamas?"
            className="input"
            autoFocus
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="input"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="input"
            autoComplete="new-password"
          />
        </label>
        {error && <p className="text-sm text-brick">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Crear cuenta y continuar
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-soft">
        ¿Ya tienes cuenta?{' '}
        <Link to={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-pine-deep underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
