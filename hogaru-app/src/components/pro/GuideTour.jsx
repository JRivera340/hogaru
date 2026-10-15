import { useEffect, useState } from 'react'

const TOUR_KEY = 'hogaru_pro_tour_done'

export function tourAlreadySeen() {
  try {
    return localStorage.getItem(TOUR_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    localStorage.setItem(TOUR_KEY, '1')
  } catch {
    // sin localStorage el recorrido se mostrará de nuevo; no es grave
  }
}

const slides = [
  {
    icon: '📥',
    title: 'Las reservas te llegan solas',
    body: 'Cuando una familia te reserva, la verás en la pestaña "Reservas". No tienes que buscar clientes.',
  },
  {
    icon: '✅',
    title: 'Tú decides si aceptas',
    body: 'Toca "Aceptar" si puedes ir. Si no puedes, toca "No puedo" y el horario queda libre para otra persona. A la familia le llega un aviso en cualquier caso.',
  },
  {
    icon: '🚶',
    title: 'Avisa cuando sales',
    body: 'El día del servicio toca "Voy en camino" y elige en cuántos minutos llegas. La familia recibe el aviso y se queda tranquila.',
  },
  {
    icon: '🏁',
    title: 'Al terminar, márcalo',
    body: 'Cuando acabes toca "Terminé el servicio". La familia podrá dejarte una valoración con estrellas.',
  },
  {
    icon: '⭐',
    title: 'Tu perfil trabaja por ti',
    body: 'Pon tus precios, tus horarios y fotos de trabajos que hayas hecho. Entre más completo, más reservas recibes. Si te trabas, toca "¿Necesitas ayuda?".',
  },
]

export default function GuideTour({ onClose }) {
  const [step, setStep] = useState(0)
  const last = step === slides.length - 1
  const slide = slides[step]

  function close() {
    markSeen()
    onClose()
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-5">
      <div role="dialog" aria-modal="true" aria-label="Cómo funciona Hogarú para ti" className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-pine">
          Cómo funciona · {step + 1} de {slides.length}
        </p>
        <p className="mt-4 text-5xl" aria-hidden="true">
          {slide.icon}
        </p>
        <h2 className="mt-3 font-display text-2xl text-ink">{slide.title}</h2>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">{slide.body}</p>

        <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
          {slides.map((s, i) => (
            <span key={s.title} className={`h-2 rounded-full ${i === step ? 'w-6 bg-pine' : 'w-2 bg-line'}`} />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          <button type="button" onClick={close} className="min-h-11 px-2 text-sm text-ink-soft underline">
            Saltar
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary !min-h-11 !px-4 text-sm">
                Atrás
              </button>
            )}
            <button
              type="button"
              onClick={() => (last ? close() : setStep(step + 1))}
              className="btn-primary !min-h-11 !px-5 text-sm"
              autoFocus
            >
              {last ? 'Entendido' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
