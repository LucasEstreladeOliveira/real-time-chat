import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface TypingMessageProps {
    content: string;
    onComplete?: () => void;
    isUser: boolean;
}

export const TypingMessage: React.FC<TypingMessageProps> = ({ content, onComplete, isUser }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const words = content.split(' ');

    const addNextWord = useCallback(() => {
        if (currentWordIndex < words.length) {
            setDisplayedText(prev =>
                prev + (prev ? ' ' : '') + words[currentWordIndex]
            );
            setCurrentWordIndex(prev => prev + 1);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentWordIndex, words, onComplete]);

    useEffect(() => {
        const minDelay = 50;  // Minimum delay between words
        const maxDelay = 150; // Maximum delay between words
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;

        const timer = setTimeout(addNextWord, delay);
        return () => clearTimeout(timer);
    }, [currentWordIndex, addNextWord]);

    const components: Components = {
        p: ({ children, ...props }) => (
            <p className="mb-2 last:mb-0" {...props}>{children}</p>
        ),
        a: ({ children, href, ...props }) => (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${isUser ? 'text-white/90 hover:text-white' : 'text-primary hover:text-accent'}`}
                {...props}
            >
                {children}
            </a>
        ),
        ul: ({ children, ...props }) => (
            <ul className="list-disc ml-4 mb-2" {...props}>{children}</ul>
        ),
        ol: ({ children, ...props }) => (
            <ol className="list-decimal ml-4 mb-2" {...props}>{children}</ol>
        ),
        li: ({ children, ...props }) => (
            <li className="mb-1" {...props}>{children}</li>
        ),
        code: ({ children, className, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const isInline = !className || !lang;

            if (isInline) {
                return (
                    <code
                        className={`px-1 py-0.5 rounded-sm ${isUser ? 'bg-black/20' : 'bg-gray-100'} font-mono text-sm ${className || ''}`}
                        {...props}
                    >
                        {children}
                    </code>
                );
            }
            return (
                <pre className={`p-3 rounded-lg ${isUser ? 'bg-black/20' : 'bg-gray-100'} font-mono text-sm overflow-x-auto mb-2 ${lang ? `language-${lang}` : ''}`}>
                    <code {...props}>{children}</code>
                </pre>
            );
        },
        blockquote: ({ children, ...props }) => (
            <blockquote
                className={`border-l-4 ${isUser ? 'border-white/30' : 'border-gray-300'} pl-3 mb-2 italic`}
                {...props}
            >
                {children}
            </blockquote>
        ),
        h1: ({ children, ...props }) => (
            <h1 className="text-xl font-bold mb-2" {...props}>{children}</h1>
        ),
        h2: ({ children, ...props }) => (
            <h2 className="text-lg font-bold mb-2" {...props}>{children}</h2>
        ),
        h3: ({ children, ...props }) => (
            <h3 className="text-base font-bold mb-2" {...props}>{children}</h3>
        ),
        hr: (props) => (
            <hr className={`my-4 border-t ${isUser ? 'border-white/30' : 'border-gray-300'}`} {...props} />
        ),
        table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-2">
                <table className="min-w-full divide-y divide-gray-300" {...props}>{children}</table>
            </div>
        ),
        th: ({ children, ...props }) => (
            <th
                className={`px-3 py-2 text-left font-semibold ${isUser ? 'text-white/90' : 'text-gray-900'}`}
                {...props}
            >
                {children}
            </th>
        ),
        td: ({ children, ...props }) => (
            <td
                className={`px-3 py-2 ${isUser ? 'text-white/80' : 'text-gray-700'}`}
                {...props}
            >
                {children}
            </td>
        ),
    };

    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={components}
            >
                {displayedText}
            </ReactMarkdown>
            {currentWordIndex < words.length && (
                <span className="typing-cursor" />
            )}
        </div>
    );
}; 