import { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

export const useMessageVisibility = (
    message: ChatMessage,
    onVisible: (message: ChatMessage) => void
) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentElement = elementRef.current;
        if (!currentElement || !message.isNew) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onVisible(message);
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.5, // Message is considered visible when 50% is in view
                rootMargin: '0px',
            }
        );

        observer.observe(currentElement);

        return () => {
            observer.disconnect();
        };
    }, [message, onVisible]);

    return elementRef;
}; 