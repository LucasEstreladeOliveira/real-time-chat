import { useCallback, useState } from 'react';
import { ChatMessage, ChatService } from '../types';

interface UseSendMessageProps {
    chatService: ChatService | null;
    isAuthLoading: boolean;
    maintenanceStatus: { isUnderMaintenance: boolean } | null;
    isOnline: boolean;
    requireAuth: boolean;
    user: { id?: string } | null;
    onMessageSent?: (message: ChatMessage) => void;
    onMessageReceived?: (message: ChatMessage) => void;
    addNewMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'isNew'>) => ChatMessage;
    handleError: (error: unknown) => string;
    setShowLogin: (show: boolean) => void;
}

export function useSendMessage({
    chatService,
    isAuthLoading,
    maintenanceStatus,
    isOnline,
    requireAuth,
    user,
    onMessageSent,
    onMessageReceived,
    addNewMessage,
    handleError,
    setShowLogin
}: UseSendMessageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const sendMessage = useCallback(async (messageText: string) => {
        if (!chatService || isLoading || isAuthLoading || maintenanceStatus?.isUnderMaintenance || !isOnline) return;

        if (requireAuth && !user) {
            setShowLogin(true);
            return;
        }

        const userMessage = addNewMessage({
            content: messageText,
            role: 'user',
            userId: user?.id,
        });

        setInputValue('');
        setIsLoading(true);
        onMessageSent?.(userMessage);

        try {
            const response = await chatService.sendMessage(messageText);
            const assistantMessage = addNewMessage({
                content: response,
                role: 'assistant',
                userId: user?.id,
            });

            onMessageReceived?.(assistantMessage);
        } catch (error) {
            const errorMessage = handleError(error);
            addNewMessage({
                content: errorMessage,
                role: 'assistant',
                userId: user?.id,
            });
        } finally {
            setIsLoading(false);
        }
    }, [
        chatService,
        isLoading,
        isAuthLoading,
        maintenanceStatus,
        isOnline,
        requireAuth,
        user,
        addNewMessage,
        onMessageSent,
        onMessageReceived,
        handleError,
        setShowLogin
    ]);

    return {
        sendMessage,
        isLoading,
        inputValue,
        setInputValue
    };
} 