import { Link, useNavigate } from 'react-router-dom'
import LoginForm from '../../components/LoginForm'

export default function ProLogin() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-pine">Para profesionales</p>
      <h1 className="mt-1 font-display text-2xl text-ink">Entra a tu panel</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Gestiona tus reservas, tarifas, horarios y evidencias de trabajo.
      </p>

      <LoginForm
        role="profesional"
        submitLabel="Entrar a mi panel"
        onSuccess={() => navigate('/pro', { replace: true })}
      />

      <p className="mt-4 text-center text-sm text-ink-soft">
        ¿Aún no ofreces tus servicios?{' '}
        <Link to="/registro?rol=profesional" className="font-semibold text-pine-deep underline">
          Regístrate como profesional
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-ink-soft">
        ¿Buscas contratar?{' '}
        <Link to="/login" className="font-semibold text-pine-deep underline">
          Entra como cliente
        </Link>
      </p>

      <div className="mt-6 rounded-lg border border-dashed border-line bg-surface p-3 text-xs text-ink-soft">
        Demo: <span className="font-semibold text-ink">marcela.ortiz@example.com</span> /{' '}
        <span className="font-semibold text-ink">demo1234</span> — tiene reservas, reseñas y evidencias.
      </div>
    </div>
  )
}
