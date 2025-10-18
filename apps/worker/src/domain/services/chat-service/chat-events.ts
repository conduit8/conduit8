/**
 * Base chat event interface
 */
interface BaseChatEvent {
  type: string;
}

/**
 * Content blocks for structured assistant messages
 */
export interface TextBlock {
  type: 'text';
  text: string;
}

export interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: any;
}

export interface ThinkingBlock {
  type: 'thinking';
  thinking: string;
  signature: string;
}

export type ContentBlock = TextBlock | ToolUseBlock | ThinkingBlock;

/**
 * Chat message from Claude (from container's SSE stream)
 */
export interface ChatMessage extends BaseChatEvent {
  type: 'system' | 'user' | 'assistant' | 'result';
  content?: string; // Optional - assistant messages use blocks instead
  blocks?: ContentBlock[]; // Structured content for assistant messages
  model?: string;
  is_final?: boolean;
  is_error?: boolean;
  session_id?: string;
  cost?: number;
}

/**
 * Container started event
 */
export interface ContainerStarted extends BaseChatEvent {
  type: 'container_started';
}

/**
 * Session restored successfully
 */
export interface SessionRestored extends BaseChatEvent {
  type: 'session_restored';
}

/**
 * Session restoration failed
 */
export interface SessionRestoreFailed extends BaseChatEvent {
  type: 'session_restore_failed';
}

/**
 * User needs configuration
 */
export interface UserConfigurationRequired extends BaseChatEvent {
  type: 'user_configuration_required';
}

/**
 * Chat is ready (user is configured)
 */
export interface ChatReady extends BaseChatEvent {
  type: 'chat_ready';
}

/**
 * Union type of all chat events
 */
export type ChatEvent
  = | ChatMessage
    | ContainerStarted
    | SessionRestored
    | SessionRestoreFailed
    | UserConfigurationRequired
    | ChatReady;
