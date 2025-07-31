import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ChatMessage } from '../types';

interface MessageContextType {
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
    clearMessages: () => void;
    getMessagesForUser: (userId: string | null) => ChatMessage[];
}

const MessageContext = createContext<MessageContextType | null>(null);

const STORAGE_KEY = 'chat-messages';

interface StoredMessages {
    [userId: string]: ChatMessage[];
}

// Helper function to serialize dates before storing
const serializeMessage = (message: ChatMessage): SerializedChatMessage => ({
    ...message,
    timestamp: message.timestamp.toISOString(),
});

// Helper function to deserialize dates after loading
const deserializeMessage = (message: SerializedChatMessage): ChatMessage => ({
    ...message,
    timestamp: new Date(message.timestamp),
});

interface SerializedChatMessage extends Omit<ChatMessage, 'timestamp'> {
    timestamp: string;
}

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
};

interface MessageProviderProps {
    children: React.ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
    const [messagesByUser, setMessagesByUser] = useState<StoredMessages>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return {};

            const parsed = JSON.parse(stored) as Record<string, SerializedChatMessage[]>;
            // Deserialize dates for all messages
            return Object.fromEntries(
                Object.entries(parsed).map(([userId, messages]) => [
                    userId,
                    messages.map(deserializeMessage)
                ])
            );
        } catch (error) {
            console.error('Failed to load messages from localStorage:', error);
            return {};
        }
    });

    useEffect(() => {
        try {
            // Serialize dates before storing
            const serialized = Object.fromEntries(
                Object.entries(messagesByUser).map(([userId, messages]) => [
                    userId,
                    messages.map(serializeMessage)
                ])
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
        } catch (error) {
            console.error('Failed to save messages to localStorage:', error);
        }
    }, [messagesByUser]);

    const addMessage = useCallback((message: ChatMessage) => {
        setMessagesByUser(prev => {
            const userId = message.userId || 'anonymous';
            const userMessages = prev[userId] || [];

            // Keep only the last 50 messages per user
            const updatedMessages = [...userMessages, message].slice(-50);

            return {
                ...prev,
                [userId]: updatedMessages,
            };
        });
    }, []);

    const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
        setMessagesByUser(prev => {
            const newMessagesByUser = { ...prev };

            // Find the user that has this message
            for (const [userId, messages] of Object.entries(newMessagesByUser)) {
                const messageIndex = messages.findIndex(msg => msg.id === messageId);
                if (messageIndex !== -1) {
                    // Update the message
                    const updatedMessages = [...messages];
                    updatedMessages[messageIndex] = {
                        ...updatedMessages[messageIndex],
                        ...updates,
                    };
                    newMessagesByUser[userId] = updatedMessages;
                    break;
                }
            }

            return newMessagesByUser;
        });
    }, []);

    const clearMessages = useCallback(() => {
        setMessagesByUser({});
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const getMessagesForUser = useCallback((userId: string | null) => {
        const key = userId || 'anonymous';
        return messagesByUser[key] || [];
    }, [messagesByUser]);

    const value = {
        messages: Object.values(messagesByUser).flat(),
        addMessage,
        updateMessage,
        clearMessages,
        getMessagesForUser,
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
}; 