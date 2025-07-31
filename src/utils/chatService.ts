import { ChatAI } from './openai';

export interface ChatService {
    sendMessage: (message: string) => Promise<string>;
}

export const createChatService = (apiKey: string): ChatService => {
    return new ChatAI(apiKey);
}; 