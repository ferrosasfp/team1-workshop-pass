'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'
import { usePassStatus } from '../hooks/usePassStatus'

export function StepUnlock() {
  const { address } = useAccount()
  const { data } = usePassStatus(address)

  if (!data?.hasPass) {
    return (
      <p className="text-lg text-muted">
        El paso 4 se abre cuando la verificación del paso 3 da positivo.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-start gap-5 corto:gap-3">
      <p className="max-w-2xl text-lg text-muted corto:text-base sm:text-xl">
        El pass no es una imagen: es la llave. La página de acceso vuelve a preguntarle a la red.
      </p>
      <Link href="/acceso" className="btn-primary text-lg">
        Entrar al contenido
      </Link>
    </div>
  )
}
