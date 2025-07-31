import React, { useState, useEffect } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { ChatMessage } from '../../types';
import { formatTime } from '../../utils/formatTime';
import { TypingMessage } from './TypingMessage';
import { MarkdownMessage } from './MarkdownMessage';
import { DefaultAvatar } from '../DefaultAvatar';

interface MessageBubbleProps {
    message: ChatMessage;
    isUser: boolean;
    avatarUrl?: string;
    onMessageSeen?: (message: ChatMessage) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isUser,
    avatarUrl,
    onMessageSeen,
}) => {
    const [isTypingComplete, setIsTypingComplete] = useState(isUser || !message.isNew);

    useEffect(() => {
        if (!isUser && message.isNew) {
            setIsTypingComplete(false);
        }
    }, [isUser, message.isNew]);

    const handleTypingComplete = () => {
        setIsTypingComplete(true);
        onMessageSeen?.(message);
    };

    return (
        <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar.Root className="flex-shrink-0">
                {isUser ? (
                    <Avatar.Image
                        className="w-8 h-8 rounded-full"
                        src={avatarUrl || 'https://github.com/shadcn.png'}
                        alt="User"
                    />
                ) : (
                    <Avatar.Fallback className="w-8 h-8 rounded-full">
                        <DefaultAvatar size={32} className='bg-primary p-2' />
                    </Avatar.Fallback>
                )}
            </Avatar.Root>
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] ${isUser
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                        }`}
                >
                    {!isUser && !isTypingComplete ? (
                        <TypingMessage
                            content={message.content}
                            onComplete={handleTypingComplete}
                            isUser={isUser}
                        />
                    ) : (
                        <MarkdownMessage content={message.content} isUser={isUser} />
                    )}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
}; 