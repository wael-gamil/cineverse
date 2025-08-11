import { notFound } from 'next/navigation';

/**
 * Enhanced error handling for API responses
 */
export class ApiError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

/**
 * Handle API errors based on status codes and context
 */
export function handleApiError(
  error: unknown,
  context: 'server' | 'client' = 'client',
  resource?: string
): never {
  if (error instanceof ApiError) {
    // Handle specific API errors
    switch (error.statusCode) {
      case 404:
        if (context === 'server') {
          notFound(); // Next.js server-side 404
        }
        throw new Error(`${resource || 'Resource'} not found`);

      case 401:
        if (context === 'server') {
          // For server-side, we might want to redirect to login
          throw new Error('Unauthorized access');
        }
        throw new Error('Please log in to continue');

      case 403:
        throw new Error('You do not have permission to access this resource');

      case 429:
        throw new Error('Too many requests. Please try again later');

      case 500:
        throw new Error('Server error occurred. Please try again');

      default:
        throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Handle network errors and other unknown errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new Error('Network error. Please check your connection');
  }

  // Log unknown errors in development
  if (process.env.NODE_ENV === 'development') {
  }

  throw new Error('An unexpected error occurred');
}

/**
 * Enhanced fetcher with proper error handling
 */
export async function safeFetcher(
  query: string,
  revalidateSeconds: number = 60,
  headers: HeadersInit = { 'Content-Type': 'application/json' },
  baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL as string
) {
  try {
    const response = await fetch(`${baseUrl}${query}`, {
      method: 'GET',
      headers,
      next: {
        revalidate: revalidateSeconds,
      },
    });

    const text = await response.text();
    let result;

    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      throw new ApiError('Invalid JSON response from server', response.status);
    }

    if (!response.ok) {
      throw new ApiError(
        result.message || `HTTP ${response.status}`,
        response.status,
        result.code
      );
    }

    if (result.success === false) {
      throw new ApiError(
        result.message || 'Request failed',
        response.status,
        result.code
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    throw new ApiError('Network error occurred', 0);
  }
}

/**
 * Safe API call wrapper that returns default values on error
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  defaultValue: T,
  context: 'server' | 'client' = 'client'
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (
      context === 'server' &&
      error instanceof ApiError &&
      error.statusCode === 404
    ) {
      notFound();
    }

    return defaultValue;
  }
}

/**
 * Wrapper for content-related API calls that should trigger 404
 */
export async function contentApiCall<T>(
  apiCall: () => Promise<T>,
  context: 'server' | 'client' = 'server'
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      if (context === 'server') {
        notFound();
      }
      throw new Error('Content not found');
    }
    throw error;
  }
}
