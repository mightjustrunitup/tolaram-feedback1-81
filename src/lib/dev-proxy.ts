
/**
 * Development proxy for handling CORS during local development
 * Updated for WAMP server compatibility
 */

const DEV_MODE = import.meta.env.DEV;

/**
 * Check if we're running in a local development environment
 */
export const isLocalLiveServer = (): boolean => {
  return window.location.hostname === '127.0.0.1' || 
         (window.location.hostname === 'localhost' && window.location.port === '5500');
};

/**
 * Check if we're running on WAMP server
 */
export const isWampServer = (): boolean => {
  return window.location.hostname === 'localhost' && 
         (window.location.port === '80' || window.location.port === '' || !window.location.port);
};

/**
 * Check if we're running through Vite dev server
 */
export const isViteDev = (): boolean => {
  return DEV_MODE && !isWampServer() && !isLocalLiveServer();
};

/**
 * Returns the appropriate API base URL based on environment
 */
export const getApiBaseUrl = (): string => {
  if (isWampServer()) {
    // When running on WAMP server - use relative path
    return '/api';
  } else if (isLocalLiveServer()) {
    // When running on Live Server locally - assume WAMP is on port 80
    return 'http://localhost/api';
  } else if (isViteDev()) {
    // When running through Vite dev server - assume WAMP is running
    return 'http://localhost/api';
  } else {
    // Production environment
    return '/api';
  }
};

/**
 * Wraps fetch with proper configuration for different environments
 */
export const devProxyFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  console.log(`[Dev Proxy] Environment: WAMP=${isWampServer()}, LiveServer=${isLocalLiveServer()}, Vite=${isViteDev()}`);
  console.log(`[Dev Proxy] Fetching: ${url}`);
  
  // Add timeout to prevent hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[Dev Proxy] Fetch error:', error);
    throw error;
  }
};
