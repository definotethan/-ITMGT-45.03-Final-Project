// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 1. IMPORT BrowserRouter from react-router-dom
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. WRAP <App /> in <BrowserRouter> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)