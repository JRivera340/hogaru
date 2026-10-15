import { useEffect } from 'react'

export default function ConfirmDialog({ title, children, confirmLabel = 'Confirmar', danger = false, onConfirm, onCancel }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-xl">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        <div className="mt-2 text-sm text-ink-soft">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn-secondary !px-4 !py-2 text-sm">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn-primary !px-4 !py-2 text-sm ${danger ? '!bg-brick-deep' : ''}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
