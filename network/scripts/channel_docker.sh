#!/bin/bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")"/../.. && pwd)
NETWORK_DIR="$ROOT_DIR/network"
ARTIFACTS_DIR="$NETWORK_DIR/artifacts"
CONFIG_DIR="$NETWORK_DIR/config"

IMG=${IMG:-hyperledger/fabric-tools:2.5}
CHANNEL_NAME=${CHANNEL_NAME:-supplychannel}

ORDERER_CA=/artifacts/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
ORG1_ADMIN_MSP=/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
ORG1_PEER_TLS=/artifacts/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
ORG2_ADMIN_MSP=/artifacts/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
ORG2_PEER_TLS=/artifacts/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

# Create channel and join peers, update anchors
docker run --rm --network docker_fabric_net \
  -v "$CONFIG_DIR":/config -v "$ARTIFACTS_DIR":/artifacts \
  -e FABRIC_CFG_PATH=/config -e CORE_PEER_TLS_ENABLED=true \
  "$IMG" bash -c "\
  CORE_PEER_LOCALMSPID=Org1MSP CORE_PEER_MSPCONFIGPATH=$ORG1_ADMIN_MSP CORE_PEER_ADDRESS=peer0.org1.example.com:7051 CORE_PEER_TLS_ROOTCERT_FILE=$ORG1_PEER_TLS \
  peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f /artifacts/channel.tx --outputBlock /artifacts/$CHANNEL_NAME.block --tls --cafile $ORDERER_CA && \
  CORE_PEER_LOCALMSPID=Org1MSP CORE_PEER_MSPCONFIGPATH=$ORG1_ADMIN_MSP CORE_PEER_ADDRESS=peer0.org1.example.com:7051 CORE_PEER_TLS_ROOTCERT_FILE=$ORG1_PEER_TLS \
  peer channel join -b /artifacts/$CHANNEL_NAME.block && \
  CORE_PEER_LOCALMSPID=Org2MSP CORE_PEER_MSPCONFIGPATH=$ORG2_ADMIN_MSP CORE_PEER_ADDRESS=peer0.org2.example.com:9051 CORE_PEER_TLS_ROOTCERT_FILE=$ORG2_PEER_TLS \
  peer channel join -b /artifacts/$CHANNEL_NAME.block && \
  CORE_PEER_LOCALMSPID=Org1MSP CORE_PEER_MSPCONFIGPATH=$ORG1_ADMIN_MSP CORE_PEER_ADDRESS=peer0.org1.example.com:7051 CORE_PEER_TLS_ROOTCERT_FILE=$ORG1_PEER_TLS \
  peer channel update -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f /artifacts/Org1MSPanchors.tx --tls --cafile $ORDERER_CA && \
  CORE_PEER_LOCALMSPID=Org2MSP CORE_PEER_MSPCONFIGPATH=$ORG2_ADMIN_MSP CORE_PEER_ADDRESS=peer0.org2.example.com:9051 CORE_PEER_TLS_ROOTCERT_FILE=$ORG2_PEER_TLS \
  peer channel update -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f /artifacts/Org2MSPanchors.tx --tls --cafile $ORDERER_CA"
