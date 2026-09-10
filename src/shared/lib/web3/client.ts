import { createPublicClient, http, type PublicClient } from 'viem'
import { defaultChain, getChainById } from './chains'

const cache = new Map<number, PublicClient>()

/**
 * Cliente de solo lectura contra el RPC de la cadena.
 *
 * Esta es la unica fuente de verdad de la aplicacion: no hay base de datos ni
 * cache de servidor. Cada verificacion de propiedad viaja hasta la red.
 */
export function getPublicClient(chainId?: number): PublicClient {
  const chain = chainId ? (getChainById(chainId) ?? defaultChain) : defaultChain

  const cached = cache.get(chain.id)
  if (cached) return cached

  const client = createPublicClient({
    chain,
    transport: http(process.env.NEXT_PUBLIC_RPC_TESTNET || undefined),
  })

  cache.set(chain.id, client)
  return client
}
