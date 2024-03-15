import React, { useState, useEffect } from 'react';

const Watch = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const secondPart = currentTime.getSeconds();
    if (secondPart > 45) {
      const blinkInterval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 2000); // set to 200

      return () => {
        clearInterval(timerId);
        clearInterval(blinkInterval);
      };
    } else {
      setBlink(false); // Ensure it doesn't blink outside the last 15 seconds
      return () => {
        clearInterval(timerId);
      };
    }
  }, [currentTime]);

  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

  // Format the time string in hh:mm:ss format
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle
        cx="100"
        cy="100"
        r="95"
        stroke="black"
        strokeWidth="2"
        fill={blink ? 'red' : 'white'}
      />
      {/* Second hand */}
      <line
        x1="100"
        y1="100"
        x2={100 + 90 * Math.sin(Math.PI * 2 * seconds / 60)}
        y2={100 - 90 * Math.cos(Math.PI * 2 * seconds / 60)}
        stroke="black"
        strokeWidth="4"
      />
      <circle cx="100" cy="100" r="3" fill="black" />
      {/* Real-time digital display */}
      <text x="50%" y="105%" dominantBaseline="middle" textAnchor="middle" fill="black" fontSize="20">
        {formattedTime}
      </text>
    </svg>
  );
};

export default Watch;
