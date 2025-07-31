import React, { useState, useCallback } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { ChatMessage } from '../../types';
import { User } from '../../utils/auth';
import { formatTime } from '../../utils/formatTime';
import { TypingMessage } from './TypingMessage';
import { MarkdownMessage } from './MarkdownMessage';
import { useMessageVisibility } from '../../hooks/useMessageVisibility';

interface MessageBubbleProps {
    message: ChatMessage;
    user: User | null;
    avatarUrl?: string;
    title: string;
    onMessageSeen?: (message: ChatMessage) => void;
}

const MessageAvatar: React.FC<{ isUser: boolean; user: User | null; avatarUrl?: string; title: string }> = ({
    isUser,
    user,
    avatarUrl,
    title,
}) => (
    <Avatar.Root className="w-6 h-6 rounded-full overflow-hidden bg-secondary flex-shrink-0 mb-1">
        {isUser ? (
            user && (
                <>
                    <Avatar.Image src={user.avatar} alt={user.name} />
                    <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
                </>
            )
        ) : (
            <>
                <Avatar.Image src={avatarUrl} alt={title} />
                <Avatar.Fallback>AI</Avatar.Fallback>
            </>
        )}
    </Avatar.Root>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    user,
    avatarUrl,
    title,
    onMessageSeen,
}) => {
    const isUser = message.role === 'user';
    const [isTypingComplete, setIsTypingComplete] = useState(isUser);
    const formattedTime = message.timestamp instanceof Date ? formatTime(message.timestamp) : '';

    const handleVisible = useCallback((seenMessage: ChatMessage) => {
        if (isTypingComplete) {
            onMessageSeen?.(seenMessage);
        }
    }, [onMessageSeen, isTypingComplete]);

    const messageRef = useMessageVisibility(message, handleVisible);

    return (
        <div
            ref={messageRef}
            className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {(isUser ? user : true) && (
                <MessageAvatar
                    isUser={isUser}
                    user={user}
                    avatarUrl={avatarUrl}
                    title={title}
                />
            )}
            <div className={`group relative flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isUser
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-secondary text-text rounded-bl-sm'
                    }`}>
                    {isUser || !message.isNew ? (
                        <MarkdownMessage content={message.content} isUser={isUser} />
                    ) : (
                        <TypingMessage
                            content={message.content}
                            onComplete={() => {
                                setIsTypingComplete(true);
                                onMessageSeen?.(message);
                            }}
                            isUser={isUser}
                        />
                    )}
                </div>
                {isTypingComplete && formattedTime && (
                    <span className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {formattedTime}
                    </span>
                )}
            </div>
        </div>
    );
}; 