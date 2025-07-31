# Real-Time Chat Widget

A beautiful and customizable real-time chat widget for React applications. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful UI with customizable themes
- 🎯 Fully customizable themes
- 📱 Responsive design
- 🔒 Optional authentication support
- 💬 Real-time messaging
- 🔌 Easy integration with OpenAI
- 🛠 Maintenance mode support
- 📝 Markdown support
- 🌐 Online/Offline status handling

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Packaging](#packaging)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Contributing](#contributing)

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
  }
});

// To unmount the widget
// unmount();
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/lucasestrela/real-time-chat.git
cd real-time-chat
```

2. Install dependencies:
```bash
npm install
```

3. Install test app dependencies:
```bash
cd test-app
npm install
cd ..
```

### Running the Development Environment

1. Start the development server:
```bash
npm run dev
```

This will start both the main library and the test app.

2. Open your browser and navigate to `http://localhost:5173` to see the test app.

### Development Structure

```
real-time-chat/
├── src/                    # Main library source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── styles/            # CSS styles
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── test-app/              # Test application
│   └── src/
│       └── App.tsx        # Demo application
├── dist/                  # Built files (generated)
└── package.json           # Package configuration
```

## Building

### Build the Library

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Generate CommonJS and ES modules
- Create TypeScript declaration files
- Bundle CSS styles
- Output files to the `dist/` directory

### Build Output

The build process creates:
- `dist/index.js` - CommonJS bundle
- `dist/index.mjs` - ES modules bundle
- `dist/index.d.ts` - TypeScript declarations
- `dist/index.d.mts` - ES module declarations

### Build Configuration

The build is configured in `tsup.config.ts`:
- Entry point: `src/index.ts`
- Output formats: CommonJS and ES modules
- TypeScript declarations enabled
- CSS injection enabled
- External dependencies: React and ReactDOM

## Testing

### Running Tests

1. Start the development server:
```bash
npm run dev
```

2. Open the test app in your browser and test:
   - Theme switching
   - Message sending/receiving
   - Authentication flow
   - Maintenance mode
   - Responsive design
   - Markdown rendering

### Test App Features

The test app includes:
- API key management
- Theme switching (Blue, Dark, Green)
- Authentication toggle
- Real-time chat testing
- Error handling demonstration

### Manual Testing Checklist

- [ ] Widget renders correctly
- [ ] Theme switching works
- [ ] Messages send and receive
- [ ] Authentication flow works
- [ ] Maintenance mode displays
- [ ] Markdown renders properly
- [ ] Responsive design works
- [ ] Error states display correctly

## Packaging

### Local Package Testing

1. Build the package:
```bash
npm run build
```

2. Pack the package locally:
```bash
npm pack
```

This creates a `.tgz` file that you can install locally.

3. Test the packed package:
```bash
# In a test directory
npm install ../real-time-chat/real-time-chat-1.0.0.tgz
```

### Publishing to npm

1. Login to npm:
```bash
npm login
```

2. Build the package:
```bash
npm run build
```

3. Publish:
```bash
npm publish
```

### Package Configuration

The package is configured in `package.json`:
- Main entry: `dist/index.js`
- Module entry: `dist/index.mjs`
- Types: `dist/index.d.ts`
- Files included: `dist/` and `README.md`
- Peer dependencies: React and ReactDOM

## Usage Examples

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat Widget Demo</title>
</head>
<body>
    <div id="app">
        <h1>My Website</h1>
        <p>Welcome to my website with chat support!</p>
    </div>

    <script type="module">
        import ChatAI from '@lucasestrela/real-time-chat';

        ChatAI({
            apiKey: 'your-openai-api-key',
            title: 'Support Chat',
            theme: {
                primaryColor: '#0066cc',
                secondaryColor: '#f0f0f0',
                accentColor: '#0052a3',
                backgroundColor: '#ffffff',
                textColor: '#000000'
            }
        });
    </script>
</body>
</html>
```

### Advanced Usage

```javascript
import ChatAI from '@lucasestrela/real-time-chat';

const chatWidget = ChatAI({
    apiKey: 'your-openai-api-key',
    title: 'AI Assistant',
    subtitle: 'Powered by OpenAI',
    theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#1f2937',
        accentColor: '#4f46e5',
        backgroundColor: '#111827',
        textColor: '#ffffff',
        spacing: '1rem',
        borderRadius: '0.75rem'
    },
    position: 'bottom-right',
    requireAuth: true,
    onMessageSent: (message) => {
        console.log('Message sent:', message);
    },
    onMessageReceived: (message) => {
        console.log('Message received:', message);
    }
});

// Unmount when needed
// chatWidget();
```

### React Integration

```jsx
import React, { useEffect } from 'react';
import ChatAI from '@lucasestrela/real-time-chat';

function App() {
    useEffect(() => {
        const unmount = ChatAI({
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
            title: 'Chat Support'
        });

        return () => {
            unmount();
        };
    }, []);

    return (
        <div>
            <h1>My React App</h1>
            {/* Chat widget will be mounted automatically */}
        </div>
    );
}
```

## API Reference

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | - | Your OpenAI API key |
| `theme` | `Theme` | `{}` | Custom theme configuration |
| `initialMessage` | `string` | "Hi! How can I help you today?" | Initial message shown in chat |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Widget position |
| `avatarUrl` | `string` | - | Custom avatar URL |
| `title` | `string` | "Chat Assistant" | Chat widget title |
| `subtitle` | `string` | "Powered by AI" | Chat widget subtitle |
| `placeholder` | `string` | "Type your message..." | Input placeholder |
| `maxHeight` | `string` | "600px" | Maximum height of chat window |
| `requireAuth` | `boolean` | `false` | Enable authentication |
| `onMessageSent` | `(message: ChatMessage) => void` | - | Callback when message is sent |
| `onMessageReceived` | `(message: ChatMessage) => void` | - | Callback when message is received |

### Theme Configuration

```typescript
interface Theme {
    primaryColor?: string;    // Primary color for buttons and accents
    secondaryColor?: string;  // Secondary color for backgrounds
    accentColor?: string;     // Accent color for hover states
    backgroundColor?: string; // Main background color
    textColor?: string;      // Main text color
    spacing?: string;        // Base spacing unit
    borderRadius?: string;   // Border radius for components
}
```

### Event Callbacks

```javascript
ChatAI({
    // ... other options
    onMessageSent: (message) => {
        // Called when user sends a message
        console.log('User sent:', message.content);
    },
    onMessageReceived: (message) => {
        // Called when AI responds
        console.log('AI responded:', message.content);
    }
});
```

### Maintenance Mode

```javascript
// Enable maintenance mode
window.dispatchEvent(new Event('maintenanceStatusActive'));

// Disable maintenance mode
window.dispatchEvent(new Event('maintenanceStatusInactive'));
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code style
- Add tests for new features
- Update documentation as needed

## License

MIT © Lucas Estrela

## Support

For support, please open an issue on GitHub or contact the maintainer.