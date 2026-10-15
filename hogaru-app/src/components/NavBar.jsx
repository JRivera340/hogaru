import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const clientLinks = [
  { to: '/explorar', label: 'Para hogares' },
  { to: '/mis-reservas', label: 'Mis reservas' },
]
const proLinks = [{ to: '/pro', label: 'Mi panel' }]
const guestLinks = [
  { to: '/explorar', label: 'Para hogares' },
  { to: '/pro/login', label: 'Soy profesional' },
]

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = !user ? guestLinks : user.role === 'profesional' ? proLinks : clientLinks

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <NavLink to="/" aria-label="Ir al inicio de Hogarú" className="shrink-0">
          <img src="/hogaru-logo.svg" alt="Hogarú" className="h-8 w-auto sm:h-9" />
        </NavLink>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `hidden rounded-full px-3 py-2 text-sm font-semibold sm:inline ${
                  isActive ? 'text-pine' : 'text-ink hover:text-pine'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <span className="ml-1 flex items-center gap-2">
              <span className="hidden max-w-28 truncate text-sm font-semibold text-ink sm:inline">
                {user.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-pine px-4 py-1.5 text-sm font-semibold text-pine hover:bg-pine-soft"
              >
                Salir
              </button>
            </span>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-pine px-4 py-1.5 text-sm font-semibold text-pine hover:bg-pine-soft"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
