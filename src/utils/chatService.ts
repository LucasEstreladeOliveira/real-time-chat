import { MockAI } from './mockAI';

export interface ChatService {
    sendMessage(message: string): Promise<string>;
    clearContext(): void;
}

interface ChatResponse {
    success: boolean;
    message?: string;
    error?: string;
}

class ServerChatService implements ChatService {
    private context: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'http://localhost:3001/api';
    }

    async sendMessage(message: string): Promise<string> {
        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    context: this.context,
                }),
            });

            const data: ChatResponse = await response.json();

            if (!data.success || !data.message) {
                throw new Error(data.error || 'Failed to get response');
            }

            // Update context
            this.context.push(
                { role: 'user', content: message },
                { role: 'assistant', content: data.message }
            );

            // Keep context size manageable
            if (this.context.length > 10) {
                this.context = this.context.slice(-10);
            }

            return data.message;
        } catch (error) {
            console.error('Error in server chat:', error);
            throw new Error('Failed to get AI response');
        }
    }

    clearContext() {
        this.context = [];
    }
}

export async function checkPremiumStatus(): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:3001/api/premium-status');
        const data = await response.json();
        return data.isPremium;
    } catch (error) {
        console.error('Error checking premium status:', error);
        return false;
    }
}

export function createChatService(usePremium: boolean): ChatService {
    if (usePremium) {
        return new ServerChatService();
    }
    return new MockAI();
} 