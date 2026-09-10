import { describe, expect, it } from 'vitest'
import { pasoActivo, pasoSugerido, pasosHabilitados } from '../lib/flow'

const SIN_WALLET = { conectado: false, redCorrecta: false, tienePass: false }
const OTRA_RED = { conectado: true, redCorrecta: false, tienePass: false }
const LISTO_PARA_ACUNAR = { conectado: true, redCorrecta: true, tienePass: false }
const CON_PASS = { conectado: true, redCorrecta: true, tienePass: true }

describe('pasoSugerido', () => {
  it('arranca en el paso 1 sin wallet', () => {
    expect(pasoSugerido(SIN_WALLET)).toBe(1)
  })

  it('se queda en el paso 1 mientras la wallet esté en otra red', () => {
    expect(pasoSugerido(OTRA_RED)).toBe(1)
  })

  it('lleva al paso 2 cuando se puede acuñar', () => {
    expect(pasoSugerido(LISTO_PARA_ACUNAR)).toBe(2)
  })

  it('salta al paso 3 cuando la dirección ya tiene el pass', () => {
    expect(pasoSugerido(CON_PASS)).toBe(3)
  })
})

describe('pasosHabilitados', () => {
  it('sin wallet solo habilita el paso 1', () => {
    expect(pasosHabilitados(SIN_WALLET)).toEqual([1])
  })

  it('en otra red no habilita el paso 2, pero sí el 3', () => {
    expect(pasosHabilitados(OTRA_RED)).toEqual([1, 3])
  })

  it('conectado y en Fuji habilita acuñar y verificar', () => {
    expect(pasosHabilitados(LISTO_PARA_ACUNAR)).toEqual([1, 2, 3])
  })

  it('con el pass habilita los cuatro', () => {
    expect(pasosHabilitados(CON_PASS)).toEqual([1, 2, 3, 4])
  })

  it('nunca habilita el paso 4 sin pass', () => {
    for (const estado of [SIN_WALLET, OTRA_RED, LISTO_PARA_ACUNAR]) {
      expect(pasosHabilitados(estado)).not.toContain(4)
    }
  })
})

describe('pasoActivo', () => {
  it('sigue al sugerido cuando el orador no eligió nada', () => {
    expect(pasoActivo(2, null)).toBe(2)
  })

  it('respeta la elección manual mientras la cadena no cambie', () => {
    expect(pasoActivo(2, { paso: 1, desde: 2 })).toBe(1)
  })

  it('descarta la elección manual cuando la cadena cambia', () => {
    // El orador estaba mirando el paso 1; confirma la acuñación y el sugerido
    // pasa de 2 a 3: la demo tiene que avanzar sola.
    expect(pasoActivo(3, { paso: 1, desde: 2 })).toBe(3)
  })

  it('al desconectar vuelve al paso 1 aunque hubiera navegación manual', () => {
    expect(pasoActivo(1, { paso: 4, desde: 3 })).toBe(1)
  })
})
