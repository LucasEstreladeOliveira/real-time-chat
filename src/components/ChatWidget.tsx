import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Theme } from '@radix-ui/themes';
import { createChatService, ChatService } from '../utils/chatService';
import { ChatMessage, ChatWidgetProps } from '../types';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { MessageProvider, useMessages } from '../contexts/MessageContext';
import { OpenAIError } from '../utils/openai';
import { LoginForm } from './LoginForm';
import { ChatHeader } from './chat/ChatHeader';
import { MessageList, MessageListRef } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import '../styles/index.css';
import { DefaultAvatar } from './DefaultAvatar';

const ChatWidgetContent: React.FC<ChatWidgetProps> = ({
    apiKey,
    theme = {},
    initialMessage = "Hi! How can I help you today?",
    position = 'bottom-right',
    darkMode = false,
    avatarUrl,
    title = 'Chat Assistant',
    subtitle,
    placeholder = 'Type your message...',
    maxHeight = '600px',
    onMessageSent,
    onMessageReceived,
    requireAuth = false,
}) => {
    const { user, logout, showLogin, setShowLogin, isLoading: isAuthLoading } = useAuth();
    const { messages, addMessage, updateMessage, getMessagesForUser } = useMessages();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatService, setChatService] = useState<ChatService | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [maintenanceStatus, setMaintenanceStatus] = useState<{
        isUnderMaintenance: boolean;
        message: string;
        estimatedEndTime?: string;
    } | null>(null);
    const [isOnline, setIsOnline] = useState(true);
    const messageListRef = useRef<MessageListRef>(null);

    // Check online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Set initial status
        setIsOnline(navigator.onLine);

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Check maintenance status using event system
    useEffect(() => {
        const handleMaintananceActive = () => setMaintenanceStatus({
            isUnderMaintenance: true,
            message: "System is under maintenance",
            estimatedEndTime: new Date(new Date().getTime() + 30 * 60000).toLocaleTimeString(),
        });
        const handleMaintananceInactive = () => setMaintenanceStatus({
            isUnderMaintenance: false,
            message: "System is operational",
        });

        // Add event listeners
        window.addEventListener('maintenanceStatusActive', handleMaintananceActive);
        window.addEventListener('maintenanceStatusInactive', handleMaintananceInactive);

        return () => {
            window.removeEventListener('maintenanceStatusActive', handleMaintananceActive);
            window.removeEventListener('maintenanceStatusInactive', handleMaintananceInactive);
        };
    }, []);

    // Initialize chat service
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

    // Add initial message if no messages exist
    useEffect(() => {
        const userMessages = getMessagesForUser(user?.id || null);
        if (userMessages.length === 0 && initialMessage) {
            addMessage({
                id: 'initial',
                content: initialMessage,
                role: 'assistant',
                timestamp: new Date(),
                userId: user?.id,
            });
        }
    }, [initialMessage, user, addMessage, getMessagesForUser]);

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

    const sendMessage = useCallback(async (messageText: string) => {
        if (!chatService || isLoading || isAuthLoading || maintenanceStatus?.isUnderMaintenance || !isOnline) return;

        if (requireAuth && !user) {
            setShowLogin(true);
            return;
        }

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            content: messageText,
            role: 'user',
            timestamp: new Date(),
            userId: user?.id,
            isNew: true,
        };

        addMessage(userMessage);
        setInputValue('');
        setIsLoading(true);
        setError(null);
        onMessageSent?.(userMessage);
        messageListRef.current?.scrollToBottom();

        try {
            const response = await chatService.sendMessage(messageText);
            const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                content: response,
                role: 'assistant',
                timestamp: new Date(),
                userId: user?.id,
                isNew: true,
            };

            addMessage(assistantMessage);
            onMessageReceived?.(assistantMessage);
            messageListRef.current?.scrollToBottom();
        } catch (error) {
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
            const errorResponse: ChatMessage = {
                id: `error-${Date.now()}`,
                content: errorMessage,
                role: 'assistant',
                timestamp: new Date(),
                userId: user?.id,
                isNew: true,
            };
            addMessage(errorResponse);
            messageListRef.current?.scrollToBottom();
        } finally {
            setIsLoading(false);
        }
    }, [chatService, isLoading, isAuthLoading, maintenanceStatus, isOnline, requireAuth, user, addMessage, onMessageSent, onMessageReceived, setShowLogin]);

    const handleLogout = useCallback(() => {
        logout();
        addMessage({
            id: 'logout',
            content: initialMessage,
            role: 'assistant',
            timestamp: new Date(),
            userId: undefined,
            isNew: true,
        });
        messageListRef.current?.scrollToBottom();
    }, [logout, initialMessage, addMessage]);

    const handleMessageSeen = useCallback((seenMessage: ChatMessage) => {
        if (!seenMessage.isNew) return;
        updateMessage(seenMessage.id, { isNew: false });
        messageListRef.current?.scrollToBottom();
    }, [updateMessage]);

    const effectiveSubtitle = subtitle || 'Powered by AI';

    const positionStyles = {
        'bottom-right': { bottom: '20px', right: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' },
        'top-right': { top: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' },
    };

    const themeVars = {
        '--chat-primary-color': theme.primaryColor,
        '--chat-secondary-color': theme.secondaryColor,
        '--chat-accent-color': theme.accentColor,
        '--chat-background-color': theme.backgroundColor,
        '--chat-text-color': theme.textColor,
        '--chat-spacing': theme.spacing,
        '--chat-border-radius': theme.borderRadius,
    };

    const currentMessages = getMessagesForUser(user?.id || null);

    return (
        <Theme>
            <div
                className={`chat-widget fixed z-50 ${darkMode ? 'dark' : ''}`}
                style={{ ...positionStyles[position], ...themeVars }}
            >
                <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`rounded-full bg-primary p-3 text-white shadow-lg hover:bg-accent transition-colors ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                    >
                        <DefaultAvatar size={24} className="text-white" />
                    </button>

                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Content
                            className="fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-background shadow-xl data-[state=open]:animate-contentShow flex flex-col overflow-hidden"
                            style={{ height: maxHeight }}
                        >
                            <ChatHeader
                                title={title}
                                subtitle={subtitle || 'Powered by AI'}
                                onClose={() => setIsOpen(false)}
                                user={user}
                                onLogout={handleLogout}
                                isOnline={isOnline}
                            />
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                    <p className="text-red-700 text-sm">
                                        {error}
                                    </p>
                                </div>
                            )}
                            <MessageList
                                messages={currentMessages}
                                isLoading={isLoading}
                                user={user}
                                avatarUrl={avatarUrl}
                                title={title}
                                ref={messageListRef}
                                onMessageSeen={handleMessageSeen}
                            />
                            <ChatInput
                                value={inputValue}
                                onChange={setInputValue}
                                onSend={sendMessage}
                                placeholder={!isOnline ? 'Chat is offline. Please check your internet connection.' : placeholder}
                                isLoading={isLoading}
                                disabled={maintenanceStatus?.isUnderMaintenance || !isOnline}
                                maintenanceStatus={maintenanceStatus}
                            />
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>

                <Dialog.Root open={showLogin} onOpenChange={setShowLogin}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <LoginForm
                            onSuccess={() => {
                                setShowLogin(false);
                                if (inputValue.trim()) {
                                    sendMessage(inputValue);
                                }
                            }}
                            onClose={() => setShowLogin(false)}
                        />
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </Theme>
    );
};

export const ChatWidget: React.FC<ChatWidgetProps> = (props) => (
    <AuthProvider>
        <MessageProvider>
            <ChatWidgetContent {...props} />
        </MessageProvider>
    </AuthProvider>
); 