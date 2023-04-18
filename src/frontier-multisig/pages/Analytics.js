import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import Transaction from './Transaction';

import FrontierMultisig from '../../artifacts/contracts/FrontierMultisig.sol/FrontierMultisig.json'

function Analytics( {activeWallet} ) {

    const [completeTx, setCompleteTx] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);


    async function fetchCompleteTransactions() {
        if (!activeWallet) {
          alert("Please select an active wallet first.");
          return;
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
        const completeTransactionsResult = await frontierMultisigContract.getCompleteTransactions();
        
        const completeTransactions = completeTransactionsResult[0].map((to, index) => {
          return {
            txId: index,
            to: completeTransactionsResult[0][index],
            value: completeTransactionsResult[1][index],
            data: completeTransactionsResult[2][index],
            executed: completeTransactionsResult[3][index],
            denied: completeTransactionsResult[4][index],
            title: completeTransactionsResult[5][index],
            description: completeTransactionsResult[6][index],
          };  
        });
        console.log("Complete transactions:", completeTransactions);
        const completeTxWithDetails = await Promise.all(
          completeTransactions.map(async (tx, index) => {
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
      
        setCompleteTx(completeTxWithDetails);
      } 

      const handleRefreshClick = async () => {
        setIsRefreshing(true);
        const fetchPromise = fetchCompleteTransactions();
      
        console.log("fetch promise completeTx", fetchPromise);


        const minSpinTime = 1000;
      
        const spinTimeout = new Promise((resolve) => {
          setTimeout(resolve, minSpinTime);
        });
      
        await Promise.all([fetchPromise, spinTimeout]);
        setIsRefreshing(false);
      };

      useEffect(() => {
        if (activeWallet) {
          fetchCompleteTransactions();
        }
      }, [activeWallet]);
      

  return (
    <div className="mx-auto w-full p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl text-gray-200 font-semibold">Complete Transactions</h2>
        <button
          onClick={handleRefreshClick}
          className="flex items-center justify-center px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faSync} className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {completeTx.length === 0 ? (
        <p className="text-gray-200">No complete transactions</p>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
          {completeTx.map((item, index) => {
            const approved = item.approvals;
            const denied = item.denials;
            const approvalsReq = item.approvalsRequired;
            const denialsReq = item.denialsRequired;
 

            const isFirstItem = index === 0;
            const isLastItem = index === completeTx.length - 1;

            const roundedClasses = `${isFirstItem ? "rounded-t-lg" : ""} ${
              isLastItem ? "rounded-b-lg" : ""
            }`;

            return (
              <div
                key={index}
                className={`${roundedClasses} ${
                  approved ? "bg-green-100" : ""
                } ${denied ? "bg-red-100" : ""}`}
              >
                <li className={`p-4 ${!isFirstItem && !isLastItem ? "border-b border-gray-200" : ""}`}>
                  <div className="flex justify-between items-center">
                    {/* <div className="text-gray-800">
                      <p className="font-semibold">Amount: {parseUnitsBack(item.value)}</p>
                      <p className="text-violet-500">To: {item.to}</p>
                    </div> */}
                    <Transaction item={item} />
                    <div className="flex items-center pl-8 space-x-4">
                      <p className="text-gray-600">{`${approved}/${approvalsReq}`}</p>
                      <p className="text-gray-600">{`${denied}/${denialsReq}`}</p>
                    </div>
                  </div>
                </li>
              </div>
            );
          })}


          </ul>
        </div>
      )}
    </div>
  );
}

export default Analytics;