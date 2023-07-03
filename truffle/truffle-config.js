const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  plugins: ["solidity-coverage"],
  contracts_build_directory: "../client/src/contracts",
  networks: {
    development: {
     host: "127.0.0.1",    
     port: 8545,           
     network_id: "*",      
    },
    goerli:{
      provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://linea-goerli.infura.io/v3/${process.env.INFURA_ID}`})},
      network_id:59140,
     },
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.18",
    }
  },
};
