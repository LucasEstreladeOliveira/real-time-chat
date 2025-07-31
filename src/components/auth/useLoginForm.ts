import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface UseLoginFormProps {
    onSuccess: () => void;
}

export const useLoginForm = ({ onSuccess }: UseLoginFormProps) => {
    const { login, register, error: authError, clearError, setShowLogin, user } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        clearError();
        setIsLoading(true);

        try {
            if (isLogin) {
                await login({ email, password, onSuccess });
            } else {
                await register({ email, password, name, onSuccess });
            }

            setShowLogin(false);
        } catch (err) {
            setError(authError || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        clearError();
    };

    return {
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
    };
}; 