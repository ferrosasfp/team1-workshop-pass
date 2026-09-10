'use client'

import { useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi'
import { ConnectDialog } from './ConnectDialog'
import { shortAddress } from '../lib/address'
import { passChain } from '../contract'
import { FAUCET_URL } from '@/shared/lib/web3/chains'

export function StepConnect() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { address, isConnected, chain, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: balance } = useBalance({ address, chainId: passChain.id })

  const wrongNetwork = isConnected && chain?.id !== passChain.id
  const noFunds = balance !== undefined && balance.value === 0n

  if (!isConnected) {
    return (
      <div className="flex flex-col items-start gap-6 corto:gap-4">
        <p className="max-w-xl text-lg text-muted corto:text-base sm:text-xl">
          No hay registro ni contraseña. Tu wallet <strong className="text-paper">es</strong> tu
          identidad, y con eso alcanza para entrar.
        </p>

        {/* En proyector el boton y la ayuda comparten fila: el alto escasea. */}
        <div className="flex flex-col items-start gap-6 corto:flex-row corto:items-center corto:gap-4">
          <button type="button" onClick={() => setDialogOpen(true)} className="btn-primary text-lg">
            Conectar wallet
          </button>

          <p className="text-sm text-muted">
            ¿No tenés ninguna?{' '}
            <a
              href="https://core.app/download"
              target="_blank"
              rel="noopener noreferrer"
              className="text-avax underline underline-offset-4"
            >
              Core es la wallet de Avalanche
            </a>
            .
          </p>
        </div>

        {dialogOpen && <ConnectDialog onClose={() => setDialogOpen(false)} />}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="chip border-ok/40 text-ok">
          <span className="h-2 w-2 rounded-full bg-ok" aria-hidden />
          conectado
        </span>
        <span className="font-mono text-lg sm:text-2xl">{shortAddress(address ?? '')}</span>
        {connector?.name && <span className="chip">{connector.name}</span>}
      </div>

      {wrongNetwork ? (
        <div className="rounded-xl border border-warn/40 bg-warn/10 p-4">
          <p className="font-semibold text-warn">Tu wallet no está en {passChain.name}</p>
          <p className="mt-1 text-sm text-muted">
            El pass vive en esa red. Cambiá desde acá y seguimos.
          </p>
          <button
            type="button"
            onClick={() => switchChain({ chainId: passChain.id })}
            disabled={isSwitching}
            className="btn-primary mt-3"
          >
            {isSwitching ? 'Cambiando…' : `Cambiar a ${passChain.name}`}
          </button>
        </div>
      ) : (
        <p className="text-lg text-muted">
          Estás en <strong className="text-paper">{passChain.name}</strong> con{' '}
          <strong className="text-paper">
            {balance
              ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}`
              : '…'}
          </strong>
          . Acá los tokens no valen dinero real.
        </p>
      )}

      {noFunds && !wrongNetwork && (
        <div className="rounded-xl border border-warn/40 bg-warn/10 p-4">
          <p className="font-semibold text-warn">No tenés AVAX de prueba</p>
          <p className="mt-1 text-sm text-muted">
            Hace falta un poco para pagar el gas. El faucet te da AVAX de Fuji gratis.
          </p>
          <a
            href={FAUCET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-3"
          >
            Abrir el faucet de Core
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => disconnect()}
        className="self-start text-sm text-muted underline underline-offset-4 hover:text-paper"
      >
        Desconectar
      </button>
    </div>
  )
}
