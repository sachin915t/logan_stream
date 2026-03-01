import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LoadingProvider } from "./context/LoadingContext";
import './index.css'
import App from './App.jsx'
import { FavoritesProvider } from "./context/FavoritesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
   <StrictMode>
<QueryClientProvider client={queryClient}>
  <FavoritesProvider>
  <LoadingProvider>
    <App />
  </LoadingProvider>
</FavoritesProvider>
</QueryClientProvider>
</StrictMode>
)
