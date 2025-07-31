import React, { createContext, useContext, useState } from 'react';
import { Theme } from '../types';

interface ChatUIContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    theme: Theme;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    title: string;
    subtitle?: string;
    placeholder: string;
    maxHeight: string;
    avatarUrl?: string;
    positionStyles?: Record<string, React.CSSProperties>;
    themeVars?: Record<string, string>;
}

const ChatUIContext = createContext<ChatUIContextType | null>(null);

interface ChatUIProviderProps {
    children: React.ReactNode;
    theme?: Theme;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    title?: string;
    subtitle?: string;
    placeholder?: string;
    maxHeight?: string;
    avatarUrl?: string;
    positionStyles?: Record<string, React.CSSProperties>;
    themeVars?: Record<string, string>;
}

export function ChatUIProvider({
    children,
    theme = {},
    position = 'bottom-right',
    title = 'Chat Assistant',
    subtitle,
    placeholder = 'Type your message...',
    maxHeight = '600px',
    avatarUrl,
    positionStyles,
    themeVars,
}: ChatUIProviderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const value = {
        isOpen,
        setIsOpen,
        theme,
        position,
        title,
        subtitle,
        placeholder,
        maxHeight,
        avatarUrl,
        positionStyles,
        themeVars,
    };

    return (
        <ChatUIContext.Provider value={value}>
            {children}
        </ChatUIContext.Provider>
    );
}

export function useChatUI() {
    const context = useContext(ChatUIContext);
    if (!context) {
        throw new Error('useChatUI must be used within a ChatUIProvider');
    }
    return context;
} 