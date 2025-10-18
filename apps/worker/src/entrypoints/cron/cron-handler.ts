export async function scheduled(
  controller: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  console.log('Cron triggered', {
    cron: controller.cron,
    scheduledTime: new Date(controller.scheduledTime).toISOString(),
  });

  try {
    switch (controller.cron) {
      case '0 9 * * *': // Daily at 9 AM UTC (keeping existing)
        // Existing daily reminder logic can stay here
        break;
      default:
        console.warn('Unknown cron pattern received', {
          cron: controller.cron,
          operation: 'cron-unknown',
        });
        break;
    }
  }
  catch (error: unknown) {
    console.error('Error occurred during cron execution', {
      cron: controller.cron,
      error: error instanceof Error ? error.message : String(error),
      errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
      stack: error instanceof Error ? error.stack : undefined,
      operation: 'cron-critical-failure',
    });

    // Re-throw to ensure it's visible in dev mode
    throw error;
  }
}
