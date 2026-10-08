import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} state={{ from: location.pathname }} replace />
  }
  return children
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
        <Route path="/reservar/:id" element={<RequireAuth><Reservar /></RequireAuth>} />
        <Route path="/pago" element={<RequireAuth><Pago /></RequireAuth>} />
        <Route path="/valorar/:bookingId" element={<RequireAuth><Valorar /></RequireAuth>} />
        <Route path="/mis-reservas" element={<RequireAuth><MisReservas /></RequireAuth>} />
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
