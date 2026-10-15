import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga']

const products = [
  {
    title: 'Aseo para hogares',
    body: 'Mantenemos tu hogar impecable, con profesionales de limpieza capacitadas. Agenda por días.',
  },
  {
    title: 'Aseo para empresas',
    body: 'Limpieza integral para oficinas y locales, con continuidad operativa.',
  },
  {
    title: 'Profesionales verificadas',
    body: 'Ves quién llega, el precio y las valoraciones antes de reservar.',
  },
]

const reviews = [
  { quote: 'Me gustó el servicio y la aplicación te informa todo.', name: 'Paula Lizeth', place: 'Bogotá' },
  { quote: 'Personal de limpieza con muy buena actitud, eficientes y puntuales.', name: 'Lucía Patricia', place: 'Bogotá' },
  { quote: 'Excelente opción para servicio en casa. Personal eficiente y seguro.', name: 'Olga Lucía', place: 'Medellín' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [city, setCity] = useState('')

  function cotizar(event) {
    event.preventDefault()
    const query = city ? `?ciudad=${encodeURIComponent(city)}` : ''
    navigate(`/explorar${query}`)
  }

  return (
    <div className="bg-white text-ink">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 top-6 hidden h-40 w-40 rounded-full border-[10px] border-pine/70 lg:block" />
        <div className="pointer-events-none absolute bottom-10 right-[38%] hidden h-16 w-16 rounded-full border-[6px] border-pine/50 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.15] text-[#3e4c56] sm:text-5xl">
              ¡Somos empresa líder en servicios de aseo!
            </h1>
            <p className="mt-4 text-lg text-ink-soft">
              Profesionales de limpieza para hogares y empresas.
            </p>
            <form
              onSubmit={cotizar}
              className="mt-8 max-w-md rounded-2xl border border-line bg-white p-5 shadow-sm"
            >
              <p className="border-b-2 border-pine pb-2 text-sm font-bold text-pine">Busco empleada</p>
              <label className="mt-4 block text-sm text-ink-soft" htmlFor="city">
                ¿En cuál ciudad te encuentras?
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink outline-none focus:border-pine"
              >
                <option value="">Selecciona una ciudad</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary mt-4 w-full">
                Cotizar
              </button>
            </form>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <img
              src="https://www.hogaru.com/assets/public_pages/homes/landing_home-5532ec58d2975f340256679b70f2edba0fd0c0bf66467a21a6b2d157dfd67a30.webp"
              alt="Sala luminosa recién aseada"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-sky py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-3xl font-bold text-[#3e4c56]">Nuestros productos</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {products.map((p) => (
              <article key={p.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#3e4c56]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <h2 className="text-3xl font-bold text-[#3e4c56]">
          Lo que nuestros clientes opinan sobre Hogarú
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-line p-5">
              <figcaption className="text-sm font-bold text-pine">{r.name}</figcaption>
              <blockquote className="mt-2 text-sm leading-relaxed text-ink">{r.quote}</blockquote>
              <p className="mt-3 text-xs text-ink-soft">{r.place}</p>
            </figure>
          ))}
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <img src="/hogaru-logo.svg" alt="Hogarú" className="h-8 w-auto" />
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
            <Link to="/registro?rol=profesional" className="hover:text-pine">Ofrece tus servicios</Link>
            <Link to="/pro/login" className="hover:text-pine">Soy profesional</Link>
            <Link to="/admin/login" className="hover:text-pine">Administración</Link>
          </nav>
          <p className="text-xs text-ink-soft">© 2026 Hogarú. Aseo para hogares y empresas.</p>
        </div>
      </footer>
    </div>
  )
}
