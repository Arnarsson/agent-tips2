import { enhancedFetch, handleNetworkError, NetworkError } from './error-handling/network-error-handler';
import { PerformanceMonitor } from './error-handling/error-utils';

// Performance monitor instance for API calls
const apiPerformanceMonitor = new PerformanceMonitor();

/**
 * API utility for making fetch requests with enhanced error handling and performance monitoring
 */
export const API = {
  /**
   * Make a GET request
   * @param url The URL to fetch
   * @param options Additional fetch options
   * @returns The parsed JSON response
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const operationName = `GET ${url}`;
    apiPerformanceMonitor.startOperation(operationName);
    
    try {
      const response = await enhancedFetch(url, {
        method: 'GET',
        ...options,
      });
      
      const data = await response.json() as T;
      apiPerformanceMonitor.endOperation(operationName, true);
      return data;
    } catch (error) {
      apiPerformanceMonitor.endOperation(operationName, false);
      handleNetworkError(error, `Failed to fetch data from ${url}`);
      throw error;
    }
  },
  
  /**
   * Make a POST request
   * @param url The URL to fetch
   * @param data The data to send
   * @param options Additional fetch options
   * @returns The parsed JSON response
   */
  async post<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const operationName = `POST ${url}`;
    apiPerformanceMonitor.startOperation(operationName);
    
    try {
      const response = await enhancedFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      
      const responseData = await response.json() as T;
      apiPerformanceMonitor.endOperation(operationName, true);
      return responseData;
    } catch (error) {
      apiPerformanceMonitor.endOperation(operationName, false);
      handleNetworkError(error, `Failed to post data to ${url}`);
      throw error;
    }
  },
  
  /**
   * Make a PUT request
   * @param url The URL to fetch
   * @param data The data to send
   * @param options Additional fetch options
   * @returns The parsed JSON response
   */
  async put<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const operationName = `PUT ${url}`;
    apiPerformanceMonitor.startOperation(operationName);
    
    try {
      const response = await enhancedFetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      
      const responseData = await response.json() as T;
      apiPerformanceMonitor.endOperation(operationName, true);
      return responseData;
    } catch (error) {
      apiPerformanceMonitor.endOperation(operationName, false);
      handleNetworkError(error, `Failed to update data at ${url}`);
      throw error;
    }
  },
  
  /**
   * Make a DELETE request
   * @param url The URL to fetch
   * @param options Additional fetch options
   * @returns The parsed JSON response
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const operationName = `DELETE ${url}`;
    apiPerformanceMonitor.startOperation(operationName);
    
    try {
      const response = await enhancedFetch(url, {
        method: 'DELETE',
        ...options,
      });
      
      const data = await response.json() as T;
      apiPerformanceMonitor.endOperation(operationName, true);
      return data;
    } catch (error) {
      apiPerformanceMonitor.endOperation(operationName, false);
      handleNetworkError(error, `Failed to delete resource at ${url}`);
      throw error;
    }
  },
  
  /**
   * Get performance metrics for API calls
   * @returns The performance metrics
   */
  getPerformanceMetrics() {
    return {
      durations: apiPerformanceMonitor.durations,
      successCount: apiPerformanceMonitor.successCount,
      failureCount: apiPerformanceMonitor.failureCount,
      successRate: apiPerformanceMonitor.successCount / 
        (apiPerformanceMonitor.successCount + apiPerformanceMonitor.failureCount) * 100
    };
  }
}; 