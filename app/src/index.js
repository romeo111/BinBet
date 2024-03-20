import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client instead of react-dom
import './index.css';
import App from './binbet';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';


// Use createRoot instead of ReactDOM.render
const root = createRoot(document.getElementById('root')); // Use createRoot instead of ReactDOM.createRoot
root.render(
  <BrowserRouter basename="/app">
    <App />
  </BrowserRouter>
);



reportWebVitals();
