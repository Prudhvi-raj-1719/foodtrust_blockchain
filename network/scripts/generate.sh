#!/bin/bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")"/../.. && pwd)
NETWORK_DIR="$ROOT_DIR/network"
ARTIFACTS_DIR="$NETWORK_DIR/artifacts"
CONFIG_DIR="$NETWORK_DIR/config"

export FABRIC_CFG_PATH="$CONFIG_DIR"
mkdir -p "$ARTIFACTS_DIR"

if ! command -v cryptogen >/dev/null 2>&1; then
  echo "cryptogen not found in PATH. Run network/scripts/bootstrap.sh and install Fabric binaries." >&2
  exit 1
fi
if ! command -v configtxgen >/dev/null 2>&1; then
  echo "configtxgen not found in PATH. Run network/scripts/bootstrap.sh and install Fabric binaries." >&2
  exit 1
fi

# Generate crypto material
cryptogen generate --config="$CONFIG_DIR/crypto-config.yaml" --output="$ARTIFACTS_DIR/crypto-config"

# Create genesis block
configtxgen -profile SampleMultiNodeEtcdRaft -channelID system-channel -outputBlock "$ARTIFACTS_DIR/genesis.block"

# Create application channel transaction
CHANNEL_NAME=${CHANNEL_NAME:-supplychannel}
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx "$ARTIFACTS_DIR/channel.tx" -channelID "$CHANNEL_NAME"

# Create anchor peer updates
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate "$ARTIFACTS_DIR/Org1MSPanchors.tx" -channelID "$CHANNEL_NAME" -asOrg Org1MSP
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate "$ARTIFACTS_DIR/Org2MSPanchors.tx" -channelID "$CHANNEL_NAME" -asOrg Org2MSP

echo "Artifacts generated in $ARTIFACTS_DIR"
