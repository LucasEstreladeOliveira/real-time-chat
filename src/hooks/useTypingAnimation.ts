import { useState, useEffect, useCallback } from 'react';

interface UseTypingAnimationProps {
    content: string;
    onComplete?: () => void;
}

interface UseTypingAnimationResult {
    displayedText: string;
    isTyping: boolean;
}

export function useTypingAnimation({ content, onComplete }: UseTypingAnimationProps): UseTypingAnimationResult {
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

    return {
        displayedText,
        isTyping: currentWordIndex < words.length
    };
} 