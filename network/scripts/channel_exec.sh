#!/bin/bash
set -euo pipefail

CHANNEL_NAME=${CHANNEL_NAME:-supplychannel}
ARTIFACTS_DIR=${ARTIFACTS_DIR:-/Users/prudhvi/Documents/SIH45/network/artifacts}

ORDERER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' orderer.example.com)
ORDERER_ADDR=${ORDERER_IP}:7050

# Create channel using Org1 admin
docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp \
  -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 \
  -e CORE_PEER_TLS_ENABLED=false \
  peer0.org1.example.com \
  peer channel create -o ${ORDERER_ADDR} -c "$CHANNEL_NAME" -f /artifacts/channel.tx --outputBlock /artifacts/$CHANNEL_NAME.block

# Join Org1
docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp \
  -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 \
  -e CORE_PEER_TLS_ENABLED=false \
  peer0.org1.example.com \
  peer channel join -b /artifacts/$CHANNEL_NAME.block

# Join Org2
docker exec \
  -e CORE_PEER_LOCALMSPID=Org2MSP \
  -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp \
  -e CORE_PEER_ADDRESS=peer0.org2.example.com:9051 \
  -e CORE_PEER_TLS_ENABLED=false \
  peer0.org2.example.com \
  peer channel join -b /artifacts/$CHANNEL_NAME.block

# Update anchors Org1
docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp \
  -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 \
  -e CORE_PEER_TLS_ENABLED=false \
  peer0.org1.example.com \
  peer channel update -o ${ORDERER_ADDR} -c "$CHANNEL_NAME" -f /artifacts/Org1MSPanchors.tx

# Update anchors Org2
docker exec \
  -e CORE_PEER_LOCALMSPID=Org2MSP \
  -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp \
  -e CORE_PEER_ADDRESS=peer0.org2.example.com:9051 \
  -e CORE_PEER_TLS_ENABLED=false \
  peer0.org2.example.com \
  peer channel update -o ${ORDERER_ADDR} -c "$CHANNEL_NAME" -f /artifacts/Org2MSPanchors.tx
