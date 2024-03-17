import React, { useState, useEffect } from 'react';

const Watch = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    let blinkInterval;
    if (currentTime.getSeconds() > 45) {
      blinkInterval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 200); // Blink every 0.2 seconds
    } else {
      setBlink(true); // Always visible before the last 15 seconds
    }

    return () => clearInterval(blinkInterval);
  }, [currentTime]);

  const seconds = currentTime.getSeconds();
  const messagePart1 = seconds <= 45 ? "TRADE NOW!" : "NO MORE TRADES!";
  const messagePart2 = seconds > 45 ? "WAIT FOR RESULTS" : "";
  const messageColor = seconds <= 45 ? "blue" : "red";
  const displayMessage = blink || seconds <= 45;

  // Adjust the font size and y position to make the text bigger and position it higher
  const fontSize = "16"; // Larger font size for better visibility
  const yPos = "50"; // Position towards the upper inside part of the watch for visibility

  return (
    <svg width="400" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="95" stroke="black" strokeWidth="2" fill="white" />
      {/* Second hand */}
      <line x1="100" y1="100" x2={100 + 90 * Math.sin(Math.PI * 2 * seconds / 60)} y2={100 - 90 * Math.cos(Math.PI * 2 * seconds / 60)} stroke="black" strokeWidth="4" />
      <circle cx="100" cy="100" r="3" fill="black" />
      {/* Conditional Message Display */}
      {displayMessage && (
        <>
          <text x="50%" y={yPos} dominantBaseline="middle" textAnchor="middle" fill={messageColor} fontSize={fontSize} fontWeight="bold">
            {messagePart1}
          </text>
          {messagePart2 && (
            <text x="50%" y={parseInt(yPos) + 20} dominantBaseline="middle" textAnchor="middle" fill={messageColor} fontSize={fontSize} fontWeight="bold">
              {messagePart2}
            </text>
          )}
        </>
      )}
    </svg>
  );
};

export default Watch;
