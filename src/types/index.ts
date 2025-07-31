export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    userId?: string;
    isNew?: boolean;
}

export interface ChatTheme {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    spacing?: string;
    borderRadius?: string;
}

export interface ChatWidgetProps {
    usePremium?: boolean;
    theme?: ChatTheme;
    initialMessage?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    darkMode?: boolean;
    avatarUrl?: string;
    title?: string;
    subtitle?: string;
    placeholder?: string;
    maxHeight?: string;
    onMessageSent?: (message: ChatMessage) => void;
    onMessageReceived?: (message: ChatMessage) => void;
    requireAuth?: boolean;
}

export interface User {
    email: string;
    password: string;
    name: string;
}