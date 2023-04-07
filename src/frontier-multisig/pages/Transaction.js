import React, { useState } from 'react';
import styles from '../styles/Transaction.module.css';

function Transaction({ item, approveTransaction, denyTransaction, index }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

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

  return (
    <div className={`${styles.transactionContainer} text-gray-800 ${expanded ? styles.expanded : ''}`}>
      <div className="flex justify-between items-start">
        <button onClick={toggleExpanded} className="focus:outline-none pr-4 pt-3">
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          )}
        </button>
        <div>
          <p className="font-semibold">Amount: {parseUnitsBack(item.value)}</p>
          <p className="text-violet-500">Title: {item.title}</p>
          <div className={`overflow-hidden ${expanded ? styles.expandedContent : ''}`}>
            {expanded && (
              <>
                <p className="text-violet-500">To: {item.to}</p>
                <p className="text-violet-500">Description: {item.description}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
