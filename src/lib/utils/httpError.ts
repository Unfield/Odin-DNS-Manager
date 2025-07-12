// src/lib/utils/httpError.ts

/**
 * Represents a standardized HTTP error structure,
 * with a generic type for the specific error data payload.
 */
export interface HttpError<TErrorData = any> {
  // Default to 'any' for backward compatibility
  status: number;
  statusText: string;
  message: string;
  data: TErrorData | null; // The specific error payload from the server
  url: string; // The URL that caused the error
}

/**
 * Creates a default HttpError object for network or unexpected issues.
 * @param error The original error object from the catch block.
 * @param url The URL that was being requested.
 */
export function defaultHttpError(error: any, url: string): HttpError<any> {
  return {
    status: 0, // Use 0 for network errors or unhandled client-side errors
    statusText: "Network Error",
    message:
      error instanceof Error
        ? error.message
        : "An unexpected network error occurred.",
    data: error, // The raw error object
    url: url,
  };
}
