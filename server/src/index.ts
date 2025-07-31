import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Types
interface ChatRequest {
    message: string;
    context?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface ChatResponse {
    success: boolean;
    message?: string;
    error?: string;
}

interface PremiumStatusResponse {
    isPremium: boolean;
    error?: string;
}

interface OpenAIMessageContent {
    type: string;
    text: string;
    annotations?: any[];
    logprobs?: any[];
}

interface OpenAIMessage {
    id: string;
    type: string;
    status: string;
    content: OpenAIMessageContent[];
    role: string;
}

interface OpenAIResponse {
    message: OpenAIMessage[];
}

// Check premium status endpoint
app.get('/api/premium-status', (req, res) => {
    try {
        const hasValidKey = !!process.env.OPENAI_API_KEY;
        res.json({
            isPremium: hasValidKey,
        });
    } catch (error) {
        console.error('Error checking premium status:', error);
        res.status(500).json({
            isPremium: false,
            error: 'Failed to check premium status',
        });
    }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context = [] } = req.body as ChatRequest;

        const completion = await openai.responses.create({
            model: "gpt-4.1",
            input: message,
        });

        const responseText = completion.output_text;
        console.log('responseText', responseText);
        if (!responseText) {
            throw new Error('Invalid response format from OpenAI');
        }

        res.json({
            success: true,
            message: responseText,
        });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get AI response',
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 