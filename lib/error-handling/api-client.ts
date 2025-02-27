import { handleAsyncOperation, createErrorFromResponse, AppError, ErrorType } from './error-utils';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Enhanced fetch function with error handling, timeout, and performance monitoring
 */
export async function apiFetch<T>(
  url: string, 
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const { result, error } = await handleAsyncOperation(
      `API Fetch: ${url}`,
      async () => {
        try {
          const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
          });
          
          if (!response.ok) {
            throw createErrorFromResponse(response);
          }
          
          // For empty responses (e.g. 204 No Content)
          if (response.status === 204) {
            return {} as T;
          }
          
          // Check content type and parse accordingly
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json() as T;
          } else {
            return await response.text() as unknown as T;
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            throw new AppError(
              `Request timed out after ${timeout}ms`, 
              ErrorType.NETWORK
            );
          }
          throw error;
        }
      }
    );
    
    if (error) {
      throw error;
    }
    
    return result as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Simplified API wrapper with common HTTP methods
 */
export const API = {
  get: <T>(url: string, options?: FetchOptions) => 
    apiFetch<T>(url, { ...options, method: 'GET' }),
    
  post: <T>(url: string, data?: any, options?: FetchOptions) => 
    apiFetch<T>(url, { 
      ...options, 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T>(url: string, data?: any, options?: FetchOptions) => 
    apiFetch<T>(url, { 
      ...options, 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T>(url: string, options?: FetchOptions) => 
    apiFetch<T>(url, { ...options, method: 'DELETE' }),
    
  patch: <T>(url: string, data?: any, options?: FetchOptions) => 
    apiFetch<T>(url, { 
      ...options, 
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),
}; 