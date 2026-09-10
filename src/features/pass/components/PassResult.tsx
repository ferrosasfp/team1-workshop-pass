'use client'

import { shortAddress } from '../lib/address'

interface Props {
  address: string
  hasPass: boolean
  tokenId: bigint | undefined
  /** Version de una sola linea, para el bloque de verificacion libre. */
  compact?: boolean
}

/** El veredicto de la verificación, en grande y sin ambigüedad. */
export function PassResult({ address, hasPass, tokenId, compact = false }: Props) {
  const detalle =
    shortAddress(address) + (hasPass && tokenId !== undefined && tokenId > 0n ? ` · pass #${tokenId}` : '')

  if (compact) {
    return (
      <p
        role="status"
        className={`flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 ${
          hasPass ? 'border-ok/40 bg-ok/10' : 'border-line bg-surface'
        }`}
      >
        <span aria-hidden className={hasPass ? 'text-ok' : 'text-muted'}>
          {hasPass ? '✓' : '·'}
        </span>
        <span className={`font-semibold ${hasPass ? 'text-ok' : 'text-muted'}`}>
          {hasPass ? 'Tiene el pass' : 'No tiene el pass'}
        </span>
        <span className="font-mono text-xs text-muted">{detalle}</span>
      </p>
    )
  }

  return (
    <div
      role="status"
      className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
        hasPass ? 'border-ok/40 bg-ok/10' : 'border-line bg-surface'
      }`}
    >
      <span
        aria-hidden
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-bold ${
          hasPass ? 'bg-ok text-ink' : 'bg-line text-muted'
        }`}
      >
        {hasPass ? '✓' : '·'}
      </span>
      <div className="min-w-0">
        <p className={`text-lg font-semibold ${hasPass ? 'text-ok' : 'text-muted'}`}>
          {hasPass ? 'Tiene el pass' : 'No tiene el pass'}
        </p>
        <p className="truncate font-mono text-sm text-muted">{detalle}</p>
      </div>
    </div>
  )
}
