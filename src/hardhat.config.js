require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString()


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/b655d4cdc80a42c39ce722f48afb3197",
      accounts: [privateKey],
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/b655d4cdc80a42c39ce722f48afb3197",
      accounts: [privateKey],
    }
  },
  solidity: "0.8.18",
};
