import { ethers } from 'ethers';
import window from 'global'
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import FrontierMultisig from '../../artifacts/contracts/FrontierMultisig.sol/FrontierMultisig.json'

function PendingTransactions({ activeWallet, setTxCount }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pendingTx, setPendingTx] = useState([]);



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
    
    const pendingTransactions = pendingTransactionsResult[1].map((to, index) => {
      return {
        txId: pendingTransactionsResult[0][index],
        to,
        value: pendingTransactionsResult[2][index],
        data: pendingTransactionsResult[3][index],
        executed: pendingTransactionsResult[4][index],
        denied: pendingTransactionsResult[5][index],
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
    setTxCount(pendingTransactions.length);
    setPendingTx(pendingTxWithDetails);
  }

  async function approveTransaction(txIndex) {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const tx = await frontierMultisigContract.approveTransaction(pendingTx[txIndex].txId);
      const receipt = await tx.wait();
      console.log("Approve transaction receipt:", receipt);
      fetchPendingTransactions(); // Refresh pending transactions list after approval
    } catch (error) {
      console.error("Error approving transaction:", error.message);
    }
  }

  async function denyTransaction(txIndex) {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const tx = await frontierMultisigContract.denyTransaction(pendingTx[txIndex].txId);
      const receipt = await tx.wait();
      console.log("Deny transaction receipt:", receipt);
      fetchPendingTransactions(); // Refresh pending transactions list after denial
    } catch (error) {
      console.error("Error denying transaction:", error.message);
    }
  }

  
  
  function parseUnitsBack(wei, decimals = 18) {
    try {
      const weiBigInt = BigInt(wei);
      const factorBigInt = BigInt(10) ** BigInt(decimals);
      const etherBigInt = weiBigInt / factorBigInt;
      const remainderBigInt = weiBigInt % factorBigInt;
      const ether = Number(etherBigInt) + Number(remainderBigInt) / Number(factorBigInt);
      return ether;
    } catch (error) {
      console.log("Error parsing units back:", error.message);
    }
  } 

  useEffect(() => {
    if (activeWallet) {
      fetchPendingTransactions();
    }
  }, [activeWallet]);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    const fetchPromise = fetchPendingTransactions();
  
    const minSpinTime = 1000;
  
    const spinTimeout = new Promise((resolve) => {
      setTimeout(resolve, minSpinTime);
    });
  
    await Promise.all([fetchPromise, spinTimeout]);
    setIsRefreshing(false);
  };
  return (

    <div className="mx-auto w-full p-6 h-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl text-gray-200 font-semibold">Pending Transactions</h2>
        <button
          onClick={handleRefreshClick}
          className="flex items-center justify-center px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faSync} className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {pendingTx.length === 0 ? (
        <p className="text-gray-200">No pending transactions</p>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {pendingTx
            .map((item, index) => {
              const approved = item.approvals;
              const denied = item.denials;
              const approvalsReq = item.approvalsRequired;
              const denialsReq = item.denialsRequired;

              return (
                <li key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-800">
                      <p className="font-semibold">Amount: {parseUnitsBack(item.value)}</p>
                      <p className='text-violet-500'>To: {item.to}</p>
                    </div>
                    <div className="flex items-center pl-8 space-x-4">
                      <p className="text-gray-600">{`${approved}/${approvalsReq}`}</p>
                      <button
                        onClick={() => approveTransaction(index)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Approve
                      </button>

                      <p className="text-gray-600">{`${denied}/${denialsReq}`}</p>
                      <button 
                        onClick={() => denyTransaction(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Deny
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>  );
}

export default PendingTransactions;
