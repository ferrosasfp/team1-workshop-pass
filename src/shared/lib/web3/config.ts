import { createConfig, http } from 'wagmi'
import { injected, coinbaseWallet } from 'wagmi/connectors'
import { supportedChains, defaultChain } from './chains'

/**
 * Configuracion de wagmi.
 *
 * `multiInjectedProviderDiscovery` activa EIP-6963, que es lo que hace que Core
 * Wallet aparezca en la lista con su nombre y su icono propios en vez de
 * esconderse detras de un generico "Injected".
 */
export const wagmiConfig = createConfig({
  chains: supportedChains,
  ssr: true,
  multiInjectedProviderDiscovery: true,
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Team1 Workshop Pass' }),
  ],
  transports: Object.fromEntries(
    supportedChains.map((chain) => [
      chain.id,
      http(chain.id === defaultChain.id ? process.env.NEXT_PUBLIC_RPC_TESTNET || undefined : undefined),
    ])
  ) as Record<number, ReturnType<typeof http>>,
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
