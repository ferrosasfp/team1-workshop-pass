'use client'

import { Component, useState, type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/shared/lib/web3/config'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * RNF-06: ningún error puede dejar la pantalla en blanco durante la demo.
 * Si algo revienta dentro del árbol de web3, se muestra una salida con
 * un botón para reintentar sin recargar.
 */
class Web3ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error) {
    console.error('[Web3Provider]', error)
  }

  private readonly handleRetry = () => this.setState({ error: null })

  override render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-dvh items-center justify-center p-6">
          <div className="card max-w-md p-8 text-center">
            <h1 className="text-xl font-semibold text-avax">No pudimos iniciar la wallet</h1>
            <p className="mt-3 text-sm text-muted">
              Algo falló al conectar con el navegador. Probá de nuevo, o recargá la página.
            </p>
            <button onClick={this.handleRetry} className="btn-primary mt-6">
              Reintentar
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export function Web3Provider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // La app le pregunta a la red, no a su base de datos: nada se
            // considera fresco por defecto.
            staleTime: 0,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <Web3ErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </Web3ErrorBoundary>
  )
}
