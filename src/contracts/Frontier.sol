// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./FrontierMultisig.sol";

contract Frontier {
    address[] public wallets;

    mapping (address => address) public walletFounders;
    mapping (address => address[]) public userWallets;
    
    function createWallet() public returns (address){
        FrontierMultisig newWallet = new FrontierMultisig(msg.sender);
        wallets.push(address(newWallet));
        walletFounders[address(newWallet)] = msg.sender;
        userWallets[msg.sender].push(address(newWallet));
        return address(newWallet);
    }


    function getWallets() public view returns (address[] memory){
        return wallets;
    }

    function getUserWallets(address user) public view returns (address[] memory) {
        if (userWallets[user].length == 0) {
            return new address[](0);
        }
        return userWallets[user];
    }

}
