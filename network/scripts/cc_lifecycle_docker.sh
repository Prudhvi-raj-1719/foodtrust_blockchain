#!/bin/bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")"/../.. && pwd)
NETWORK_DIR="$ROOT_DIR/network"
ARTIFACTS_DIR="$NETWORK_DIR/artifacts"
CONFIG_DIR="$NETWORK_DIR/config"
CHAINCODE_DIR="$ROOT_DIR/chaincode/foodtrust-contract"

IMG=${IMG:-hyperledger/fabric-tools:2.5}
CHANNEL_NAME=${CHANNEL_NAME:-supplychannel}
CC_NAME=${CC_NAME:-foodtrust}
CC_LABEL=${CC_LABEL:-foodtrust_1}
CC_VERSION=${CC_VERSION:-1.0}
CC_SEQUENCE=${CC_SEQUENCE:-1}

ORDERER_CA=/artifacts/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

COMMON="-v $CONFIG_DIR:/config -v $ARTIFACTS_DIR:/artifacts -v $CHAINCODE_DIR:/cc -e FABRIC_CFG_PATH=/config --network docker_fabric_net"

# Package
PACKAGE_CMD="peer lifecycle chaincode package /artifacts/${CC_LABEL}.tar.gz --path /cc --lang node --label ${CC_LABEL}"
# Install, approve, commit, seed

RUN_ORG1_PREFIX="-e CORE_PEER_LOCALMSPID=Org1MSP -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 -e CORE_PEER_TLS_ENABLED=true -e CORE_PEER_TLS_ROOTCERT_FILE=/artifacts/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
RUN_ORG2_PREFIX="-e CORE_PEER_LOCALMSPID=Org2MSP -e CORE_PEER_MSPCONFIGPATH=/artifacts/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp -e CORE_PEER_ADDRESS=peer0.org2.example.com:9051 -e CORE_PEER_TLS_ENABLED=true -e CORE_PEER_TLS_ROOTCERT_FILE=/artifacts/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

# Package
docker run --rm $COMMON $IMG bash -c "$PACKAGE_CMD"

# Install on Org1
docker run --rm $COMMON $RUN_ORG1_PREFIX $IMG bash -c "peer lifecycle chaincode install /artifacts/${CC_LABEL}.tar.gz && peer lifecycle chaincode queryinstalled > /artifacts/qinstalled_Org1MSP.txt"

# Extract PACKAGE_ID from org1 file
PACKAGE_ID=$(sed -n "/Label: ${CC_LABEL}/s/Package ID: \(.*\), Label: .*/\1/p" "$ARTIFACTS_DIR/qinstalled_Org1MSP.txt")

echo "$PACKAGE_ID" > "$ARTIFACTS_DIR/packageid_Org1MSP.txt"

# Install on Org2
docker run --rm $COMMON $RUN_ORG2_PREFIX $IMG bash -c "peer lifecycle chaincode install /artifacts/${CC_LABEL}.tar.gz && peer lifecycle chaincode queryinstalled > /artifacts/qinstalled_Org2MSP.txt"

# Approve for Org1 and Org2
APPROVE_CMD="peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $PACKAGE_ID --sequence $CC_SEQUENCE --tls --cafile $ORDERER_CA"

docker run --rm $COMMON $RUN_ORG1_PREFIX $IMG bash -c "$APPROVE_CMD"
docker run --rm $COMMON $RUN_ORG2_PREFIX $IMG bash -c "$APPROVE_CMD"

# Commit
COMMIT_CMD="peer lifecycle chaincode commit -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --sequence $CC_SEQUENCE --tls --cafile $ORDERER_CA --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /artifacts/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /artifacts/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

docker run --rm $COMMON $IMG bash -c "$COMMIT_CMD"

# Seed data
SEED_CMD="peer chaincode invoke -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n $CC_NAME -c '{\"Args\":[\"createBatch\",\"BATCH001\",\"{\\\"crop\\\":\\\"Tomatoes\\\",\\\"harvestDate\\\":\\\"2025-09-01\\\",\\\"owner\\\":\\\"Farmer\\\"}\"]}' --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /artifacts/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /artifacts/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

docker run --rm $COMMON $IMG bash -c "$SEED_CMD"

echo "Chaincode $CC_NAME committed and seeded."
