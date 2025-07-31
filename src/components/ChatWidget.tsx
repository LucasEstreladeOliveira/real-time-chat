import React from 'react';
import { ChatWidgetProps } from '../types';
import { AuthProvider } from '../contexts/AuthContext';
import { MessageProvider } from '../contexts/MessageContext';
import { ChatUIProvider } from '../contexts/ChatUIContext';
import { ChatStateProvider } from '../contexts/ChatStateContext';
import '../styles/index.css';
import { ChatWidgetWrapper } from './chat/ChatWidgetWrapper';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
    apiKey,
    theme = {},
    position = 'bottom-right',
    title = 'Chat Assistant',
    subtitle,
    placeholder = 'Type your message...',
    maxHeight = '600px',
    avatarUrl,
    initialMessage = "Hi! How can I help you today?",
    requireAuth = false,
    onMessageSent,
    onMessageReceived,
}) => {
    const positionStyles = {
        'bottom-right': { bottom: '20px', right: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' },
        'top-right': { top: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' },
    };

    const themeVars = {
        '--chat-primary-color': theme.primaryColor || '',
        '--chat-secondary-color': theme.secondaryColor || '',
        '--chat-accent-color': theme.accentColor || '',
        '--chat-background-color': theme.backgroundColor || '',
        '--chat-text-color': theme.textColor || '',
        '--chat-spacing': theme.spacing || '',
        '--chat-border-radius': theme.borderRadius || '',
    };

    return (
        <div>
            <AuthProvider>
                <MessageProvider>
                    <ChatUIProvider
                        theme={theme}
                        position={position}
                        title={title}
                        subtitle={subtitle}
                        placeholder={placeholder}
                        maxHeight={maxHeight}
                        avatarUrl={avatarUrl}
                        positionStyles={positionStyles}
                        themeVars={themeVars}
                    >
                        <ChatStateProvider
                            apiKey={apiKey}
                            initialMessage={initialMessage}
                            requireAuth={requireAuth}
                            onMessageSent={onMessageSent}
                            onMessageReceived={onMessageReceived}
                        >
                            <ChatWidgetWrapper />
                        </ChatStateProvider>
                    </ChatUIProvider>
                </MessageProvider>
            </AuthProvider>
        </div>
    );
}; 