'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'
import { usePassStatus } from '../hooks/usePassStatus'
import { NetworkProof } from './NetworkProof'
import { REPO_URL, TELEGRAM_URL, AVALANCHE_DOCS_URL } from '../links'

const RECURSOS = [
  {
    href: REPO_URL,
    title: 'El código de esta demo',
    detail: 'El contrato, los tests y la aplicación. Todo abierto.',
  },
  {
    href: TELEGRAM_URL,
    title: 'La comunidad de Team1',
    detail: 'Donde seguimos la conversación después del workshop.',
  },
  {
    href: AVALANCHE_DOCS_URL,
    title: 'Documentación de Avalanche',
    detail: 'Para cuando quieras construir lo tuyo.',
  },
]

/**
 * RF-14 y RF-15. El portero vuelve a preguntarle a la red: no confía en lo que
 * haya pasado en la portada.
 */
export function AccesoGate() {
  const { address, isConnected } = useAccount()
  const { data, isLoading, isError, refetch } = usePassStatus(address)

  if (!isConnected || !address) {
    return (
      <Denegado
        titulo="Todavía no sabemos quién sos"
        detalle="Esta página le pregunta a la red si tu dirección tiene el pass, y para eso necesita una dirección conectada."
      />
    )
  }

  if (isLoading) {
    return (
      <Marco>
        <p className="text-xl text-muted">Preguntándole a la red…</p>
      </Marco>
    )
  }

  if (isError) {
    return (
      <Marco>
        <h1 className="text-3xl font-bold tracking-heading">No pudimos preguntarle a la red</h1>
        <p className="mt-3 text-lg text-muted">
          Sin respuesta de la red no podemos dejarte pasar, porque no hay ninguna otra lista donde
          buscar.
        </p>
        <button type="button" onClick={() => refetch()} className="btn-primary mt-6">
          Volver a preguntar
        </button>
      </Marco>
    )
  }

  if (!data?.hasPass) {
    return (
      <Denegado
        titulo="Esta dirección no tiene el pass"
        detalle="No hay lista de invitados ni base de datos: la única credencial es el token, y esta dirección no lo tiene."
        checkedAt={data?.checkedAt}
      />
    )
  }

  return (
    <Marco>
      <p className="chip border-ok/40 text-ok">
        <span className="h-2 w-2 rounded-full bg-ok" aria-hidden />
        pass #{data.tokenId.toString()} verificado
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-heading sm:text-5xl">
        Estás <span className="text-avax">adentro</span>
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted sm:text-xl">
        Nadie te dio de alta en ningún sistema. Tenés el token, y con eso alcanzó.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {RECURSOS.map((recurso) => (
          <li key={recurso.href}>
            <a
              href={recurso.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card block h-full p-4 transition-colors hover:border-avax"
            >
              <p className="font-semibold">{recurso.title}</p>
              <p className="mt-1 text-sm text-muted">{recurso.detail}</p>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <NetworkProof checkedAt={data.checkedAt} />
        <Link href="/" className="btn-ghost">
          Volver a los pasos
        </Link>
      </div>
    </Marco>
  )
}

function Denegado({
  titulo,
  detalle,
  checkedAt,
}: {
  titulo: string
  detalle: string
  checkedAt?: number | undefined
}) {
  return (
    <Marco>
      <h1 className="text-3xl font-bold tracking-heading sm:text-4xl">{titulo}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{detalle}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/" className="btn-primary">
          Ir al paso 1
        </Link>
        <NetworkProof checkedAt={checkedAt} />
      </div>
    </Marco>
  )
}

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center p-6">
      <div>{children}</div>
    </main>
  )
}
