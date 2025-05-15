
/**
 * API client for communicating with PHP backend
 */
import { devProxyFetch, getApiBaseUrl, isLocalLiveServer } from './dev-proxy';

// Base URL for the PHP backend - dynamically determined based on environment
const API_BASE_URL = getApiBaseUrl();

/**
 * Make an API request to the PHP backend
 * @param endpoint - API endpoint path (without base URL)
 * @param options - Fetch API options
 * @returns Promise with the JSON response
 */
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Add default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Choose which fetch to use based on environment
  const fetchFunc = isLocalLiveServer() ? devProxyFetch : fetch;

  try {
    const response = await fetchFunc(url, {
      ...options,
      headers,
      // Include credentials to handle cookies if needed
      credentials: 'include',
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Convenience wrapper for GET requests
 */
export const get = <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
};

/**
 * Convenience wrapper for POST requests
 */
export const post = <T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * Convenience wrapper for PUT requests
 */
export const put = <T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * Convenience wrapper for DELETE requests
 */
export const del = <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
};

// Example type for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
