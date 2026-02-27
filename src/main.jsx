import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LoadingProvider } from "./context/LoadingContext";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

   <LoadingProvider>
  <App />
</LoadingProvider>

)
