import { useEffect, useState } from 'react'

// Devuelve un contador que sube cuando OTRA pestaña modifica datos de Hogarú
// (el evento `storage` solo se dispara entre pestañas). Úsalo como dependencia
// o como `key` para volver a leer los stores.
export default function useStorageVersion() {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    function onStorage(e) {
      if (e.key === null || e.key.startsWith('hogaru_')) setVersion((v) => v + 1)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return version
}
