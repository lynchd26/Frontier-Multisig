import '../styles/globals.css'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'

import WalletSelect from './WalletSelect'

import {
  frontierAddress
} from '../../config.js'

import Frontier from '../../artifacts/contracts/Frontier.sol/Frontier.json'


function MyApp({ Component, pageProps }) {
  
  const [walletButtonText, setWalletButtonText] = useState('Connect Wallet')
  const [currentPage, setCurrentPage] = useState('page1');
  const [userWallets, setUserWallets] = useState([]);
  const [balance, setBalance] = useState("0");
  const [activeWallet, setActiveWallet] = useState(null);
  const [txCount, setTxCount] = useState(0);

  const switchToPage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchBalance();
  }, [activeWallet]);
  // const connectWallet = () => {
  //   setWalletButtonText('Wallet Connected')
  // }

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
      // setErrorMessage("Error fetching wallet balance: " + error.message);
    }
  }

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
      // setErrorMessage('Error creating a new wallet: ' + error.message);
    }
  }

  async function main(){
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    var accountAddress = window.ethereum.selectedAddress;
    setWalletButtonText(accountAddress)
  }

  useEffect(() => {
    viewMyWallets();
  }, []);

  main()


  return (
    // <div style={{ backgroundImage: `url(${require('./media/mesh-gradient(1).png')})`, backgroundSize: 'cover' }}>
    <div className='bg-gray-300'>
      
      <header class="fixed h-16 bg-indigo-500 shadow-md z-50 w-full pl-5 py-2 flex justify-between items-center border-b-2 border-blue-300">
        <router-link to="/" class="text-2xl pl-10 text-white font-bold uppercase tracking-wider">Frontier Multisig</router-link>
        <div class="h-16 flex top-0 bg-indigo-600 rounded-l-full mb-1 pl-4 items-center space-x-3 ">
          <span className={`rounded-full w-3 h-3 animate-pulse ${activeWallet ? 'bg-green-400' : 'bg-red-400'}`}></span>
          <WalletSelect userWallets={userWallets} activeWallet={activeWallet} setActiveWallet={setActiveWallet}/>
          <button
            onClick={() => createNewWallet()}
            className="bg-white text-blue-500 h-9 w-9 rounded shadow"
          >
          <span className="text-2xl font-bold">+</span>
          </button>

          <div className='h-16 end-0 top-0 bg-indigo-700 w-40 mb-1 pt-1 rounded-l-full text-gray-200 flex items-center'>
            <p className='mx-auto font-bold'>ETH: {balance}</p>
          </div>


        </div>
      </header>



    
    <div className="flex items-center pt-16" >

        <button on data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <span className="sr-only">Open sidebar</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>

        <aside id="default-sidebar" className="fixed flex h-auto pl-10 pt-10 pb-10 z-40 w-1/5 transition-transform -translate-x-full sm:translate-x-0 align" aria-label="Sidebar">
          <div className="items-center px-3 py-4 overflow-y-auto rounded-lg p-4 border-4 border-indigo-500/25 shadow-xl bg-indigo-500 dark:bg-gray-800">            
              <ul className="space-y-2 justify-center items-center">
                <li>
                    <a href="#" className="flex items-center p-2 text-base transition duration-75 font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                      <span onClick={() => switchToPage('page1')} className="ml-3 mr-3 ">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                      <span onClick={() => switchToPage('page2')} className="flex-1 ml-3 whitespace-nowrap">Pending Tx</span>
                      {txCount > 0 && (
                        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                          {txCount}
                        </span>
                      )}

                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                      <span onClick={() => switchToPage('page3')} className="flex-1 ml-3 whitespace-nowrap">Analytics</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                      <span onClick={() => switchToPage('page4')} className="flex-1 ml-3 whitespace-nowrap">Wallet Settings</span>
                    </a>
                </li>
              </ul>
          </div>
        </aside>
      
      <div className="p-10 sm:ml-64 w-4/5 rounded-lg">
        <Component {...pageProps} currentPage={currentPage} activeWallet={activeWallet} setActiveWallet={activeWallet} setBalance={setBalance} txCount={txCount} setTxCount={setTxCount} />
      </div>

    </div>
    </div>
    
  )
  
}

export default MyApp