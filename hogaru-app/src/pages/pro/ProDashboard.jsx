import { useState } from 'react'
import { Link } from 'react-router-dom'
import Stars from '../../components/Stars'
import { services, dayLabels } from '../../data/seed'
import { useAuth } from '../../store/AuthContext'
import useStorageVersion from '../../store/useStorageVersion'
import { getProfessional, isBookable, updateProfessional } from '../../store/proStore'
import HelpTip from '../../components/pro/HelpTip'
import SetupChecklist from '../../components/pro/SetupChecklist'
import GuideTour, { tourAlreadySeen } from '../../components/pro/GuideTour'
import {
  OPEN_STATUSES,
  acceptBooking,
  completeBooking,
  getBookingsForProfessional,
  getReviewsForProfessional,
  markOnTheWay,
  professionalRatingSummary,
  rejectBooking,
  statusLabel,
  updateBookingStatus,
} from '../../store/bookingStore'

const tabs = ['Reservas', 'Perfil y tarifas', 'Disponibilidad', 'Valoraciones']
const hours = Array.from({ length: 14 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`)

const statusStyle = {
  pendiente: 'bg-gold/15 text-gold',
  confirmada: 'bg-pine-soft text-pine-deep',
  en_camino: 'bg-pine text-surface',
  completada: 'bg-pine-soft text-pine-deep',
  rechazada: 'bg-paper-warm text-ink-soft',
  cancelada: 'bg-paper-warm text-ink-soft',
}
const etaOptions = [10, 20, 30, 45, 60]

// Se vuelve a montar cuando otra pestaña cambia datos (p. ej. un cliente reserva).
export default function ProDashboard() {
  return <ProDashboardView key={useStorageVersion()} />
}

function ProDashboardView() {
  const { user } = useAuth()
  const [pro, setPro] = useState(() => getProfessional(user.professionalId))
  const [tab, setTab] = useState(() => (isBookable(getProfessional(user.professionalId) ?? {}) ? 0 : 1))
  const [tourOpen, setTourOpen] = useState(() => !tourAlreadySeen())
  const pendingCount = pro ? getBookingsForProfessional(pro.id).filter((b) => b.status === 'pendiente').length : 0

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
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setTourOpen(true)} className="btn-secondary !min-h-11 !px-4 text-sm">
            ¿Necesitas ayuda?
          </button>
          <Link to={`/profesional/${pro.id}`} className="btn-secondary !min-h-11 !px-4 text-sm">
            Ver mi perfil público
          </Link>
        </div>
      </div>

      <SetupChecklist pro={pro} user={user} onGo={setTab} />


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
            {t === 'Reservas' && pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-gold px-1.5 text-xs font-semibold text-white">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 0 && <BookingsTab pro={pro} />}
        {tab === 1 && <ProfileTab pro={pro} save={save} />}
        {tab === 2 && <AvailabilityTab pro={pro} save={save} />}
        {tab === 3 && <ReviewsTab pro={pro} />}
      </div>

      <p className="mt-10 text-center text-sm text-ink-soft">
        ¿Dudas? Mira las{' '}
        <Link to="/pro/ayuda" className="font-semibold text-pine-deep underline">
          preguntas frecuentes
        </Link>
        .
      </p>

      {tourOpen && <GuideTour onClose={() => setTourOpen(false)} />}
    </div>
  )
}

function loadBookings(professionalId) {
  const rank = { pendiente: 0, en_camino: 1, confirmada: 2 }
  return getBookingsForProfessional(professionalId)
    .slice()
    .sort((a, b) => {
      const ra = rank[a.status] ?? 3
      const rb = rank[b.status] ?? 3
      if (ra !== rb) return ra - rb
      return new Date(b.date) - new Date(a.date)
    })
}

function BookingsTab({ pro }) {
  const [bookings, setBookings] = useState(() => loadBookings(pro.id))
  const [eta, setEta] = useState({})

  function act(fn) {
    fn()
    setBookings(loadBookings(pro.id))
  }

  return (
    <div>
      <HelpTip title="Aquí llegan tus reservas">
        Cuando una familia te reserva, aparece arriba con el botón <strong>Aceptar</strong>. Después, el día del
        servicio, toca <strong>Voy en camino</strong> y al terminar <strong>Terminé el servicio</strong>. Cada paso le
        avisa a la familia.
      </HelpTip>

      <ul className="space-y-3">
        {bookings.map((b) => (
          <li key={b.id} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-display text-lg text-ink">{b.userName}</p>
                <p className="text-base text-ink-soft">
                  {services.find((s) => s.id === b.service)?.label} · {dayLabels[b.day]} {b.date}, {b.time}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{b.address}</p>
                {b.notes && <p className="mt-1 text-sm italic text-ink-soft">“{b.notes}”</p>}
              </div>
              <div className="text-right">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[b.status]}`}>
                  {statusLabel[b.status] ?? b.status}
                </span>
                <p className="mt-2 text-base font-semibold text-pine-deep">${b.price.toLocaleString('es-CO')}</p>
              </div>
            </div>

            {b.status === 'pendiente' && (
              <div className="mt-3">
                <p className="mb-2 text-sm text-ink-soft">Esta familia espera tu respuesta. ¿Puedes ir?</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => act(() => acceptBooking(b.id))} className="btn-primary !min-h-11 !px-5 text-base">
                    Aceptar
                  </button>
                  <button type="button" onClick={() => act(() => rejectBooking(b.id))} className="btn-secondary !min-h-11 !px-5 text-base">
                    No puedo
                  </button>
                </div>
              </div>
            )}

            {b.status === 'confirmada' && (
              <div className="mt-3">
                <p className="mb-2 text-sm text-ink-soft">Aceptada. Cuando salgas, avisa a la familia:</p>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={eta[b.id] ?? 20}
                    onChange={(e) => setEta({ ...eta, [b.id]: Number(e.target.value) })}
                    aria-label="Minutos para llegar"
                    className="input !min-h-11 !w-auto text-base"
                  >
                    {etaOptions.map((m) => (
                      <option key={m} value={m}>
                        Llego en {m} min
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => act(() => markOnTheWay(b.id, eta[b.id] ?? 20))}
                    className="btn-primary !min-h-11 !px-5 text-base"
                  >
                    Voy en camino
                  </button>
                  <button
                    type="button"
                    onClick={() => act(() => updateBookingStatus(b.id, 'cancelada', { by: 'profesional' }))}
                    className="btn-secondary !min-h-11 !px-4 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {b.status === 'en_camino' && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => act(() => completeBooking(b.id))} className="btn-primary !min-h-11 !px-5 text-base">
                  Terminé el servicio
                </button>
                <button
                  type="button"
                  onClick={() => act(() => updateBookingStatus(b.id, 'cancelada', { by: 'profesional' }))}
                  className="btn-secondary !min-h-11 !px-4 text-sm"
                >
                  Cancelar
                </button>
              </div>
            )}
          </li>
        ))}
        {bookings.length === 0 && (
          <p className="py-8 text-center text-base text-ink-soft">
            Aún no tienes reservas. Completa tu perfil para aparecer en Explorar.
          </p>
        )}
      </ul>
    </div>
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
    if (chosen.length === 0) return setError('Marca al menos un servicio de los que haces.')
    if (!zone.trim()) return setError('Indica tu zona de trabajo.')
    const pricing = {}
    for (const s of chosen) {
      const value = Number(prices[s.id])
      if (!Number.isFinite(value) || value < 10000) {
        return setError(`Falta el precio de «${s.label}». Escribe solo números, por ejemplo 45000 (mínimo 10000).`)
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
    <div>
    <HelpTip title="Tu perfil es lo primero que ve la familia">
      Escribe en pocas palabras quién eres y cuánto tiempo llevas trabajando. Por ejemplo: «Llevo 8 años haciendo aseo
      en casas de familia, soy puntual y cuidadosa.» Marca los servicios que haces y pon el precio de cada uno (solo
      números, por ejemplo 45000).
    </HelpTip>
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
      <p className="mt-1 text-sm text-ink-soft">
        Sube fotos claras de trabajos que ya hiciste (una cocina limpia, ropa planchada) y cuenta en una frase qué hiciste.
        Así las familias confían más. No subas fotos con personas ni datos de la casa.
      </p>

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
  const activeBookings = getBookingsForProfessional(pro.id).filter((b) => OPEN_STATUSES.includes(b.status))

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
      <HelpTip title="¿Cuándo puedes trabajar?">
        Para cada día elige una hora en la lista y toca <strong>Agregar</strong>. Si un día no trabajas, déjalo sin horas.
        Para quitar una hora toca la <strong>×</strong>.
      </HelpTip>
      <p className="text-sm text-ink-soft">
        Estas son las franjas semanales que los hogares pueden reservar. Las que ya tienen una reserva
        activa (●) no se pueden quitar.
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
                      <span title="Tiene una reserva activa" aria-label="Reservada">
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
      <HelpTip title="Lo que dicen de ti">
        Cada vez que terminas un servicio, la familia puede dejarte estrellas y un comentario. Tu promedio aparece en tu
        perfil y ayuda a que te reserven más.
      </HelpTip>
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
