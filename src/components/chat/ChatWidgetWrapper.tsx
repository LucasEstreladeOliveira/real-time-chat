import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Theme } from '@radix-ui/themes';
import { useAuth } from '../../contexts/AuthContext';
import { useChatUI } from '../../contexts/ChatUIContext';
import { useChatState } from '../../contexts/ChatStateContext';
import { LoginForm } from '../LoginForm';
import { ChatDialogContent } from './ChatDialogContent';
import { ChatTrigger } from './ChatTrigger';

export const ChatWidgetWrapper: React.FC = () => {
    const { showLogin, setShowLogin } = useAuth();
    const { isOpen, setIsOpen, darkMode, position, positionStyles, themeVars } = useChatUI();
    const { inputValue, sendMessage } = useChatState();

    return (
        <Theme>
            <div
                className={`chat-widget fixed z-50 ${darkMode ? 'dark' : ''}`}
                style={{ ...positionStyles?.[position], ...themeVars }}
            >
                <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                    <ChatTrigger />
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <ChatDialogContent />
                    </Dialog.Portal>
                </Dialog.Root>

                <Dialog.Root open={showLogin} onOpenChange={setShowLogin}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <LoginForm
                            onSuccess={() => {
                                setShowLogin(false);
                                if (inputValue.trim()) {
                                    sendMessage(inputValue);
                                }
                            }}
                            onClose={() => setShowLogin(false)}
                        />
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </Theme>
    );
};

