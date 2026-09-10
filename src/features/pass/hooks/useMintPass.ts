'use client'

import { useCallback, useMemo } from 'react'
import { parseEventLogs } from 'viem'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { passAbi, passAddress, passChain } from '../contract'
import { toFriendlyError, type FriendlyError } from '../lib/errors'

/** Los tres estados que pide RF-06, más el reposo y el fallo. */
export type MintPhase = 'idle' | 'signing' | 'confirming' | 'confirmed' | 'error'

export interface MintState {
  phase: MintPhase
  hash: `0x${string}` | undefined
  tokenId: bigint | undefined
  error: FriendlyError | undefined
  mint: () => void
  reset: () => void
}

export function useMintPass(): MintState {
  const {
    writeContract,
    data: hash,
    isPending: isSigning,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  const {
    data: receipt,
    isLoading: isConfirming,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash, chainId: passChain.id })

  const mint = useCallback(() => {
    resetWrite()
    writeContract({
      address: passAddress,
      abi: passAbi,
      functionName: 'mint',
      chainId: passChain.id,
    })
  }, [writeContract, resetWrite])

  const tokenId = useMemo(() => {
    if (!receipt) return undefined

    const [minted] = parseEventLogs({
      abi: passAbi,
      eventName: 'PassMinted',
      logs: receipt.logs,
    })

    const args = minted?.args as { tokenId?: bigint } | undefined
    return args?.tokenId
  }, [receipt])

  const rawError = writeError ?? receiptError
  const error = rawError ? toFriendlyError(rawError) : undefined

  const phase: MintPhase = error
    ? 'error'
    : receipt
      ? 'confirmed'
      : isConfirming
        ? 'confirming'
        : isSigning
          ? 'signing'
          : 'idle'

  return { phase, hash, tokenId, error, mint, reset: resetWrite }
}
