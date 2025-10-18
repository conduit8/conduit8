import type { ErrorResponse } from '@kollektiv/core';
import type { ErrorHandler } from 'hono';

import * as Sentry from '@sentry/cloudflare';
import { HTTPException } from 'hono/http-exception';

/**
 * Global error handler for the application
 * Handles both HTTPExceptions and unexpected errors
 */
export const errorHandler: ErrorHandler = (err, c) => {
  // If error is handled (HTTPException) -> just wrap
  // If error is unhandled -> log and wrap

  // Handle HTTPException
  if (err instanceof HTTPException) {
    const errResponse
      = err.res
        ?? c.json<ErrorResponse>(
          {
            success: false,
            error: err.message,
          },
          err.status,
        );
    return errResponse;
  }
  else {
    // Unhandled error - ALWAYS log with context
    // Send Unhandled errors to Sentry
    Sentry.captureException(err);
    console.error('[Unhandled Error]', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      method: c.req.method,
      path: c.req.path,
      url: c.req.url,
      // Add user context if available
      userId: c.get('user')?.id,
    });
    return c.json<ErrorResponse>(
      {
        success: false,
        error: c.env.ENV === 'production' ? 'Internal Server Error' : err.message,
      },
      500,
    );
  }
};
