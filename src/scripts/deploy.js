// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();

  const Frontier = await ethers.getContractFactory("Frontier");
  const frontier = await Frontier.deploy();
  await frontier.deployed();
  console.log("Frontier deployed to:", frontier.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
