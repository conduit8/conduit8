/**
 * API Client
 * A clean, type-safe HTTP http-client for making API requests
 */
import type { ApiClientConfig } from '@/infrastructure/http/config';
import type { ApiRequestOptions, HttpMethod, PathParams, QueryParams } from '@/infrastructure/http/types';

import {
  ApiError,

} from './types';
import { convertToCamelCase, convertToSnakeCase } from './utils';

/**
 * API Client interface defining available HTTP methods
 * @template TRoutes - Type of routes/paths that can be used with this client
 */
export interface ApiClient<TRoutes = string> {
  get: <T>(path: TRoutes, requestOptions?: ApiRequestOptions) => Promise<T>;
  post: <T>(path: TRoutes, body: unknown, requestOptions?: ApiRequestOptions) => Promise<T>;
  put: <T>(path: TRoutes, body: unknown, requestOptions?: ApiRequestOptions) => Promise<T>;
  patch: <T>(path: TRoutes, body: unknown, requestOptions?: ApiRequestOptions) => Promise<T>;
  delete: <T>(path: TRoutes, requestOptions?: ApiRequestOptions) => Promise<T>;
}

/**
 * Creates an API http-client with the specified configuration
 * @template TRoutes - Type of routes/paths that can be used with this client (defaults to string)
 * @param options - Configuration options
 * @returns An object with methods for making API requests
 */
export function createApiClient<TRoutes = string>(options: ApiClientConfig): ApiClient<TRoutes> {
  const baseUrl = options.baseUrl;
  const timeout = options.timeout || 60000; // Default 60s timeout
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // Configure case conversion (default to true if not specified)
  const caseConversion = options.caseConversion ?? true;

  // Determine if we should convert request bodies to snake_case
  const shouldConvertRequestToSnakeCase
    = typeof caseConversion === 'boolean'
      ? caseConversion
      : (caseConversion.requestToSnakeCase ?? true);

  // Determine if we should convert response bodies to camelCase
  const shouldConvertResponseToCamelCase
    = typeof caseConversion === 'boolean'
      ? caseConversion
      : (caseConversion.responseToCamelCase ?? true);

  /**
   * Builds a full API URL by:
   * - Normalizing the path (ensuring leading slash)
   * - Expanding :pathParams placeholders
   * - Adding query string parameters
   *
   * Example:
   *   buildApiUrl('/user/:id', {id: '42'}, {filter: 'active'}) → /user/42?filter=active
   * @param path - API path
   * @param pathParams - Path parameters to replace in the URL
   * @param queryParams - Query parameters to add to the URL
   * @returns Formatted URL
   */
  function buildApiUrl(
    path: string,
    pathParams?: PathParams,
    queryParams?: QueryParams,
  ): string {
    // Ensure path starts with '/'
    let normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Build in path params
    if (pathParams) {
      for (const [key, value] of Object.entries(pathParams)) {
        normalizedPath = normalizedPath.replace(`:${key}`, encodeURIComponent(value));
      }
    }

    // Build base URL - if no baseUrl, use relative path
    let url = baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;

    // Build in query params if provided
    if (queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  /**
   * Handles and logs all types of API errors. Never returns, throws ApiError on error.
   *
   * @param response
   */
  async function handleErrorResponse(response: Response): Promise<never> {
    const status = response.status;
    const statusText = response.statusText || String(status);

    const ct = (response.headers.get('content-type') || '').toLowerCase();
    const clen = response.headers.get('content-length');
    const bodyExpected = ![204, 205, 304].includes(status) && clen !== '0';

    let payload: unknown = null;
    let msg: string | undefined;

    // Error handling flow
    if (bodyExpected) {
      try {
        // First get the response as text to ensure text() is called
        const responseText = await response.text();

        if (ct.includes('json')) {
          try {
            // Try to parse as JSON
            payload = JSON.parse(responseText);
            const b = payload as any;
            msg = b?.detail?.message ?? b?.detail ?? b?.message ?? b?.error?.message ?? b?.error;
            if (typeof msg !== 'string')
              msg = undefined;
          }
          catch {
            // If JSON parsing fails, use the text
            msg = responseText.trim();
          }
        }
        else {
          // treat any non-JSON as text
          msg = responseText.trim();
        }
      }
      catch {
        /* ignore malformed body */
      }
    }
    // Handle Auth Errors first if the onAuthError handler provided
    if ((status === 401 || status === 403) && options.handleAuthError) {
      const code = (
        payload as {
          detail?: { details?: { code?: string } };
        }
      )?.detail?.details?.code;
      await options.handleAuthError(status, code);
    }

    if (!msg)
      msg = statusText;
    console.error('[API Error]', 'HTTP', status, msg);
    throw new ApiError(msg, status, statusText, 'HTTP', payload);
  }

  /**
   * Checks if the user has an internet connection
   *
   * @throws ApiError if no internet connection is detected
   */
  function checkInternetConnection(): void {
    // Check in browser environment or Workers with navigator compatibility flag
    // @ts-expect-error - navigator may exist in Workers with compatibility flags
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.error('[API Error]', 'network', 0, 'No network connection');
      throw new ApiError(
        'No network connection - check your connection and try again.',
        0,
        'No network connection',
        'network',
      );
    }
  }

  /**
   * Handles errors raised by fetch API
   *
   * @param error The error object
   *
   * @throws ApiError if the error is not handled
   */
  function handleFetchError(error: Error): never {
    // Re-raise ApiError (it's already handled)
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle AbortError (check both DOMException and generic Error for Workers compatibility)
    if ((typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError')
      || (error.name === 'AbortError')) {
      console.error('[API Error]', 'timeout', 0, error.message);
      throw new ApiError('Request timed out or was cancelled', 0, 'Request Cancelled', 'timeout');
    }

    // All other errors
    const msg = error.message;
    console.error('[API Error]', 'other', 0, msg);
    throw new ApiError(
      'Request failed - either the server could not respond or there was a network / CORS issue.',
      0,
      'Fetch failed',
      'other',
    );
  }

  /**
   * Parses and returns a response<T> if response.ok

   * @param response
   * @returns Promise<T>
   * @throws ApiError if response could not be parsed
   */
  async function parseResponse<T>(response: Response): Promise<T> {
    // Handle NO CONTENT specifically
    if (response.status === 204) {
      return {} as T;
    }

    // Handle successful responses with JSON bodies
    try {
      const jsonResponse = await response.json();
      // Apply case conversion only if Conduit8 to do so
      const processedResponse = shouldConvertResponseToCamelCase
        ? convertToCamelCase(jsonResponse)
        : jsonResponse;
      return processedResponse as T;
    }
    catch (e) {
      console.error('[API Error]', 'parse', response.status, String(e));
      throw new ApiError(
        'Received malformed response from server.',
        response.status,
        'JSON Parsing Error',
        'parse',
      );
    }
  }

  /**
   * Sends a request, processes the Response, and handles network/parsing errors.
   * Converts successful JSON responses to camelCase.
   * Throws specific ApiError instances for various failure conditions.
   *
   * @param url - The URL object for the request.
   * @param fetchOptions - The options for the fetch call.
   * @returns Promise resolving to the processed response data of type T.
   */
  async function getProcessedResponse<T>(url: string, fetchOptions: RequestInit): Promise<T> {
    let response: Response;

    try {
      checkInternetConnection();
      console.log('Sending request to:', url);

      response = await fetch(url, fetchOptions);

      /* ---------- !response.ok branch ---------- */
      if (!response.ok) {
        await handleErrorResponse(response);
      }
      /* ---------- response.ok branch ---------- */
      return await parseResponse(response);
    }
    catch (error) {
      /* ---------- error branch ---------- */
      handleFetchError(error as Error);
    }
  }

  /**
   * Core request method that handles all HTTP methods
   * @param method - HTTP method (GET, POST, PUT, DELETE)
   * @param path - API path
   * @param requestOptions - Request options (pathParams, queryParams, headers)
   * @param body - Request body
   * @returns Promise with the response wrapped in ApiResponse
   */
  async function request<T>(
    method: HttpMethod,
    path: TRoutes,
    requestOptions: ApiRequestOptions,
    body?: unknown,
  ): Promise<T> {
    // Build url path with path and query params
    const url = buildApiUrl(path as string, requestOptions.pathParams, requestOptions.queryParams);

    // Get auth headers if authHeader function is provided
    const authHeaders = options.getAuthHeaders ? options.getAuthHeaders() : {};

    // Merge all headers: default -> auth -> request-specific
    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...authHeaders,
      ...(requestOptions.headers || {}),
    };

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    if (isFormData) {
      // browser will add it's own boundary
      delete headers['Content-Type'];
    }

    // Set up fetch config
    const fetchOptions: RequestInit = {
      method,
      headers,
      body: isFormData
        ? (body as FormData)
        : body
          ? JSON.stringify(shouldConvertRequestToSnakeCase ? convertToSnakeCase(body) : body)
          : undefined,
      // signal: (for abort/timeout, add if needed)
    };

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const abortController = new AbortController();
    // Use request-specific timeout OR the http-client's default timeout
    const effectiveTimeout = requestOptions.timeoutMs ?? timeout;

    // Only set up AbortController if there's a valid timeout value
    if (effectiveTimeout && effectiveTimeout > 0) {
      timeoutId = setTimeout(() => {
        console.log(`[API Client] Request timed out after ${effectiveTimeout}ms. Aborting...`);
        abortController.abort();
      }, effectiveTimeout);
      fetchOptions.signal = abortController.signal;
    }

    // Get the response
    try {
      return await getProcessedResponse(url, fetchOptions);
    }
    finally {
      if (timeoutId)
        clearTimeout(timeoutId);
    }
  }

  /**
   * Make a GET request
   * @param path - API path
   * @param requestOptions - Request options (pathParams, queryParams, headers)
   * @returns Promise with the response wrapped in ApiResponse
   */
  async function get<T>(
    path: TRoutes,
    requestOptions: ApiRequestOptions = {},
  ): Promise<T> {
    return request<T>('GET', path, requestOptions);
  }

  /**
   * Make a POST request
   * @param path - API path
   * @param body - Request body
   * @param requestOptions - Request options (pathParams, queryParams, headers)
   * @returns Promise with the response wrapped in ApiResponse
   */
  async function post<T>(
    path: TRoutes,
    body: unknown,
    requestOptions: ApiRequestOptions = {},
  ): Promise<T> {
    return request<T>('POST', path, requestOptions, body);
  }

  /**
   * Make a PUT request
   * @param path - API path
   * @param body - Request body
   * @param requestOptions - Request options (pathParams, queryParams, headers)
   * @returns Promise with the response wrapped in ApiResponse
   */
  async function put<T>(
    path: TRoutes,
    body: unknown,
    requestOptions: ApiRequestOptions = {},
  ): Promise<T> {
    return request<T>('PUT', path, requestOptions, body);
  }

  /**
   * Make a PATCH request
   * @param path - API path
   * @param body - Request body
   * @param requestOptions - Request options (pathParams, queryParams, headers)
   * @returns Promise with the response wrapped in ApiResponse
   */
  async function patch<T>(
    path: TRoutes,
    body: unknown,
    requestOptions: ApiRequestOptions = {},
  ): Promise<T> {
    return request<T>('PATCH', path, requestOptions, body);
  }

  /**
   * Make a DELETE request
   * @param path - API path
   * @param requestOptions - Request options (pathParams, queryParams, headers)
   * @returns Promise with the response wrapped in ApiResponse
   */
  async function del<T>(
    path: TRoutes,
    requestOptions: ApiRequestOptions = {},
  ): Promise<T> {
    return request<T>('DELETE', path, requestOptions);
  }

  // Return the public API
  return {
    get,
    post,
    put,
    patch,
    delete: del, // Renamed to avoid conflict with JavaScript keyword
  };
}
