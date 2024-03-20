import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './binbet';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);

// Remove ReactDOM.render call

// You can keep other code as it is

reportWebVitals();