import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [timer, setTimer] = useState(60); // Timer for the trade game (60 seconds)
  const [stakeTimer, setStakeTimer] = useState(45); // Timer for making stakes (45 seconds)
  const [volume, setVolume] = useState(5); // Initial volume trade set to 5%

  useEffect(() => {
    const tradeTimer = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    const stakeTimer = setInterval(() => {
      setStakeTimer((prevStakeTimer) => prevStakeTimer - 1);
    }, 1000);

    // Cleanup intervals on unmount
    return () => {
      clearInterval(tradeTimer);
      clearInterval(stakeTimer);
    };
  }, []);

  return (
    <div className="BinBet" style={{ backgroundColor: 'darkgreen', textAlign: 'center' }}>
      <header className="BinBet-header">
        <h1 style={{ fontSize: '4em', color: 'white' }}>BinBet</h1>
        <p>
          Trade Timer: {timer} seconds
          <br />
          Stake Timer: {stakeTimer} seconds
          <br />
          <input
            type="range"
            min={5}
            max={100}
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
          <br />
          Volume Trade: {volume}%
        </p>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

