// Analytics Service (PostHog)
export interface IAnalyticsService {
  track: (event: string, distinctId: string, properties?: Record<string, any>) => void;
}

// Queue Service - Send domain messages with automatic routing
export interface IQueueService {
  /**
   * Send a domain message to the appropriate queue
   * Automatically routes based on message type and name
   * @param message - Domain command or event (not queries)
   */
  send: (message: any) => Promise<void>;
}

// Email Service
export interface IEmailService {
  sendEmail: (options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    tags?: string[];
  }) => Promise<{
    id: string;
    success: boolean;
  }>;
}
