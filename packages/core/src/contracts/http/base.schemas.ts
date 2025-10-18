export type SuccessResponse<T = void> = {
  success: true;
  message?: string;
} & (T extends void ? object : { data: T });

export interface ErrorResponse<TDetail = unknown> {
  success: false;
  error: string;
  // Enable isFormError if API server is handling form submissions
  // Turned off for Hono <> React SPA
  // isFormError?: boolean;
  detail?: TDetail;
}
