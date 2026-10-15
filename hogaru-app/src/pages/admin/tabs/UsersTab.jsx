import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../../../components/ConfirmDialog'
import { services } from '../../../data/seed'
import {
  deleteUser,
  listUsers,
  resetUserPassword,
  setUserSuspended,
  setUserVerified,
  updateUser,
} from '../../../store/authStore'
import { getProfessional } from '../../../store/proStore'

const roleFilters = [
  { id: 'todos', label: 'Todos' },
  { id: 'cliente', label: 'Clientes' },
  { id: 'profesional', label: 'Profesionales' },
]
const statusFilters = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'verificado', label: 'Verificados' },
  { id: 'suspendido', label: 'Suspendidos' },
]

function statusOf(u) {
  if (u.suspended) return 'suspendido'
  return u.verified ? 'verificado' : 'pendiente'
}

const statusStyle = {
  verificado: 'bg-pine-soft text-pine-deep',
  pendiente: 'bg-gold/15 text-gold',
  suspendido: 'bg-paper-warm text-ink-soft line-through',
}
const statusText = { verificado: 'Verificado', pendiente: 'Pendiente', suspendido: 'Suspendido' }

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}

export default function UsersTab({ onChange }) {
  const [users, setUsers] = useState(() => listUsers())
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('todos')
  const [status, setStatus] = useState('todos')
  const [dialog, setDialog] = useState(null)
  const [notice, setNotice] = useState('')

  function reload() {
    setUsers(listUsers())
    onChange()
  }

  function run(action, success) {
    try {
      action()
      setNotice(success)
      reload()
    } catch (err) {
      setNotice(err.message)
    }
    setDialog(null)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users
      .filter((u) => role === 'todos' || u.role === role)
      .filter((u) => status === 'todos' || statusOf(u) === status)
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .sort((a, b) => {
        const order = { pendiente: 0, verificado: 1, suspendido: 2 }
        return order[statusOf(a)] - order[statusOf(b)] || new Date(b.createdAt) - new Date(a.createdAt)
      })
  }, [users, query, role, status])

  const pendingCount = users.filter((u) => statusOf(u) === 'pendiente').length

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o correo"
          aria-label="Buscar usuarios"
          className="input sm:max-w-xs"
        />
        <p className="text-sm text-ink-soft">
          {filtered.length} de {users.length} usuarios ·{' '}
          <span className="font-semibold text-ink">{pendingCount} por verificar</span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <FilterGroup label="Rol" options={roleFilters} value={role} onChange={setRole} />
        <FilterGroup label="Estado" options={statusFilters} value={status} onChange={setStatus} />
      </div>

      {notice && (
        <p role="status" className="mt-4 rounded-lg border border-line bg-paper-warm px-3 py-2 text-sm text-ink">
          {notice}
        </p>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft">
              <th className="py-2 pr-4 font-medium">Usuario</th>
              <th className="py-2 pr-4 font-medium">Rol</th>
              <th className="py-2 pr-4 font-medium">Registro</th>
              <th className="py-2 pr-4 font-medium">Último ingreso</th>
              <th className="py-2 pr-4 font-medium">Reservas</th>
              <th className="py-2 pr-4 font-medium">Estado</th>
              <th className="py-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const st = statusOf(u)
              const pro = u.professionalId ? getProfessional(u.professionalId) : null
              return (
                <tr key={u.id} className="border-b border-line align-top last:border-0">
                  <td className="py-2.5 pr-4">
                    <p className="font-medium text-ink">{u.name}</p>
                    <p className="text-xs text-ink-soft">{u.email}</p>
                    {pro && (
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {pro.zone} · {pro.services.map((s) => services.find((sv) => sv.id === s)?.label).join(', ')} ·{' '}
                        <Link to={`/profesional/${pro.id}`} className="underline hover:text-pine">
                          ver perfil
                        </Link>
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 capitalize text-ink-soft">{u.role}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatDate(u.createdAt)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatDate(u.lastLoginAt)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">
                    {u.bookingCount}
                    {u.activeBookingCount > 0 && <span className="text-xs"> ({u.activeBookingCount} activas)</span>}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[st]}`}>
                      {statusText[st]}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <RowButton
                        onClick={() =>
                          run(() => setUserVerified(u.id, !u.verified), u.verified ? 'Verificación retirada.' : `${u.name} fue verificado.`)
                        }
                      >
                        {u.verified ? 'Quitar verif.' : 'Verificar'}
                      </RowButton>
                      <RowButton onClick={() => setDialog({ type: u.suspended ? 'reactivate' : 'suspend', user: u })}>
                        {u.suspended ? 'Reactivar' : 'Suspender'}
                      </RowButton>
                      <RowButton onClick={() => setDialog({ type: 'edit', user: u })}>Editar</RowButton>
                      <RowButton onClick={() => setDialog({ type: 'password', user: u })}>Contraseña</RowButton>
                      <RowButton danger onClick={() => setDialog({ type: 'delete', user: u })}>
                        Eliminar
                      </RowButton>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-8 text-center text-ink-soft">Ningún usuario coincide con el filtro.</p>}
      </div>

      {dialog?.type === 'suspend' && (
        <ConfirmDialog
          title="Suspender cuenta"
          confirmLabel="Suspender"
          danger
          onCancel={() => setDialog(null)}
          onConfirm={() => run(() => setUserSuspended(dialog.user.id, true), `${dialog.user.name} fue suspendido.`)}
        >
          {dialog.user.name} no podrá iniciar sesión y, si es profesional, dejará de aparecer en Explorar. Sus
          reservas se conservan.
        </ConfirmDialog>
      )}
      {dialog?.type === 'reactivate' && (
        <ConfirmDialog
          title="Reactivar cuenta"
          confirmLabel="Reactivar"
          onCancel={() => setDialog(null)}
          onConfirm={() => run(() => setUserSuspended(dialog.user.id, false), `${dialog.user.name} fue reactivado.`)}
        >
          {dialog.user.name} podrá volver a iniciar sesión.
        </ConfirmDialog>
      )}
      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Eliminar usuario"
          confirmLabel="Eliminar"
          danger
          onCancel={() => setDialog(null)}
          onConfirm={() => run(() => deleteUser(dialog.user.id), `${dialog.user.name} fue eliminado.`)}
        >
          Se borra la cuenta de {dialog.user.name}
          {dialog.user.role === 'profesional' ? ' y su perfil público' : ''}. Esta acción no se puede deshacer. Las
          reservas completadas o canceladas quedan como historial.
        </ConfirmDialog>
      )}
      {dialog?.type === 'edit' && (
        <EditDialog
          user={dialog.user}
          onCancel={() => setDialog(null)}
          onSave={(data) => run(() => updateUser(dialog.user.id, data), 'Datos actualizados.')}
        />
      )}
      {dialog?.type === 'password' && (
        <PasswordDialog
          user={dialog.user}
          onCancel={() => setDialog(null)}
          onSave={(pw) => run(() => resetUserPassword(dialog.user.id, pw), `Contraseña de ${dialog.user.name} restablecida.`)}
        />
      )}
    </div>
  )
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-semibold text-ink-soft">{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            value === o.id ? 'border-pine bg-pine-soft text-pine-deep' : 'border-line text-ink-soft hover:border-pine'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function RowButton({ children, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        danger ? 'border-line text-brick-deep hover:border-brick' : 'border-line text-ink-soft hover:border-pine hover:text-pine-deep'
      }`}
    >
      {children}
    </button>
  )
}

function EditDialog({ user, onCancel, onSave }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  return (
    <ConfirmDialog
      title="Editar datos"
      confirmLabel="Guardar"
      onCancel={onCancel}
      onConfirm={() => onSave({ name, email })}
    >
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink">Nombre</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" autoFocus />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink">Correo</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </label>
      </div>
    </ConfirmDialog>
  )
}

function PasswordDialog({ user, onCancel, onSave }) {
  const [password, setPassword] = useState('')
  return (
    <ConfirmDialog
      title="Restablecer contraseña"
      confirmLabel="Restablecer"
      onCancel={onCancel}
      onConfirm={() => onSave(password)}
    >
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-ink">Nueva contraseña para {user.name}</span>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          className="input"
          autoFocus
          autoComplete="off"
        />
      </label>
    </ConfirmDialog>
  )
}
