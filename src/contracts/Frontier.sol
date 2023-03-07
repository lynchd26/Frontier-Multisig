// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./FrontierMultisig.sol";

contract Frontier {
    // Allow users to create a multisig wallet by calling FrontierMultisig.sol from this contract with msg.sender as the owner
    address[] public wallets;

    mapping (address => address) public walletFounders;


    function createWallet() public returns (address){
        FrontierMultisig newWallet = new FrontierMultisig(msg.sender);
        wallets.push(address(newWallet));
        walletFounders[address(newWallet)] = msg.sender;
        return address(newWallet);
    }

    function getWallets() public view returns (address[] memory){
        return wallets;
    }

}