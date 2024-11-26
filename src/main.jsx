import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { APIProvider } from './contexts/Apicontext.jsx';  // Import APIProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider>
    <App />
    </APIProvider>
  </StrictMode>,
)
