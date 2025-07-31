import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthResponse {
    success: boolean;
    error?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: ({ email, password, onSuccess }: { email: string, password: string, onSuccess: () => void }) => Promise<AuthResponse>;
    register: ({ email, password, name, onSuccess }: { email: string, password: string, name: string, onSuccess: () => void }) => Promise<AuthResponse>;
    logout: () => void;
    clearError: () => void;
    showLogin: boolean;
    setShowLogin: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

// Mock storage key
const AUTH_STORAGE_KEY = 'chat-widget-auth';

// Mock user database
const MOCK_USERS: Record<string, User & { password: string }> = {
    'user@example.com': {
        id: '1',
        name: 'Demo User',
        email: 'user@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user from storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error('Failed to parse stored user:', err);
            }
        }
        setIsLoading(false);
    }, []);

    // Mock authentication delay
    const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

    const login = useCallback(async ({ email, password, onSuccess }: { email: string, password: string, onSuccess: () => void }): Promise<AuthResponse> => {
        setError(null);
        setIsLoading(true);

        try {
            await mockDelay();

            const mockUser = MOCK_USERS[email];
            if (!mockUser || mockUser.password !== password) {
                throw new Error('Invalid email or password');
            }

            const { password: _, ...userWithoutPassword } = mockUser;
            await setUser(userWithoutPassword);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));

            onSuccess()
            return { success: true };
        } catch (err) {
            const error = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(error);
            return { success: false, error };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async ({ email, password, name, onSuccess }: { email: string, password: string, name: string, onSuccess: () => void }): Promise<AuthResponse> => {
        setError(null);
        setIsLoading(true);

        try {
            await mockDelay();

            if (MOCK_USERS[email]) {
                throw new Error('Email already exists');
            }

            const newUser: User = {
                id: Date.now().toString(),
                name,
                email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            };

            MOCK_USERS[email] = { ...newUser, password };
            await setUser(newUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

            onSuccess()
            return { success: true };
        } catch (err) {
            const error = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(error);
            return { success: false, error };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        user,
        showLogin,
        setShowLogin,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 