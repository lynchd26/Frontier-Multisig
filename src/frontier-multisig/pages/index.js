
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


async function viewMyWallets() {
  // Call the getWallets() function on the Frontier contract
  const wallets = await frontierContract.getWallets();
  setWalletsListText(wallets.join(', '));
  console.log('Wallets:', wallets);

}

async function createNewWallet() {
  // Connect to the Ethereum network using MetaMask
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Create an instance of the Ethereum provider using the window.ethereum object
  const provider = new ethers.BrowserProvider(window.ethereum);
  // Create a new instance of the Frontier contract
  const signer = await provider.getSigner();
  const frontierContract = new ethers.Contract(frontierAddress, Frontier.abi, signer);

  // Call the createWallet() function on the Frontier contract
  const wallet = await frontierContract.createWallet();
  console.log('New wallet address:', wallet);
}


function IndexPage({ currentPage }) {

  const [walletsList, setWalletsListText] = useState('No wallets found');



  return (
   <main className={`${styles.main} rounded-lg`}>
      {currentPage === 'page1' ? (
        
       
        <div className='md:columns-2 text-white' style={{height: '50%'}}>
          <div className='column justify-center items-center'>
            <button onClick={() => createNewWallet()}>Create New Wallet</button>
          </div>
          <div className='column justify-center items-center'>
            <button onClick={() => viewMyWallets()}>View My Wallets</button>
            <p>{walletsList}</p>
          </div>
        </div>

      ) : null}
      {currentPage === 'page2' ? (

        <div className='bg-white'>
          <p>This is the content of page 2.</p>
        </div>

      ) : null}
      {currentPage === 'page3' ? (
        
        <div className='bg-red-500'>
          <p>This is the content of page 3.</p>
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
