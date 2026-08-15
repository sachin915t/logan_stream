import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LoadingProvider } from "./context/LoadingContext";
import "./index.css";
import App from "./App.jsx";
import { FavoritesProvider } from "./context/FavoritesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 30,    // cache 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  </StrictMode>
);