// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./FrontierMultisig.sol";

contract FrontierFactory {
    // Allow users to create a multisig wallet by calling FrontierMultisig.sol from this contract with msg.sender as the owner

    event WalletCreated(address wallet, address founder);

    struct WalletsCreated {
        address wallet;
        address founder;
    }

    WalletsCreated[] public walletsCreated;
    FrontierMultisig[] public walletContractsCreated;

    mapping (address => WalletsCreated[]) public walletFounders;


    function createWallet() public {
        FrontierMultisig newWallet = new FrontierMultisig(msg.sender);
        walletsCreated.push(WalletsCreated(address(newWallet), msg.sender));
        walletContractsCreated.push(newWallet);
        walletFounders[msg.sender].push(WalletsCreated(address(newWallet), msg.sender));
        emit WalletCreated(address(newWallet), msg.sender);
    }

    function getWallets(address owner) public view returns (address[] memory){
        address[] memory wallets = new address[](walletFounders[owner].length);
        for (uint i = 0; i < walletFounders[owner].length; i++) {
            wallets[i] = walletFounders[owner][i].wallet;
        }
        return wallets;
    }

}