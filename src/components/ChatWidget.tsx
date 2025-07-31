import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Theme } from '@radix-ui/themes';
import { createChatService, ChatService, checkPremiumStatus } from '../utils/chatService';
import { ChatMessage, ChatWidgetProps } from '../types';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { MessageProvider, useMessages } from '../contexts/MessageContext';
import { LoginForm } from './LoginForm';
import { ChatHeader } from './chat/ChatHeader';
import { MessageList, MessageListRef } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import '../styles/index.css';

const ChatWidgetContent: React.FC<ChatWidgetProps> = ({
    usePremium = false,
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
    const [isPremiumAvailable, setIsPremiumAvailable] = useState(false);
    const messageListRef = useRef<MessageListRef>(null);

    // Initialize chat service and check premium status
    useEffect(() => {
        const initChat = async () => {
            const service = createChatService(usePremium);
            setChatService(service);

            if (usePremium) {
                const isPremium = await checkPremiumStatus();
                setIsPremiumAvailable(isPremium);
            }
        };

        initChat();
    }, [usePremium]);

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
        if (!chatService || isLoading || isAuthLoading) return;

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
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                content: 'Sorry, I encountered an error. Please try again.',
                role: 'assistant',
                timestamp: new Date(),
                userId: user?.id,
                isNew: true,
            };
            addMessage(errorMessage);
            messageListRef.current?.scrollToBottom();
        } finally {
            setIsLoading(false);
        }
    }, [chatService, isLoading, isAuthLoading, requireAuth, user, addMessage, onMessageSent, onMessageReceived, setShowLogin]);

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

    const effectiveSubtitle = subtitle || (usePremium && isPremiumAvailable ? 'Powered by AI' : 'Free Tier');

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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                            />
                        </svg>
                    </button>

                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Content
                            className="fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-background shadow-xl data-[state=open]:animate-contentShow flex flex-col"
                            style={{ height: maxHeight }}
                        >
                            <ChatHeader
                                title={title}
                                subtitle={effectiveSubtitle}
                                onClose={() => setIsOpen(false)}
                                user={user}
                                onLogout={handleLogout}
                            />
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
                                placeholder={placeholder}
                                isLoading={isLoading}
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