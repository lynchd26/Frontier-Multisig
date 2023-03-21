
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useState } from 'react'
import { ethers } from 'ethers'
import window from 'global'

const inter = Inter({ subsets: ['latin'] })

import {
  frontierMultisigAddress, frontierAddress
} from '../../config.js'

import Frontier from '../../artifacts/contracts/Frontier.sol/Frontier.json'
import FrontierMultisig from '../../artifacts/contracts/FrontierMultisig.sol/FrontierMultisig.json'

const frontierContract = new ethers.Contract(frontierAddress, Frontier.abi, ethers.getDefaultProvider());
const frontierMultisigContract = new ethers.Contract(frontierMultisigAddress, FrontierMultisig.abi, ethers.getDefaultProvider());

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

  const [walletsList, setWalletsListText] = useState('No wallets found');
  const [addressToSend, setAddressToSend] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [pendingTx, setPendingTx] = useState(list);

  async function createNewWallet() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });                           // Connect to the Ethereum network using MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);                               // Create an instance of the Ethereum provider using the window.ethereum object
    const signer = await provider.getSigner();                                                  // Create a new instance of the Frontier contract
    const frontierContract = new ethers.Contract(frontierAddress, Frontier.abi, signer);
    const wallet = await frontierContract.createWallet();                                       // Call the createWallet() function on the Frontier contract
    console.log('New wallet address:', wallet);
  }

  async function viewMyWallets() {
    const wallets = await frontierContract.getWallets();
    if (wallets != null) {
      setWalletsListText(wallets.join(', '));
    } else {
      setWalletsListText('Error: No wallets found');
    }
    console.log('Wallets:', wallets);
  }

  async function submitTransaction(address, amount){
    await window.ethereum.request({ method: 'eth_requestAccounts' });                           // Connect to the Ethereum network using MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);                               // Create an instance of the Ethereum provider using the window.ethereum object
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(frontierMultisigAddress, FrontierMultisig.abi, signer);
    const value = ethers.utils.parseUnits(amount.toString(), "matic");
    const tx = await frontierMultisigContract.submitTransaction(address, value, "0x");
    console.log('Transaction submitted:', tx);
  }

  async function updateTransactions() {
    const pendingTransactions = await frontierMultisigContract.getTransactions();
    setPendingTx(pendingTransactions);
    console.log('Pending transactions:', pendingTransactions);
  }


  return (
   <main className={`${styles.main} rounded-lg`}>

      {currentPage === 'page1' ? (
        
       
        <div className='md:columns-2 text-white' style={{height: '50%'}}>
          <div className='column justify-center items-center'>
            <button onClick={() => createNewWallet()}>Create New Wallet</button>
          </div>
          <div className='column justify-center items-center'>
            <button onClick={() => viewMyWallets()}>Wallets: {walletsList}</button>
          </div>
        </div>

      ) : null}


      {currentPage === 'page2' ? (

        <div>
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-xl text-gray-200 font-semibold">Pending Transactions</h2>
            <button onClick={updateTransactions} class="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-600">Refresh</button>
          </div>

          <div class="bg-gray-200 px-5 py-1 rounded">
            <ul>
              {pendingTx.map((item, index) => {
                // const approved = list.filter((item) => item.approved).length;
                // const denied = list.filter((item) => item.denied).length;

                return (
                  <li class={`flex justify-between items-center py-2 ${index !== pendingTx.length - 1 ? 'border-b border-gray-300' : ''}`}>
                    <p class="text-gray-800">{item.text}</p>
                    <div class="flex items-center space-x-4">
                      {/* <p class="text-gray-600">{`${approved}/${list.length}`}</p> */}
                      <button class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                      {/* <p class="text-gray-600">{`${denied}/${list.length}`}</p> */}
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

// export default function Home() {
//   return (
//     <>    
//       <main className={`${styles.main} rounded-lg`}>
//           <div className='md:columns-2 text-white' style={{height: '50%'}}>
//             <div className='column'>
//               <h1 className='text-4xl font-bold '>Hello World!</h1>
//               <p className='text-xl'>Hola mundo!</p>
//               </div>
//               <div className='column'>
//               <h1 className='text-4xl font-bold'>Hello World!</h1>
//               <p className='text-xl'>Hola mundo!</p>
//               </div>
//           </div><div className='md:columns-2 text-white'  style={{height: '50%'}}>
//             <div className='column'>
//             <h1 className='text-4xl font-bold'>Hello World!</h1>
//               <p className='text-xl'>Hola mundo!</p>
//               </div>
//               <div className='column'>
//               <h1 className='text-4xl font-bold'>Hello World!</h1>
//               <button>
//                 <a href='./index2'>Google</a>
//               </button>
//               <p className='text-xl'>Hola mundo!</p>
//               </div>
//           </div>
//       </main>
//     </>
//   )
// }
