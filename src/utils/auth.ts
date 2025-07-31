export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
    'user@example.com': {
        password: 'password123',
        user: {
            id: '1',
            name: 'Demo User',
            email: 'user@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user',
        },
    },
    'admin@example.com': {
        password: 'admin123',
        user: {
            id: '2',
            name: 'Admin User',
            email: 'admin@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-user',
        },
    },
};

export class AuthService {
    private static instance: AuthService;
    private currentUser: User | null = null;
    private listeners: ((user: User | null) => void)[] = [];

    private constructor() {
        // Try to restore session from localStorage
        const savedUser = localStorage.getItem('chat_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userRecord = MOCK_USERS[email];
        if (!userRecord || userRecord.password !== password) {
            return {
                success: false,
                error: 'Invalid email or password',
            };
        }

        this.currentUser = userRecord.user;
        localStorage.setItem('chat_user', JSON.stringify(this.currentUser));
        this.notifyListeners();

        return {
            success: true,
            user: this.currentUser,
        };
    }

    async register(email: string, password: string, name: string): Promise<AuthResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (MOCK_USERS[email]) {
            return {
                success: false,
                error: 'Email already exists',
            };
        }

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        MOCK_USERS[email] = {
            password,
            user: newUser,
        };

        this.currentUser = newUser;
        localStorage.setItem('chat_user', JSON.stringify(this.currentUser));
        this.notifyListeners();

        return {
            success: true,
            user: newUser,
        };
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('chat_user');
        this.notifyListeners();
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    addListener(listener: (user: User | null) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.currentUser));
    }
} 