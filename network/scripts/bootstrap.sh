#!/bin/bash
set -euo pipefail

FABRIC_VERSION=${FABRIC_VERSION:-2.5.6}
CA_VERSION=${CA_VERSION:-1.5.7}
BIN_DIR=${BIN_DIR:-$HOME/fabric/bin}

mkdir -p "$BIN_DIR"
export PATH="$BIN_DIR:$PATH"

if command -v peer >/dev/null 2>&1 && command -v cryptogen >/dev/null 2>&1 && command -v configtxgen >/dev/null 2>&1; then
  echo "Fabric binaries found in PATH. Skipping download."
  exit 0
fi

echo "Please install Fabric binaries manually and ensure peer, cryptogen, configtxgen are in PATH."
echo "Recommended: https://hyperledger-fabric.readthedocs.io/en/release-2.5/install.html"
echo "You can set PATH to include your binaries. Current PATH: $PATH"
exit 0
