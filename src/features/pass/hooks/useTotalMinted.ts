'use client'

import { useQuery } from '@tanstack/react-query'
import { getPublicClient } from '@/shared/lib/web3/client'
import { passAbi, passAddress, passChain, isPassAddressConfigured } from '../contract'

/** Total de passes acuñados, leído de `totalMinted()` (RF-17). */
export function useTotalMinted() {
  return useQuery<bigint>({
    queryKey: ['total-minted', passChain.id, passAddress],
    enabled: isPassAddressConfigured,
    staleTime: 0,
    refetchInterval: 15_000,
    retry: 1,
    queryFn: async () => {
      const client = getPublicClient(passChain.id)
      return await client.readContract({
        address: passAddress,
        abi: passAbi,
        functionName: 'totalMinted',
      })
    },
  })
}
