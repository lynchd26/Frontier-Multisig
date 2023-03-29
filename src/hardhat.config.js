require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
// const privateKey = fs.readFileSync("./.secret").toString()


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // mumbai: {
    //   url: "https://polygon-mumbai.infura.io/v3/ad10f433b3fd4f84a55260f7cf5f97fd",
    //   accounts: ['ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    // },
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/b655d4cdc80a42c39ce722f48afb3197",
    //   accounts: [privateKey],
    // },
    // mainnet: {
    //   url: "https://mainnet.infura.io/v3/b655d4cdc80a42c39ce722f48afb3197",
    //   accounts: [privateKey],
    // },
    // mumbai: {
    //   url: "https://polygon-mumbai.infura.io/v3/b655d4cdc80a42c39ce722f48afb3197",
    //   accounts: [privateKey],
    // },
  },
  solidity: "0.8.17"
};
