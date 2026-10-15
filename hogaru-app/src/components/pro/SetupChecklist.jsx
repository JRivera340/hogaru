// Lista de pasos para dejar el perfil listo. Cada paso lleva a la pestaña donde se hace.
export function setupSteps(pro, user) {
  return [
    { id: 'cuenta', label: 'Crear tu cuenta', done: true },
    { id: 'perfil', label: 'Cuéntanos de ti', hint: 'Escribe una presentación corta y tu zona.', done: Boolean(pro.bio?.trim()) && Boolean(pro.zone?.trim()), tab: 1 },
    { id: 'precio', label: 'Pon tu precio', hint: 'Cuánto cobras por cada servicio que haces.', done: Object.values(pro.pricing ?? {}).some((n) => n > 0), tab: 1 },
    { id: 'horario', label: 'Elige tus días y horas', hint: 'Cuándo puedes ir a trabajar.', done: Object.values(pro.availability ?? {}).some((s) => s.length > 0), tab: 2 },
    { id: 'trabajo', label: 'Muestra un trabajo tuyo', hint: 'Una foto y unas palabras de un trabajo que ya hiciste.', done: (pro.portfolio ?? []).length > 0, tab: 1 },
    { id: 'verificacion', label: 'Espera la verificación de Hogarú', hint: 'Revisamos tu perfil y te ponemos el sello de verificada.', done: Boolean(user.verified) },
  ]
}

export default function SetupChecklist({ pro, user, onGo }) {
  const steps = setupSteps(pro, user)
  const done = steps.filter((s) => s.done).length
  if (done === steps.length) return null
  const next = steps.find((s) => !s.done)

  return (
    <section aria-label="Pasos para empezar" className="mt-6 rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl text-ink">Deja tu perfil listo</h2>
        <p className="text-sm font-semibold text-pine-deep">
          {done} de {steps.length} pasos
        </p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-paper-warm"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={done}
      >
        <div className="h-full rounded-full bg-pine transition-all" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>

      <ol className="mt-4 space-y-2">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                s.done ? 'bg-pine text-surface' : 'border border-line text-ink-soft'
              }`}
            >
              {s.done ? '✓' : i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-base ${s.done ? 'text-ink-soft line-through' : 'font-semibold text-ink'}`}>{s.label}</p>
              {!s.done && s.hint && <p className="text-sm text-ink-soft">{s.hint}</p>}
            </div>
            {!s.done && s.tab !== undefined && s === next && (
              <button type="button" onClick={() => onGo(s.tab)} className="btn-primary !min-h-11 !px-4 !py-2 text-sm">
                Hacerlo ahora
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
