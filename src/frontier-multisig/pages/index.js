
import styles from '@/styles/Home.module.css'
import { ethers } from 'ethers'
import window from 'global'
import React, { useState, useEffect } from "react";

import MultisigWallet from './MultisigWallet.js';
import PendingTransactions from './PendingTransactions.js';
import Analytics from './Analytics.js';

import {
  frontierAddress
} from '../../config.js'

import Frontier from '../../artifacts/contracts/Frontier.sol/Frontier.json'
import FrontierMultisig from '../../artifacts/contracts/FrontierMultisig.sol/FrontierMultisig.json'
import Manage from './Manage.js';


function IndexPage({ currentPage, activeWallet, setBalance, txCount, setTxCount }) {

  const [pendingTx, setPendingTx] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  async function viewMyWallets() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const frontierContract = new ethers.Contract(frontierAddress, Frontier.abi, signer);
      const userAddress = await signer.getAddress();
      const wallets = await frontierContract.getUserWallets(userAddress);
      if (wallets.length > 0) {
        console.log('User wallets:', wallets);
      } else {
        console.log('No user wallets found');
      }
      console.log('User wallets:', wallets);
    } catch (error) {
      console.log('Error viewing wallets: ' + error.message);
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
      setBalance(parseUnitsBack(walletBalance));
    } catch (error) {
      setErrorMessage("Error fetching wallet balance: " + error.message);
    }
  }

  async function fetchPendingTransactions() {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    const pendingTransactionsResult = await frontierMultisigContract.getPendingTransactions();

    const pendingTransactions = pendingTransactionsResult.map((pendingTransaction) => {
      return {
        transactionIndex: pendingTransaction.transactionIndex,
        to: pendingTransaction.to,
        value: pendingTransaction.value,
        data: pendingTransaction.data,
        executed: pendingTransaction.executed,
        denied: pendingTransaction.denied,
        title: pendingTransaction.title,
        description: pendingTransaction.description,
      };
    });
    console.log("Pending transactions:", pendingTransactions);
    try {
      const pendingTxWithDetails = await Promise.all(
        pendingTransactions.map(async (tx) => {
          const transactionIndex = tx.transactionIndex; 
          console.log("Transaction index:", transactionIndex);
          const approvals = await frontierMultisigContract.getTransactionApprovals(transactionIndex);
          const denials = await frontierMultisigContract.getTransactionDenials(transactionIndex);
          const approvalsRequired = await frontierMultisigContract.getApprovalsRequired();
          const denialsRequired = await frontierMultisigContract.getDenialsRequired();  
      
          console.log("Approvals:", approvals);
          console.log("Denials:", denials);
          console.log("Approvals required:", approvalsRequired);
          console.log("Denials required:", denialsRequired);
      
          return {
            ...tx,
            approvals,
            denials,
            approvalsRequired,
            denialsRequired,
          };
        })
      );
      setTxCount(pendingTransactions.length);
      setPendingTx(pendingTxWithDetails);
    } catch (error) {
      console.error("Error fetching pending transactions:", error.message);
    }

  }
  
  function parseUnitsBack(wei, decimals = 18) {
    const weiBigInt = BigInt(wei);
    const factorBigInt = BigInt(10) ** BigInt(decimals);
    const etherBigInt = weiBigInt / factorBigInt;
    const remainderBigInt = weiBigInt % factorBigInt;
    const ether = Number(etherBigInt) + Number(remainderBigInt) / Number(factorBigInt);
  
    return ether;
  }  

  useEffect(() => {
    if (activeWallet) {
      fetchPendingTransactions();
    }
  }, [activeWallet]);
  
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


  
  
    return (
      <main className={`${styles.main} grid grid-cols-1 gap-8 rounded-lg`}>

        {currentPage === 'page1' ? (
          <MultisigWallet activeWallet={activeWallet} setBalance={setBalance} txCount={txCount} setTxCount={setTxCount} errorMessage={errorMessage} />)        
        : null}

        {currentPage === 'page2' ? (
          <PendingTransactions pendingTx={pendingTx} activeWallet={activeWallet} setTxCount={setTxCount} errorMessage={errorMessage} />
        ) : null}

        {currentPage === 'page3' ? (
          <Analytics activeWallet={activeWallet} ></Analytics>      
        ) : null}

        {currentPage === 'page4' ? (
         <Manage activeWallet={activeWallet} ></Manage>
        ) : null}

    </main>
  );
  
}

IndexPage.getInitialProps = async ({ query }) => {
  const initialPage = query.page || 'page1';
  return { initialPage };
};

export default IndexPage;
