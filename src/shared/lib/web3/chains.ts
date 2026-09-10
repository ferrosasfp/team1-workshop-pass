import { avalanche, avalancheFuji } from 'viem/chains'
import type { Chain } from 'viem'

/**
 * Registro de cadenas EVM. Fuji es la cadena de la demo: los tokens no valen
 * nada, asi que cualquiera puede repetir el ejercicio sin gastar un peso.
 */
// `as const` conserva los tipos literales de cada cadena, que es lo que le
// permite a wagmi inferir los `chainId` validos en cada llamada.
export const supportedChains = [avalancheFuji, avalanche] as const

const configuredChainId = Number((process.env.NEXT_PUBLIC_CHAIN_ID ?? '43113').trim())

export const defaultChain = configuredChainId === avalanche.id ? avalanche : avalancheFuji

export function getChainById(chainId: number): Chain | undefined {
  return supportedChains.find((chain) => chain.id === chainId)
}

/** Explorador de la cadena activa, para los enlaces a transacciones. */
export const explorerUrl =
  defaultChain.id === avalancheFuji.id
    ? 'https://subnets.avax.network/c-chain-testnet'
    : 'https://subnets.avax.network/c-chain'

export const FAUCET_URL = 'https://core.app/tools/testnet-faucet'
