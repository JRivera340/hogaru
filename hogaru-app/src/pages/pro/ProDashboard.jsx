import { useState } from 'react'
import { Link } from 'react-router-dom'
import Stars from '../../components/Stars'
import { services, dayLabels } from '../../data/seed'
import { useAuth } from '../../store/AuthContext'
import useStorageVersion from '../../store/useStorageVersion'
import { getProfessional, isBookable, updateProfessional } from '../../store/proStore'
import {
  getBookingsForProfessional,
  getReviewsForProfessional,
  professionalRatingSummary,
  updateBookingStatus,
} from '../../store/bookingStore'

const tabs = ['Reservas', 'Perfil y tarifas', 'Disponibilidad', 'Valoraciones']
const hours = Array.from({ length: 14 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`)

const statusStyle = {
  confirmada: 'bg-gold/15 text-gold',
  completada: 'bg-pine-soft text-pine-deep',
  cancelada: 'bg-paper-warm text-ink-soft',
}

// Se vuelve a montar cuando otra pestaña cambia datos (p. ej. un cliente reserva).
export default function ProDashboard() {
  return <ProDashboardView key={useStorageVersion()} />
}

function ProDashboardView() {
  const { user } = useAuth()
  const [pro, setPro] = useState(() => getProfessional(user.professionalId))
  const [tab, setTab] = useState(() => (isBookable(getProfessional(user.professionalId) ?? {}) ? 0 : 1))

  if (!pro) {
    return <p className="px-5 py-16 text-center text-ink-soft">No encontramos tu perfil profesional.</p>
  }

  function save(patch) {
    setPro(updateProfessional(pro.id, patch))
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Hola, {pro.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {pro.verified ? 'Tu perfil está verificado.' : 'Tu perfil aún no está verificado por Hogarú.'}
          </p>
        </div>
        <Link to={`/profesional/${pro.id}`} className="btn-secondary !px-3 !py-1.5 text-xs">
          Ver mi perfil público
        </Link>
      </div>

      {!isBookable(pro) && (
        <p className="mt-5 rounded-lg border border-dashed border-pine bg-pine-soft p-3 text-sm text-pine-deep">
          Para aparecer en Explorar, define el precio de al menos un servicio y agrega algún horario
          disponible.
        </p>
      )}

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${
              tab === i ? 'border-pine text-ink' : 'border-transparent text-ink-soft'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 0 && <BookingsTab pro={pro} />}
        {tab === 1 && <ProfileTab pro={pro} save={save} />}
        {tab === 2 && <AvailabilityTab pro={pro} save={save} />}
        {tab === 3 && <ReviewsTab pro={pro} />}
      </div>
    </div>
  )
}

function loadBookings(professionalId) {
  return getBookingsForProfessional(professionalId)
    .slice()
    .sort((a, b) => {
      const aOpen = a.status === 'confirmada'
      const bOpen = b.status === 'confirmada'
      if (aOpen !== bOpen) return aOpen ? -1 : 1
      return new Date(b.date) - new Date(a.date)
    })
}

function BookingsTab({ pro }) {
  const [bookings, setBookings] = useState(() => loadBookings(pro.id))

  function setStatus(id, status) {
    updateBookingStatus(id, status)
    setBookings(loadBookings(pro.id))
  }

  return (
    <ul className="space-y-3">
      {bookings.map((b) => (
        <li key={b.id} className="rounded-lg border border-line bg-surface p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-display text-lg text-ink">{b.userName}</p>
              <p className="text-sm text-ink-soft">
                {services.find((s) => s.id === b.service)?.label} · {dayLabels[b.day]} {b.date}, {b.time}
              </p>
              <p className="mt-1 text-xs text-ink-soft">{b.address}</p>
              {b.notes && <p className="mt-1 text-xs italic text-ink-soft">“{b.notes}”</p>}
            </div>
            <div className="text-right">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[b.status]}`}
              >
                {b.status}
              </span>
              <p className="mt-2 text-sm font-semibold text-pine-deep">
                ${b.price.toLocaleString('es-CO')}
              </p>
            </div>
          </div>
          {b.status === 'confirmada' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatus(b.id, 'completada')}
                className="btn-primary !px-3 !py-1.5 text-xs"
              >
                Marcar realizada
              </button>
              <button
                type="button"
                onClick={() => setStatus(b.id, 'cancelada')}
                className="btn-secondary !px-3 !py-1.5 text-xs"
              >
                Cancelar
              </button>
            </div>
          )}
        </li>
      ))}
      {bookings.length === 0 && <p className="py-8 text-center text-ink-soft">Aún no tienes reservas.</p>}
    </ul>
  )
}

function ProfileTab({ pro, save }) {
  const [bio, setBio] = useState(pro.bio)
  const [zone, setZone] = useState(pro.zone)
  const [photo, setPhoto] = useState(pro.photo)
  const [offered, setOffered] = useState(() => new Set(pro.services))
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(services.map((s) => [s.id, pro.pricing?.[s.id] ? String(pro.pricing[s.id]) : ''])),
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function toggle(id) {
    const next = new Set(offered)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setOffered(next)
  }

  function submit(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    const chosen = services.filter((s) => offered.has(s.id))
    if (chosen.length === 0) return setError('Elige al menos un servicio.')
    if (!zone.trim()) return setError('Indica tu zona de trabajo.')
    const pricing = {}
    for (const s of chosen) {
      const value = Number(prices[s.id])
      if (!Number.isFinite(value) || value < 10000) {
        return setError(`Define un precio válido (mínimo $10.000) para ${s.label}.`)
      }
      pricing[s.id] = Math.round(value)
    }
    save({
      bio: bio.trim(),
      zone: zone.trim(),
      photo: photo.trim() || pro.photo,
      services: chosen.map((s) => s.id),
      pricing,
    })
    setMessage('Perfil guardado.')
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Presentación</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Años de experiencia, qué te distingue, referencias…"
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Zona</span>
          <input value={zone} onChange={(e) => setZone(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Foto (URL)</span>
          <input value={photo} onChange={(e) => setPhoto(e.target.value)} className="input" />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Servicios y tarifa por servicio (COP)</p>
          <ul className="space-y-2">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2"
              >
                <label className="flex flex-1 items-center gap-2 text-sm text-ink">
                  <input type="checkbox" checked={offered.has(s.id)} onChange={() => toggle(s.id)} />
                  {s.label}
                </label>
                <input
                  type="number"
                  min="10000"
                  step="1000"
                  inputMode="numeric"
                  disabled={!offered.has(s.id)}
                  value={prices[s.id]}
                  onChange={(e) => setPrices({ ...prices, [s.id]: e.target.value })}
                  placeholder="45000"
                  aria-label={`Precio de ${s.label}`}
                  className="input !w-28 disabled:opacity-40"
                />
              </li>
            ))}
          </ul>
        </div>

        {error && <p className="text-sm text-brick">{error}</p>}
        {message && <p className="text-sm text-pine-deep">{message}</p>}
        <button type="submit" className="btn-primary">
          Guardar perfil
        </button>
      </form>

      <PortfolioEditor pro={pro} save={save} />
    </div>
  )
}

function PortfolioEditor({ pro, save }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const portfolio = pro.portfolio ?? []

  function add(e) {
    e.preventDefault()
    if (!title.trim()) return setError('Ponle un título al trabajo.')
    setError('')
    const id = `${pro.id}-w${Date.now()}`
    save({
      portfolio: [
        ...portfolio,
        {
          id,
          title: title.trim(),
          description: description.trim(),
          image: image.trim() || `https://picsum.photos/seed/${id}/640/420`,
        },
      ],
    })
    setTitle('')
    setDescription('')
    setImage('')
  }

  function remove(id) {
    save({ portfolio: portfolio.filter((w) => w.id !== id) })
  }

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Evidencias de tu trabajo</h2>
      <p className="mt-1 text-sm text-ink-soft">Los hogares confían más cuando ven trabajos reales.</p>

      <ul className="mt-4 space-y-3">
        {portfolio.map((w) => (
          <li key={w.id} className="flex gap-3 rounded-lg border border-line bg-surface p-3">
            {w.image && <img src={w.image} alt="" className="h-16 w-20 rounded object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{w.title}</p>
              <p className="line-clamp-2 text-xs text-ink-soft">{w.description}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(w.id)}
              className="self-start text-xs text-ink-soft hover:text-brick"
            >
              Quitar
            </button>
          </li>
        ))}
        {portfolio.length === 0 && <li className="text-sm text-ink-soft">Todavía no agregas trabajos.</li>}
      </ul>

      <form onSubmit={add} className="mt-4 space-y-3 rounded-lg border border-dashed border-line p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del trabajo"
          className="input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Qué hiciste y cómo quedó"
          className="input"
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="URL de la foto (opcional)"
          className="input"
        />
        {error && <p className="text-sm text-brick">{error}</p>}
        <button type="submit" className="btn-secondary !px-3 !py-1.5 text-sm">
          Agregar trabajo
        </button>
      </form>
    </div>
  )
}

function AvailabilityTab({ pro, save }) {
  const [adding, setAdding] = useState({})
  const activeBookings = getBookingsForProfessional(pro.id).filter((b) => b.status === 'confirmada')

  function slotBooked(day, time) {
    return activeBookings.some((b) => b.day === day && b.time === time)
  }

  function setSlots(day, slots) {
    const availability = { ...pro.availability }
    if (slots.length === 0) delete availability[day]
    else availability[day] = slots
    save({ availability })
  }

  function addSlot(day) {
    const time = adding[day]
    const current = pro.availability?.[day] ?? []
    if (!time || current.includes(time)) return
    setSlots(day, [...current, time].sort())
    setAdding({ ...adding, [day]: '' })
  }

  return (
    <div>
      <p className="text-sm text-ink-soft">
        Estas son las franjas semanales que los hogares pueden reservar. Las que ya tienen una reserva
        confirmada (●) no se pueden quitar.
      </p>
      <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface">
        {Object.entries(dayLabels).map(([day, label]) => {
          const slots = pro.availability?.[day] ?? []
          return (
            <li key={day} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="w-24 text-sm font-semibold text-ink">{label}</span>
              <div className="flex flex-1 flex-wrap gap-2">
                {slots.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full bg-pine-soft px-3 py-1 text-xs text-pine-deep"
                  >
                    {t}
                    {slotBooked(day, t) ? (
                      <span title="Tiene una reserva confirmada" aria-label="Reservada">
                        ●
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setSlots(
                            day,
                            slots.filter((x) => x !== t),
                          )
                        }
                        aria-label={`Quitar ${t} del ${label}`}
                        className="hover:text-brick"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {slots.length === 0 && <span className="text-xs text-ink-soft">Sin franjas</span>}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={adding[day] ?? ''}
                  onChange={(e) => setAdding({ ...adding, [day]: e.target.value })}
                  aria-label={`Hora para el ${label}`}
                  className="input !w-24 !py-1.5 text-xs"
                >
                  <option value="">Hora</option>
                  {hours
                    .filter((h) => !slots.includes(h))
                    .map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                </select>
                <button type="button" onClick={() => addSlot(day)} className="btn-secondary !px-3 !py-1 text-xs">
                  Agregar
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ReviewsTab({ pro }) {
  const { rating, count } = professionalRatingSummary(pro.id, pro.rating, pro.reviewCount)
  const reviews = getReviewsForProfessional(pro.id)
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div>
      <div className="flex items-center gap-3">
        <Stars value={rating} />
        <p className="text-sm text-ink-soft">
          {count > 0 ? `${rating} promedio · ${count} valoraciones` : 'Sin valoraciones aún'}
        </p>
      </div>
      <ul className="mt-4 space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">{r.userName}</p>
              <Stars value={r.rating} size="text-xs" />
            </div>
            {r.comment && <p className="mt-1.5 text-sm text-ink-soft">{r.comment}</p>}
          </li>
        ))}
        {reviews.length === 0 && (
          <p className="py-8 text-center text-ink-soft">
            Las valoraciones aparecerán cuando completes servicios.
          </p>
        )}
      </ul>
    </div>
  )
}
