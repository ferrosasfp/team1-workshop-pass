# Team1 Workshop Pass

Un NFT en **Avalanche Fuji** que funciona como credencial de acceso. Es la demo en vivo de la
lámina 20 del workshop *"NFT más allá del arte"* de Team1 LatAm.

No es un producto: es una pieza de demostración de siete minutos. Cuatro pasos, en español,
usable desde el teléfono.

| | |
|---|---|
| Aplicación | https://team1-workshop-pass.vercel.app |
| Repositorio | https://github.com/ferrosasfp/team1-workshop-pass |
| Contrato en Fuji | [`0x2C9a24f4e55A46195fc1838BCAf00506402a0Fa2`](https://subnets.avax.network/c-chain-testnet/address/0x2C9a24f4e55A46195fc1838BCAf00506402a0Fa2) (verificado) |
| Wallet de respaldo (plan B) | `0x78Bef96aC46b44073caAc33834df924DEef62f43`, con el pass #1 acuñado |

---

## La idea que sostiene todo

En el paso 3 el orador dice, en voz alta:

> **"La app le pregunta a la red, no a su base de datos."**

Eso no es una frase de marketing, es el requisito de arquitectura del proyecto. La verificación de
propiedad se lee de la blockchain en el momento:

- No hay base de datos. No hay backend propio. No hay caché de servidor.
- Cada verificación es un `readContract` desde el navegador contra el RPC público de Fuji.
- La pantalla muestra **de dónde salió la respuesta**: red, `chainId`, contrato y hora exacta.

Si eso no se cumple, la demo pierde el sentido.

## Los cuatro pasos

| Paso | En pantalla | Qué pasa por debajo |
|---|---|---|
| 01 Conectar | La wallet es la identidad. Sin registro ni contraseña. | wagmi con EIP-6963, para que Core Wallet aparezca con su nombre y su ícono |
| 02 Crear el pass | Escribimos el registro: ID, dueño y reglas. | `mint()`, con los tres estados de la transacción a la vista |
| 03 Verificar | La app le pregunta a la red, no a su base de datos. | `hasPass(address)` contra el RPC, con la prueba de origen en pantalla |
| 04 Desbloquear | El pass abre el acceso. | `/acceso` vuelve a preguntarle a la red antes de mostrar nada |

Además hay un campo de **verificación libre**, siempre visible, que consulta cualquier dirección
pegada a mano sin conectar wallet. Es el plan B de la demo.

---

## El contrato

`Team1WorkshopPass` · símbolo `T1PASS` · ERC-721 sobre OpenZeppelin v5 · solc 0.8.24.

```solidity
function mint() external returns (uint256 tokenId);
function hasPass(address account) external view returns (bool);
function passTokenIdOf(address account) external view returns (uint256);
function totalMinted() external view returns (uint256);
function tokenURI(uint256 tokenId) external view returns (string memory);
```

Tres decisiones, y por qué:

**Es soulbound.** Un pase de acceso a un evento no se revende. La regla vive en una sola línea,
sobrescribiendo `_update` de OZ v5:

```solidity
address from = _ownerOf(tokenId);
if (from != address(0)) revert PassIsSoulbound();
```

Toda acuñación, transferencia y quema pasa por ahí. En una acuñación el dueño anterior es la
dirección cero; en cualquier otro caso hay un dueño previo y la operación se rechaza. Eso incluye
las transferencias hechas por un tercero aprobado o por un operador global.

**Uno por dirección.** El segundo intento revierte con `PassAlreadyMinted(address)`, que la
aplicación traduce a un mensaje en castellano. Evita que un asistente entusiasta acuñe cuarenta.

**Los metadatos son on-chain.** `tokenURI` arma el JSON en base64 con un SVG generado dentro del
contrato, con la paleta del deck. Sin IPFS y sin servidor de imágenes: una cosa menos que se puede
caer en vivo, y un punto de enseñanza regalado.

No tiene dueño, ni pausa, ni funciones administrativas. Cualquiera acuña el suyo.

### Tests del contrato

```bash
npm run contracts:test
```

20 tests de Foundry, incluyendo los dos casos que importan: que la transferencia revierte (en sus
cuatro variantes, más el aprobado y el operador global) y que la segunda acuñación de la misma
dirección revierte sin alterar el estado.

---

## Cómo levantarlo en local

Hace falta Node 20 o más, y [Foundry](https://getfoundry.sh) para los contratos.

```bash
npm install
cp .env.example .env.local     # y completa NEXT_PUBLIC_PASS_ADDRESS
npm run dev                    # http://localhost:3000
```

### Contra una cadena local, sin gastar nada

Útil para probar el flujo entero sin depender de Fuji:

```bash
anvil --chain-id 43113                                  # en otra terminal

cd contracts
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  forge script script/DeployPass.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

Y en `.env.local`:

```
NEXT_PUBLIC_PASS_ADDRESS=<la dirección que imprimió el despliegue>
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_RPC_TESTNET=http://127.0.0.1:8545
```

---

## Cómo desplegarlo

### 1. El contrato en Fuji

El desplegador necesita AVAX de prueba. Se piden gratis en
[el faucet de Core](https://core.app/tools/testnet-faucet) pegando la dirección.

```bash
PRIVATE_KEY=0x... bash scripts/deploy-fuji.sh
```

El script despliega, verifica el contrato en el explorador y te imprime la dirección. Como el
contrato no tiene dueño, la clave que se use para desplegar no queda con ningún privilegio.

### 2. El ABI

```bash
npm run contracts:build
npm run contracts:sync-abi
```

Copia el ABI de `contracts/out/` a `src/features/contracts/abi/` como TypeScript con `as const`.
**El ABI no se escribe a mano nunca**: si el contrato cambia, se vuelve a correr esto.

### 3. La aplicación en Vercel

```bash
vercel link --scope ferrosasfp-1287s-projects
vercel env add NEXT_PUBLIC_PASS_ADDRESS production   # la dirección del contrato
vercel env add NEXT_PUBLIC_CHAIN_ID production       # 43113
vercel --prod
```

No hay secretos: todas las variables son `NEXT_PUBLIC_`, porque todo lo que hace la aplicación es
leer una cadena pública y pedirle a la wallet que firme.

### 4. La wallet de respaldo

Es el plan B: una segunda cuenta que ya tiene el pass acuñado, para pegar su dirección en el campo
de verificación si la wallet del orador falla en vivo.

```bash
PRIVATE_KEY=<la de la wallet de respaldo> CONTRATO=<la del contrato> \
  bash scripts/mint-respaldo.sh
```

El `mint()` acuña siempre para quien firma, así que tiene que firmar la wallet de respaldo. No hay
forma de acuñar en nombre de otro, ni de transferirle el pass después.

---

## Calidad

```bash
npm run qa        # typecheck + lint sin warnings + tests + build
npm run qa:full   # lo anterior, más los tests de Foundry
```

- TypeScript en `strict`, con `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`.
- ESLint con `--max-warnings 0`.
- 36 tests de vitest sobre la lógica de verificación, el avance de los pasos y el formateo de
  errores. 20 tests de Foundry sobre el contrato.
- `npm audit`: sin vulnerabilidades.

### Lo que se verificó en pantalla

El flujo entero entra **sin scroll** a 1280x720 con el navegador al 150 por ciento, que es como se
proyecta por Google Meet. Está medido en los cuatro pasos, en `/acceso` y con el resultado de la
verificación libre a la vista, y también a 1280x720 sin zoom y a 1440x780. En 390 píxeles de ancho
no hay desborde horizontal.

---

## Estructura

```
contracts/
  src/Team1WorkshopPass.sol      el contrato
  test/Team1WorkshopPass.t.sol   soulbound, doble acuñación, metadatos
  script/DeployPass.s.sol        despliegue
scripts/
  sync-abi.mjs                   ABI de contracts/out a src (nunca a mano)
  deploy-fuji.sh                 despliegue y verificación en Fuji
  mint-respaldo.sh               acuña el pass de la wallet del plan B
src/
  app/                           portada, /acceso, errores
  features/pass/
    contract.ts                  dirección y ABI
    steps.ts                     los textos exactos de la lámina 20
    lib/                         validación de direcciones, errores, avance de pasos
    hooks/                       lecturas a la red y acuñación
    components/                  los cuatro pasos y la verificación libre
  shared/lib/web3/               cadenas, wagmi, cliente de lectura
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind 3.4 · viem + wagmi ·
@tanstack/react-query · zod · vitest · Foundry con OpenZeppelin v5 · Vercel.

El mismo de `wasiai-v2` y `chaski-v2`, con las mismas convenciones: la configuración de wagmi en
`src/shared/lib/web3/config.ts` con `ssr: true` y `multiInjectedProviderDiscovery: true`, el
registro de cadenas en `chains.ts`, y los contratos en `contracts/` con Foundry.
