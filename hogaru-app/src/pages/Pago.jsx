import { useState } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { services, dayLabels } from '../data/seed'
import { getProfessional } from '../store/proStore'
import { useAuth } from '../store/AuthContext'
import { isSlotTaken, saveBooking } from '../store/bookingStore'

export default function Pago() {
  const { state } = useLocation()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(null)
  const [slotError, setSlotError] = useState('')
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvc: '' })

  if (!state) {
    return <Navigate to="/explorar" replace />
  }

  const pro = getProfessional(state.professionalId)
  const cardComplete =
    card.number.replace(/\s/g, '').length >= 12 && card.name && card.exp && card.cvc.length >= 3

  function handlePay(e) {
    e.preventDefault()
    if (!cardComplete || processing) return
    if (!user.verified) {
      setSlotError('Tu cuenta aún no está verificada.')
      return
    }
    if (isSlotTaken(state.professionalId, state.date, state.time)) {
      setSlotError('Alguien reservó esa franja mientras pagabas. Elige otro horario.')
      return
    }
    setProcessing(true)
    // Pago simulado — no hay proveedor real conectado en este MVP local.
    setTimeout(() => {
      const booking = saveBooking({
        professionalId: state.professionalId,
        userId: user.id,
        userName: user.name,
        service: state.service,
        day: state.day,
        time: state.time,
        date: state.date,
        address: state.address,
        notes: state.notes,
        status: 'pendiente',
        price: state.price,
        createdAt: new Date().toISOString(),
      })
      setProcessing(false)
      setConfirmed(booking)
    }, 900)
  }

  if (confirmed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center sm:px-8">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-pine-soft"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#2F5D50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <h1 className="mt-5 font-display text-2xl text-ink">Reserva enviada</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {pro?.name} recibió tu solicitud y te avisará aquí cuando la acepte. Verás el aviso en la campana y en tus reservas.
        </p>

        <dl className="mt-6 w-full divide-y divide-line rounded-lg border border-line bg-surface text-left text-sm">
          <Row label="Profesional" value={pro?.name} />
          <Row label="Fecha" value={`${dayLabels[confirmed.day]} ${confirmed.date}, ${confirmed.time}`} />
          <Row label="Dirección" value={confirmed.address} />
          <Row label="Pagado" value={`$${confirmed.price.toLocaleString('es-CO')}`} strong />
        </dl>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link to="/mis-reservas" className="btn-primary flex-1 text-center">
            Ver mis reservas
          </Link>
          <Link to="/explorar" className="btn-secondary flex-1 text-center">
            Seguir explorando
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-16 pt-8 sm:px-8">
      <h1 className="font-display text-2xl text-ink">Pago</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Simulación de pago — este MVP no procesa tarjetas reales.
      </p>

      <div className="mt-6 rounded-lg border border-line bg-surface p-4 text-sm">
        <p className="font-semibold text-ink">{pro?.name}</p>
        <p className="mt-1 text-ink-soft">
          {services.find((s) => s.id === state.service)?.label} · {dayLabels[state.day]} {state.date}, {state.time}
        </p>
        <p className="mt-2 font-display text-xl text-pine-deep">
          ${state.price.toLocaleString('es-CO')}
        </p>
      </div>

      <form onSubmit={handlePay} className="mt-6 space-y-4">
        <Field label="Número de tarjeta">
          <input
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Nombre en la tarjeta">
          <input
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            placeholder={user?.name ?? 'Como aparece en la tarjeta'}
            className="input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Vencimiento">
            <input
              placeholder="MM/AA"
              value={card.exp}
              onChange={(e) => setCard({ ...card, exp: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="CVC">
            <input
              inputMode="numeric"
              placeholder="123"
              value={card.cvc}
              onChange={(e) => setCard({ ...card, cvc: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        {slotError && (
          <p className="text-sm text-brick">
            {slotError}{' '}
            <Link to={`/reservar/${state.professionalId}`} className="font-semibold underline">
              Elegir otro horario
            </Link>
          </p>
        )}
        <button type="submit" disabled={!cardComplete || processing} className="btn-primary w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={processing ? 'processing' : 'idle'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {processing ? 'Procesando…' : `Pagar $${state.price.toLocaleString('es-CO')}`}
            </motion.span>
          </AnimatePresence>
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  )
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={strong ? 'font-display text-lg text-pine-deep' : 'text-ink'}>{value}</dd>
    </div>
  )
}
