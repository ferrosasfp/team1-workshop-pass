'use client'

import { useTotalMinted } from '../hooks/useTotalMinted'

/** RF-17: cuánta gente lo hizo, leído de `totalMinted()`. */
export function PassCounter() {
  const { data, isLoading } = useTotalMinted()

  return (
    <span className="chip">
      <strong className="font-mono text-sm text-paper">
        {isLoading || data === undefined ? '…' : data.toString()}
      </strong>
      {data === 1n ? 'pass acuñado' : 'passes acuñados'}
    </span>
  )
}
