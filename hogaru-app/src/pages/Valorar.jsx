import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProfessional } from '../store/proStore'
import { useAuth } from '../store/AuthContext'
import { getBookings, hasReviewForBooking, saveReview } from '../store/bookingStore'

export default function Valorar() {
  const { bookingId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const booking = getBookings().find((b) => b.id === bookingId)
  const pro = booking ? getProfessional(booking.professionalId) : null

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [done, setDone] = useState(false)

  if (!booking || !pro) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-ink-soft">No encontramos esa reserva.</p>
        <Link to="/mis-reservas" className="btn-secondary mt-4 inline-block">
          Volver a mis reservas
        </Link>
      </div>
    )
  }

  if (booking.userId !== user.id) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-ink-soft">Esa reserva no pertenece a tu cuenta.</p>
        <Link to="/mis-reservas" className="btn-secondary mt-4 inline-block">
          Ver mis reservas
        </Link>
      </div>
    )
  }

  if (!done && (booking.status !== 'completada' || hasReviewForBooking(booking.id))) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-ink-soft">
          {booking.status !== 'completada'
            ? 'Podrás valorar cuando la profesional marque el servicio como realizado.'
            : 'Ya valoraste este servicio.'}
        </p>
        <Link to="/mis-reservas" className="btn-secondary mt-4 inline-block">
          Volver a mis reservas
        </Link>
      </div>
    )
  }

  function submit(e) {
    e.preventDefault()
    if (rating === 0 || hasReviewForBooking(booking.id)) return
    saveReview({
      bookingId: booking.id,
      professionalId: booking.professionalId,
      userId: user.id,
      userName: user.name,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-pine-soft"
        >
          <svg width="24" height="24" viewBox="0 0 20 20" fill="#C9992B">
            <path d="M10 1.5l2.47 5.24 5.78.62-4.31 3.94 1.19 5.7L10 14.9l-5.13 2.1 1.19-5.7L1.75 7.36l5.78-.62L10 1.5z" />
          </svg>
        </motion.div>
        <h1 className="mt-5 font-display text-2xl text-ink">Gracias por tu valoración</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Ayuda a que {pro.name} y otras familias sepan qué esperar.
        </p>
        <button onClick={() => navigate('/mis-reservas')} className="btn-primary mt-6">
          Volver a mis reservas
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl text-ink">Valorar a {pro.name}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Servicio del {booking.date} a las {booking.time}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">¿Cómo estuvo el servicio?</p>
          <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHovered(n)}
                onClick={() => setRating(n)}
                aria-label={`${n} estrellas`}
                className="p-0.5"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 20 20"
                  fill={n <= (hovered || rating) ? '#C9992B' : '#D7DED3'}
                >
                  <path d="M10 1.5l2.47 5.24 5.78.62-4.31 3.94 1.19 5.7L10 14.9l-5.13 2.1 1.19-5.7L1.75 7.36l5.78-.62L10 1.5z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-ink" htmlFor="comment">
            Cuéntanos qué tal (opcional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Puntualidad, trato, calidad del aseo…"
            className="input"
          />
        </div>

        <button type="submit" disabled={rating === 0} className="btn-primary w-full">
          Enviar valoración
        </button>
      </form>
    </div>
  )
}
