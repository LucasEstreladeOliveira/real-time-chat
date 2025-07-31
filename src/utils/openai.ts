import { ChatService } from './chatService';

interface OpenAIErrorResponse {
    response?: {
        status: number;
        data?: {
            error?: {
                message?: string;
            };
        };
    };
    message?: string;
}

export class OpenAIError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'OpenAIError';
    }
}

export class ChatAI implements ChatService {
    private apiKey: string;
    private context: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async sendMessage(message: string): Promise<string> {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        ...this.context,
                        { role: 'user', content: message }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                const error: any = new Error('OpenAI API error');
                error.response = response;
                throw error;
            }

            const data = await response.json();
            const assistantMessage = data.choices[0]?.message?.content;

            if (!assistantMessage) {
                throw new OpenAIError('No response from OpenAI', 'NO_RESPONSE');
            }

            // Update context
            this.context.push(
                { role: 'user', content: message },
                { role: 'assistant', content: assistantMessage }
            );

            // Keep context size manageable
            if (this.context.length > 10) {
                this.context = this.context.slice(-10);
            }

            return assistantMessage;
        } catch (error) {
            const apiError = error as OpenAIErrorResponse;
            if (apiError.response) {
                const status = apiError.response.status;
                switch (status) {
                    case 401:
                        throw new OpenAIError('Invalid API key. Please check your OpenAI API key.', 'INVALID_KEY');
                    case 429:
                        throw new OpenAIError('Rate limit exceeded. Please try again later.', 'RATE_LIMIT');
                    case 500:
                        throw new OpenAIError('OpenAI service error. Please try again later.', 'SERVICE_ERROR');
                    default:
                        throw new OpenAIError(
                            `OpenAI API error: ${apiError.response.data?.error?.message || apiError.message || 'Unknown error'}`,
                            'API_ERROR'
                        );
                }
            }
            throw new OpenAIError('Failed to connect to OpenAI. Please check your internet connection.', 'CONNECTION_ERROR');
        }
    }
} 