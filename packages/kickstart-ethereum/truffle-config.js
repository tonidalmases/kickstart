const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config({ path: __dirname + '/.env' });
const mnemonic = process.env['ETH_MNEMONIC'];
const rinkebyLink = `https://rinkeby.infura.io/v3/${process.env['ETH_PROJECT_ID']}`;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, rinkebyLink),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  mocha: {},

  compilers: {
    solc: {
      version: '0.8.3',
    },
  },

  db: {
    enabled: false,
  },
};
