import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Watch from './watch.jsx'


function useMetaMaskAccount() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  const checkMetaMaskAvailability = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        await fetchBalance(accounts[0]);
      } catch (error) {
        console.error("User denied account access or there's an error", error);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  }, []);

  const fetchBalance = useCallback(async (account) => {
    if (window.ethereum && account) {
      const balanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      const balanceEth = window.web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);
    }
  }, []);

const logout = () => {
  // Resetting the state variables
  setAccount('');
  setBalance('');

  // Optionally, trigger a state refresh in your app if needed
  // This might depend on how your app is structured
};

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        logout();
      } else {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [fetchBalance, logout]);

  return { account, balance, checkMetaMaskAvailability, logout };
}

function App() {
  const { account, balance, checkMetaMaskAvailability, logout } = useMetaMaskAccount();

  return (

   

    <div className="App">
      {/* Wallet Row */}
      <div className="WalletRow">
        <h2>BinBet </h2>
        

        <div>Balance: {balance} ETH</div><div className="WalletInfo" title={account ? "Wallet Address: " + account : "Wallet Disconnected"}>
          Status: {account ? 'Metamask Connected' : 'Metamask Disconnected'}
        </div>
        {account ? (
          <button onClick={logout}>Log Out</button>
        ) : (
          <button onClick={checkMetaMaskAvailability}>Connect Wallet</button>
        )}

      </div>
<Watch />
      {/* Main Content */}
      <div className="MainContent">
        <div className="ChartSection">
          {/* Trading Chart */}
           <iframe
    src="https://www.coindesk.com/embedded-chart/wjtPzLtMrbmpj"
    frameBorder="0"
    scrolling="no"
    title="Embedded Bitcoin Price Chart"
    style={{ width: '100%', height: '500px' }} // Adjust height as needed
  ></iframe>
        </div>
        

      </div>
<div className="TradingSection">
          {/* Trading Buttons */}
		<button className="TradeButton BuyButton">Buy ↑</button>

		<button className="TradeButton SellButton">Sell ↓</button>
        </div>

    </div>

  );
}
export default App;
