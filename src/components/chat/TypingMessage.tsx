import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useMarkdownComponents } from '../../hooks/useMarkdownComponents';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';

interface TypingMessageProps {
    content: string;
    onComplete?: () => void;
    isUser: boolean;
}

export const TypingMessage: React.FC<TypingMessageProps> = ({ content, onComplete, isUser }) => {
    const components = useMarkdownComponents(isUser);
    const { displayedText, isTyping } = useTypingAnimation({ content, onComplete });

    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={components}
            >
                {displayedText}
            </ReactMarkdown>
            {isTyping && (
                <span className="typing-cursor" />
            )}
        </div>
    );
}; 