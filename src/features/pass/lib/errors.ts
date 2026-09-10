/**
 * Traduce cualquier error de wallet o de cadena a una frase que se pueda leer
 * en voz alta durante la demo.
 *
 * RNF-06: ninguna condición de error puede dejar la pantalla en blanco, y toda
 * salida tiene un mensaje en castellano.
 */

export interface FriendlyError {
  /** Lo que se muestra en grande. */
  title: string
  /** Una línea explicando qué hacer. */
  hint: string
  /** true cuando reintentar tiene sentido. */
  retryable: boolean
}

const REJECTED: FriendlyError = {
  title: 'Cancelaste la firma',
  hint: 'No se envió nada a la red y no gastaste nada. Puedes volver a intentarlo cuando quieras.',
  retryable: true,
}

const ALREADY_MINTED: FriendlyError = {
  title: 'Esta dirección ya tiene su pass',
  hint: 'El contrato permite uno por dirección. Ve al paso 3 y verifícalo.',
  retryable: false,
}

const SOULBOUND: FriendlyError = {
  title: 'El pass no se puede transferir',
  hint: 'La regla vive dentro del contrato: una vez acuñado, se queda en la dirección que lo acuñó.',
  retryable: false,
}

const NO_FUNDS: FriendlyError = {
  title: 'Te falta AVAX de prueba',
  hint: 'Pide AVAX gratis en el faucet de Core y vuelve a intentarlo. En Fuji no vale dinero real.',
  retryable: true,
}

const WRONG_NETWORK: FriendlyError = {
  title: 'Tu wallet no está en Avalanche Fuji',
  hint: 'Cambia de red desde el aviso de arriba y vuelve a intentarlo.',
  retryable: true,
}

const NETWORK: FriendlyError = {
  title: 'No pudimos hablar con la red',
  hint: 'Puede ser la conexión o el nodo público de Fuji. Espera unos segundos y reintenta.',
  retryable: true,
}

const UNKNOWN: FriendlyError = {
  title: 'Algo salió mal',
  hint: 'La transacción no se completó. Prueba de nuevo; si sigue fallando, recarga la página.',
  retryable: true,
}

/** Junta nombre, mensaje y toda la cadena de causas en un solo texto buscable. */
function flatten(error: unknown): string {
  const parts: string[] = []
  const seen = new Set<unknown>()
  let current: unknown = error

  while (current && !seen.has(current) && parts.length < 20) {
    seen.add(current)

    if (typeof current === 'string') {
      parts.push(current)
      break
    }

    if (typeof current === 'object') {
      const candidate = current as Record<string, unknown>
      for (const key of ['name', 'shortMessage', 'details', 'message', 'reason']) {
        const value = candidate[key]
        if (typeof value === 'string') parts.push(value)
      }
      if (typeof candidate['code'] === 'number') parts.push(String(candidate['code']))
      current = candidate['cause']
      continue
    }

    break
  }

  return parts.join(' | ').toLowerCase()
}

export function toFriendlyError(error: unknown): FriendlyError {
  if (error === null || error === undefined) return UNKNOWN

  const text = flatten(error)

  // El orden importa: lo más específico primero.
  if (text.includes('passalreadyminted')) return ALREADY_MINTED
  if (text.includes('passissoulbound')) return SOULBOUND

  if (
    text.includes('userrejected') ||
    text.includes('user rejected') ||
    text.includes('user denied') ||
    text.includes('rejected the request') ||
    text.includes('4001')
  ) {
    return REJECTED
  }

  if (
    text.includes('insufficient funds') ||
    text.includes('exceeds the balance') ||
    text.includes('gas required exceeds')
  ) {
    return NO_FUNDS
  }

  if (
    text.includes('chain mismatch') ||
    text.includes('chainmismatch') ||
    text.includes('does not match the target chain') ||
    text.includes('unsupported chain') ||
    text.includes('switchchain')
  ) {
    return WRONG_NETWORK
  }

  if (
    text.includes('http request failed') ||
    text.includes('fetch failed') ||
    text.includes('timed out') ||
    text.includes('timeout') ||
    text.includes('network error') ||
    text.includes('failed to fetch')
  ) {
    return NETWORK
  }

  return UNKNOWN
}
