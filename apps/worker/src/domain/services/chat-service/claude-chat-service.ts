import type { User } from '@worker/domain/models';
import type { IConversationRepository } from '@worker/domain/repositories';

import { ConversationRepository } from '@worker/infrastructure/persistence/repositories';

import type { ClaudeRuntime } from '@worker/infrastructure/runtime/claude-runtime';

import type { ChatEvent, ChatMessage } from './chat-events';

import { UserService } from '../user-service';

/**
 * Handles communication and use of agent sandbox / runtime instance
 * Internally manages it's lifecycle and state without exposing it to consumers
 */
export class ClaudeChatService {
  private isNewInstance = false;

  constructor(
    private readonly runtime: DurableObjectStub<ClaudeRuntime>,
    private readonly user: User,
    private readonly conversationRepo: IConversationRepository,
  ) {
    // Validate user exists
    if (!user) {
      throw new Error('ClaudeRuntimeService: user is required');
    }
    this.user = user;
  }

  static async create(env: Env, userId: string) {
    const userService = UserService.create(env);
    const user = await userService.getUser(userId);
    if (!user) {
      console.error(`Can not start claude instance - user not found for ID: ${userId}`);
      throw new Error('Unable to start claude instance - user not found');
    }

    const runtime = env.CLAUDE_RUNTIME.getByName(user.platformUserId);
    const conversationRepo = ConversationRepository.create(env);
    return new ClaudeChatService(runtime, user, conversationRepo);
  }

  /**
   * Ensures container instance is ready with proper configuration
   * Returns true if newly created, false if already existed
   */
  async prepareInstance(): Promise<boolean> {
    // 1. Check container health
    const state = await this.runtime.getContainerHealth();

    if (state.status === 'healthy') {
      // Container already running
      console.log('Claude instance healthy');
      this.isNewInstance = false;
      return this.isNewInstance;
    }

    // Container not running - need to set up and start
    console.log('Container not running - starting new instance');

    // Measure container startup time
    const startTime = performance.now();

    // 2. Set user-specific env vars via RPC
    // Pass all config fields with correct env var names (matching Python settings.py)
    const envVars: Record<string, string> = {
      ANTHROPIC_API_KEY: this.user.config.anthropicKey,
      GH_TOKEN: this.user.config.githubToken, // Python expects GH_TOKEN not GITHUB_TOKEN
    };

    // Add optional fields if present
    if (this.user.config.firecrawlKey) {
      envVars.FIRECRAWL_API_KEY = this.user.config.firecrawlKey;
    }

    await this.runtime.persistEnvVars(envVars);

    // 3. Start container and wait for ports
    await this.runtime.startAndWaitForPorts();

    const startupTime = performance.now() - startTime;
    console.log('Container started successfully', {
      startupTimeMs: startupTime,
    });
    this.isNewInstance = true;
    return this.isNewInstance;
  }

  /**
   * Restore a session from R2 to container
   * Returns true if restoration succeeded, false otherwise
   */
  async restoreSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      const sessionData = await this.conversationRepo.getSessionHistory(userId, sessionId);
      if (!sessionData) {
        console.warn('No session data found for restoration', {
          userId,
          sessionId,
        });
        return false;
      }

      // Use clean RPC call to restore session
      const restored = await this.runtime.restoreSession(
        sessionId,
        sessionData.projectId,
        sessionData.data,
      );

      if (restored) {
        console.log('Session restored successfully', {
          sessionId,
          projectId: sessionData.projectId,
          sizeBytes: sessionData.data.byteLength,
        });
      }

      return restored;
    }
    catch (error) {
      console.error('Error restoring session', {
        sessionId,
        error: String(error),
      });
      return false;
    }
  }

  /**
   * Accepts user message and sends it to the agent instance
   * Handles ALL orchestration: container startup, session restoration, streaming
   * Streams responses back as they arrive from container
   */
  async* processMessage(message: string, sessionId?: string):
  AsyncGenerator<ChatEvent, void, unknown> {
    if (!message?.trim()) {
      console.warn('Message is empty or whitespace');
      return;
    }
    console.info(`Processing message for session: ${sessionId ?? 'No sessionId provided'}`);

    // 1. Check if user has required configuration
    if (!this.user.config) {
      console.warn('User configuration incomplete', {
        userId: this.user.platformUserId,
      });
      yield { type: 'user_configuration_required' };
      return;
    }

    // 2. Ensure container is ready
    const isNewInstance = await this.prepareInstance();

    // 2. Check if session needs restoration (new container + has session)
    if (sessionId && isNewInstance) {
      const restored = await this.restoreSession(this.user.platformUserId, sessionId);

      if (restored) {
        yield {
          type: 'session_restored',
        };
      }
      else {
        yield {
          type: 'session_restore_failed',
        };
      }
    }

    try {
      // Start timing for first meaningful chunk
      const startTime = performance.now();

      const response = await this.runtime.fetch(
        new Request('http://container/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            user_id: this.user.platformUserId,
            session_id: sessionId,
          }),
        }),
      );

      if (!response.ok) {
        const errorResponse = await response.json() as { message?: string };
        throw new Error(`Received an error response from Claude instance: ${errorResponse.message || response.statusText}`);
      }

      // Parse SSE stream and yield chunks as they arrive
      yield* this.parseSSEStream(response, startTime);
    }
    catch (error) {
      // Log detailed error information to understand stale state failures
      console.error('Failed to send message to container - detailed error', {
        platformUserId: this.user.platformUserId,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorType: (error as any).errorType,
        statusCode: (error as any).statusCode,
        isStreamError: (error as any).isStreamError,
        errorStack: error instanceof Error ? error.stack : undefined,
      });

      // Check if this looks like a stale container state error
      if ((error as any).statusCode === 500
        && error instanceof Error
        && (error.message.includes('Container exited') || error.message.includes('Failed to start container'))) {
        console.warn('Detected possible stale container state', {
          platformUserId: this.user.platformUserId,
          errorPattern: 'Container exit/start failure',
        });
        // TODO: Implement retry logic here after confirming error pattern
      }

      throw error;
    }
  }

  /**
   * Parse Server-Sent Events stream from container
   * Yields chunks as they arrive without transformation
   */
  private async* parseSSEStream(
    response: Response,
    startTime: number,
  ): AsyncGenerator<ChatMessage, void, unknown> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let sessionId: string | undefined;
    let totalCost: number | undefined;
    let firstChunkLogged = false;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;

        // Log Time to First Chunk once (measures when Claude starts responding)
        if (!firstChunkLogged) {
          const ttfc = performance.now() - startTime;
          console.info('Claude started responding', {
            platformUserId: this.user.platformUserId,
            ttfcMs: ttfc,
          });
          firstChunkLogged = true;
        }

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Split by lines and keep incomplete line in buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          // SSE format: "data: {json}\n\n"
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr)
              continue;

            try {
              const chunk = JSON.parse(jsonStr) as ChatMessage;

              // Check for error chunks first
              if (chunk.is_error) {
                const error = new Error(chunk.content);
                (error as any).isStreamError = true;
                throw error;
              }

              // Yield all chunks to consumer
              yield chunk;

              // Log completion
              if (chunk.is_final) {
                sessionId = chunk.session_id;
                totalCost = chunk.cost;

                console.info('Claude response complete', {
                  platformUserId: this.user.platformUserId,
                  sessionId,
                  cost: totalCost,
                });
              }
            }
            catch (parseError) {
              if ((parseError as any).isStreamError) {
                throw parseError;
              }
              console.warn('Failed to parse SSE chunk', {
                line,
                error: String(parseError),
              });
            }
          }
        }
      }
    }
    finally {
      reader.releaseLock();
    }
  }
}
