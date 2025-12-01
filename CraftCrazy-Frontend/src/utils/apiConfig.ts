// API Configuration with fallback
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // Ensure it ends with a slash
    return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
  }
  // Fallback URL
  return 'https://craftcrazy-2.onrender.com/';
};

export const API_BASE_URL = getBaseUrl();

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure base URL ends with / and endpoint doesn't start with /
  return `${API_BASE_URL}${cleanEndpoint}`;
};

