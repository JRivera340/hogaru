import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const next = params.get('next') || location.state?.from || '/explorar'

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-pine">Paso previo a reservar</p>
      <h1 className="mt-1 font-display text-2xl text-ink">Inicia sesión</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Tus reservas, pagos y valoraciones quedan ligadas a tu cuenta.
      </p>

      <LoginForm
        role="cliente"
        submitLabel="Entrar y continuar"
        onSuccess={() => navigate(next, { replace: true })}
      />

      <p className="mt-4 text-center text-sm text-ink-soft">
        ¿Sin cuenta?{' '}
        <Link to={`/registro?next=${encodeURIComponent(next)}`} className="font-semibold text-pine-deep underline">
          Crea una en segundos
        </Link>
      </p>

      <p className="mt-2 text-center text-sm text-ink-soft">
        ¿Ofreces servicios?{' '}
        <Link to="/pro/login" className="font-semibold text-pine-deep underline">
          Soy profesional
        </Link>
      </p>

      <div className="mt-6 rounded-lg border border-dashed border-line bg-surface p-3 text-xs text-ink-soft">
        Demo: <span className="font-semibold text-ink">juanc.restrepo@example.com</span> /{' '}
        <span className="font-semibold text-ink">demo1234</span> — así ves las reservas de ejemplo.
      </div>
    </div>
  )
}
