import React from 'react';
import { User } from '../../utils/auth';
import { StatusIndicator } from '../StatusIndicator';

interface ChatHeaderProps {
    title: string;
    subtitle?: string;
    user: User | null;
    onLogout: () => void;
    onClose: () => void;
    isOnline?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    title,
    subtitle,
    user,
    onLogout,
    onClose,
    isOnline = true,
}) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-text">{title}</h2>
                    <StatusIndicator isOnline={isOnline} />
                </div>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
                {user && (
                    <button
                        onClick={onLogout}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Logout
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}; 