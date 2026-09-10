import { describe, expect, it } from 'vitest'
import { parseAddress, shortAddress } from '../lib/address'

// Direccion de ejemplo de la especificacion EIP-55.
const EJEMPLO = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'

describe('parseAddress', () => {
  it('acepta una dirección con checksum y la devuelve normalizada', () => {
    const result = parseAddress(EJEMPLO)
    expect(result).toEqual({ ok: true, address: EJEMPLO })
  })

  it('acepta una dirección en minúsculas y le pone el checksum', () => {
    const result = parseAddress(EJEMPLO.toLowerCase())
    expect(result.ok && result.address).toBe(EJEMPLO)
  })

  it('tolera espacios y saltos de línea al pegar', () => {
    const result = parseAddress(`  ${EJEMPLO}\n`)
    expect(result.ok && result.address).toBe(EJEMPLO)
  })

  it('pide una dirección cuando el campo está vacío', () => {
    const result = parseAddress('   ')
    expect(result).toEqual({ ok: false, error: 'Pega una dirección para verificarla.' })
  })

  it.each([
    ['sin prefijo 0x', '5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'],
    ['muy corta', '0x5aAeb605'],
    ['con un carácter que no es hexadecimal', '0xZZAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'],
    ['un nombre de dominio', 'fernando.eth'],
  ])('rechaza una dirección %s con un motivo legible', (_caso, entrada) => {
    const result = parseAddress(entrada)
    expect(result.ok).toBe(false)
    expect(result.ok === false && result.error).toContain('0x')
  })

  it('nunca lanza, por más basura que reciba', () => {
    expect(() => parseAddress('<script>alert(1)</script>')).not.toThrow()
    expect(parseAddress('<script>alert(1)</script>').ok).toBe(false)
  })
})

describe('shortAddress', () => {
  it('abrevia dejando el principio y el final', () => {
    expect(shortAddress(EJEMPLO)).toBe('0x5aAe...eAed')
  })

  it('deja intacto lo que ya es corto', () => {
    expect(shortAddress('0x1234')).toBe('0x1234')
  })
})
