'use client'

import { passAddress, passAddressShort, passChain } from '../contract'
import { explorerUrl } from '@/shared/lib/web3/chains'

interface Props {
  /** Momento en que la red respondió, si ya respondió. */
  checkedAt?: number | undefined
}

function hora(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

/**
 * RF-12: de dónde salió la respuesta. Red, chainId y contrato a la vista, para
 * que "la app le pregunta a la red, no a su base de datos" se pueda comprobar
 * en pantalla en vez de creerlo.
 */
export function NetworkProof({ checkedAt }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="chip">
        <span className="h-2 w-2 rounded-full bg-avax" aria-hidden />
        {passChain.name}
      </span>
      <span className="chip">chainId {passChain.id}</span>
      <a
        href={`${explorerUrl}/address/${passAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="chip transition-colors hover:border-avax hover:text-avax"
      >
        contrato {passAddressShort}
      </a>
      {checkedAt !== undefined && (
        <span className="font-mono text-xs text-muted">respondió a las {hora(checkedAt)}</span>
      )}
    </div>
  )
}
