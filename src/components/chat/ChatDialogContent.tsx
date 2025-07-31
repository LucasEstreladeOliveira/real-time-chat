import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { MaintenanceBanner } from '../MaintenanceBanner';
import { useChatUI } from '../../contexts/ChatUIContext';
import { useChatState } from '../../contexts/ChatStateContext';
import { useAuth } from '../../contexts/AuthContext';

export const ChatDialogContent: React.FC = () => {
    const {
        title,
        subtitle,
        avatarUrl,
        placeholder,
        maxHeight,
        setIsOpen
    } = useChatUI();

    const {
        isOnline,
        error,
        maintenanceStatus,
        messages,
        isLoading,
        messageListRef,
        handleMessageSeen,
        inputValue,
        setInputValue,
        sendMessage
    } = useChatState();

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Dialog.Content
            className="fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-background shadow-xl data-[state=open]:animate-contentShow flex flex-col overflow-hidden"
            style={{ height: maxHeight }}
        >
            <ChatHeader
                title={title}
                subtitle={subtitle}
                onClose={() => setIsOpen(false)}
                user={user}
                onLogout={handleLogout}
                isOnline={isOnline}
            />
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-red-700 text-sm">
                        {error}
                    </p>
                </div>
            )}
            {maintenanceStatus?.isUnderMaintenance && (
                <MaintenanceBanner
                    message={maintenanceStatus.message}
                    estimatedEndTime={maintenanceStatus.estimatedEndTime}
                />
            )}
            <div className="flex-1 flex flex-col min-h-0">
                <MessageList
                    messages={messages}
                    isLoading={isLoading}
                    avatarUrl={avatarUrl}
                    ref={messageListRef}
                    onMessageSeen={handleMessageSeen}
                />
            </div>
            <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={sendMessage}
                placeholder={!isOnline ? 'Chat is offline. Please check your internet connection.' : placeholder}
                isLoading={isLoading}
                disabled={maintenanceStatus?.isUnderMaintenance || !isOnline}
                maintenanceStatus={maintenanceStatus}
            />
        </Dialog.Content>
    );
}; 