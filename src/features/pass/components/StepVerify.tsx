'use client'

import { useAccount } from 'wagmi'
import { usePassStatus } from '../hooks/usePassStatus'
import { NetworkProof } from './NetworkProof'
import { PassResult } from './PassResult'

/**
 * RF-10 y RF-11: consulta `hasPass(address)` al RPC de Fuji y la vuelve a
 * hacer cada vez que cambia la dirección conectada o confirma una acuñación.
 */
export function StepVerify() {
  const { address } = useAccount()
  const { data, isFetching, isError, refetch } = usePassStatus(address)

  if (!address) {
    return <p className="text-lg text-muted">Conecta tu wallet en el paso 1 para verificarla.</p>
  }

  return (
    <div className="flex flex-col gap-4 corto:gap-3">
      {/* En proyector el subtitulo de la lamina ya dice esto, y el alto escasea. */}
      <p className="text-base text-muted corto:hidden">
        Nadie guardó tu nombre en una lista. Esto es lo que contestó la red:
      </p>

      {isError ? (
        <div className="rounded-xl border border-avax/50 bg-avax-soft p-4">
          <p className="font-semibold text-avax">No pudimos preguntarle a la red</p>
          <p className="mt-1 text-sm text-muted">
            Puede ser la conexión o el nodo público de Fuji. Reintenta en unos segundos.
          </p>
          <button type="button" onClick={() => refetch()} className="btn-ghost mt-3">
            Volver a preguntar
          </button>
        </div>
      ) : data ? (
        <PassResult address={address} hasPass={data.hasPass} tokenId={data.tokenId} />
      ) : (
        <p className="text-lg text-muted">Preguntándole a la red…</p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <NetworkProof checkedAt={data?.checkedAt} />
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs text-muted underline underline-offset-4 hover:text-avax
                     disabled:no-underline disabled:opacity-50"
        >
          {isFetching ? 'preguntando…' : 'preguntar de nuevo'}
        </button>
      </div>
    </div>
  )
}
