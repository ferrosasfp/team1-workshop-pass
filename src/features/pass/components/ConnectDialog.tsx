'use client'

import { useEffect, useRef } from 'react'
import type { Connector } from 'wagmi'
import { useConnect, useConnectors } from 'wagmi'

interface Props {
  onClose: () => void
}

/**
 * RF-02: lista las wallets que el navegador anuncia por EIP-6963, con su
 * nombre y su ícono propios. Core Wallet aparece aquí como "Core", no como
 * un genérico "Injected".
 */
export function ConnectDialog({ onClose }: Props) {
  // EIP-6963 agrega conectores en tiempo de ejecucion, asi que la lista
  // real puede ser mas larga que la declarada en la configuracion.
  const connectors: readonly Connector[] = useConnectors()
  const { connect } = useConnect()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Elige tu wallet"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (!panel.current?.contains(event.target as Node)) onClose()
      }}
    >
      <div ref={panel} className="card w-full max-w-sm p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Elige tu wallet</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg px-2 text-2xl leading-none text-muted hover:text-paper"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              onClick={() => {
                connect({ connector })
                onClose()
              }}
              className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-left
                         transition-colors hover:border-avax hover:bg-avax-soft"
            >
              {connector.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={connector.icon} alt="" className="h-7 w-7 rounded-lg" />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-line font-mono text-xs">
                  {connector.name.slice(0, 1)}
                </span>
              )}
              <span className="font-medium">{connector.name}</span>
            </button>
          ))}

          {connectors.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">
              No detectamos ninguna wallet en este navegador. Instala Core Wallet y vuelve a
              intentarlo.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
