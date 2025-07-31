import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { ChatMessage } from '../../types';
import { User } from '../../utils/auth';
import { MessageBubble } from './MessageBubble';
import { LoadingBubble } from './LoadingBubble';

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    user: User | null;
    avatarUrl?: string;
    title: string;
    onMessageSeen?: (message: ChatMessage) => void;
}

export interface MessageListRef {
    scrollToBottom: () => void;
}

export const MessageList = forwardRef<MessageListRef, MessageListProps>(({
    messages,
    isLoading,
    user,
    avatarUrl,
    title,
    onMessageSeen,
}, ref) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (viewportRef.current) {
            const scrollHeight = viewportRef.current.scrollHeight;
            viewportRef.current.scrollTo({
                top: scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // Expose scrollToBottom method through ref
    useImperativeHandle(ref, () => ({
        scrollToBottom
    }));

    // Scroll to bottom when messages change or when loading state changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <ScrollArea.Root className="flex-1 h-[400px]">
            <ScrollArea.Viewport ref={viewportRef} className="h-full w-full">
                <div className="space-y-4 p-4">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isUser={message.role === 'user'}
                            avatarUrl={avatarUrl}
                            title={title}
                            onMessageSeen={onMessageSeen}
                        />
                    ))}
                    {isLoading && (
                        <LoadingBubble
                            avatarUrl={avatarUrl}
                            title={title}
                        />
                    )}
                </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-secondary/20 transition-colors duration-150 ease-out hover:bg-secondary/30 data-[orientation=vertical]:w-2"
                orientation="vertical"
            >
                <ScrollArea.Thumb className="flex-1 bg-secondary rounded-full relative" />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    );
}); 