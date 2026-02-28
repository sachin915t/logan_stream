import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LoadingProvider } from "./context/LoadingContext";
import './index.css'
import App from './App.jsx'
import { FavoritesProvider } from "./context/FavoritesContext";


createRoot(document.getElementById('root')).render(
<FavoritesProvider>
  <LoadingProvider>
    <App />
  </LoadingProvider>
</FavoritesProvider>

)
