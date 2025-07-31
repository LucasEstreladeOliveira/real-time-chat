# Real-Time Chat Widget

A modern, customizable chat widget that can be easily embedded into any website. Built with React, TypeScript, Tailwind CSS, and Radix UI.

## Features

- 🚀 Easy Integration - Single function call to embed
- 💅 Modern UI - Based on modern design principles
- 🎨 Customizable Themes - Easily match your brand
- 🤖 AI-Powered - OpenAI integration for intelligent responses
- 📱 Responsive Design - Works on all devices
- 🔒 Authentication Support - Optional user authentication
- 💾 Message Persistence - Chat history saved in localStorage
- ✨ Rich Text Support - Markdown rendering for messages
- 🔄 Real-time Status - Online/offline indicator
- ⚡ Typing Animation - Word-by-word message display
- 🛠️ Maintenance Mode - Built-in maintenance status handling
- 🎯 Auto-scroll - Automatic scroll to latest messages

## Installation

```bash
npm install @lucasestrela/real-time-chat
# or
yarn add @lucasestrela/real-time-chat
```

## Quick Start

```javascript
import ChatAI from '@lucasestrela/real-time-chat';

// Initialize the chat widget
ChatAI({
  apiKey: "your-openai-api-key", // Required
  theme: {
    primary: '#007AFF',
    accent: '#0056b3',
    background: '#ffffff',
    text: '#000000'
  },
  title: 'Chat Assistant',
  subtitle: 'Powered by AI',
  position: 'bottom-right',
  darkMode: false,
  requireAuth: false,
  maxHeight: '600px',
  placeholder: 'Type your message...',
  avatarUrl: 'https://your-avatar-url.com/image.png'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiKey | string | Required | Your OpenAI API key |
| theme | object | {} | Custom theme colors |
| title | string | 'Chat Assistant' | Widget title |
| subtitle | string | 'Powered by AI' | Widget subtitle |
| position | string | 'bottom-right' | Widget position |
| darkMode | boolean | false | Enable dark mode |
| requireAuth | boolean | false | Enable authentication |
| maxHeight | string | '600px' | Maximum widget height |
| placeholder | string | 'Type your message...' | Input placeholder |
| avatarUrl | string | undefined | Custom avatar URL |
| onMessageSent | function | undefined | Message sent callback |
| onMessageReceived | function | undefined | Message received callback |

## Theme Customization

```javascript
const theme = {
  primary: '#007AFF',    // Primary color for buttons and accents
  accent: '#0056b3',     // Secondary color for hover states
  background: '#ffffff', // Background color
  text: '#000000'       // Text color
};
```

## Features in Detail

### Authentication
- Optional user authentication system
- Persistent sessions via localStorage
- Secure message history per user
- Easy login/logout functionality

### Message Features
- Markdown support for rich text
- Word-by-word typing animation for AI responses
- Message persistence across sessions
- Automatic scroll to new messages
- Read status tracking

### Status Management
- Real-time online/offline detection
- Visual status indicator
- Automatic handling of connection loss
- Maintenance mode support with custom messages

### UI/UX
- Responsive design
- Customizable themes
- Dark mode support
- Smooth animations
- Loading indicators
- Error handling with user-friendly messages

## Events and Callbacks

```javascript
ChatAI({
  // ... other options
  onMessageSent: (message) => {
    console.log('Message sent:', message);
  },
  onMessageReceived: (message) => {
    console.log('Message received:', message);
  }
});
```

## Error Handling

The widget includes built-in error handling for:
- Network connectivity issues
- API errors
- Authentication failures
- Rate limiting
- Service unavailability

## Browser Support

Supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

To run the development environment:

```bash
npm install
npm run dev
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License - see LICENSE file for details