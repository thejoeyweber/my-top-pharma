/**
 * Error Handling Utilities
 * 
 * Standardized error handling functions for consistent error management
 * across the application.
 */

import type { PostgrestError } from '@supabase/supabase-js';

// Define standard error categories
export enum ErrorCategory {
  DATABASE = 'Database',
  NETWORK = 'Network',
  VALIDATION = 'Validation',
  AUTHENTICATION = 'Authentication',
  AUTHORIZATION = 'Authorization',
  NOT_FOUND = 'Not Found',
  INTERNAL = 'Internal',
  EXTERNAL_API = 'External API',
  IMPORT = 'Import',
  CONFIGURATION = 'Configuration'
}

// Define structured error response type
export interface ErrorResponse {
  message: string;
  category: ErrorCategory;
  code?: string;
  details?: Record<string, any>;
  originalError?: unknown;
}

/**
 * Create a standardized error response object
 * 
 * @param message Human-readable error message
 * @param category Error category
 * @param options Additional error details
 * @returns Structured error response
 */
export function createErrorResponse(
  message: string,
  category: ErrorCategory,
  options?: {
    code?: string;
    details?: Record<string, any>;
    originalError?: unknown;
  }
): ErrorResponse {
  return {
    message,
    category,
    code: options?.code,
    details: options?.details,
    originalError: options?.originalError
  };
}

/**
 * Handle and log database errors from Supabase
 * 
 * @param error PostgrestError or unknown error
 * @param operation Description of the operation that failed
 * @param entityType Type of entity being accessed (e.g., 'company', 'product')
 * @param entityId Optional ID of the specific entity
 * @returns Standardized error response
 */
export function handleDatabaseError(
  error: PostgrestError | unknown,
  operation: string,
  entityType: string,
  entityId?: string
): ErrorResponse {
  // Format entity identifier for logging
  const entityIdentifier = entityId ? `${entityType} ${entityId}` : entityType;
  
  // Log detailed error information
  console.error(`Database error during ${operation} of ${entityIdentifier}:`, error);
  
  // Handle PostgrestError specifically
  if (isPostgrestError(error)) {
    return createErrorResponse(
      `Failed to ${operation} ${entityIdentifier}: ${error.message}`,
      ErrorCategory.DATABASE,
      {
        code: error.code,
        details: { hint: error.hint, details: error.details },
        originalError: error
      }
    );
  }
  
  // Handle generic errors
  return createErrorResponse(
    `Failed to ${operation} ${entityIdentifier}`,
    ErrorCategory.DATABASE,
    { originalError: error }
  );
}

/**
 * Handle and log network errors
 * 
 * @param error The caught error
 * @param operation Description of the operation that failed
 * @returns Standardized error response
 */
export function handleNetworkError(
  error: unknown,
  operation: string
): ErrorResponse {
  console.error(`Network error during ${operation}:`, error);
  
  if (error instanceof Error) {
    return createErrorResponse(
      `Network error: ${error.message}`,
      ErrorCategory.NETWORK,
      { originalError: error }
    );
  }
  
  return createErrorResponse(
    'Network connection error',
    ErrorCategory.NETWORK,
    { originalError: error }
  );
}

/**
 * Handle and log external API errors
 * 
 * @param error The caught error
 * @param apiName Name of the external API
 * @param operation Description of the operation that failed
 * @returns Standardized error response
 */
export function handleExternalApiError(
  error: unknown,
  apiName: string,
  operation: string
): ErrorResponse {
  console.error(`Error from ${apiName} API during ${operation}:`, error);
  
  if (error instanceof Error) {
    return createErrorResponse(
      `${apiName} API error: ${error.message}`,
      ErrorCategory.EXTERNAL_API,
      { originalError: error }
    );
  }
  
  return createErrorResponse(
    `${apiName} API error during ${operation}`,
    ErrorCategory.EXTERNAL_API,
    { originalError: error }
  );
}

/**
 * Type guard to check if an error is a PostgrestError
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error
  );
}

/**
 * Create a not found error response
 * 
 * @param entityType Type of entity not found
 * @param identifier Identifier that was searched for
 * @returns Standardized error response
 */
export function createNotFoundError(
  entityType: string,
  identifier?: string
): ErrorResponse {
  const message = identifier
    ? `${entityType} with identifier '${identifier}' not found`
    : `${entityType} not found`;
    
  return createErrorResponse(message, ErrorCategory.NOT_FOUND);
}

/**
 * Safe JSON parsing with error handling
 * 
 * @param jsonString JSON string to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed JSON or default value
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
} 