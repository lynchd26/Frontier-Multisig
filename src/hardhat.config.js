require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-ethers');
require("solidity-coverage");

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },

  },
  solidity: "0.8.17"
};
