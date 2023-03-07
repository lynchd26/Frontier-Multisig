// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");


async function main() {
  const FrontierMultisig = await hre.ethers.getContractFactory("FrontierMultisig");
  const frontierMultisig = await FrontierMultisig.deploy();
  await frontierMultisig.deployed();
  console.log("frontierMultisig deployed to:", frontierMultisig.address);

  const Frontier = await hre.ethers.getContractFactory("Frontier");
  const frontier = await Frontier.deploy();
  await frontier.deployed();
  console.log("frontier deployed to:", frontier.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

