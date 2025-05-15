
/**
 * Development proxy for handling CORS during local development
 * This file is only used during local development and not in production
 */

const DEV_MODE = import.meta.env.DEV;
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

/**
 * Wraps fetch with a CORS proxy for local development
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Promise with response
 */
export const devProxyFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Only use proxy in development mode
  if (DEV_MODE) {
    const proxyUrl = url.startsWith('http') ? `${PROXY_URL}${url}` : url;
    console.log(`[Dev Proxy] Fetching: ${proxyUrl}`);
    
    return fetch(proxyUrl, {
      ...options,
      headers: {
        ...options.headers,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
  }
  
  // In production, use normal fetch
  return fetch(url, options);
};

/**
 * Check if we're running in a local development environment through Live Server
 */
export const isLocalLiveServer = (): boolean => {
  return window.location.hostname === '127.0.0.1' || 
         window.location.hostname === 'localhost' || 
         window.location.port === '5500';
};

/**
 * Returns the appropriate API base URL based on environment
 */
export const getApiBaseUrl = (): string => {
  if (isLocalLiveServer()) {
    // When running on Live Server locally
    return 'http://localhost:8000/api';
  } else if (DEV_MODE) {
    // When running through Vite dev server
    return 'http://localhost:8000/api';
  } else {
    // Production environment
    return '/api';
  }
};
