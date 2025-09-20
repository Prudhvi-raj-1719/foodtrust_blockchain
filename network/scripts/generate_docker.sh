#!/bin/bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")"/../.. && pwd)
NETWORK_DIR="$ROOT_DIR/network"
ARTIFACTS_DIR="$NETWORK_DIR/artifacts"
CONFIG_DIR="$NETWORK_DIR/config"

mkdir -p "$ARTIFACTS_DIR"

IMG=${IMG:-hyperledger/fabric-tools:2.5}

docker run --rm \
  -v "$CONFIG_DIR":/config \
  -v "$ARTIFACTS_DIR":/artifacts \
  -e FABRIC_CFG_PATH=/config \
  "$IMG" bash -c "\
  cryptogen generate --config=/config/crypto-config.yaml --output=/artifacts/crypto-config && \
  configtxgen -profile SampleMultiNodeEtcdRaft -channelID system-channel -outputBlock /artifacts/genesis.block && \
  configtxgen -profile TwoOrgsChannel -outputCreateChannelTx /artifacts/channel.tx -channelID supplychannel && \
  configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate /artifacts/Org1MSPanchors.tx -channelID supplychannel -asOrg Org1MSP && \
  configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate /artifacts/Org2MSPanchors.tx -channelID supplychannel -asOrg Org2MSP"

echo "Artifacts generated in $ARTIFACTS_DIR using $IMG"
