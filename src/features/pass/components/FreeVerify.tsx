'use client'

import { useState, type FormEvent } from 'react'
import type { Address } from 'viem'
import { parseAddress } from '../lib/address'
import { usePassStatus } from '../hooks/usePassStatus'
import { PassResult } from './PassResult'

/**
 * RF-13: verificar cualquier dirección pegada a mano, sin conectar nada.
 *
 * Vive fuera de los cuatro pasos y siempre está a la vista, porque además de
 * ser una demostración es el plan B: si la wallet del orador falla en vivo, aquí
 * se pega la dirección de respaldo y la demo sigue.
 */
export function FreeVerify() {
  const [input, setInput] = useState('')
  const [target, setTarget] = useState<Address | undefined>(undefined)
  const [inputError, setInputError] = useState<string | null>(null)

  const { data, isFetching, isError } = usePassStatus(target)

  function onSubmit(event: FormEvent) {
    event.preventDefault()

    const parsed = parseAddress(input)
    if (!parsed.ok) {
      setInputError(parsed.error)
      setTarget(undefined)
      return
    }

    setInputError(null)
    setTarget(parsed.address)
  }

  return (
    <section aria-label="Verificar cualquier dirección" className="card p-3 corto:p-2.5 sm:p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor="direccion"
          className="shrink-0 text-sm font-semibold uppercase tracking-wide text-muted"
        >
          Verificar otra dirección
        </label>
        <input
          id="direccion"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="0x… sin conectar wallet"
          spellCheck={false}
          autoComplete="off"
          className="w-full rounded-xl border border-line bg-ink px-4 py-2.5 font-mono text-sm
                     text-paper placeholder:text-muted focus:border-avax focus:outline-none"
        />
        <button type="submit" disabled={isFetching} className="btn-primary shrink-0 py-2.5">
          {isFetching ? 'Preguntando…' : 'Verificar'}
        </button>
      </form>

      {inputError && <p className="mt-2 text-sm text-avax corto:mt-1 corto:text-xs">{inputError}</p>}

      {isError && target && (
        <p className="mt-2 text-sm text-avax corto:mt-1 corto:text-xs">
          No pudimos preguntarle a la red. Reintenta en unos segundos.
        </p>
      )}

      {target && data && (
        <div className="mt-2">
          <PassResult address={target} hasPass={data.hasPass} tokenId={data.tokenId} compact />
        </div>
      )}
    </section>
  )
}
