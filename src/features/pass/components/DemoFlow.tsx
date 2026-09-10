'use client'

import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { STEPS, type StepNumber } from '../steps'
import { isPassAddressConfigured, passChain } from '../contract'
import { usePassStatus } from '../hooks/usePassStatus'
import { pasoActivo, pasoSugerido, pasosHabilitados } from '../lib/flow'
import { Stepper } from './Stepper'
import { StepConnect } from './StepConnect'
import { StepMint } from './StepMint'
import { StepVerify } from './StepVerify'
import { StepUnlock } from './StepUnlock'
import { FreeVerify } from './FreeVerify'
import { PassCounter } from './PassCounter'

export function DemoFlow() {
  const { address, isConnected, chain } = useAccount()
  const { data: status } = usePassStatus(address)
  const queryClient = useQueryClient()

  const estado = {
    conectado: isConnected,
    redCorrecta: chain?.id === passChain.id,
    tienePass: status?.hasPass ?? false,
  }

  const sugerido = pasoSugerido(estado)
  const unlocked = pasosHabilitados(estado)

  // Navegacion manual del orador, que caduca sola cuando cambia la cadena.
  const [elegido, setElegido] = useState<{ paso: StepNumber; desde: StepNumber } | null>(null)
  const step = pasoActivo(sugerido, elegido)

  // Sin useCallback: el compilador de React memoiza esto solo, y aca la
  // dependencia real es `sugerido`, que cambia cuando cambia la cadena.
  const onSelect = (paso: StepNumber) => setElegido({ paso, desde: sugerido })

  // RF-11: cuando confirma una acuñación, se vuelve a preguntar sin recargar.
  const onMinted = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['pass-status'] })
    void queryClient.invalidateQueries({ queryKey: ['total-minted'] })
  }, [queryClient])

  if (!isPassAddressConfigured) {
    return (
      <main className="grid min-h-dvh place-items-center p-6">
        <div className="card max-w-lg p-8">
          <h1 className="text-xl font-semibold text-avax">Falta configurar el contrato</h1>
          <p className="mt-3 text-sm text-muted">
            La variable <code className="font-mono">NEXT_PUBLIC_PASS_ADDRESS</code> no tiene una
            dirección válida. Copiá <code className="font-mono">.env.example</code> a{' '}
            <code className="font-mono">.env.local</code>, completala con la dirección del contrato
            en {passChain.name} y volvé a levantar la aplicación.
          </p>
        </div>
      </main>
    )
  }

  const current = STEPS[step - 1]!

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-3 p-4
                 sm:h-dvh sm:overflow-hidden sm:p-5"
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold tracking-heading">
          Team1 <span className="text-avax">Workshop Pass</span>
        </h1>
        <PassCounter />
      </header>

      {/* En pantalla ancha: pasos a la izquierda, contenido a la derecha. */}
      <div className="flex flex-col gap-3 sm:min-h-0 sm:flex-1 sm:flex-row sm:gap-4">
        <Stepper active={step} unlocked={unlocked} onSelect={onSelect} />

        <section
          aria-label={`Paso ${current.number}: ${current.title}`}
          className="card flex flex-col gap-3 p-5 corto:gap-2 corto:p-4 sm:min-h-0 sm:flex-1 sm:overflow-y-auto"
        >
          <div>
            <p className="font-mono text-xs text-avax">{current.number}</p>
            <h2 className="text-2xl font-bold tracking-heading corto:text-2xl sm:text-3xl">
              {current.title}
            </h2>
            <p className="mt-0.5 text-base text-muted corto:text-sm">{current.subtitle}</p>
          </div>

          {step === 1 && <StepConnect />}
          {step === 2 && <StepMint onMinted={onMinted} />}
          {step === 3 && <StepVerify />}
          {step === 4 && <StepUnlock />}
        </section>
      </div>

      <FreeVerify />

      <footer className="shrink-0">
        <p className="text-xs text-muted">
          Fuji es la red de pruebas. Sin dinero real, y lo podés repetir hoy.
        </p>
      </footer>
    </main>
  )
}
