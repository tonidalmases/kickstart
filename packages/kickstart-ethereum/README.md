# Kickstart ethereum

This package contains the ethereum contracts for the application.

## Prerequisites

- Install [Truffle Suite](https://www.trufflesuite.com) to build, test and deploy the contract.

```bash
npm install -g truffle
```

- Install [Ganache](https://www.trufflesuite.com/ganache) to quickly fire up a personal Ethereum blockchain in localhost.

## Compilation

Open a terminal to `packages/kickstart-ethereum/` and type:

```bash
truffle compile
```

Artifacts of the compilation will be placed in the `build/contracts/` directory.

## Deployment in localhost

The Ganache blockchain must be running for local development and testing. The migration deploys the contracts to the blockchain, which takes the `development` network configuration in `truffle-config.js`.

```bash
truffle migrate
```

The response contains the information of the contract, included the address.

## Execution of local tests

Execute the following line in order to run the tests:

```bash
truffle test
```

## Deployment in Rinkeby

Before deploying the contract to the Rinkeby network, an `.env` file must be created with your mnemonic and [Infura](https://infura.io/) project id.

```
ETH_MNEMONIC="your mnemonic"
ETH_PROJECT_ID="projectId"
```

The deployment uses the `rinkeby` network configuration in `truffle-config.js`. Type into the terminal:

```bash
truffle migrate --network rinkeby
```
