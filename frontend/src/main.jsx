import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster
  position="top-right"
  toastOptions={{
    duration: 2500,
    style: {
      background: '#1c1914',
      color: '#e8d5c4',
      border: '1px solid #3a2e24',
      borderRadius: '12px',
      padding: '12px 16px',
      fontSize: '13px',
      fontFamily: "'Sora', sans-serif",
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    },
    success: {
      iconTheme: {
        primary: '#5a8a6a',
        secondary: '#1c1914',
      },
    },
    error: {
      iconTheme: {
        primary: '#b85a5a',
        secondary: '#1c1914',
      },
    },
  }}
/>
    <App />
  </BrowserRouter>
);   



