import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ChatWidget } from '../components/ChatWidget';
import { ChatWidgetProps } from '../types';
import '../styles/index.css';

// Keep track of the current instance
let currentRoot: Root | null = null;
let currentContainer: HTMLElement | null = null;

function createStyleElement(id: string): HTMLStyleElement {
    const styleEl = document.createElement('style');
    styleEl.id = id;
    return styleEl;
}

function injectStyles(): HTMLStyleElement {
    const STYLE_ID = 'chat-widget-styles';

    // Check if styles are already injected
    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement;

    if (!styleEl) {
        // Create style element for custom CSS variables
        styleEl = createStyleElement(STYLE_ID);
        styleEl.textContent = `
            :root {
                --chat-primary-color: #0066cc;
                --chat-secondary-color: #f0f0f0;
                --chat-accent-color: #0052a3;
                --chat-background-color: #ffffff;
                --chat-text-color: #000000;
                --chat-spacing: 1rem;
                --chat-border-radius: 0.75rem;
            }
        `;
        document.head.appendChild(styleEl);
    }

    return styleEl;
}

function updateThemeStyles(styleEl: HTMLStyleElement, theme: ChatWidgetProps['theme']) {
    if (!theme) return;

    const themeVars = `
        :root {
            --chat-primary-color: ${theme.primaryColor || '#0066cc'};
            --chat-secondary-color: ${theme.secondaryColor || '#f0f0f0'};
            --chat-accent-color: ${theme.accentColor || '#0052a3'};
            --chat-background-color: ${theme.backgroundColor || '#ffffff'};
            --chat-text-color: ${theme.textColor || '#000000'};
            --chat-spacing: ${theme.spacing || '1rem'};
            --chat-border-radius: ${theme.borderRadius || '0.75rem'};
        }
    `;
    styleEl.textContent = themeVars;
}

function cleanup() {
    // Unmount React root if it exists
    if (currentRoot) {
        try {
            currentRoot.unmount();
        } catch (error) {
            console.error('Error unmounting React root:', error);
        }
        currentRoot = null;
    }

    // Remove container if it exists
    if (currentContainer) {
        try {
            currentContainer.remove();
        } catch (error) {
            console.error('Error removing container:', error);
        }
        currentContainer = null;
    }

    // Remove styles
    try {
        document.getElementById('chat-widget-styles')?.remove();
    } catch (error) {
        console.error('Error removing styles:', error);
    }
}

export function mountChatWidget(props: ChatWidgetProps) {
    // Clean up any existing instance
    cleanup();

    try {
        // Inject base styles
        const styleEl = injectStyles();

        // Create container
        currentContainer = document.createElement('div');
        currentContainer.id = 'chat-widget-root';
        document.body.appendChild(currentContainer);

        // Update theme styles
        updateThemeStyles(styleEl, props.theme);

        // Create React root and render
        currentRoot = createRoot(currentContainer);
        currentRoot.render(React.createElement(ChatWidget, props));

        // Return cleanup function
        return cleanup;
    } catch (error) {
        console.error('Error mounting chat widget:', error);
        cleanup(); // Clean up on error
        throw error; // Re-throw to let caller handle it
    }
} 