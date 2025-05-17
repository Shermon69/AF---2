import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithRouter from './App'; // Updated to import AppWithRouter
import reportWebVitals from './reportWebVitals';

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);

// Performance measurement (optional)
reportWebVitals();