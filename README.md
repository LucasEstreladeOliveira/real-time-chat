# Real-Time Chat Widget

A beautiful and customizable real-time chat widget for React applications. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful UI with dark mode support
- 🎯 Fully customizable themes
- 📱 Responsive design
- 🔒 Optional authentication support
- 💬 Real-time messaging
- 🔌 Easy integration with OpenAI
- 🛠 Maintenance mode support
- 📝 Markdown support
- 🌐 Online/Offline status handling

## Installation

```bash
npm install @lucasestrela/real-time-chat
```

## Quick Start

```javascript
import ChatAI from '@lucasestrela/real-time-chat';

// Initialize the chat widget
const unmount = ChatAI({
  apiKey: "your-openai-api-key",
  title: "Chat Assistant",
  theme: {
    primaryColor: '#0066cc',
    secondaryColor: '#f0f0f0',
    accentColor: '#0052a3',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    spacing: '1rem',
    borderRadius: '0.75rem'
  },
  darkMode: false
});

// To unmount the widget
// unmount();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | - | Your OpenAI API key |
| `theme` | `Theme` | `{}` | Custom theme configuration |
| `initialMessage` | `string` | "Hi! How can I help you today?" | Initial message shown in chat |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Widget position |
| `darkMode` | `boolean` | `false` | Enable dark mode |
| `avatarUrl` | `string` | - | Custom avatar URL |
| `title` | `string` | "Chat Assistant" | Chat widget title |
| `subtitle` | `string` | "Powered by AI" | Chat widget subtitle |
| `placeholder` | `string` | "Type your message..." | Input placeholder |
| `maxHeight` | `string` | "600px" | Maximum height of chat window |
| `requireAuth` | `boolean` | `false` | Enable authentication |
| `onMessageSent` | `(message: ChatMessage) => void` | - | Callback when message is sent |
| `onMessageReceived` | `(message: ChatMessage) => void` | - | Callback when message is received |

## Theme Customization

```javascript
const theme = {
  primaryColor: '#0066cc',    // Primary color for buttons and accents
  secondaryColor: '#f0f0f0',  // Secondary color for backgrounds
  accentColor: '#0052a3',     // Accent color for hover states
  backgroundColor: '#ffffff', // Main background color
  textColor: '#000000',      // Main text color
  spacing: '1rem',           // Base spacing unit
  borderRadius: '0.75rem'    // Border radius for components
};

ChatAI({
  apiKey: "your-openai-api-key",
  theme: theme
});
```

## Authentication

Enable authentication to require users to log in before using the chat:

```javascript
ChatAI({
  apiKey: "your-openai-api-key",
  requireAuth: true
});
```

Default demo credentials:
- Email: user@example.com
- Password: password123

## Maintenance Mode

The widget supports maintenance mode through custom events:

```javascript
// Enable maintenance mode
window.dispatchEvent(new Event('maintenanceStatusActive'));

// Disable maintenance mode
window.dispatchEvent(new Event('maintenanceStatusInactive'));
```

## Event Callbacks

```javascript
ChatAI({
  apiKey: "your-openai-api-key",
  onMessageSent: (message) => {
    console.log('Message sent:', message);
  },
  onMessageReceived: (message) => {
    console.log('Message received:', message);
  }
});
```

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Building

```bash
npm run build
```

## License

MIT © Lucas Estrela

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request