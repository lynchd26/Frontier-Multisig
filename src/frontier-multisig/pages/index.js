
import styles from '@/styles/Home.module.css'
import { ethers, utlis } from 'ethers'
import window from 'global'
import React, { useState, useEffect } from "react";

import {
  frontierMultisigAddress, frontierAddress
} from '../../config.js'

import Frontier from '../../artifacts/contracts/Frontier.sol/Frontier.json'
import FrontierMultisig from '../../artifacts/contracts/FrontierMultisig.sol/FrontierMultisig.json'


// const frontierContract = new ethers.Contract(frontierAddress, Frontier.abi, ethers.getDefaultProvider());
// const frontierMultisigContract = new ethers.Contract(frontierMultisigAddress, FrontierMultisig.abi, ethers.getDefaultProvider());

const list = [
  { id: 1, text: "This is the first tx" },
  { id: 2, text: "This is the second tx" },
  { id: 3, text: "This is the third tx" },
  { id: 4, text: "This is the fourth tx" },
  { id: 5, text: "This is the fifth tx" }
];

const transactionHistory = [
  { id: "Tx1234", tag: "Payment" },
  { id: "Tx5678", tag: "Refund" },
  { id: "Tx91011", tag: "Withdrawal" },
  { id: "Tx121314", tag: "Deposit" },
];


function IndexPage({ currentPage }) {

  const [userWallets, setUserWallets] = useState([]);
  const [addressToSend, setAddressToSend] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [pendingTx, setPendingTx] = useState(list);
  const [activeWallet, setActiveWallet] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [balance, setBalance] = useState("");


  async function createNewWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const frontierContract = new ethers.Contract(frontierAddress, Frontier.abi, signer);
      const wallet = await frontierContract.createWallet();
      const receipt = await wallet.wait();
      if (receipt) {
        viewMyWallets();
      }
      console.log('New wallet address:', wallet);
    } catch (error) {
      setErrorMessage('Error creating a new wallet: ' + error.message);
    }
  }
  
  async function viewMyWallets() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const frontierContract = new ethers.Contract(frontierAddress, Frontier.abi, signer);
      const userAddress = await signer.getAddress();
      const wallets = await frontierContract.getUserWallets(userAddress);
      if (wallets.length > 0) {
        setUserWallets(wallets);
        console.log('User wallets:', wallets);
      } else {
        console.log('No user wallets found');
      }
      console.log('User wallets:', wallets);
    } catch (error) {
      setErrorMessage('Error viewing wallets: ' + error.message);
    }
  }

  async function submitTransaction() {
    if (!activeWallet) {
        alert("Please select an active wallet first.");
        return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
        console.log("to: " + addressToSend, "value: " + parseUnits(amountToSend));
        const tx = await frontierMultisigContract.submitTransaction(addressToSend, parseUnits(amountToSend), "0x");
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);
    } catch (error) {
        console.error("Error submitting transaction:", error.message);
    }
  }

  async function depositToMultisig() {
    console.log("Deposit button clicked");
  
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
  
    if (!depositAmount) {
      alert("Invalid deposit amount.");
      return;
    }
  
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: activeWallet,
        value: parseUnits(depositAmount),
      });

      const receipt = await tx.wait();
      console.log("Deposit transaction receipt:", receipt);
    } catch (error) {
      console.error("Error depositing to multisig wallet:", error.message);
    }
  }

  async function fetchBalance() {
    if (!activeWallet) {
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const walletBalance = await provider.getBalance(activeWallet);
      setBalance(walletBalance.toString());
    } catch (error) {
      setErrorMessage("Error fetching wallet balance: " + error.message);
    }
  }

  function parseUnits(value) {
    const [integer, decimal] = value.split(".");
    const wei = integer + (decimal ? decimal.padEnd(18, "0") : "0".repeat(18));
    const weiBigInt = BigInt(wei);
  
    return weiBigInt;
  }
  
  
  useEffect(() => {
    fetchBalance();
  }, [activeWallet]);
  
  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
      setErrorMessage('');
    }
  }, [errorMessage]);

  useEffect(() => {
    viewMyWallets();
  }, []);

  // async function updateTransactions() {
  //   const pendingTransactions = await frontierMultisigContract.getTransactions();
  //   setPendingTx(pendingTransactions);
  //   console.log('Pending transactions:', pendingTransactions);
  // }


  return (
    <main className={`${styles.main} rounded-lg`}>
    {currentPage === "page1" ? (
      <div className="flex flex-col md:flex-row text-white space-y-4 md:space-y-0 md:space-x-4 items-center justify-center h-1/2">
        <div className="bg-gray-500 p-6 rounded-lg shadow-md w-full md:w-auto">
          <h2 className="text-lg font-semibold mb-4">Create a New Wallet</h2>
          <button
            onClick={() => createNewWallet()}
            className="bg-white text-blue-500 py-2 px-4 rounded shadow"
          >
            Create New Wallet
          </button>
        </div>
        <div className="bg-gray-500 p-6 rounded-lg shadow-md w-full md:w-auto">
      <h2 className="text-lg font-semibold mb-4">View My Wallets</h2>
      <button
        onClick={() => viewMyWallets()}
        className="bg-white text-blue-500 py-2 px-4 rounded shadow mb-4"
      >
        View My Wallets
      </button>
      <h3 className="font-semibold">Active Wallet: {activeWallet || "None"}</h3>
        <div className="space-y-2 mt-4">
          {userWallets.map((wallet) => (
            <div key={wallet} className="flex items-center space-x-2">
              <span className="font-mono text-sm">{wallet}</span>
              <button
                onClick={() => setActiveWallet(wallet)}
                className="bg-white text-blue-500 py-1 px-2 rounded shadow text-xs"
              >
                Set as Active
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Balance: {balance || "N/A"}</h4>
          <button
            onClick={() => fetchBalance()}
            className="bg-white text-blue-500 py-1 px-2 rounded shadow text-xs"
          >
            Refresh Balance
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="depositAmount" className="mb-2">
            Deposit Amount (ETH):
          </label>
          <input
            type="text"
            id="depositAmount"
            className="w-full px-2 py-1 rounded-md border border-gray-400 mb-4 text-gray-800"
            style={{ maxWidth: "400px" }}
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button
            onClick={() => depositToMultisig()}
            className="bg-white text-blue-500 py-2 px-4 rounded shadow"
          >
            Deposit
          </button>
        </div>
      </div>


      </div>
    ) : null}  

      {currentPage === 'page2' ? (

        <div>
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-xl text-gray-200 font-semibold">Pending Transactions</h2>
            {/* <button onClick={updateTransactions} class="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-600">Refresh</button> */}
          </div>

          <div class="bg-gray-200 px-5 py-1 rounded">
            <ul>
              {pendingTx.map((item, index) => {
                const approved = list.filter((item) => item.approved).length;
                const denied = list.filter((item) => item.denied).length;

                return (
                  <li class={`flex justify-between items-center py-2 ${index !== pendingTx.length - 1 ? 'border-b border-gray-300' : ''}`}>
                    <p class="text-gray-800">{item.text}</p>
                    <div class="flex items-center space-x-4">
                      <p class="text-gray-600">{`${approved}/${list.length}`}</p>
                      <button class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                      <p class="text-gray-600">{`${denied}/${list.length}`}</p>
                      <button class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Deny</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>


      ) : null}


      {currentPage === 'page3' ? (
        
        <div class="bg-gray-200 px-5 py-1 rounded">
          {transactionHistory.map((transaction, index) => (
            <li class={`flex justify-between items-center py-2 ${index !== transactionHistory.length - 1 ? 'border-b border-gray-300' : ''}`}>
              <p class="text-gray-800 py-1">{transaction.id}</p>
              <div class="flex items-center">
                <span class="text-gray-600 mr-2">{transaction.date}</span>
                <p class="text-indigo-700">{transaction.tag}</p>
              </div>
            </li>
          ))}
        </div>

      ) : null}

      {currentPage === 'page4' ? (
        
      <div className="md:grid md:grid-cols-2 text-white h-1/2">
        <div className="flex flex-col justify-center items-center">
          <label htmlFor="address" className="mb-2">Address:</label>
          <input
            onChange={(e) => setAddressToSend(e.target.value)}
            className="w-full px-2 py-1 rounded-md border border-gray-400 mb-4 text-gray-800"
            style={{ maxWidth: "400px" }}
          />

          <label htmlFor="amount" className="mb-2">Amount:</label>
          <input
            onChange={(e) => setAmountToSend(e.target.value)}
            className="w-40 px-2 py-1 rounded-md border border-gray-400 mb-4 text-gray-800"
          />

          <label htmlFor="tag" className="mb-2">Transaction Tag:</label>
          <input
            onChange={(e) => setTag(e.target.value)}
            className="w-full px-2 py-1 rounded-md border border-gray-400 mb-4 text-gray-800"
            style={{ maxWidth: "400px" }}
          />

          <button
            onClick={() => submitTransaction(addressToSend, amountToSend)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out"
          >
            Submit transaction
          </button>
        </div>
      </div>



      ) : null}

    </main>
  );
  
}

IndexPage.getInitialProps = async ({ query }) => {
  const initialPage = query.page || 'page1';
  return { initialPage };
};

export default IndexPage;
