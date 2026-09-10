#!/usr/bin/env bash
#
# Acuna el pass para la wallet de respaldo, la del plan B de la demo.
#
#   PRIVATE_KEY=0x... CONTRATO=0x... bash scripts/mint-respaldo.sh
#
# PRIVATE_KEY tiene que ser la de la wallet de respaldo, porque `mint()` acuna
# siempre para quien firma. Es la unica forma de que el pass quede en esa
# direccion: el contrato no deja acunar en nombre de otro, ni transferir.

set -euo pipefail

RPC="https://api.avax-test.network/ext/bc/C/rpc"
: "${PRIVATE_KEY:?falta PRIVATE_KEY (la de la wallet de respaldo)}"
: "${CONTRATO:?falta CONTRATO (la direccion del contrato en Fuji)}"

CUENTA="$(cast wallet address --private-key "$PRIVATE_KEY")"
echo "Wallet de respaldo: $CUENTA"

if [[ "$(cast call "$CONTRATO" 'hasPass(address)(bool)' "$CUENTA" --rpc-url "$RPC")" == "true" ]]; then
  echo "Esa wallet ya tiene el pass. No hay nada que hacer."
  exit 0
fi

cast send "$CONTRATO" 'mint()' --private-key "$PRIVATE_KEY" --rpc-url "$RPC"

echo
echo "hasPass:      $(cast call "$CONTRATO" 'hasPass(address)(bool)' "$CUENTA" --rpc-url "$RPC")"
echo "tokenId:      $(cast call "$CONTRATO" 'passTokenIdOf(address)(uint256)' "$CUENTA" --rpc-url "$RPC")"
echo "totalMinted:  $(cast call "$CONTRATO" 'totalMinted()(uint256)' --rpc-url "$RPC")"
echo
echo "Anota $CUENTA en el README, en el hueco de la wallet de respaldo."
