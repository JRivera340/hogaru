import { useState } from 'react'
import ConfirmDialog from '../../../components/ConfirmDialog'
import Stars from '../../../components/Stars'
import { getProfessionals } from '../../../store/proStore'
import { deleteReview, getReviews } from '../../../store/bookingStore'

export default function ReviewsTab({ onChange }) {
  const [reviews, setReviews] = useState(() => getReviews())
  const [toDelete, setToDelete] = useState(null)
  const professionals = getProfessionals()
  const sorted = reviews.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  function remove() {
    deleteReview(toDelete.id)
    setReviews(getReviews())
    setToDelete(null)
    onChange()
  }

  return (
    <div>
      <ul className="space-y-3">
        {sorted.map((r) => {
          const pro = professionals.find((p) => p.id === r.professionalId)
          return (
            <li key={r.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  {r.userName} → {pro?.name ?? 'Cuenta eliminada'}
                </p>
                <div className="flex items-center gap-3">
                  <Stars value={r.rating} size="text-xs" />
                  <button
                    type="button"
                    onClick={() => setToDelete(r)}
                    className="text-xs text-brick-deep underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              {r.comment && <p className="mt-1.5 text-sm text-ink-soft">{r.comment}</p>}
            </li>
          )
        })}
        {sorted.length === 0 && <p className="py-8 text-center text-ink-soft">Sin valoraciones todavía.</p>}
      </ul>

      {toDelete && (
        <ConfirmDialog
          title="Eliminar valoración"
          confirmLabel="Eliminar"
          danger
          onCancel={() => setToDelete(null)}
          onConfirm={remove}
        >
          La reseña de {toDelete.userName} deja de mostrarse y el promedio de la profesional se recalcula.
        </ConfirmDialog>
      )}
    </div>
  )
}
