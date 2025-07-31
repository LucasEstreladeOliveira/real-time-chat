import { useCallback, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { useMessages } from '../contexts/MessageContext';
import { MessageListRef } from '../components/chat/MessageList';

interface UseChatMessagesProps {
    initialMessage?: string;
    userId?: string;
    isOpen?: boolean;
}

export function useChatMessages({ initialMessage, userId, isOpen }: UseChatMessagesProps) {
    const { messages, addMessage, updateMessage, getMessagesForUser } = useMessages();
    const messageListRef = useRef<MessageListRef>(null);

    // Add initial message if no messages exist
    useEffect(() => {
        const userMessages = getMessagesForUser(userId || null);
        if (userMessages.length === 0 && initialMessage) {
            addMessage({
                id: 'initial',
                content: initialMessage,
                role: 'assistant',
                timestamp: new Date(),
                userId: userId,
            });
        }
    }, [initialMessage, userId, addMessage, getMessagesForUser]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messageListRef.current?.scrollToBottom();
    }, [messages]);

    // Scroll to bottom when chat is opened
    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure the chat is fully rendered
            const timer = setTimeout(() => {
                messageListRef.current?.scrollToBottom();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleMessageSeen = useCallback((seenMessage: ChatMessage) => {
        if (!seenMessage.isNew) return;
        updateMessage(seenMessage.id, { isNew: false });
        messageListRef.current?.scrollToBottom();
    }, [updateMessage]);

    const addNewMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp' | 'isNew'>) => {
        const newMessage: ChatMessage = {
            ...message,
            id: `${message.role}-${Date.now()}`,
            timestamp: new Date(),
            isNew: true,
        };
        addMessage(newMessage);
        messageListRef.current?.scrollToBottom();
        return newMessage;
    }, [addMessage]);

    return {
        messages: getMessagesForUser(userId || null),
        addNewMessage,
        handleMessageSeen,
        messageListRef
    };
} 