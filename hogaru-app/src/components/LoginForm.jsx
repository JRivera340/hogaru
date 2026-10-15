import { useState } from 'react'
import { useAuth } from '../store/AuthContext'

export default function LoginForm({ role, submitLabel, onSuccess }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const user = login({ email, password, role })
      onSuccess(user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
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
        {submitLabel}
      </button>
    </form>
  )
}
