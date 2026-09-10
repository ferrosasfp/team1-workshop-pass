import type { Address } from 'viem'
import { team1WorkshopPassAbi } from '@/features/contracts/abi/Team1WorkshopPass'
import { defaultChain } from '@/shared/lib/web3/chains'

/**
 * El ABI sale del artefacto de Foundry via `npm run contracts:sync-abi`.
 * Nunca se escribe a mano.
 */
export const passAbi = team1WorkshopPassAbi

// Se recorta: cargar la variable con `echo` deja un salto de linea pegado,
// y sin esto la aplicacion se cae al piso creyendo que no esta configurada.
const configured = (process.env.NEXT_PUBLIC_PASS_ADDRESS ?? '').trim()

/** false cuando falta configurar NEXT_PUBLIC_PASS_ADDRESS con una dirección válida. */
export const isPassAddressConfigured = /^0x[0-9a-fA-F]{40}$/.test(configured)

export const passAddress = (
  isPassAddressConfigured ? configured : '0x0000000000000000000000000000000000000000'
) as Address

export const passChain = defaultChain

/** Contrato abreviado para mostrarlo en pantalla: "0xAbCd...1234". */
export const passAddressShort = `${passAddress.slice(0, 6)}...${passAddress.slice(-4)}`
