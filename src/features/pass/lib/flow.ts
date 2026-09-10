import type { StepNumber } from '../steps'

export interface EstadoDeCadena {
  /** Hay una wallet conectada. */
  conectado: boolean
  /** Esa wallet está en la red donde vive el contrato. */
  redCorrecta: boolean
  /** La red respondió que esta dirección tiene el pass. */
  tienePass: boolean
}

/**
 * El paso que corresponde segun lo que dice la cadena.
 * Es lo unico que decide como avanza la demo: no hay estado propio que pueda
 * quedar desincronizado con la red.
 */
export function pasoSugerido({ conectado, redCorrecta, tienePass }: EstadoDeCadena): StepNumber {
  if (!conectado || !redCorrecta) return 1
  return tienePass ? 3 : 2
}

/**
 * RF-01 y RF-03: sin wallet conectada los pasos 2, 3 y 4 se ven pero no se
 * pueden usar, y el paso 2 sigue bloqueado mientras la red no sea la correcta.
 */
export function pasosHabilitados({
  conectado,
  redCorrecta,
  tienePass,
}: EstadoDeCadena): StepNumber[] {
  const pasos: StepNumber[] = [1]
  if (conectado && redCorrecta) pasos.push(2)
  if (conectado) pasos.push(3)
  if (tienePass) pasos.push(4)
  return pasos
}

/**
 * Resuelve el paso activo combinando el sugerido con la navegacion manual del
 * orador. La eleccion manual caduca en cuanto cambia el estado de la cadena,
 * asi que conectar la wallet o confirmar una acuñacion siempre hace avanzar la
 * demo, aunque el orador haya estado mirando otro paso.
 */
export function pasoActivo(
  sugerido: StepNumber,
  elegido: { paso: StepNumber; desde: StepNumber } | null
): StepNumber {
  return elegido?.desde === sugerido ? elegido.paso : sugerido
}
