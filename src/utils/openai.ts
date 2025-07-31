import OpenAI from 'openai';
import { ChatMessage } from '../types';

export class ChatAI {
    private client: OpenAI;
    private context: ChatMessage[] = [];

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    async sendMessage(message: string): Promise<string> {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are a helpful AI assistant.' },
                    ...this.context.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    { role: 'user', content: message }
                ],
                model: 'gpt-3.5-turbo',
            });

            const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

            // Update context
            this.context.push(
                { id: Date.now().toString(), content: message, role: 'user', timestamp: new Date() },
                { id: (Date.now() + 1).toString(), content: response, role: 'assistant', timestamp: new Date() }
            );

            // Keep context size manageable
            if (this.context.length > 10) {
                this.context = this.context.slice(-10);
            }

            return response;
        } catch (error) {
            console.error('Error in AI response:', error);
            throw new Error('Failed to get AI response');
        }
    }

    clearContext() {
        this.context = [];
    }
} 