/**
 * Los cuatro pasos, con los textos exactos de la lámina 20 del deck.
 * La pantalla usa las mismas palabras que la gente acaba de leer.
 */
export const STEPS = [
  {
    number: '01',
    title: 'Conectar',
    subtitle: 'La wallet es la identidad. Sin registro ni contraseña.',
  },
  {
    number: '02',
    title: 'Crear el pass',
    subtitle: 'Escribimos el registro: ID, dueño y reglas.',
  },
  {
    number: '03',
    title: 'Verificar',
    subtitle: 'La app le pregunta a la red, no a su base de datos.',
  },
  {
    number: '04',
    title: 'Desbloquear',
    subtitle: 'El pass abre el acceso.',
  },
] as const

export type StepNumber = 1 | 2 | 3 | 4
