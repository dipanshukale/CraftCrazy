// API Configuration with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://craftcrazy-1.onrender.com/';

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure base URL ends with / and endpoint doesn't start with /
  return `${API_BASE_URL}${cleanEndpoint}`;
};

