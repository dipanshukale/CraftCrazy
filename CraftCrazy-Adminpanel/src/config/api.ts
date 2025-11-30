// API Configuration
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://craftcrazy-1.onrender.com';
export const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || 'https://craftcrazy-1.onrender.com';

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure base URL doesn't have trailing slash
  const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${cleanBaseUrl}/${cleanEndpoint}`;
};

