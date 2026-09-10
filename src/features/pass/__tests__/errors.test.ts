import { describe, expect, it } from 'vitest'
import { toFriendlyError } from '../lib/errors'

/** Reproduce la forma anidada con la que viem envuelve los errores. */
function envuelto(...capas: Array<{ name?: string; message?: string; code?: number }>) {
  return capas.reduceRight<unknown>(
    (cause, capa) => Object.assign(new Error(capa.message ?? ''), capa, { cause }),
    undefined
  )
}

describe('toFriendlyError', () => {
  it('reconoce que la persona canceló la firma', () => {
    const result = toFriendlyError(
      envuelto(
        { name: 'ContractFunctionExecutionError', message: 'User rejected the request.' },
        { name: 'UserRejectedRequestError', code: 4001 }
      )
    )

    expect(result.title).toBe('Cancelaste la firma')
    expect(result.retryable).toBe(true)
    expect(result.hint).toContain('no gastaste nada')
  })

  it('reconoce el código 4001 aunque no venga el nombre del error', () => {
    expect(toFriendlyError({ code: 4001, message: 'denied' }).title).toBe('Cancelaste la firma')
  })

  it('traduce PassAlreadyMinted y no ofrece reintentar', () => {
    const result = toFriendlyError(
      envuelto(
        { name: 'ContractFunctionExecutionError', message: 'reverted' },
        { name: 'ContractFunctionRevertedError', message: 'PassAlreadyMinted(address account)' }
      )
    )

    expect(result.title).toBe('Esta dirección ya tiene su pass')
    expect(result.retryable).toBe(false)
  })

  it('traduce PassIsSoulbound', () => {
    const result = toFriendlyError(new Error('execution reverted: PassIsSoulbound()'))
    expect(result.title).toBe('El pass no se puede transferir')
    expect(result.retryable).toBe(false)
  })

  it('detecta que falta AVAX para el gas', () => {
    const result = toFriendlyError(
      new Error('insufficient funds for gas * price + value')
    )
    expect(result.title).toBe('Te falta AVAX de prueba')
    expect(result.hint).toContain('faucet')
  })

  it('detecta que la wallet está en otra red', () => {
    const result = toFriendlyError(
      envuelto({ name: 'ChainMismatchError', message: 'The current chain does not match' })
    )
    expect(result.title).toBe('Tu wallet no está en Avalanche Fuji')
  })

  it('detecta un problema de red', () => {
    expect(toFriendlyError(new Error('HTTP request failed.')).title).toBe(
      'No pudimos hablar con la red'
    )
  })

  it('le gana el error del contrato al de red cuando vienen juntos', () => {
    const result = toFriendlyError(
      envuelto(
        { name: 'ContractFunctionExecutionError', message: 'HTTP request failed' },
        { name: 'ContractFunctionRevertedError', message: 'PassAlreadyMinted' }
      )
    )
    expect(result.title).toBe('Esta dirección ya tiene su pass')
  })

  it('siempre devuelve algo mostrable, aunque no entienda el error', () => {
    for (const entrada of [null, undefined, 0, '', {}, new Error('boom'), Symbol('x')]) {
      const result = toFriendlyError(entrada)
      expect(result.title.length).toBeGreaterThan(0)
      expect(result.hint.length).toBeGreaterThan(0)
    }
  })

  it('no entra en bucle con causas circulares', () => {
    const a: { message: string; cause?: unknown } = { message: 'a' }
    const b = { message: 'b', cause: a }
    a.cause = b

    expect(() => toFriendlyError(a)).not.toThrow()
  })
})
