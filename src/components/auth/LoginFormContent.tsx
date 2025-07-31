import React from 'react';
import { FormInput } from './FormInput';
import { FormButton } from './FormButton';
import { ErrorMessage } from './ErrorMessage';

interface LoginFormContentProps {
    isLogin: boolean;
    isLoading: boolean;
    error: string | null;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onToggleMode: () => void;
}

export const LoginFormContent: React.FC<LoginFormContentProps> = ({
    isLogin,
    isLoading,
    error,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    onSubmit,
    onToggleMode,
}) => (
    <form onSubmit={onSubmit} className="space-y-4">
        {!isLogin && (
            <FormInput
                type="text"
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Enter your name"
                required
            />
        )}

        <FormInput
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            required
        />

        <FormInput
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
        />

        {error && <ErrorMessage message={error} />}

        <div className="flex flex-col space-y-2">
            <FormButton
                type="submit"
                disabled={isLoading}
            >
                {isLoading
                    ? 'Loading...'
                    : isLogin
                        ? 'Login'
                        : 'Create Account'}
            </FormButton>

            <FormButton
                type="button"
                variant="link"
                onClick={onToggleMode}
            >
                {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Login'}
            </FormButton>
        </div>
    </form>
); 