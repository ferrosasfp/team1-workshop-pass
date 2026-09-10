'use client'

import { useEffect } from 'react'

/** RNF-06: ningún error deja la pantalla en blanco, y siempre hay una salida. */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[app]', error)
  }, [error])

  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold tracking-heading text-avax">Algo se rompió</h1>
        <p className="mt-3 max-w-md text-muted">
          La aplicación no pudo mostrar esta pantalla. Nada de lo que está en la red se perdió: tu
          pass sigue donde estaba.
        </p>
        <button type="button" onClick={reset} className="btn-primary mt-6">
          Reintentar
        </button>
      </div>
    </main>
  )
}
