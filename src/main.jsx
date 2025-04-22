import { StrictMode } from 'react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import './styles/leaflet.css';
import { ChakraProvider } from '@chakra-ui/react'; // Chakra UI for UI styling
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // React Query for data fetching and caching
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Devtools for React Query debugging

registerSW();

// Configuring the React Query client with caching and stale time options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cached data persists for 10 minutes
    },
  },
});

/**
 * AppWithQueryClient Component
 * 
 * This component wraps the main `App` with the `QueryClientProvider`, enabling
 * React Query for data fetching and caching.
 * It also includes the `ReactQueryDevtools` for debugging.
 * 
 * @returns {JSX.Element} The application wrapped with React Query functionality.
 */
function AppWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} /> {/* Devtools for debugging */}
    </QueryClientProvider>
  );
}

// Rendering the application inside a StrictMode wrapper for better debugging
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Enables routing for the app */}
      <ChakraProvider> {/* Provides Chakra UI theme and styling support */}
        <AppWithQueryClient /> {/* Renders the app with React Query support */}
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
