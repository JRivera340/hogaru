import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import { useAuth } from './store/AuthContext'
import Landing from './pages/Landing'
import Explorar from './pages/Explorar'
import ProfessionalDetail from './pages/ProfessionalDetail'
import Reservar from './pages/Reservar'
import Pago from './pages/Pago'
import Valorar from './pages/Valorar'
import MisReservas from './pages/MisReservas'
import Login from './pages/Login'
import Registro from './pages/Registro'
import ProLogin from './pages/pro/ProLogin'
import ProDashboard from './pages/pro/ProDashboard'
import ProHelp from './pages/pro/ProHelp'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function RequireAuth({ children, role = 'cliente', requireVerified = false }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    if (role === 'profesional') return <Navigate to="/pro/login" replace />
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} state={{ from: location.pathname }} replace />
  }
  if (user.role !== role) {
    return <Navigate to={user.role === 'profesional' ? '/pro' : '/explorar'} replace />
  }
  if (requireVerified && !user.verified) return <PendingVerification />
  return children
}

function PendingVerification() {
  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="font-display text-2xl text-ink">Tu cuenta está pendiente de verificación</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Hogarú revisa cada cuenta antes de permitir reservas. Mientras tanto puedes explorar profesionales y
        ver sus perfiles.
      </p>
      <Link to="/explorar" className="btn-secondary mt-6 inline-block">
        Seguir explorando
      </Link>
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-paper">
      {!isAdmin && <NavBar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/profesional/:id" element={<ProfessionalDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reservar/:id" element={<RequireAuth requireVerified><Reservar /></RequireAuth>} />
        <Route path="/pago" element={<RequireAuth requireVerified><Pago /></RequireAuth>} />
        <Route path="/valorar/:bookingId" element={<RequireAuth><Valorar /></RequireAuth>} />
        <Route path="/mis-reservas" element={<RequireAuth><MisReservas /></RequireAuth>} />
        <Route path="/pro/login" element={<ProLogin />} />
        <Route path="/pro" element={<RequireAuth role="profesional"><ProDashboard /></RequireAuth>} />
        <Route path="/pro/ayuda" element={<RequireAuth role="profesional"><ProHelp /></RequireAuth>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="font-display text-2xl text-ink">Página no encontrada</h1>
      <p className="mt-2 text-sm text-ink-soft">Revisa el enlace o vuelve al inicio.</p>
    </div>
  )
}
