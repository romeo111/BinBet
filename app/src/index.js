import React from 'react';
import ReactDOM from 'react-dom'; // Corrected import statement
import './index.css';
import App from './binbet';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter basename="/Binbet">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
