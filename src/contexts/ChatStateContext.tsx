import React, { createContext, useContext, useRef } from 'react';
import { ChatMessage, MaintenanceStatus } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useMaintenanceStatus } from '../hooks/useMaintenanceStatus';
import { useChatService } from '../hooks/useChatService';
import { useChatMessages } from '../hooks/useChatMessages';
import { useSendMessage } from '../hooks/useSendMessage';
import { useAuth } from './AuthContext';
import { MessageListRef } from '../components/chat/MessageList';

interface ChatStateContextType {
    isOnline: boolean;
    maintenanceStatus: MaintenanceStatus | null;
    error: string | null;
    isLoading: boolean;
    messages: ChatMessage[];
    inputValue: string;
    setInputValue: (value: string) => void;
    sendMessage: (message: string) => void;
    handleMessageSeen: (message: ChatMessage) => void;
    messageListRef: React.RefObject<MessageListRef | null>;
}

const ChatStateContext = createContext<ChatStateContextType | null>(null);

interface ChatStateProviderProps {
    children: React.ReactNode;
    apiKey: string;
    initialMessage?: string;
    requireAuth?: boolean;
    onMessageSent?: (message: ChatMessage) => void;
    onMessageReceived?: (message: ChatMessage) => void;
}

export function ChatStateProvider({
    children,
    apiKey,
    initialMessage = "Hi! How can I help you today?",
    requireAuth = false,
    onMessageSent,
    onMessageReceived,
}: ChatStateProviderProps) {
    const { user, isLoading: isAuthLoading, setShowLogin } = useAuth();
    const isOnline = useOnlineStatus();
    const maintenanceStatus = useMaintenanceStatus();
    const { chatService, error, handleError } = useChatService(apiKey);
    const messageListRef = useRef<MessageListRef>(null);

    const {
        messages,
        addNewMessage,
        handleMessageSeen,
    } = useChatMessages({
        initialMessage,
        userId: user?.id,
        isOpen: true // We'll manage this through ChatUIContext
    });

    const {
        sendMessage,
        isLoading,
        inputValue,
        setInputValue
    } = useSendMessage({
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
    });

    const value = {
        isOnline,
        maintenanceStatus,
        error,
        isLoading,
        messages,
        inputValue,
        setInputValue,
        sendMessage,
        handleMessageSeen,
        messageListRef,
    };

    return (
        <ChatStateContext.Provider value={value}>
            {children}
        </ChatStateContext.Provider>
    );
}

export function useChatState() {
    const context = useContext(ChatStateContext);
    if (!context) {
        throw new Error('useChatState must be used within a ChatStateProvider');
    }
    return context;
} 