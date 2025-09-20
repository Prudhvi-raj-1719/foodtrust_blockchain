#!/bin/bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")"/../.. && pwd)
NETWORK_DIR="$ROOT_DIR/network"
DOCKER_DIR="$NETWORK_DIR/docker"
ARTIFACTS_DIR="$NETWORK_DIR/artifacts"

if [ ! -f "$ARTIFACTS_DIR/genesis.block" ]; then
  echo "Artifacts not found. Run network/scripts/generate.sh first." >&2
  exit 1
fi

cd "$DOCKER_DIR"
docker compose up -d

echo "Network containers started. Next: create and join channel, set anchor peers, then deploy chaincode."
echo "Channel creation/join scripts will be added next."
