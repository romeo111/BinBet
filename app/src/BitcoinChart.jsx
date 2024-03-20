import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const BitcoinChart = () => {
  const [btcData, setBtcData] = useState([]);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
          headers: {
            'X-CMC_PRO_API_KEY': '9cf8fa74-4e78-4874-bcd9-f4d7d7594df0'
          },
          params: {
            start: 1,
            limit: 10,
            convert: 'USD'
          }
        });

        const btcData = response.data.data.filter(crypto => crypto.symbol === 'BTC');
        // Assume each data point is an object { timestamp: '...', price: '...' }
        const formattedData = btcData.map(data => ({
          timestamp: data.quote.USD.last_updated, // Adapt based on actual API response structure
          price: data.quote.USD.price // Adapt based on actual API response structure
        }));

        setBtcData(formattedData);
      } catch (error) {
        console.error("Error fetching Bitcoin data:", error);
      }
    };

    fetchBitcoinData();
  }, []);

  const data = {
    labels: btcData.map(dataPoint => dataPoint.timestamp),
    datasets: [{
      label: 'BTC Price',
      data: btcData.map(dataPoint => dataPoint.price),
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    }],
  };

  return <div>
    <h2>Bitcoin Price Chart</h2>
    <Line data={data} />
  </div>;
};

export default BitcoinChart;
