#!/bin/bash
set -euo pipefail

CHANNEL_NAME=${CHANNEL_NAME:-supplychannel}
ROOT_DIR=$(cd "$(dirname "$0")"/../.. && pwd)
NETWORK_DIR="$ROOT_DIR/network"
ARTIFACTS_DIR="$NETWORK_DIR/artifacts"

export FABRIC_CFG_PATH="$NETWORK_DIR/config"

ORDERER_CA="$ARTIFACTS_DIR/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

create_channel() {
  peer channel create -o localhost:7050 -c "$CHANNEL_NAME" -f "$ARTIFACTS_DIR/channel.tx" \
    --outputBlock "$ARTIFACTS_DIR/$CHANNEL_NAME.block" \
    --tls --cafile "$ORDERER_CA"
}

join_channel_org() {
  local MSP=$1
  local PEER_ADDR=$2
  local MSP_PATH=$3
  local TLS_ROOT=$4

  export CORE_PEER_LOCALMSPID=$MSP
  export CORE_PEER_MSPCONFIGPATH=$MSP_PATH
  export CORE_PEER_ADDRESS=$PEER_ADDR
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_TLS_ROOTCERT_FILE=$TLS_ROOT

  peer channel join -b "$ARTIFACTS_DIR/$CHANNEL_NAME.block"
}

update_anchor() {
  local MSP=$1
  local PEER_ADDR=$2
  local MSP_PATH=$3
  local TLS_ROOT=$4
  local ANCHOR_TX=$5

  export CORE_PEER_LOCALMSPID=$MSP
  export CORE_PEER_MSPCONFIGPATH=$MSP_PATH
  export CORE_PEER_ADDRESS=$PEER_ADDR
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_TLS_ROOTCERT_FILE=$TLS_ROOT

  peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    -c "$CHANNEL_NAME" -f "$ANCHOR_TX" --tls --cafile "$ORDERER_CA"
}

main() {
  create_channel

  join_channel_org Org1MSP localhost:7051 \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"

  join_channel_org Org2MSP localhost:9051 \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

  update_anchor Org1MSP localhost:7051 \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
    "$ARTIFACTS_DIR/Org1MSPanchors.tx"

  update_anchor Org2MSP localhost:9051 \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
    "$ARTIFACTS_DIR/Org2MSPanchors.tx"
}

main "$@"
