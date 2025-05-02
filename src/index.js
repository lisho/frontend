// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Estilos globales base
import App from './App';
// Quita la importación de reportWebVitals
// Quita la llamada a reportWebVitals()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);