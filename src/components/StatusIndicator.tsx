import React from 'react';

interface StatusIndicatorProps {
    isOnline: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isOnline }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="relative flex">
                <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div
                    className={`absolute w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} animate-ping`}
                    style={{ animationDuration: '2s' }}
                />
            </div>
            <span className="text-sm text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
            </span>
        </div>
    );
}; 