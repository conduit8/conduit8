import type { SuccessResponse } from '@kollektiv/core';
import type { Context } from 'hono';

/**
 * Success response helper for data responses
 */
export function success<T>(c: Context, data: T) {
  const response = {
    success: true,
    data,
  };
  return c.json(response);
}

/**
 * Success response helper for void responses (no data)
 */
export function successVoid(c: Context, message?: string) {
  const response: SuccessResponse<void> = {
    success: true,
    ...(message && { message }),
  };
  return c.json(response);
}
