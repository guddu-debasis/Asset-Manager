import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1f1e1c',
            color: '#f0ede8',
            border: '1px solid #333230',
            borderRadius: '10px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: { primary: '#4caf7d', secondary: '#0f0e0d' },
          },
          error: {
            iconTheme: { primary: '#e05c5c', secondary: '#0f0e0d' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
