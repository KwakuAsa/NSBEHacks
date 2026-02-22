import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma/css/bulma.min.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import Onboarding from './Onboarding.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding firstName="Jane" />} />        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)