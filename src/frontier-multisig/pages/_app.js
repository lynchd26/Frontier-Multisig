import '../styles/globals.css'
import Link from 'next/link'
import Web3Modal from 'web3modal'
// import axios from 'axios'
import { ethers } from 'ethers'
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

  // create a const for the sidebar
  const [walletButtonText, setWalletButtonText] = useState('Connect Wallet')

  // Function to toggle sidebar



  let accountAddress = ''
  // Function to connect ethereum wallet and get the account address
  const connectWallet = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "YOUR_INFURA_ID", // required
        },
      },
    };
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    accountAddress = accounts[0]
    if (accountAddress) {
      setWalletButtonText(accountAddress)
    } else {
      setWalletButtonText('Failed to load wallet address')
    }
    console.log(accountAddress)
  }

  function main(){
    if (accountAddress != ''){
      setWalletButtonText(accountAddress)
    }
  }

  main()


  return (

    <div>


      <header class="fixed h-16 bg-indigo-500 shadow-md z-50 w-full px-5 py-2 flex justify-between items-center">
        <router-link to="/" class="text-2xl pl-10 text-white">Fontier Multisig</router-link>
        <div className="absolute right-0 overflow-y-auto rounded-lg border-4 border-r-8 border-indigo-500/25 shadow-xl bg-indigo-500 dark:bg-gray-800">            
              <button className="space-y-2 justify-center items-center"
                    onClick={() => connectWallet()}>
                    <a href="#" className="flex items-center pl-6 pr-10 text-base transition duration-75 font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">                     
                      <span className="ml-3 mr-3 ">{walletButtonText}</span>
                    </a>
              </button>
        </div>
      </header>
    
    <div className='flex items-center pt-16 bg-gradient-to-r from-gray-100 via-gray-400 to-white dark:bg-gradient-to-r dark:from-black dark:via-zinc-800 to-black'>

        <button on data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <span className="sr-only">Open sidebar</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>

        <aside id="default-sidebar" className="fixed pl-10 pt-10 pb-10 z-40 w-1/5 h-screen transition-transform -translate-x-full sm:translate-x-0 align" aria-label="Sidebar">
          <div className="items-center px-3 py-4 overflow-y-auto rounded-lg p-4 border-4 border-indigo-500/25 shadow-xl bg-indigo-500 dark:bg-gray-800">            
              <ul className="space-y-2 justify-center items-center">
                <li>
                    <a href="#" className="flex items-center p-2 text-base transition duration-75 font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                      <svg aria-hidden="true" className="w-6 h-6 text-gray-50 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                      <span className="ml-3 mr-3 ">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                      <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-50 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                      <span className="flex-1 ml-3 whitespace-nowrap">Pending Tx</span>
                      <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                      <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-50 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
                      <span className="flex-1 ml-3 whitespace-nowrap">Analytics</span>
                      {/* <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
                    </a>
                </li>
              </ul>
          </div>
        </aside>
      
      <div className="p-10 sm:ml-64 w-4/5 rounded-lg">
        <Component {...pageProps} />
      </div>

    </div>
    </div>
    
  )
  
}

export default MyApp