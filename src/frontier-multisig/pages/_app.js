import '../styles/globals.css'
import { ethers } from 'ethers'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

  // create a const for the sidebar
  const [walletButtonText, setWalletButtonText] = useState('Connect Wallet')
  const [currentPage, setCurrentPage] = useState('page1');

  const switchToPage = (page) => {
    setCurrentPage(page);
  };

  const connectWallet = () => {
    setWalletButtonText('Wallet Connected')
  }

  async function main(){
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    var accountAddress = window.ethereum.selectedAddress;
    setWalletButtonText(accountAddress)
  }

  main()


  return (
    // <div style={{ backgroundImage: `url(${require('./media/mesh-gradient(1).png')})`, backgroundSize: 'cover' }}>
    <div className='bg-gray-300'>
      
      <header class="fixed h-16 bg-indigo-500 shadow-md z-50 w-full px-5 py-2 flex justify-between items-center border-b-2 border-blue-300">
        <router-link to="/" class="text-2xl pl-10 text-white font-bold uppercase tracking-wider">Frontier Multisig</router-link>
        <div class="flex items-center space-x-3">
          <button class="flex items-center justify-center space-x-1 text-base font-medium text-gray-100 rounded-md hover:bg-blue-400 py-2 px-3 border border-transparent transition-colors duration-300" onClick={() => connectWallet()}>
            <span class="bg-green-400 rounded-full w-3 h-3 animate-pulse"></span>
            <span>{walletButtonText}</span>
          </button>
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
                      <svg aria-hidden="true" className="w-6 h-6 text-gray-50 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                      <span onClick={() => switchToPage('page1')} className="ml-3 mr-3 ">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                      <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-50 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                      <span onClick={() => switchToPage('page2')} className="flex-1 ml-3 whitespace-nowrap">Pending Tx</span>
                      <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                      <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-50 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
                      <span onClick={() => switchToPage('page3')} className="flex-1 ml-3 whitespace-nowrap">Analytics</span>
                      {/* <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700">
                      <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-50 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
                      <span onClick={() => switchToPage('page4')} className="flex-1 ml-3 whitespace-nowrap">Create tx</span>
                      {/* <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
                    </a>
                </li>
              </ul>
          </div>
        </aside>
      
      <div className="p-10 sm:ml-64 w-4/5 rounded-lg">
        <Component {...pageProps} currentPage={currentPage} />
      </div>

    </div>
    </div>
    
  )
  
}

export default MyApp