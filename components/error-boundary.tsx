"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { AppError, ErrorType } from "@/lib/error-handling/error-utils";
import { useRouter } from "next/navigation";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function getErrorMessage(error: Error): string {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.NETWORK:
        return "Network error. Please check your connection and try again.";
      case ErrorType.AUTHENTICATION:
        return "Authentication error. Please log in again.";
      case ErrorType.AUTHORIZATION:
        return "You don't have permission to access this resource.";
      case ErrorType.VALIDATION:
        return "Invalid data. Please check your inputs and try again.";
      case ErrorType.NOT_FOUND:
        return "The requested resource was not found.";
      case ErrorType.SERVER:
        return "Server error. Our team has been notified and we'll fix this as soon as possible.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }
  return error.message || "An unexpected error occurred.";
}

function logErrorToService(error: Error, errorInfo: ErrorInfo): void {
  // In a production environment, you would log this to a service like Sentry, LogRocket, etc.
  console.error("Error caught by ErrorBoundary:", error);
  console.error("Error Info:", errorInfo);
}

// The actual error boundary component needs to be a class component
class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    logErrorToService(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })} 
        />
      );
    }

    return this.props.children;
  }
}

// Create a wrapper that injects the router for actions like refresh
export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps): JSX.Element {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
}

// Default fallback UI when an error occurs
interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps): JSX.Element {
  const router = useRouter();
  
  const handleRefresh = () => {
    resetError();
    router.refresh();
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center bg-destructive/5 rounded-md border border-destructive/20">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {error ? getErrorMessage(error) : "An unexpected error occurred"}
      </p>
      <div className="flex gap-4">
        <Button onClick={resetError} variant="outline">
          Try again
        </Button>
        <Button onClick={handleRefresh} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh page
        </Button>
      </div>
    </div>
  );
}

// Component-level error boundary for use in specific components
export function ComponentErrorBoundary({ 
  children, 
  fallback 
}: ErrorBoundaryProps): JSX.Element {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
} 