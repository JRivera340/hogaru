// Recuadro de ayuda corto, en lenguaje simple, al inicio de cada sección del panel.
export default function HelpTip({ title, children }) {
  return (
    <div className="mb-5 flex gap-3 rounded-lg border border-pine/30 bg-pine-soft p-4 text-base text-ink">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine text-sm font-bold text-surface"
      >
        ?
      </span>
      <div>
        {title && <p className="font-semibold text-pine-deep">{title}</p>}
        <div className="mt-0.5 text-sm leading-relaxed text-ink-soft">{children}</div>
      </div>
    </div>
  )
}
