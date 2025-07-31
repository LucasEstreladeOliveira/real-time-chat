import React from 'react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (message: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    disabled?: boolean;
    maintenanceStatus?: {
        isUnderMaintenance: boolean;
        message: string;
        estimatedEndTime?: string;
    } | null;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChange,
    onSend,
    placeholder = 'Type a message...',
    isLoading = false,
    disabled = false,
    maintenanceStatus,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim() || isLoading || disabled) return;
        onSend(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={maintenanceStatus?.isUnderMaintenance
                            ? 'Chat is temporarily unavailable due to maintenance'
                            : placeholder}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
                        disabled={isLoading || disabled}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!value.trim() || isLoading || disabled}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}; 