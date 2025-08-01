import React from 'react';
import { Components } from 'react-markdown';

interface CodeProps {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export function useMarkdownComponents(isUser: boolean): Components {
    return {
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
        code: ({ inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const isInline = inline || (!className && !lang);

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
} 