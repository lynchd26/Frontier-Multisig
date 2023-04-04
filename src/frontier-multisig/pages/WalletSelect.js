import Select from 'react-select';
import { useState } from 'react';
import { ethers } from 'ethers';

function WalletSelect({ userWallets, setActiveWallet, setBalance }) {
  const [selectedOption, setSelectedOption] = useState(null);
  
  function parseUnitsBack(wei, decimals = 18) {
    const weiBigInt = BigInt(wei);
    const factorBigInt = BigInt(10) ** BigInt(decimals);
    const etherBigInt = weiBigInt / factorBigInt;
    const remainderBigInt = weiBigInt % factorBigInt;
    const ether = Number(etherBigInt) + Number(remainderBigInt) / Number(factorBigInt);
  
    return ether;
  }  

  async function fetchBalance() {
    if (!selectedOption) {
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const walletBalance = await provider.getBalance(selectedOption.value);
      setBalance(parseUnitsBack(walletBalance));
    } catch (error) {
      console.log("Error fetching wallet balance: " + error.message);
    }
  }

  const options = userWallets.map((wallet) => ({
    value: wallet,
    label: wallet
  }));

  const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#4F46E5',
        borderColor: state.isFocused ? '#4F46E5' : '#4F46E5',
        '&:hover': {
            borderColor: '#4F46E5'
        },
        width: '450px'
    }),      
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4F46E5' : null,
      '&:hover': {
        backgroundColor: '#4F46E5',
        color: '#fff'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    })
  };

  return (
    <Select
      options={options}
      styles={customStyles}
      value={selectedOption}
      onChange={(option) => {
        setSelectedOption(option);
        setActiveWallet(option.value);
        fetchBalance();
      }}
      placeholder="Select a wallet"
      isClearable={false}
      isSearchable={false}
    />
  );
}

export default WalletSelect;
