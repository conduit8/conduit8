import type { Context, ValidationTargets } from 'hono';
import type { ZodType } from 'zod/v4';

import { zValidator as zv } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';

export function zValidator<T extends ZodType, Target extends keyof ValidationTargets>(target: Target, schema: T) {
  return zv(target, schema, (result, c) => {
    if (!result.success) {
      console.error('Input validation failed', {
        operation: 'input-validation',
        target,
        inputType: typeof result.data,
        issues: result.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      });

      const issues = result.error.issues.map(issue => ({
        message: issue.message,
        code: issue.code,
        property: issue.path,
      }));

      return c.json(
        {
          success: false,
          error: {
            issues,
            name: 'ZodError',
          },
        },
        400,
      );
    }
  });
}

// New approach: Reusable hook function without wrapper
// This avoids generic type issues while maintaining logging
export function onError(
  result: {
    success: boolean;
    data?: any;
    error?: { issues: any[] };
    target: string;
  },
  c: Context,
) {
  if (!result.success) {
    const route = `${c.req.method} ${c.req.path}`;
    console.error(`[Validation] ${route} - ${result.target} validation failed:`, result.error!.issues);

    throw new HTTPException(400, {
      message: `Invalid ${result.target} data`,
      cause: result.error,
    });
  }
}

// Re-export zValidator for convenience
export { zValidator as validate } from '@hono/zod-validator';
