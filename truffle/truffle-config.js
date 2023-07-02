module.exports = {
  plugins: ["solidity-coverage"],
  contracts_build_directory: "../client/src/contracts",
  networks: {
    development: {
     host: "127.0.0.1",    
     port: 8545,           
     network_id: "*",      
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
