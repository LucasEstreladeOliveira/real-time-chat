# Real-Time Chat Widget

A beautiful, customizable, and easy-to-integrate chat widget for any website with AI capabilities. Inspired by the design of Eloquent AI.

## Features

- 🎨 Beautiful and modern UI design
- 🎭 Dark mode support
- 🎨 Fully customizable themes
- 🤖 AI-powered responses using OpenAI
- 📱 Responsive and mobile-friendly
- 🔧 Easy to integrate
- ⚡ Real-time interactions
- 🎯 Flexible positioning
- 🔄 Message history
- 🎉 Customizable avatar and branding
- 🆓 Free tier with mock responses
- 🔌 Framework-agnostic integration

## Installation

```bash
npm install @lucasestrela/real-time-chat
```

## Quick Start

```javascript
import ChatAI from '@lucasestrela/real-time-chat';

// Initialize the chat widget
const unmount = ChatAI({
  apiKey: 'your-openai-api-key', // Optional - if not provided, uses free tier
  title: 'My Assistant',
  theme: {
    primaryColor: '#0066cc',
    // ... other theme options
  },
});

// To remove the widget (optional)
unmount();
```

### Using in HTML

```html
<script type="module">
  import ChatAI from 'https://unpkg.com/@lucasestrela/real-time-chat';

  ChatAI({
    apiKey: 'your-openai-api-key', // Optional
    title: 'My Assistant',
  });
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiKey | string | undefined | Your OpenAI API key (optional - uses free tier if not provided) |
| theme | ChatTheme | {} | Custom theme configuration |
| initialMessage | string | "Hi! How can I help you today?" | Initial bot message |
| position | 'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' | 'bottom-right' | Widget position |
| darkMode | boolean | false | Enable dark mode |
| avatarUrl | string | undefined | Custom avatar image URL |
| title | string | "Chat Assistant" | Widget title |
| subtitle | string | "Powered by AI" / "Free Tier" | Widget subtitle |
| placeholder | string | "Type your message..." | Input placeholder |
| maxHeight | string | "600px" | Maximum height of chat window |
| onMessageSent | (message: ChatMessage) => void | undefined | Callback when message is sent |
| onMessageReceived | (message: ChatMessage) => void | undefined | Callback when message is received |

## Theme Customization

You can customize the appearance of the chat widget by passing a theme object:

```javascript
const theme = {
  primaryColor: '#0066cc',
  secondaryColor: '#f0f0f0',
  accentColor: '#0052a3',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  spacing: '16px',
  borderRadius: '12px',
};

ChatAI({
  apiKey: 'your-openai-api-key',
  theme,
});
```

## Free vs Premium Tier

The widget supports two tiers:

### Free Tier
- No API key required
- Pre-written responses
- Basic functionality
- "Free Tier" badge displayed

### Premium Tier
- Requires OpenAI API key
- AI-powered responses
- Full functionality
- Professional branding

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Build: `npm run build`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.