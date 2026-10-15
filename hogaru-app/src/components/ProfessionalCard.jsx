import { Link } from 'react-router-dom'
import Stars from './Stars'
import { services as allServices } from '../data/seed'
import { professionalRatingSummary } from '../store/bookingStore'

function serviceLabel(id) {
  return allServices.find((s) => s.id === id)?.label ?? id
}

export default function ProfessionalCard({ pro, index = 0 }) {
  const { rating, count } = professionalRatingSummary(pro.id, pro.rating, pro.reviewCount)

  return (
    <Link
      to={`/profesional/${pro.id}`}
      className="group block overflow-hidden border border-line bg-surface transition-colors hover:border-pine"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <img
          src={pro.photo}
          alt={pro.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!pro.verified && (
          <span className="stamp absolute left-3 top-3 bg-surface/95">Nueva</span>
        )}
        {pro.verified && (
          <span className="stamp absolute left-3 top-3 bg-surface/95">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 1.5l1.9 1.2 2.24-.28 1.02 2.02 2.02 1.02-.28 2.24 1.2 1.9-1.2 1.9.28 2.24-2.02 1.02-1.02 2.02-2.24-.28L10 18.5l-1.9-1.2-2.24.28-1.02-2.02-2.02-1.02.28-2.24L1.9 10.5l1.2-1.9-.28-2.24 2.02-1.02L5.86 3.32l2.24.28L10 1.5z"
                fill="#2F5D50"
              />
              <path d="M6.8 10.2l2 2 4.4-4.6" stroke="#F1F4EE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verificada
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight text-ink">{pro.name}</h3>
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">{pro.zone}</p>
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <Stars value={rating} />
          <span className="text-ink-soft">
            {count > 0 ? `${rating} · ${count} valoraciones` : 'Sin valoraciones aún'}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pro.services.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-paper-warm px-2.5 py-1 text-xs text-ink-soft">
              {serviceLabel(s)}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm font-medium text-pine-deep">Desde ${pro.priceFrom.toLocaleString('es-CO')}</p>
      </div>
    </Link>
  )
}
