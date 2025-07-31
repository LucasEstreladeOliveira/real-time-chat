import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { LoginFormContent } from './auth/LoginFormContent';
import { useLoginForm } from './auth/useLoginForm';

interface LoginFormProps {
    onSuccess: () => void;
    onClose: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onClose }) => {
    const {
        isLogin,
        isLoading,
        error,
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        handleSubmit,
        toggleMode,
    } = useLoginForm({ onSuccess });

    return (
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[calc(100vw-40px)] rounded-chat bg-background p-6 shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4">
                {isLogin ? 'Login to Chat' : 'Create Account'}
            </Dialog.Title>

            <LoginFormContent
                isLogin={isLogin}
                isLoading={isLoading}
                error={error}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                name={name}
                setName={setName}
                onSubmit={handleSubmit}
                onToggleMode={toggleMode}
            />

            <Dialog.Close
                className="absolute top-4 right-4 text-text/50 hover:text-text"
                onClick={onClose}
            >
                ×
            </Dialog.Close>
        </Dialog.Content>
    );
}; 