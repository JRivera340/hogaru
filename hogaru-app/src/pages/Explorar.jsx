import { useMemo, useState } from 'react'
import ProfessionalCard from '../components/ProfessionalCard'
import { professionals, services } from '../data/seed'

export default function Explorar() {
  const [serviceFilter, setServiceFilter] = useState('todos')

  const filtered = useMemo(() => {
    if (serviceFilter === 'todos') return professionals
    return professionals.filter((p) => p.services.includes(serviceFilter))
  }, [serviceFilter])

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-ink">Profesionales en Bogotá</h1>
        <p className="text-sm text-ink-soft">
          {filtered.length} disponibles · todas verificadas por Hogaru
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip active={serviceFilter === 'todos'} onClick={() => setServiceFilter('todos')}>
          Todos los servicios
        </FilterChip>
        {services.map((s) => (
          <FilterChip
            key={s.id}
            active={serviceFilter === s.id}
            onClick={() => setServiceFilter(s.id)}
          >
            {s.label}
          </FilterChip>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pro, i) => (
          <ProfessionalCard key={pro.id} pro={pro} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-ink-soft">
          Nadie ofrece ese servicio todavía. Prueba con otro filtro.
        </p>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-pine bg-pine-soft text-pine-deep'
          : 'border-line bg-surface text-ink-soft hover:border-pine'
      }`}
    >
      {children}
    </button>
  )
}
