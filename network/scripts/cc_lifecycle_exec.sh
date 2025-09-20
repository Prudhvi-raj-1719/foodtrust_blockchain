#!/bin/bash
set -euo pipefail

CHANNEL_NAME=${CHANNEL_NAME:-supplychannel}
CC_NAME=${CC_NAME:-foodtrust}
CC_LABEL=${CC_LABEL:-foodtrust_1}
CC_VERSION=${CC_VERSION:-1.0}
CC_SEQUENCE=${CC_SEQUENCE:-1}

ARTIFACTS=/Users/prudhvi/Documents/SIH45/network/artifacts
ORDERER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' orderer.example.com)
ORDERER_ADDR=${ORDERER_IP}:7050

# Package chaincode using org1 peer container
docker exec peer0.org1.example.com bash -c "peer lifecycle chaincode package /artifacts/${CC_LABEL}.tar.gz --path /cc/foodtrust-contract --lang node --label ${CC_LABEL}"

# Install on org1 and org2
docker exec peer0.org1.example.com bash -c "peer lifecycle chaincode install /artifacts/${CC_LABEL}.tar.gz && peer lifecycle chaincode queryinstalled > /artifacts/qinstalled_Org1MSP.txt"
PACKAGE_ID=$(sed -n "/Label: ${CC_LABEL}/s/Package ID: \(.*\), Label: .*/\1/p" "$ARTIFACTS/qinstalled_Org1MSP.txt")

docker exec peer0.org2.example.com bash -c "peer lifecycle chaincode install /artifacts/${CC_LABEL}.tar.gz && peer lifecycle chaincode queryinstalled > /artifacts/qinstalled_Org2MSP.txt"

# Approve org1
docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp \
  -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 \
  -e CORE_PEER_TLS_ENABLED=false \
  peer0.org1.example.com \
  peer lifecycle chaincode approveformyorg -o ${ORDERER_ADDR} --channelID "$CHANNEL_NAME" --name "$CC_NAME" --version "$CC_VERSION" --package-id "$PACKAGE_ID" --sequence "$CC_SEQUENCE"

# Approve org2
docker exec \
  -e CORE_PEER_LOCALMSPID=Org2MSP \
  -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp \
  -e CORE_PEER_ADDRESS=peer0.org2.example.com:9051 \
  -e CORE_PEER_TLS_ENABLED=false \
  peer0.org2.example.com \
  peer lifecycle chaincode approveformyorg -o ${ORDERER_ADDR} --channelID "$CHANNEL_NAME" --name "$CC_NAME" --version "$CC_VERSION" --package-id "$PACKAGE_ID" --sequence "$CC_SEQUENCE"

# Commit
docker exec peer0.org1.example.com bash -c "peer lifecycle chaincode commit -o ${ORDERER_ADDR} --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --sequence $CC_SEQUENCE --peerAddresses peer0.org1.example.com:7051 --peerAddresses peer0.org2.example.com:9051"

# Seed
SEED='{"Args":["createBatch","BATCH001","{\"crop\":\"Tomatoes\",\"harvestDate\":\"2025-09-01\",\"owner\":\"Farmer\"}"]}'
docker exec peer0.org1.example.com bash -c "peer chaincode invoke -o ${ORDERER_ADDR} -C $CHANNEL_NAME -n $CC_NAME -c '$SEED' --peerAddresses peer0.org1.example.com:7051 --peerAddresses peer0.org2.example.com:9051"
