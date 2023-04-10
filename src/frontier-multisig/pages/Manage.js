import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import FrontierMultisig from '../../artifacts/contracts/FrontierMultisig.sol/FrontierMultisig.json'

function Manage( {activeWallet} ) {

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [targetAddress, setTargetAddress] = useState("");
    const [owners, setOwners] = useState([]);
    const [approvalsRequired, setApprovalsRequired] = useState('');
    const [displayedApprovals, setDisplayedApprovals] = useState(1);
    const [denialsRequired, setDenialsRequired] = useState('');
    const [displayedDenials, setDisplayedDenials] = useState(1);
  

    async function addOwner(newOwner) {
        if (!activeWallet) {
          alert("Please select an active wallet first.");
          return;
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
        console.log("Adding owner:", newOwner);
        try {
          const tx = await frontierMultisigContract.addOwner(newOwner);
          const receipt = await tx.wait();
          console.log("Add owner transaction receipt:", receipt);
          fetchOwners();
        } catch (error) {
          console.error("Error adding owner:", error.message);
        }
      }
      
      async function removeOwner(ownerToRemove) {
        if (!activeWallet) {
          alert("Please select an active wallet first.");
          return;
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
        try {
          const tx = await frontierMultisigContract.removeOwner(ownerToRemove);
          const receipt = await tx.wait();
          console.log("Remove owner transaction receipt:", receipt);
          fetchOwners();
        } catch (error) {
          console.error("Error removing owner:", error.message);
        }
      }
    
      async function fetchOwners() {
        if (!activeWallet) {
          alert("Please select an active wallet first.");
          return;
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
        try {
          const owners = await frontierMultisigContract.getOwners();
          setOwners(owners);
        }
        catch (error) {
          console.error("Error fetching owners:", error.message);
        }
      }
    
    async function changeApprovalsRequired() {
        if (!activeWallet) {
          alert("Please select an active wallet first.");
          return;
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
        try {
          const tx = await frontierMultisigContract.changeApprovalsRequired(approvalsRequired);
          const receipt = await tx.wait();
          console.log("Change approvals required transaction receipt:", receipt);
          fetchRequiredApprovals();
        } catch (error) {
          console.error("Error changing approvals required:", error.message);
        }
      }
    
      async function changeDenialsRequired() {
        if (!activeWallet) {
          alert("Please select an active wallet first.");
          return;
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
        try {
          const tx = await frontierMultisigContract.changeDenialsRequired(denialsRequired);
          const receipt = await tx.wait();
          console.log("Change denials required transaction receipt:", receipt);
          fetchRequiredDenials();
        } catch (error) {
          console.error("Error changing denials required:", error.message);
        }
      }


  async function fetchRequiredApprovals() {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const approvalsRequired = await frontierMultisigContract.getApprovalsRequired();
      console.log("Approvals required:", approvalsRequired);
      setApprovalsRequired(approvalsRequired);
      setDisplayedApprovals(approvalsRequired);
    }
    catch (error) {
      console.error("Error fetching required approvals:", error.message);
    }
  }

  async function fetchRequiredDenials() {
    if (!activeWallet) {
      alert("Please select an active wallet first.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const frontierMultisigContract = new ethers.Contract(activeWallet, FrontierMultisig.abi, signer);
    try {
      const denialsRequired = await frontierMultisigContract.getDenialsRequired();
      setDenialsRequired(denialsRequired);
    }
    catch (error) {
      console.error("Error fetching required denials:", error.message);
    }
  }

      
    const handleRefreshClick = async () => {
      setIsRefreshing(true);
      const fetchPromise1 = fetchOwners();
      const fetchPromise2 = fetchRequiredApprovals();
      const fetchPromise3 = fetchRequiredDenials();
    
      const minSpinTime = 1000;
    
      const spinTimeout = new Promise((resolve) => {
        setTimeout(resolve, minSpinTime);
      });
    
      await Promise.all([fetchPromise1, fetchPromise2, fetchPromise3, spinTimeout]);
      setIsRefreshing(false);
    };
    
    useEffect(() => {
        handleRefreshClick();
    }, [activeWallet]);


    return (
        <div className="mx-auto w-full p-6">
            <div className="flex justify-between items-center mb-5">

                <h2 className="text-2xl text-gray-200 font-semibold mb-5">Manage Wallet</h2>
                <button
                    onClick={handleRefreshClick}
                    className="flex items-center justify-center px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-600"
                >
                    <FontAwesomeIcon icon={faSync} className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
        <div className="bg-white rounded-lg shadow p-4 mb-5">
          <input
            type="text"
            id="owner address"
            className="w-full px-2 py-1 rounded-md border border-gray-400 mb-4 text-gray-800"
            style={{ maxWidth: "400px" }}
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => addOwner(targetAddress)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add owner
            </button>
            <button
              onClick={() => removeOwner(targetAddress)}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Remove owner
            </button>
          </div>
        </div>
      
        <div className="bg-white rounded-lg shadow mb-5">
          <ul className="divide-y divide-gray-200">
            <li className="p-4">
              <h3 className="text-gray-800 font-semibold">Owners</h3>
            </li>
            {owners.map((owner, index) => (
              <li key={index} className="p-4">
                <div className="text-gray-800">
                  <p>{owner}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      
        <div className="flex space-x-4">
          <div className="bg-white rounded-lg shadow p-4 w-1/2">
            <h3 className="text-gray-800 font-semibold mb-4">
              Required Approvals: {displayedApprovals.toString()}
            </h3>
            <input
              type="integer"
              id="approvals required"
              className="w-full p-2 rounded-md border border-gray-400 mb-4 text-gray-800 mr-2"
              style={{ maxWidth: "400px" }}
              value={approvalsRequired}
              onChange={(e) => setApprovalsRequired(e.target.value)}
            />
            <button
              onClick={() => changeApprovalsRequired(approvalsRequired)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Change
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 w-1/2">
            <h3 className="text-gray-800 font-semibold mb-4">
              Required Denials: {displayedDenials.toString()}
            </h3>
            <input
              type="integer"
              id="denials required"
              className="w-full p-2 rounded-md border border-gray-400 mb-4 text-gray-800 mr-2"
              style={{ maxWidth: "400px" }}
              value={denialsRequired}
              onChange={(e) => setDenialsRequired(e.target.value)}
            />
             <button
             onClick={() => changeDenialsRequired(denialsRequired)}
             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
           >
             Change
           </button>
         </div>
       </div>
     </div>
    );
}

export default Manage;