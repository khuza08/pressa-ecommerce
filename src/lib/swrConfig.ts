import { Cache } from 'swr';

// Default SWR configuration for the tshirt store
export const swrConfig = {
  refreshInterval: 60000, // Refresh every minute
  errorRetryInterval: 5000, // Retry after 5 seconds on error
  errorRetryCount: 3, // Max 3 retries
  revalidateOnFocus: false, // Don't revalidate on window focus (to reduce API calls)
  revalidateOnReconnect: true, // Revalidate when network reconnects
  shouldRetryOnError: true, // Retry on error
  dedupingInterval: 2000, // Deduping interval to avoid multiple requests
  keepPreviousData: true, // Keep previous data while loading new data
  fallback: {}, // Default fallback data
};

// Custom cache implementation if needed
export const swrCache: Cache = new Map();