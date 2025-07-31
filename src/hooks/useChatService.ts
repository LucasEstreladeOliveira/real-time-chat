import { useState, useEffect } from 'react';
import { createChatService, ChatService } from '../utils/chatService';
import { OpenAIError } from '../utils/openai';

export function useChatService(apiKey: string) {
    const [chatService, setChatService] = useState<ChatService | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const service = createChatService(apiKey);
            setChatService(service);
            setError(null);
        } catch (error) {
            console.error('Failed to initialize chat service:', error);
            if (error instanceof OpenAIError) {
                setError(error.message);
            } else {
                setError('Failed to initialize chat service. Please check your API key.');
            }
        }
    }, [apiKey]);

    const handleError = (error: unknown): string => {
        console.error('Failed to get response:', error);
        let errorMessage = 'Sorry, I encountered an error. Please try again.';

        if (error instanceof OpenAIError) {
            switch (error.code) {
                case 'INVALID_KEY':
                    errorMessage = 'Invalid API key. Please check your OpenAI API key.';
                    break;
                case 'RATE_LIMIT':
                    errorMessage = 'Rate limit exceeded. Please try again in a moment.';
                    break;
                case 'SERVICE_ERROR':
                    errorMessage = 'OpenAI service is currently unavailable. Please try again later.';
                    break;
                case 'CONNECTION_ERROR':
                    errorMessage = 'Failed to connect to OpenAI. Please check your internet connection.';
                    break;
            }
        }

        setError(errorMessage);
        return errorMessage;
    };

    return {
        chatService,
        error,
        setError,
        handleError
    };
} 