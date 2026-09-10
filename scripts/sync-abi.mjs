#!/usr/bin/env node

/**
 * Sincroniza el ABI compilado de contracts/out/ hacia src/features/contracts/abi/.
 *
 *   npm run contracts:build && npm run contracts:sync-abi
 *
 * El ABI del front nunca se escribe a mano: sale siempre del artefacto de Foundry.
 * Solo se copian los contratos propios de contracts/src/, no los de lib/.
 *
 * Se emite como TypeScript con `as const` para que wagmi y viem infieran los
 * nombres de funciones y los tipos de los argumentos en tiempo de compilacion.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = process.cwd()
const CONTRACTS_SRC = resolve(ROOT, 'contracts/src')
const CONTRACTS_OUT = resolve(ROOT, 'contracts/out')
const ABI_DIR = resolve(ROOT, 'src/features/contracts/abi')

function camel(name) {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function main() {
  if (!existsSync(CONTRACTS_OUT)) {
    console.error('  contracts/out/ no existe. Corre `npm run contracts:build` primero.')
    process.exit(1)
  }

  mkdirSync(ABI_DIR, { recursive: true })

  const ownContracts = new Set(
    readdirSync(CONTRACTS_SRC).filter((file) => file.endsWith('.sol'))
  )

  let synced = 0

  for (const dir of readdirSync(CONTRACTS_OUT)) {
    if (!ownContracts.has(dir)) continue

    const artifacts = readdirSync(join(CONTRACTS_OUT, dir)).filter(
      (file) => file.endsWith('.json') && !file.includes('.dbg.')
    )

    for (const artifact of artifacts) {
      const { abi } = JSON.parse(readFileSync(join(CONTRACTS_OUT, dir, artifact), 'utf-8'))
      if (!abi) continue

      const name = artifact.replace('.json', '')
      const file = [
        '// Generado por scripts/sync-abi.mjs. No editar a mano.',
        `// Fuente: contracts/out/${dir}/${artifact}`,
        '',
        `export const ${camel(name)}Abi = ${JSON.stringify(abi, null, 2)} as const`,
        '',
      ].join('\n')

      writeFileSync(join(ABI_DIR, `${name}.ts`), file)
      console.log(`  ok ${name}.ts`)
      synced++
    }
  }

  if (synced === 0) {
    console.error('  No se encontro ningun ABI. Revisa que los contratos compilen.')
    process.exit(1)
  }

  console.log(`\n  ${synced} ABI(s) sincronizado(s) en src/features/contracts/abi/`)
}

main()
