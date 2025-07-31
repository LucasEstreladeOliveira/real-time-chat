import React from 'react';
import { DefaultAvatar } from '../DefaultAvatar';

interface LoadingBubbleProps {
    avatarUrl?: string;
    title?: string;
}

export const LoadingBubble: React.FC<LoadingBubbleProps> = ({
    avatarUrl,
    title = 'Assistant'
}) => {
    return (
        <div className="group flex items-start gap-3 animate-fade-in">
            <div className="flex-shrink-0">
                {avatarUrl ? (
                    <img src={avatarUrl} alt={title} className="w-8 h-8 rounded-full" />
                ) : (
                    <DefaultAvatar size={32} />
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="bg-secondary rounded-2xl p-3 inline-block max-w-full">
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 