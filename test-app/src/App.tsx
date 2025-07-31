import React, { useState, useEffect, useRef } from 'react';
import ChatAI from '../../src';

const themes = {
    blue: {
        primaryColor: '#0066cc',
        secondaryColor: '#f0f0f0',
        accentColor: '#0052a3',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        spacing: '1rem',
        borderRadius: '0.75rem',
    },
    dark: {
        primaryColor: '#6366f1',
        secondaryColor: '#1f2937',
        accentColor: '#4f46e5',
        backgroundColor: '#111827',
        textColor: '#ffffff',
        spacing: '1rem',
        borderRadius: '0.75rem',
    },
    green: {
        primaryColor: '#059669',
        secondaryColor: '#f0fdf4',
        accentColor: '#047857',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        spacing: '1rem',
        borderRadius: '0.75rem',
    },
};

const STORAGE_KEY = 'chat-widget-api-key';

function App() {
    const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('blue');
    const [requireAuth, setRequireAuth] = useState(false);
    const [apiKey, setApiKey] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) || '';
        } catch (error) {
            console.error('Failed to load API key from localStorage:', error);
            return '';
        }
    });
    const [chatInitialized, setChatInitialized] = useState(() => Boolean(apiKey));
    const chatInstanceRef = useRef<(() => void) | null>(null);

    // Save API key to localStorage whenever it changes
    useEffect(() => {
        try {
            if (apiKey) {
                localStorage.setItem(STORAGE_KEY, apiKey);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            console.error('Failed to save API key to localStorage:', error);
        }
    }, [apiKey]);

    useEffect(() => {
        let isMounted = true;

        const initChat = async () => {
            if (!apiKey) return;

            if (chatInstanceRef.current) {
                chatInstanceRef.current();
                chatInstanceRef.current = null;
            }
            if (isMounted) {
                const unmount = ChatAI({
                    apiKey,
                    title: "AI Assistant",
                    avatarUrl: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                    theme: themes[selectedTheme],
                    requireAuth,
                    onMessageSent: (message) => {
                        console.log("Message sent:", message);
                    },
                    onMessageReceived: (message) => {
                        console.log("Message received:", message);
                    }
                });
                chatInstanceRef.current = unmount;
            }
        };

        initChat().catch(console.error);

        return () => {
            isMounted = false;
            if (chatInstanceRef.current) {
                chatInstanceRef.current();
                chatInstanceRef.current = null;
            }
        };
    }, [selectedTheme, requireAuth, apiKey]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            setApiKey(apiKey.trim());
            setChatInitialized(true);
        }
    };

    const handleReset = () => {
        setApiKey('');
        setChatInitialized(false);
        if (chatInstanceRef.current) {
            chatInstanceRef.current();
            chatInstanceRef.current = null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <div className="w-full max-w-md space-y-4 bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Chat Widget Demo</h1>
                    {chatInitialized && (
                        <button
                            onClick={handleReset}
                            className="text-sm text-gray-600 hover:text-red-600"
                        >
                            Reset API Key
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {!chatInitialized && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    OpenAI API Key
                                </label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="sk-..."
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Enter your OpenAI API key to start chatting
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!apiKey.trim()}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Initialize Chat
                            </button>
                        </form>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Theme
                        </label>
                        <select
                            value={selectedTheme}
                            onChange={(e) => setSelectedTheme(e.target.value as keyof typeof themes)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="blue">Blue</option>
                            <option value="dark">Dark</option>
                            <option value="green">Green</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={requireAuth}
                                onChange={(e) => setRequireAuth(e.target.checked)}
                                className="rounded"
                            />
                            <span>Require Authentication</span>
                        </label>
                    </div>
                </div>
            </div>

            {requireAuth && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                    <p className="text-yellow-700">
                        When authentication is required, use these demo credentials:
                    </p>
                    <p className="text-yellow-600 text-sm mt-2">
                        Email: user@example.com<br />
                        Password: password123
                    </p>
                </div>
            )}
        </div>
    );
}

export default App; 