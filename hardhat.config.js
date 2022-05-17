require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@unlock-protocol/hardhat-plugin");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.7',
    // optimizer is required to deploy unlock contracts
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      gas: 1000000000,
      allowUnlimitedContractSize: true,
      blockGasLimit: 1000000000,
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      accounts: []
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
      accounts: []
    }
  },
  etherscan: {
    apiKey: {
      polygon: 'W9TVEYKW2CDTQ94T3A2V93IX6U3IHQN5Y3',
      mainnet: 'HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF',
      rinkeby: 'HPSH1KQDPJTNAPU3335G931SC6Y3ZYK3BF',
    }
  },
};
