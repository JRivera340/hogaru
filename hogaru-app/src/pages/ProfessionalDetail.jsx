import { Link, useNavigate, useParams } from 'react-router-dom'
import Stars from '../components/Stars'
import MobileFab from '../components/MobileFab'
import { professionals, services, dayLabels } from '../data/seed'
import { professionalRatingSummary, getReviewsForProfessional } from '../store/bookingStore'

function serviceLabel(id) {
  return services.find((s) => s.id === id)?.label ?? id
}

export default function ProfessionalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pro = professionals.find((p) => p.id === id)

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

  const { rating, count } = professionalRatingSummary(pro.id, pro.rating, pro.reviewCount)
  const reviews = getReviewsForProfessional(pro.id).slice().reverse()

  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-8 sm:px-8 sm:pb-16">
      <div className="grid gap-8 sm:grid-cols-[220px_1fr]">
        <img
          src={pro.photo}
          alt={pro.name}
          className="aspect-square w-full rounded-xl object-cover sm:w-[220px]"
        />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl text-ink">{pro.name}</h1>
            {pro.verified && <span className="stamp">Verificada</span>}
          </div>
          <p className="mt-1 text-ink-soft">{pro.zone}</p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Stars value={rating} />
            <span className="text-ink-soft">{rating} · {count} valoraciones</span>
          </div>
          <p className="mt-4 max-w-lg text-sm text-ink-soft">{pro.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {pro.services.map((s) => (
              <span key={s} className="rounded-full bg-paper-warm px-3 py-1 text-xs text-ink-soft">
                {serviceLabel(s)}
              </span>
            ))}
          </div>
          <p className="mt-4 font-display text-xl text-pine-deep">
            Desde ${pro.priceFrom.toLocaleString('es-CO')}
          </p>
          <button
            type="button"
            onClick={() => navigate(`/reservar/${pro.id}`)}
            className="btn-primary mt-5 hidden sm:inline-flex"
          >
            Reservar
          </button>
        </div>
      </div>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="font-display text-xl text-ink">Disponibilidad</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.entries(pro.availability).map(([day, slots]) => (
            <div key={day} className="rounded-lg border border-line bg-surface px-3 py-2">
              <p className="text-xs font-semibold text-ink">{dayLabels[day]}</p>
              <p className="mt-1 text-xs text-ink-soft">{slots.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="font-display text-xl text-ink">Valoraciones</h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">Todavía no tiene valoraciones.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-line pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{r.userName}</p>
                  <Stars value={r.rating} size="text-xs" />
                </div>
                <p className="mt-1 text-sm text-ink-soft">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <MobileFab label="Reservar" onClick={() => navigate(`/reservar/${pro.id}`)} />
    </div>
  )
}
