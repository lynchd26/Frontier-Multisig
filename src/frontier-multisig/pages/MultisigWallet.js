import { ethers } from 'ethers';
import window from 'global'
import React, { useState, useEffect } from "react";
import FrontierMultisig from '../../artifacts/contracts/FrontierMultisig.sol/FrontierMultisig.json'


function MultisigWallet( {activeWallet, setBalance, setTxCount } ) {

  const [depositAmount, setDepositAmount] = useState("");
  const [addressToSend, setAddressToSend] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
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
        setTxCount((txCount) => txCount + 1);
        // fetchPendingTransactions();
    } catch (error) {
        console.error("Error submitting transaction:", error.message);
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

    
  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
      setErrorMessage('');
    }
  }, [errorMessage]);

  useEffect(() => {
    if (activeWallet) {
      fetchBalance();
    }
  }, [activeWallet]);
  
  return (
    <div className="mx-auto w-full p-6">
      <h2 className="text-2xl text-gray-200 font-semibold mb-5">Create Transaction</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-xl text-gray-800 font-semibold mb-4">Submit Transaction</h3>
          <div>
            <label htmlFor="address" className="block mb-2 font-semibold text-gray-800">Address:</label>
            <input
              onChange={(e) => setAddressToSend(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 mb-4 text-gray-800 focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
              style={{ maxWidth: "400px" }}
            />
          </div>
          <div>
            <label htmlFor="amount" className="block mb-2 font-semibold text-gray-800">Amount:</label>
            <input
              onChange={(e) => setAmountToSend(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 mb-4 text-gray-800 focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
              style={{ maxWidth: "400px" }}
            />
          </div>
          <div>
            <label htmlFor="tag" className="block mb-2 font-semibold text-gray-800">Transaction Tag:</label>
            <input
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 mb-4 text-gray-800 focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
              style={{ maxWidth: "400px" }}
            />
          </div>
          <button
            onClick={() => submitTransaction(addressToSend, amountToSend)}
            className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition-colors duration-300 ease-in-out"
          >
            Submit transaction
          </button>
        </div>
        <div className="bg-white h-[52%] rounded-lg shadow p-6">
          <h3 className="text-xl text-gray-800 font-semibold mb-4">Deposit</h3>
          <div className="flex flex-col">
            <label htmlFor="depositAmount" className="block font-semibold text-gray-800 mb-4">Deposit Amount (ETH):</label>
            <input
              type="text"
              id="depositAmount"
              className="mt-2 p-2 rounded-md border border-gray-300 text-gray-800 mb-4"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
            <div className="w-40">
              <button
                onClick={() => depositToMultisig()}
                className="w-full px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition-colors duration-300 ease-in-out"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
  
  

  
}

export default MultisigWallet;
