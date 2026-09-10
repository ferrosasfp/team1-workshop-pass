import { z } from 'zod'
import { getAddress, isAddress } from 'viem'
import type { Address } from 'viem'

/** Una dirección EVM, tolerante a espacios de sobra al pegarla. */
export const addressSchema = z
  .string()
  .trim()
  .refine((value) => isAddress(value, { strict: false }), {
    message: 'Eso no parece una dirección. Tiene que empezar con 0x y tener 42 caracteres.',
  })
  .transform((value) => getAddress(value))

export type ParsedAddress =
  | { ok: true; address: Address }
  | { ok: false; error: string }

/**
 * Valida una dirección pegada a mano en el campo de verificación libre.
 * Nunca lanza: devuelve el motivo en castellano para mostrarlo tal cual.
 */
export function parseAddress(input: string): ParsedAddress {
  if (input.trim().length === 0) {
    return { ok: false, error: 'Pegá una dirección para verificarla.' }
  }

  const result = addressSchema.safeParse(input)
  if (!result.success) {
    return { ok: false, error: result.error.issues[0]?.message ?? 'Dirección inválida.' }
  }

  return { ok: true, address: result.data }
}

/** "0xEbC2...6523". Lo que se muestra en pantalla en vez de los 42 caracteres. */
export function shortAddress(address: string): string {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
