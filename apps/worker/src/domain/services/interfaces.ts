export interface IMessagingService {
  sendMessage: (channel: string, message: string, threadTs?: string) => Promise<void>;
}

export interface IConversationService {}
export interface IUserService {}
