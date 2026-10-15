import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { services } from '../data/seed'

const roles = [
  { id: 'cliente', title: 'Busco un servicio', hint: 'Reservo aseo para mi hogar' },
  { id: 'profesional', title: 'Ofrezco un servicio', hint: 'Quiero recibir reservas' },
]

export default function Registro() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const next = params.get('next') || location.state?.from || '/explorar'

  const [role, setRole] = useState(params.get('rol') === 'profesional' ? 'profesional' : 'cliente')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [service, setService] = useState(services[0].id)
  const [zone, setZone] = useState('')
  const [error, setError] = useState('')

  const isPro = role === 'profesional'

  function submit(e) {
    e.preventDefault()
    setError('')
    try {
      register({ name, email, password, role, service, zone })
      navigate(isPro ? '/pro' : next, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-pine">
        {isPro ? 'Únete como profesional' : 'Empieza a reservar'}
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">Crea tu cuenta</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {isPro
          ? 'Después podrás definir tus tarifas, horarios y mostrar trabajos que ya hiciste.'
          : 'Sin llamadas ni papeleo: con tu cuenta reservas, pagas y valoras en minutos.'}
      </p>

      {isPro && (
        <ol className="mt-4 space-y-1 rounded-lg bg-paper-warm p-3 text-sm text-ink-soft">
          <li><span className="font-semibold text-ink">1.</span> Crea tu cuenta con estos datos.</li>
          <li><span className="font-semibold text-ink">2.</span> Completa tu perfil: precio, horas y fotos de trabajos.</li>
          <li><span className="font-semibold text-ink">3.</span> Recibe reservas y avisa a las familias desde tu panel.</li>
        </ol>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de cuenta">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={role === r.id}
            onClick={() => setRole(r.id)}
            className={`rounded-lg border p-3 text-left ${
              role === r.id ? 'border-pine bg-pine-soft' : 'border-line bg-surface hover:border-pine'
            }`}
          >
            <span className="block text-sm font-semibold text-ink">{r.title}</span>
            <span className="mt-0.5 block text-xs text-ink-soft">{r.hint}</span>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
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

        {isPro && (
          <>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink">¿Qué actividad realizas?</span>
              <select value={service} onChange={(e) => setService(e.target.value)} className="input">
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs text-ink-soft">Luego puedes agregar más servicios.</span>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink">Zona donde trabajas</span>
              <input
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="Ej. Chapinero, Bogotá"
                className="input"
              />
            </label>
          </>
        )}

        {error && <p className="text-sm text-brick">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          {isPro ? 'Crear cuenta de profesional' : 'Crear cuenta y continuar'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-soft">
        ¿Ya tienes cuenta?{' '}
        <Link
          to={isPro ? '/pro/login' : `/login?next=${encodeURIComponent(next)}`}
          className="font-semibold text-pine-deep underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
