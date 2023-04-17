const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Frontier", function () {
  let Frontier;
  let frontier;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Frontier = await ethers.getContractFactory("Frontier");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    frontier = await Frontier.deploy();
  });

  describe("createWallet", function () {
    it("Should create a new wallet and emit WalletCreated event", async function () {
      await expect(frontier.connect(owner).createWallet())
        .to.emit(frontier, "WalletCreated")
        .withArgs((await frontier.getUserWallets(owner.address))[0]);
    });

    it("Should create multiple wallets for the same user", async function () {
      await frontier.connect(owner).createWallet();
      await frontier.connect(owner).createWallet();
      const userWallets = await frontier.getUserWallets(owner.address);
      expect(userWallets.length).to.equal(2);
    });
  });

  describe("getUserWallets", function () {
    it("Should return an empty array if the user has no wallets", async function () {
      const userWallets = await frontier.getUserWallets(addr1.address);
      expect(userWallets.length).to.equal(0);
    });

    it("Should return an array of wallet addresses created by the user", async function () {
      await frontier.connect(addr1).createWallet();
      await frontier.connect(addr2).createWallet();
      const userWallets1 = await frontier.getUserWallets(addr1.address);
      const userWallets2 = await frontier.getUserWallets(addr2.address);
      expect(userWallets1.length).to.equal(1);
      expect(userWallets2.length).to.equal(1);
    });
  });
});
