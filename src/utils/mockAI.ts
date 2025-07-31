import { ChatMessage } from '../types';

const MOCK_RESPONSES = [
    "Thank you for your message! This is a free tier response. To get AI-powered responses, please provide an OpenAI API key.",
    "I'm a simple mock response for the free tier. For more intelligent conversations, consider upgrading to use the OpenAI integration.",
    "Hello! I'm the free version of the chat widget. I can only provide pre-written responses.",
    "This is a demo response. To experience the full capabilities, please configure the widget with an OpenAI API key.",
];

export class MockAI {
    private context: ChatMessage[] = [];
    private responseIndex = 0;

    async sendMessage(message: string): Promise<string> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Cycle through mock responses
        const response = MOCK_RESPONSES[this.responseIndex];
        this.responseIndex = (this.responseIndex + 1) % MOCK_RESPONSES.length;

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
    }

    clearContext() {
        this.context = [];
    }
} 