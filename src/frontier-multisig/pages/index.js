
import styles from '@/styles/Home.module.css'
import { ethers } from 'ethers'
import window from 'global'
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import MultisigWallet from './MultisigWallet.js';
import PendingTransactions from './PendingTransactions.js';
import Analytics from './Analytics.js';

import {
  frontierAddress
} from '../../config.js'

import Frontier from '../../artifacts/contracts/Frontier.sol/Frontier.json'
import FrontierMultisig from '../../artifacts/contracts/FrontierMultisig.sol/FrontierMultisig.json'


function IndexPage({ currentPage, activeWallet, setBalance, txCount, setTxCount }) {

  const [userWallets, setUserWallets] = useState([]);
  const [addressToSend, setAddressToSend] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [pendingTx, setPendingTx] = useState([]);
  const [completeTx, setCompleteTx] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  // const [balance, setBalance] = useState("0");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [owners, setOwners] = useState([]);
  const [approvalsRequired, setApprovalsRequired] = useState('');
  const [displayedApprovals, setDisplayedApprovals] = useState(1);
  const [denialsRequired, setDenialsRequired] = useState('');
  const [displayedDenials, setDisplayedDenials] = useState(1);


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
      // setErrorMessage('Error viewing wallets: ' + error.message);
      console.log('Error viewing wallets: ' + error.message);
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
        fetchPendingTransactions();
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
      fetchBalance();
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
      setBalance(parseUnitsBack(walletBalance));
    } catch (error) {
      setErrorMessage("Error fetching wallet balance: " + error.message);
    }
  }

  async function fetchPendingTransactions() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    const pendingTransactionsResult = await frontierMultisigContract.getPendingTransactions();
    
    const pendingTransactions = pendingTransactionsResult[0].map((to, index) => {
      return {
        txId: pendingTransactionsResult[0][index], // Add this line
        to,
        value: pendingTransactionsResult[1][index],
        data: pendingTransactionsResult[2][index],
        executed: pendingTransactionsResult[3][index],
        denied: pendingTransactionsResult[4][index],
      };
    });
    console.log("Pending transactions:", pendingTransactions);
    const pendingTxWithDetails = await Promise.all(
      pendingTransactions.map(async (tx, index) => {
        const approvals = await frontierMultisigContract.getTransactionApprovals(index);
        const denials = await frontierMultisigContract.getTransactionDenials(index);
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
  
    setPendingTx(pendingTxWithDetails);
  }


  async function addOwner(newOwner) {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    console.log("Adding owner:", newOwner);
    try {
      const tx = await frontierMultisigContract.addOwner(newOwner);
      const receipt = await tx.wait();
      console.log("Add owner transaction receipt:", receipt);
      fetchOwners();
    } catch (error) {
      console.error("Error adding owner:", error.message);
    }
  }
  
  async function removeOwner(ownerToRemove) {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const tx = await frontierMultisigContract.removeOwner(ownerToRemove);
      const receipt = await tx.wait();
      console.log("Remove owner transaction receipt:", receipt);
      fetchOwners();
    } catch (error) {
      console.error("Error removing owner:", error.message);
    }
  }

  async function fetchOwners() {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const owners = await frontierMultisigContract.getOwners();
      setOwners(owners);
    }
    catch (error) {
      console.error("Error fetching owners:", error.message);
    }
  }

  async function fetchRequiredApprovals() {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const approvalsRequired = await frontierMultisigContract.getApprovalsRequired();
      console.log("Approvals required:", approvalsRequired);
      setApprovalsRequired(approvalsRequired);
      setDisplayedApprovals(approvalsRequired);
    }
    catch (error) {
      console.error("Error fetching required approvals:", error.message);
    }
  }

  async function fetchRequiredDenials() {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const denialsRequired = await frontierMultisigContract.getDenialsRequired();
      setDenialsRequired(denialsRequired);
    }
    catch (error) {
      console.error("Error fetching required denials:", error.message);
    }
  }

  async function changeApprovalsRequired() {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const tx = await frontierMultisigContract.changeApprovalsRequired(approvalsRequired);
      const receipt = await tx.wait();
      console.log("Change approvals required transaction receipt:", receipt);
      fetchRequiredApprovals();
    } catch (error) {
      console.error("Error changing approvals required:", error.message);
    }
  }

  async function changeDenialsRequired() {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const tx = await frontierMultisigContract.changeDenialsRequired(denialsRequired);
      const receipt = await tx.wait();
      console.log("Change denials required transaction receipt:", receipt);
      fetchRequiredDenials();
    } catch (error) {
      console.error("Error changing denials required:", error.message);
    }
  }
  
  function parseUnits(value) {
    const [integer, decimal] = value.split(".");
    const wei = integer + (decimal ? decimal.padEnd(18, "0") : "0".repeat(18));
    const weiBigInt = BigInt(wei);
  
    return weiBigInt;
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
          <MultisigWallet activeWallet={activeWallet} depositAmount={depositAmount} setBalance={setBalance} txCount={txCount} setTxCount={setTxCount} errorMessage={errorMessage} />)        
        : null}

        {currentPage === 'page2' ? (
          <PendingTransactions pendingTx={pendingTx} activeWallet={activeWallet} setTxCount={setTxCount} errorMessage={errorMessage} />
        ) : null}

        {currentPage === 'page3' ? (
          <Analytics activeWallet={activeWallet} ></Analytics>      
        ) : null}

        {currentPage === 'page4' ? (
          <div className="mt-4">
          <input
              type="text"
              id="owner address"
              className="w-full px-2 py-1 rounded-md border border-gray-400 mb-4 text-gray-800"
              style={{ maxWidth: '400px' }}
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
            />
            <button
              onClick={() => addOwner(targetAddress)}
              className="bg-white text-blue-500 py-2 px-4 rounded shadow"
            >Add owner</button>
            <button
              onClick={() => removeOwner(targetAddress)}
              className="bg-white text-blue-500 py-2 px-4 rounded shadow"
            >Remove owner</button>
            
            <button
              onClick={() => {
                fetchOwners();
                fetchRequiredApprovals();
                fetchRequiredDenials();
              }}
              className="bg-white text-blue-500 py-2 px-4 rounded shadow"
            >Refresh</button>
  
            <div>
              <p className="text-gray-200">Owners:</p>
              <ul className="divide-y divide-gray-200">
                {owners.map((owner, index) => (
                  <li key={index} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-800">
                        <p className="font-semibold">{owner}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div>
                <p className="text-gray-200">Required approvals: {displayedApprovals.toString()}</p>
                <input
                  type="integer"
                  id="approvals required"
                  className="w-full px-2 py-1 rounded-md border border-gray-400 mb-4 text-gray-800"
                  style={{ maxWidth: '400px' }}
                  value={approvalsRequired}
                  onChange={(e) => setApprovalsRequired(e.target.value)}
                />
                <button
                  onClick={() => changeApprovalsRequired(approvalsRequired)}
                  className="bg-white text-blue-500 py-2 px-4 rounded shadow"
                >Change</button>
              </div>
              <div>
                <p className="text-gray-200">Required denials: {displayedDenials.toString()}</p>
                <input
                  type="integer"
                  id="denials required"
                  className="w-full px-2 py-1 rounded-md border border-gray-400 mb-4 text-gray-800"
                  style={{ maxWidth: '400px' }}
                  value={denialsRequired}
                  onChange={(e) => setDenialsRequired(e.target.value)}
                />
                <button
                  onClick={() => changeDenialsRequired(denialsRequired)}
                  className="bg-white text-blue-500 py-2 px-4 rounded shadow"
                >Change</button>
              </div>
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
