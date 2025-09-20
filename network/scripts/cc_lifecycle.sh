#!/bin/bash
set -euo pipefail

CC_NAME=${CC_NAME:-foodtrust}
CC_LABEL=${CC_LABEL:-foodtrust_1}
CC_VERSION=${CC_VERSION:-1.0}
CC_SEQUENCE=${CC_SEQUENCE:-1}
CC_LANG=${CC_LANG:-node}
CC_PATH=${CC_PATH:-$PWD/../../chaincode/foodtrust-contract}
CHANNEL_NAME=${CHANNEL_NAME:-supplychannel}
INIT_REQUIRED=${INIT_REQUIRED:-false}

ROOT_DIR=$(cd "$(dirname "$0")"/../.. && pwd)
NETWORK_DIR="$ROOT_DIR/network"
ARTIFACTS_DIR="$NETWORK_DIR/artifacts"

export FABRIC_CFG_PATH="$NETWORK_DIR/config"
ORDERER_CA="$ARTIFACTS_DIR/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

setPeerEnv() {
  local MSP=$1
  local PEER_ADDR=$2
  local MSP_PATH=$3
  local TLS_ROOT=$4
  export CORE_PEER_LOCALMSPID=$MSP
  export CORE_PEER_MSPCONFIGPATH=$MSP_PATH
  export CORE_PEER_ADDRESS=$PEER_ADDR
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_TLS_ROOTCERT_FILE=$TLS_ROOT
}

pkg() {
  peer lifecycle chaincode package "$ARTIFACTS_DIR/${CC_LABEL}.tar.gz" \
    --path "$CC_PATH" --lang "$CC_LANG" --label "$CC_LABEL"
}

installCC() {
  peer lifecycle chaincode install "$ARTIFACTS_DIR/${CC_LABEL}.tar.gz"
}

queryInstalled() {
  peer lifecycle chaincode queryinstalled >& "$ARTIFACTS_DIR/qinstalled_${CORE_PEER_LOCALMSPID}.txt"
  PACKAGE_ID=$(sed -n "/Label: ${CC_LABEL}/s/Package ID: \(.*\), Label: .*/\1/p" "$ARTIFACTS_DIR/qinstalled_${CORE_PEER_LOCALMSPID}.txt")
  echo "$PACKAGE_ID" > "$ARTIFACTS_DIR/packageid_${CORE_PEER_LOCALMSPID}.txt"
  echo "${CORE_PEER_LOCALMSPID} PACKAGE_ID: $PACKAGE_ID"
}

approve() {
  local PACKAGE_ID=$1
  peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    --channelID "$CHANNEL_NAME" --name "$CC_NAME" \
    --version "$CC_VERSION" --package-id "$PACKAGE_ID" --sequence "$CC_SEQUENCE" \
    --tls --cafile "$ORDERER_CA"
}

checkCommitReadiness() {
  peer lifecycle chaincode checkcommitreadiness --channelID "$CHANNEL_NAME" --name "$CC_NAME" \
    --version "$CC_VERSION" --sequence "$CC_SEQUENCE" --output json
}

commit() {
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    --channelID "$CHANNEL_NAME" --name "$CC_NAME" --version "$CC_VERSION" --sequence "$CC_SEQUENCE" \
    --tls --cafile "$ORDERER_CA" \
    --peerAddresses localhost:7051 --tlsRootCertFiles "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:9051 --tlsRootCertFiles "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
}

invokeInit() {
  if [ "$INIT_REQUIRED" = "true" ]; then
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
      --tls --cafile "$ORDERER_CA" -C "$CHANNEL_NAME" -n "$CC_NAME" \
      --ctor '{"Args":["InitLedger"]}' \
      --peerAddresses localhost:7051 --tlsRootCertFiles "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
      --peerAddresses localhost:9051 --tlsRootCertFiles "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
  fi
}

seed() {
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    --tls --cafile "$ORDERER_CA" -C "$CHANNEL_NAME" -n "$CC_NAME" \
    -c '{"Args":["createBatch","BATCH001","{\"crop\":\"Tomatoes\",\"harvestDate\":\"2025-09-01\",\"owner\":\"Farmer\"}"]}' \
    --peerAddresses localhost:7051 --tlsRootCertFiles "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
    --peerAddresses localhost:9051 --tlsRootCertFiles "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
}

main() {
  pkg

  setPeerEnv Org1MSP localhost:7051 \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
  installCC
  queryInstalled
  PKG1=$(cat "$ARTIFACTS_DIR/packageid_Org1MSP.txt")
  approve "$PKG1"

  setPeerEnv Org2MSP localhost:9051 \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
  installCC
  queryInstalled
  PKG2=$(cat "$ARTIFACTS_DIR/packageid_Org2MSP.txt")
  approve "$PKG2"

  setPeerEnv Org1MSP localhost:7051 \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    "$ARTIFACTS_DIR/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
  checkCommitReadiness
  commit
  invokeInit
  seed
}

main "$@"
