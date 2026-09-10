'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useMintPass } from '../hooks/useMintPass'
import { usePassStatus } from '../hooks/usePassStatus'
import { passChain } from '../contract'
import { explorerUrl, FAUCET_URL } from '@/shared/lib/web3/chains'

interface Props {
  /** Se llama cuando la acuñación confirma, para refrescar el paso 3. */
  onMinted: () => void
}

const PHASES = [
  { key: 'signing', label: 'Firmando en tu wallet' },
  { key: 'confirming', label: 'Esperando confirmación' },
  { key: 'confirmed', label: 'Confirmada' },
] as const

export function StepMint({ onMinted }: Props) {
  const { address, chain } = useAccount()
  const { data: status } = usePassStatus(address)
  const { phase, hash, tokenId, error, mint, reset } = useMintPass()

  useEffect(() => {
    if (phase === 'confirmed') onMinted()
  }, [phase, onMinted])

  const wrongNetwork = chain?.id !== passChain.id

  // RF-08: si ya tiene el pass, el botón no existe.
  if (status?.hasPass && phase !== 'confirmed') {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-2xl font-semibold text-ok sm:text-3xl">Ya tienes tu pass</p>
        <p className="max-w-xl text-lg text-muted">
          El contrato permite uno por dirección, así que no hay nada más que hacer aquí. Pasa al
          paso 3 y preguntémosle a la red.
        </p>
      </div>
    )
  }

  if (wrongNetwork) {
    return (
      <p className="text-lg text-muted">
        Vuelve al paso 1 y cambia a {passChain.name} para poder acuñar.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-5 corto:gap-3">
      {phase !== 'confirmed' && (
        <p className="max-w-2xl text-lg text-muted corto:text-base sm:text-xl">
          Acuñar es escribir un registro en la red: un{' '}
          <strong className="text-paper">ID</strong>, un{' '}
          <strong className="text-paper">dueño</strong> y las{' '}
          <strong className="text-paper">reglas</strong>. Este no se puede transferir, porque un
          pase de acceso no se revende.
        </p>
      )}

      {phase === 'confirmed' && tokenId !== undefined ? (
        <div className="rounded-xl border border-ok/40 bg-ok/10 p-5 corto:p-4">
          <p className="text-3xl font-bold text-ok">Pass #{tokenId.toString()}</p>
          <p className="mt-1 text-sm text-muted">Ya está escrito en la red y es tuyo.</p>
          {hash && (
            <a
              href={`${explorerUrl}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-3"
            >
              Ver la transacción en el explorador
            </a>
          )}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={mint}
            disabled={phase === 'signing' || phase === 'confirming'}
            className="btn-primary self-start text-lg"
          >
            {phase === 'signing'
              ? 'Confirma en tu wallet…'
              : phase === 'confirming'
                ? 'Escribiendo en la red…'
                : 'Acuñar mi pass'}
          </button>

          {/* RF-06: los tres estados de la transacción, siempre a la vista. */}
          {(phase === 'signing' || phase === 'confirming') && (
            <ol className="flex flex-wrap gap-2">
              {PHASES.map((item) => {
                const reached =
                  (item.key === 'signing' && (phase === 'signing' || phase === 'confirming')) ||
                  (item.key === 'confirming' && phase === 'confirming')

                return (
                  <li
                    key={item.key}
                    className={`chip ${reached ? 'border-avax text-avax' : 'opacity-50'}`}
                  >
                    {item.label}
                  </li>
                )
              })}
            </ol>
          )}
        </>
      )}

      {/* RF-09: el motivo en castellano y el botón sigue disponible. */}
      {error && (
        <div className="rounded-xl border border-avax/50 bg-avax-soft p-4">
          <p className="font-semibold text-avax">{error.title}</p>
          <p className="mt-1 text-sm text-muted">{error.hint}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {error.retryable && (
              <button type="button" onClick={reset} className="btn-ghost">
                Volver a intentar
              </button>
            )}
            {error.title.includes('AVAX') && (
              <a href={FAUCET_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Abrir el faucet
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
