require('solidity-coverage');
require('@nomiclabs/hardhat-truffle5');

module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ganache: {
      url: 'http://localhost:7545', 
    },
  },

  coverage: {
    provider: 'ganache',
    url: 'http://localhost:7545',
  },
};
