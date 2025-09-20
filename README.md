# IBM Food Trust Clone – Dev Scaffold

This repository scaffolds a Hyperledger Fabric-based supply chain transparency system per the SRS. It includes:

- Minimal 2-org Fabric dev network (OrdererOrg + Org1 + Org2) with one channel `supplychannel`
- Node.js chaincode `foodtrust-contract` (skeleton with core functions)
- Placeholders for backend, web frontend, and mobile app

## Prerequisites
- Docker Desktop (latest)
- Docker Compose v2
- make, curl, tar, openssl
- Node.js 18+

## Quickstart (Dev)
1) Bootstrap Fabric binaries and images
```bash
cd network
./scripts/bootstrap.sh
```

2) Generate crypto and channel artifacts
```bash
./scripts/generate.sh
```

3) Start the network
```bash
./scripts/start.sh
```

4) Deploy sample chaincode (next step)
```bash
# Coming next: lifecycle scripts
```

## Structure
- `network/` – Fabric config, docker, and scripts
- `chaincode/foodtrust-contract/` – Node.js contract (WIP)
- `backend/` – Express API (TBD)
- `frontend/` – React app (TBD)
- `mobile/` – React Native app (TBD)

## Next Steps
- Add chaincode lifecycle scripts to install/approve/commit
- Implement REST API and role-based flows
- Implement React web and mobile apps with QR support
