import { Link } from 'react-router-dom'

const faqs = [
  {
    q: '¿Cómo acepto una reserva?',
    a: 'Entra a "Mi panel" y abre la pestaña "Reservas". Las nuevas dicen "Pendiente de confirmación". Toca el botón verde "Aceptar". A la familia le llega un aviso.',
  },
  {
    q: '¿Cómo aviso que voy en camino?',
    a: 'Cuando ya vas a salir, en la reserva toca "Voy en camino" y elige en cuántos minutos llegas (10, 20, 30, 45 o 60). La familia recibe el aviso al instante.',
  },
  {
    q: '¿Qué hago si no puedo ir?',
    a: 'Si la reserva aún está pendiente, toca "No puedo". Si ya la habías aceptado, toca "Cancelar". En los dos casos el horario queda libre y la familia recibe un aviso para buscar a otra persona.',
  },
  {
    q: '¿Cómo digo que ya terminé?',
    a: 'Cuando acabes el trabajo toca "Terminé el servicio". Así la familia puede dejarte su valoración con estrellas.',
  },
  {
    q: '¿Cómo cambio mis precios?',
    a: 'Ve a "Perfil y tarifas". Marca los servicios que haces y escribe cuánto cobras en cada uno (solo números, por ejemplo 45000). Al final toca "Guardar perfil".',
  },
  {
    q: '¿Cómo cambio mis días y horas?',
    a: 'Ve a "Disponibilidad". En cada día elige una hora y toca "Agregar". Para quitar una hora toca la "×". Las horas con un punto (●) ya tienen una reserva y no se pueden quitar.',
  },
  {
    q: '¿Por qué no aparezco en Explorar?',
    a: 'Para aparecer necesitas al menos un servicio con precio y una hora disponible. Revisa la lista "Deja tu perfil listo" en tu panel: te dice qué falta.',
  },
  {
    q: '¿Cuándo me verifican y qué cambia?',
    a: 'El equipo de Hogarú revisa tu perfil. Cuando te verifica, tu perfil muestra el sello "Verificada", que da más confianza a las familias. Mientras tanto puedes recibir reservas.',
  },
  {
    q: '¿Qué fotos debo subir de mis trabajos?',
    a: 'Fotos claras de trabajos que hayas hecho: una cocina limpia, ropa planchada, un baño. Escribe en una frase qué hiciste. No subas fotos donde se vean personas ni datos de la casa.',
  },
]

export default function ProHelp() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Link to="/pro" className="text-sm text-ink-soft hover:text-pine">
        ← Volver a mi panel
      </Link>
      <h1 className="mt-2 font-display text-3xl text-ink">Ayuda para profesionales</h1>
      <p className="mt-1 text-base text-ink-soft">
        Respuestas cortas a las dudas más comunes. Toca una pregunta para ver la respuesta.
      </p>

      <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface">
        {faqs.map((f) => (
          <details key={f.q} className="group px-4 py-3">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-ink">
              {f.q}
              <span aria-hidden="true" className="text-pine transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="pb-2 pt-1 text-base leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿Sigues con dudas? Escríbenos a{' '}
        <a href="mailto:ayuda@hogaru.com" className="font-semibold text-pine-deep underline">
          ayuda@hogaru.com
        </a>
        .
      </p>
    </div>
  )
}
