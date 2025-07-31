import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

interface LoadingBubbleProps {
    avatarUrl?: string;
    title: string;
}

export const LoadingBubble: React.FC<LoadingBubbleProps> = ({ avatarUrl, title }) => (
    <div className="flex items-end gap-2">
        <Avatar.Root className="w-6 h-6 rounded-full overflow-hidden bg-secondary flex-shrink-0 mb-1">
            <Avatar.Image src={avatarUrl} alt={title} />
            <Avatar.Fallback>AI</Avatar.Fallback>
        </Avatar.Root>
        <div className="bg-secondary text-text rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-text rounded-full animate-bounce-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-text rounded-full animate-bounce-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-text rounded-full animate-bounce-pulse" style={{ animationDelay: '300ms' }} />
        </div>
    </div>
); 