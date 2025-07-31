/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: 'var(--chat-primary-color)',
                secondary: 'var(--chat-secondary-color)',
                accent: 'var(--chat-accent-color)',
                background: 'var(--chat-background-color)',
                text: 'var(--chat-text-color)',
            },
            spacing: {
                chat: 'var(--chat-spacing)',
            },
            borderRadius: {
                chat: 'var(--chat-border-radius)',
            },
        },
    },
    plugins: [],
    // Ensure Tailwind doesn't purge our dynamic classes
    safelist: [
        'bg-primary',
        'bg-secondary',
        'bg-accent',
        'bg-background',
        'text-text',
        'hover:bg-accent',
        'border-secondary',
        'rounded-chat',
        'dark',
    ],
} 