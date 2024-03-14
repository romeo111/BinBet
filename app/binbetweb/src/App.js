import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState('');

  useEffect(() => {
    const checkMetaMaskAvailability = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Accounts now exposed, set the first account as the user's account
          setAccount(accounts[0]);
        } catch (error) {
          console.error("User denied account access or there's an error", error);
        }
      } else {
        console.log('MetaMask is not installed!');
      }
    };

    checkMetaMaskAvailability();

    // Handling account change
    window.ethereum?.on('accountsChanged', (accounts) => {
      setAccount(accounts[0]);
    });

    // Handling chain change (refresh the page to reload in case of chain change)
    window.ethereum?.on('chainChanged', (chainId) => {
      window.location.reload();
    });

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        BinBet
      </header>
      <div className="Wallet">
        {account ? (
          <p>Connected Wallet: {account}</p>
        ) : (
          <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
            Connect Wallet
          </button>
        )}
      </div>
 <div className="Buttons">
        <button className="BuyButton">Buy</button>
        <button className="SellButton">Sell</button>
      </div>
      <div className="BitcoinPrice" style={{ width: '100%', height: 'fit-content', aspectRatio: '1200 / 630' }}>
        <iframe
          style={{ width: '100%', height: '100%', aspectRatio: '1200 / 630' }}
          src="https://www.coindesk.com/embedded-chart/wjtPzLtMrbmpj"
          frameBorder="0"
          scrolling="no"
	title="Embedded Bitcoin Price Chart"
        ></iframe>
      </div>
     
    </div>
  );
}

export default App;
