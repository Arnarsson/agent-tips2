import { toast } from 'sonner';
import { AppError } from './error-utils';

export class NetworkError extends AppError {
  status: number;
  url: string;
  
  constructor(message: string, status: number, url: string) {
    super(message, 'NetworkError');
    this.status = status;
    this.url = url;
  }
}

/**
 * Handles network errors with appropriate user feedback
 * @param error The error object to handle
 * @param fallbackMessage A fallback message if the error is not a NetworkError
 */
export function handleNetworkError(error: unknown, fallbackMessage = 'A network error occurred'): void {
  console.error('Network error:', error);
  
  if (error instanceof NetworkError) {
    // Handle specific HTTP status codes
    switch (error.status) {
      case 404:
        toast.error(`Resource not found: ${error.url}`);
        break;
      case 500:
        toast.error(`Server error occurred. Please try again later.`);
        break;
      case 401:
        toast.error('Authentication required. Please log in.');
        break;
      case 403:
        toast.error('You do not have permission to access this resource.');
        break;
      default:
        toast.error(`${error.message} (Status: ${error.status})`);
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(fallbackMessage);
  }
}

/**
 * Enhanced fetch wrapper that handles network errors
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns The fetch response
 */
export async function enhancedFetch(url: string, options?: RequestInit): Promise<Response> {
  try {
    // Check for network connectivity
    if (!navigator.onLine) {
      throw new NetworkError('You are offline. Please check your internet connection.', 0, url);
    }
    
    const response = await fetch(url, options);
    
    // Handle HTTP error responses
    if (!response.ok) {
      throw new NetworkError(
        `Request failed with status: ${response.status}`,
        response.status,
        url
      );
    }
    
    return response;
  } catch (error) {
    // Handle fetch errors (network issues, CORS, etc.)
    if (error instanceof TypeError) {
      throw new NetworkError('Network request failed. This could be due to CORS or network connectivity issues.', 0, url);
    }
    
    // Re-throw NetworkError instances
    if (error instanceof NetworkError) {
      throw error;
    }
    
    // Handle other errors
    throw new NetworkError(
      error instanceof Error ? error.message : 'Unknown network error',
      0,
      url
    );
  }
}

/**
 * Checks if the current port is different from the expected port
 * and provides guidance if there's a mismatch
 */
export function checkPortMismatch(expectedPort: number = 3000): void {
  const currentPort = window.location.port;
  
  if (currentPort && currentPort !== expectedPort.toString()) {
    console.warn(`Port mismatch detected: You're accessing the application on port ${currentPort}, but the server is expecting port ${expectedPort}.`);
    
    toast.warning(
      `Port mismatch detected. Try accessing the application at http://localhost:${expectedPort}`,
      {
        duration: 10000,
        action: {
          label: 'Open Correct URL',
          onClick: () => {
            const newUrl = window.location.href.replace(
              `:${currentPort}`,
              `:${expectedPort}`
            );
            window.location.href = newUrl;
          }
        }
      }
    );
  }
} 