import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MobileFab from '../components/MobileFab'
import { professionals, services, dayLabels } from '../data/seed'
import { useAuth } from '../store/AuthContext'

const steps = ['Horario', 'Dirección', 'Resumen']

export default function Reservar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const pro = professionals.find((p) => p.id === id)

  const [step, setStep] = useState(0)
  const [service, setService] = useState(pro?.services[0] ?? '')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  const canContinueStep0 = service && day && time
  const canContinueStep1 = address.trim().length > 4

  const nextDate = useMemo(() => nextDateForDay(day), [day])

  if (!pro) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="text-ink-soft">No encontramos esa profesional.</p>
        <Link to="/explorar" className="btn-secondary mt-4 inline-block">
          Volver a explorar
        </Link>
      </div>
    )
  }

  function goNext() {
    if (step === 0 && !canContinueStep0) return
    if (step === 1 && !canContinueStep1) return
    if (step === 2) {
      navigate(`/pago`, {
        state: {
          professionalId: pro.id,
          service,
          day,
          time,
          date: nextDate,
          address,
          notes,
          price: pro.priceFrom,
        },
      })
      return
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const isLastStep = step === steps.length - 1
  const canContinue = step === 0 ? canContinueStep0 : step === 1 ? canContinueStep1 : true

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-8 sm:px-8 sm:pb-16">
      <Link to={`/profesional/${pro.id}`} className="text-sm text-ink-soft hover:text-pine">
        ← {pro.name}
      </Link>
      <h1 className="mt-2 font-display text-2xl text-ink">Reservar aseo</h1>

      <ol className="mt-6 flex items-center gap-2 text-xs font-medium text-ink-soft">
        {steps.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                i <= step ? 'border-pine bg-pine text-surface' : 'border-line text-ink-soft'
              }`}
            >
              {i + 1}
            </span>
            <span className={i === step ? 'text-ink' : ''}>{label}</span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-line" />}
          </li>
        ))}
      </ol>

      <div className="mt-8">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Servicio</p>
              <div className="flex flex-wrap gap-2">
                {pro.services.map((sId) => (
                  <button
                    key={sId}
                    type="button"
                    onClick={() => setService(sId)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      service === sId
                        ? 'border-pine bg-pine-soft text-pine-deep'
                        : 'border-line text-ink-soft'
                    }`}
                  >
                    {services.find((s) => s.id === sId)?.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Día</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(pro.availability).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDay(d)
                      setTime('')
                    }}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      day === d ? 'border-pine bg-pine-soft text-pine-deep' : 'border-line text-ink-soft'
                    }`}
                  >
                    {dayLabels[d]}
                  </button>
                ))}
              </div>
            </div>

            {day && (
              <div>
                <p className="mb-2 text-sm font-semibold text-ink">Franja horaria</p>
                <div className="flex flex-wrap gap-2">
                  {pro.availability[day].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`rounded-full border px-3 py-1.5 text-sm ${
                        time === t ? 'border-pine bg-pine-soft text-pine-deep' : 'border-line text-ink-soft'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink" htmlFor="address">
                Dirección del servicio
              </label>
              <input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle 85 #12-34, Apto 501, Chapinero"
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none focus-visible:border-pine"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink" htmlFor="notes">
                Notas para la profesional (opcional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Portería exige documento, timbre no funciona, etc."
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none focus-visible:border-pine"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <dl className="divide-y divide-line rounded-lg border border-line bg-surface text-sm">
            <Row label="Profesional" value={pro.name} />
            <Row label="Servicio" value={services.find((s) => s.id === service)?.label} />
            <Row label="Día y hora" value={`${dayLabels[day]} · ${time} (${nextDate})`} />
            <Row label="Dirección" value={address} />
            <Row label="Cliente" value={user ? `${user.name} · ${user.email}` : ''} />
            <Row label="Total a pagar" value={`$${pro.priceFrom.toLocaleString('es-CO')}`} strong />
          </dl>
        )}
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={!canContinue}
        className="btn-primary mt-8 hidden sm:inline-flex"
      >
        {isLastStep ? 'Ir a pagar' : 'Continuar'}
      </button>

      <MobileFab
        label={isLastStep ? 'Ir a pagar' : 'Continuar'}
        onClick={goNext}
        disabled={!canContinue}
      />
    </div>
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

const dayIndex = { dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6 }

function nextDateForDay(day) {
  if (!day) return ''
  const target = dayIndex[day]
  const now = new Date()
  const diff = (target - now.getDay() + 7) % 7 || 7
  const result = new Date(now)
  result.setDate(now.getDate() + diff)
  return result.toISOString().slice(0, 10)
}
