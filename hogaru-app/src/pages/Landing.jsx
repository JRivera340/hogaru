import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import DustLight from '../components/DustLight'
import { professionals } from '../data/seed'

const spread = [professionals[0], professionals[2], professionals[4]]

export default function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <DustLight density={40} />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="max-w-lg font-display text-4xl leading-[1.08] text-ink sm:text-5xl">
              Tu casa, en manos que ya se ganaron la confianza de tus vecinos.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink-soft sm:text-lg">
              Reserva profesionales de aseo verificados en Bogotá, elige el horario que
              te sirva y paga desde la app. Sin llamadas, sin adivinar quién te abre la puerta.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/explorar" className="btn-primary">
                Buscar profesional
              </Link>
              <Link to="/mis-reservas" className="btn-secondary">
                Ver mis reservas
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-xs text-ink-soft">Profesionales</dt>
                <dd className="font-display text-2xl text-ink">100% verificadas</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">Zona</dt>
                <dd className="font-display text-2xl text-ink">Bogotá</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-soft">Reserva</dt>
                <dd className="font-display text-2xl text-ink">En minutos</dd>
              </div>
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="relative mx-auto h-[420px] w-full max-w-sm sm:h-[480px]"
          >
            {/* Spread de tarjetas superpuestas — la disponibilidad real y
                verificación de tres profesionales, no fotos decorativas. */}
            <ProCard pro={spread[0]} className="left-0 top-0 z-10 rotate-[-6deg]" />
            <ProCard pro={spread[1]} className="left-1/2 top-14 z-20 -translate-x-1/2 rotate-[3deg]" />
            <ProCard pro={spread[2]} className="right-0 top-2 z-10 rotate-[7deg]" />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              title: 'Verificación real',
              body: 'Antecedentes revisados y referencias confirmadas antes de que alguien entre a tu casa.',
            },
            {
              title: 'Precio claro',
              body: 'Ves el precio desde antes de reservar. Nada se negocia en la puerta.',
            },
            {
              title: 'Valoraciones honestas',
              body: 'Solo puede calificar quien ya recibió el servicio, y queda visible para todos.',
            },
          ].map((f) => (
            <div key={f.title} className="border-t-2 border-pine pt-4">
              <h3 className="font-display text-lg text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProCard({ pro, className }) {
  return (
    <div
      className={`absolute w-44 border border-line bg-surface p-2 shadow-xl shadow-ink/10 sm:w-52 ${className}`}
    >
      <img src={pro.photo} alt={pro.name} className="aspect-square w-full rounded-sm object-cover" />
      <p className="mt-2 truncate font-display text-sm text-ink">{pro.name}</p>
      <p className="stamp mt-1 !py-1 !text-[0.6rem]">Verificada</p>
    </div>
  )
}
