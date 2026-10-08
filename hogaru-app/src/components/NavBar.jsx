import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const links = [
  { to: '/explorar', label: 'Explorar' },
  { to: '/mis-reservas', label: 'Mis reservas' },
]

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <NavLink to="/" className="font-display text-xl text-ink">
          hogaru
        </NavLink>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  isActive
                    ? 'bg-pine-soft text-pine-deep'
                    : 'text-ink-soft hover:bg-paper-warm'
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
                className="rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper-warm"
              >
                Salir
              </button>
            </span>
          ) : (
            <span className="ml-1 flex items-center gap-1">
              <Link to="/login" className="rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper-warm">
                Ingresar
              </Link>
              <Link to="/registro" className="btn-primary !px-4 !py-2 text-sm">
                Crear cuenta
              </Link>
            </span>
          )}
        </nav>
      </div>
    </header>
  )
}
