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
      url: "https://rpc.sepolia.com",
      accounts: [privateKey],
    }
  },
  solidity: "0.8.18",
};
