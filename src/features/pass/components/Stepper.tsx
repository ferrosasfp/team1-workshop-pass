'use client'

import { STEPS, type StepNumber } from '../steps'

interface Props {
  active: StepNumber
  /** Pasos a los que se puede llegar con el estado actual. */
  unlocked: readonly StepNumber[]
  onSelect: (step: StepNumber) => void
}

/**
 * En celular es una grilla de 2x2 arriba del panel. En pantalla ancha es una
 * columna a la izquierda: asi el alto queda libre para el contenido del paso,
 * que es lo que se proyecta.
 */
export function Stepper({ active, unlocked, onSelect }: Props) {
  return (
    <nav aria-label="Pasos de la demo" className="shrink-0">
      <ol className="grid grid-cols-2 gap-2 sm:flex sm:w-56 sm:flex-col sm:gap-2">
        {STEPS.map((step, index) => {
          const number = (index + 1) as StepNumber
          const isActive = number === active
          const isUnlocked = unlocked.includes(number)

          return (
            <li key={step.number}>
              <button
                type="button"
                onClick={() => onSelect(number)}
                disabled={!isUnlocked}
                aria-current={isActive ? 'step' : undefined}
                className={[
                  'flex w-full items-baseline gap-2 rounded-xl border px-3 py-2 text-left transition-colors',
                  isActive
                    ? 'border-avax bg-avax-soft'
                    : isUnlocked
                      ? 'border-line bg-surface hover:border-muted'
                      : 'cursor-not-allowed border-line/60 bg-surface/40 opacity-40',
                ].join(' ')}
              >
                <span className={`font-mono text-xs ${isActive ? 'text-avax' : 'text-muted'}`}>
                  {step.number}
                </span>
                <span className="text-sm font-semibold leading-tight">{step.title}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
