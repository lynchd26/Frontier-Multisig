import { ethers } from "ethers";
import { useState, useEffect } from "react";


function Analytics( {activeWallet} ) {

    const [completeTx, setCompleteTx] = useState([]);


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
            txId: completeTransactionsResult[0][index], // Add this line
            to,
            value: completeTransactionsResult[1][index],
            data: completeTransactionsResult[2][index],
            executed: completeTransactionsResult[3][index],
            denied: completeTransactionsResult[4][index],
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


  return (
    <div className="Analytics">
      <button
        onClick={() => {fetchCompleteTransactions() }}
      >
        Refresh
      </button>
      {!completeTx=== 0 ? (
        <p className="text-gray-200">No complete transactions</p>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
          {completeTx.map((item, index) => {
            const approved = item.approvals;
            const denied = item.denials;
            const approvalsReq = item.approvalsRequired;
            const denialsReq = item.denialsRequired;
            const isApproved = approved >= approvalsReq;
            const isDenied = denied >= denialsReq;

            return (
              <li key={index} className={`p-4 ${isApproved ? 'bg-green-100' : ''} ${isDenied ? 'bg-red-100' : ''}`}>
                <div className="flex justify-between items-center">
                  <div className="text-gray-800">
                    <p className="font-semibold">Amount: {parseUnitsBack(item.value)}</p>
                    <p className='text-violet-500'>To: {item.to}</p>                     
                  </div>
                  <div className="flex items-center pl-8 space-x-4">
                    <p className="text-gray-600">{`${approved}/${approvalsReq}`}</p>
                    <p className="text-gray-600">{`${denied}/${denialsReq}`}</p>
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Analytics;