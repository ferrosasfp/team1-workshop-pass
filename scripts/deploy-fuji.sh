#!/usr/bin/env bash
#
# Despliega Team1WorkshopPass en Avalanche Fuji y lo verifica en el explorador.
#
#   PRIVATE_KEY=0x... bash scripts/deploy-fuji.sh
#
# Si no se pasa PRIVATE_KEY, la toma de .deployer-key.txt (que no se versiona).
# El contrato no tiene dueno: quien despliega no queda con ningun privilegio.

set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RPC="https://api.avax-test.network/ext/bc/C/rpc"
VERIFIER_URL="https://api.routescan.io/v2/network/testnet/evm/43113/etherscan"

if [[ -z "${PRIVATE_KEY:-}" ]]; then
  if [[ -f "$RAIZ/.deployer-key.txt" ]]; then
    PRIVATE_KEY="$(grep '^PRIVATE_KEY=' "$RAIZ/.deployer-key.txt" | cut -d= -f2)"
  else
    echo "Falta PRIVATE_KEY y no hay .deployer-key.txt" >&2
    exit 1
  fi
fi
export PRIVATE_KEY

DEPLOYER="$(cast wallet address --private-key "$PRIVATE_KEY")"
SALDO="$(cast balance "$DEPLOYER" --rpc-url "$RPC")"

echo "Desplegador: $DEPLOYER"
echo "Saldo:       $(cast to-unit "$SALDO" ether) AVAX"

if [[ "$SALDO" == "0" ]]; then
  cat >&2 <<MSG

Esa direccion no tiene AVAX de prueba, y el despliegue cuesta gas.

  Opcion 1: pedirlo en https://core.app/tools/testnet-faucet pegando la direccion.
  Opcion 2: mandarle 0.2 AVAX de Fuji desde otra wallet.

MSG
  exit 1
fi

cd "$RAIZ/contracts"

forge script script/DeployPass.s.sol \
  --rpc-url "$RPC" \
  --broadcast \
  --verify \
  --verifier etherscan \
  --verifier-url "$VERIFIER_URL" \
  --etherscan-api-key "verifyContract" \
  -vvv | tee "$RAIZ/.deploy-fuji.log"

DIRECCION="$(grep -oE 'Team1WorkshopPass: 0x[0-9a-fA-F]{40}' "$RAIZ/.deploy-fuji.log" | tail -1 | awk '{print $2}')"

if [[ -z "$DIRECCION" ]]; then
  echo "No pude leer la direccion del contrato en la salida del despliegue." >&2
  exit 1
fi

echo
echo "==================================================================="
echo " Contrato desplegado en Fuji"
echo "   direccion: $DIRECCION"
echo "   explorador: https://subnets.avax.network/c-chain-testnet/address/$DIRECCION"
echo
echo " Ahora:"
echo "   1. NEXT_PUBLIC_PASS_ADDRESS=$DIRECCION  en .env.local y en Vercel"
echo "   2. npm run contracts:sync-abi   (por si cambio el contrato)"
echo "==================================================================="
