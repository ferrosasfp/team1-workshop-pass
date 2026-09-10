'use client'

import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'
import { getPublicClient } from '@/shared/lib/web3/client'
import { passAbi, passAddress, passChain, isPassAddressConfigured } from '../contract'

export interface PassStatus {
  hasPass: boolean
  tokenId: bigint
  /** Momento exacto en que la red respondió. Se muestra para que se vea que es en vivo. */
  checkedAt: number
}

/**
 * Consulta `hasPass(address)` directamente al RPC de Fuji.
 *
 * No hay base de datos ni caché de servidor detrás de esto: cada llamada sale
 * del navegador hacia un nodo de la red. Por eso `staleTime` es 0, para que
 * cada vez que se pregunta se vuelva a preguntar de verdad.
 */
export function usePassStatus(address: Address | undefined) {
  return useQuery<PassStatus>({
    queryKey: ['pass-status', passChain.id, passAddress, address],
    enabled: Boolean(address) && isPassAddressConfigured,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    queryFn: async () => {
      const client = getPublicClient(passChain.id)

      const [hasPass, tokenId] = await Promise.all([
        client.readContract({
          address: passAddress,
          abi: passAbi,
          functionName: 'hasPass',
          args: [address!],
        }),
        client.readContract({
          address: passAddress,
          abi: passAbi,
          functionName: 'passTokenIdOf',
          args: [address!],
        }),
      ])

      return { hasPass, tokenId, checkedAt: Date.now() }
    },
  })
}
