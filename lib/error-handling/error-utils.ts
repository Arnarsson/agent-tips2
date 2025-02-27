import { toast } from "@/components/ui/use-toast";

/**
 * Performance monitor class as specified in custom instructions
 */
export class PerformanceMonitor {
  private start_times: Record<string, number> = {};
  private durations: Record<string, number> = {};
  private success_count = 0;
  private failure_count = 0;
  
  startOperation(name: string): void {
    this.start_times[name] = performance.now();
  }
  
  endOperation(name: string, success: boolean): number {
    if (name in this.start_times) {
      const duration = performance.now() - this.start_times[name];
      this.durations[name] = duration;
      if (success) {
        this.success_count += 1;
      } else {
        this.failure_count += 1;
      }
      return duration;
    }
    return 0;
  }
  
  getMetrics(): { 
    durations: Record<string, number>; 
    success_rate: number;
    total_operations: number;
  } {
    const total = this.success_count + this.failure_count;
    return {
      durations: { ...this.durations },
      success_rate: total > 0 ? (this.success_count / total) * 100 : 100,
      total_operations: total
    };
  }
  
  getPerformanceRating(operation: string): 'good' | 'warning' | 'critical' | null {
    if (!(operation in this.durations)) return null;
    
    const duration = this.durations[operation];
    if (duration < 1000) return 'good';
    if (duration < 3000) return 'warning';
    return 'critical';
  }

  getStatusColor(operation: string): string {
    const rating = this.getPerformanceRating(operation);
    switch (rating) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }
}

// Global performance monitor instance
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * Handles async operations with error handling and performance monitoring
 * as specified in custom instructions
 */
export async function handleAsyncOperation<T>(
  operationName: string,
  coroutine: () => Promise<T>,
  options: {
    showToast?: boolean;
    performanceMonitor?: PerformanceMonitor;
  } = {}
): Promise<{ result: T | null; error: Error | null }> {
  const monitor = options.performanceMonitor || globalPerformanceMonitor;
  const showToast = options.showToast !== undefined ? options.showToast : true;
  
  monitor.startOperation(operationName);
  
  try {
    console.log(`Starting ${operationName}...`);
    const result = await coroutine();
    console.log(`${operationName} completed successfully`);
    
    const duration = monitor.endOperation(operationName, true);
    
    if (showToast) {
      toast({
        title: "Operation successful",
        description: `${operationName} completed in ${duration.toFixed(0)}ms`,
        variant: "default"
      });
    }
    
    return { result, error: null };
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    const errorMsg = `Error in ${operationName}: ${error.message}`;
    console.error(errorMsg);
    console.error(error.stack);
    
    monitor.endOperation(operationName, false);
    
    if (showToast) {
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    }
    
    return { result: null, error };
  }
}

/**
 * Common error types for application-wide error handling
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Structured error class for better error management
 */
export class AppError extends Error {
  type: ErrorType;
  statusCode?: number;
  context?: Record<string, any>;
  
  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, statusCode?: number, context?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.context = context;
  }
}

/**
 * Create appropriate error from HTTP response
 */
export function createErrorFromResponse(response: Response, message?: string): AppError {
  const statusCode = response.status;
  let type = ErrorType.UNKNOWN;
  
  if (statusCode >= 400 && statusCode < 500) {
    if (statusCode === 401) type = ErrorType.AUTHENTICATION;
    else if (statusCode === 403) type = ErrorType.AUTHORIZATION;
    else if (statusCode === 404) type = ErrorType.NOT_FOUND;
    else if (statusCode === 422) type = ErrorType.VALIDATION;
    else type = ErrorType.CLIENT;
  } else if (statusCode >= 500) {
    type = ErrorType.SERVER;
  } else if (response.type === 'opaque' || response.type === 'error') {
    type = ErrorType.NETWORK;
  }
  
  return new AppError(
    message || `Request failed with status ${statusCode}`,
    type,
    statusCode
  );
} 