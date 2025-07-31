import React, { useState, useEffect } from 'react';
import ChatAI from '../../src';

const themes = {
    blue: {
        primaryColor: '#0066cc',
        secondaryColor: '#f0f0f0',
        accentColor: '#0052a3',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        spacing: '16px',
        borderRadius: '12px',
    },
    green: {
        primaryColor: '#10B981',
        secondaryColor: '#F3F4F6',
        accentColor: '#059669',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        spacing: '16px',
        borderRadius: '16px',
    },
    purple: {
        primaryColor: '#8B5CF6',
        secondaryColor: '#EDE9FE',
        accentColor: '#7C3AED',
        backgroundColor: '#ffffff',
        textColor: '#1F2937',
        spacing: '20px',
        borderRadius: '20px',
    },
};

const markdownExample = `
# Markdown Support

This chat widget supports **Markdown** formatting! Here are some examples:

## Text Formatting
- *Italic text*
- **Bold text**
- ~~Strikethrough~~
- \`inline code\`

## Lists
1. Ordered list item 1
2. Ordered list item 2
   - Nested unordered item
   - Another nested item

## Code Blocks
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Tables
| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Tables | ✅ |
| Code blocks | ✅ |

## Links and Blockquotes
[Visit our website](https://example.com)

> This is a blockquote.
> It can span multiple lines.

---

That's just a small sample of what you can do with Markdown!
`;

function App() {
    const [usePremium, setUsePremium] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('blue');
    const [requireAuth, setRequireAuth] = useState(false);
    const [showMarkdownExample, setShowMarkdownExample] = useState(false);

    useEffect(() => {
        // Initialize chat widget
        const unmount = ChatAI({
            usePremium,
            title: usePremium ? "Premium Assistant" : "Free Assistant",
            theme: themes[selectedTheme],
            requireAuth,
            initialMessage: showMarkdownExample ? markdownExample : undefined,
        });

        // Cleanup on unmount
        return () => {
            unmount();
        };
    }, [usePremium, selectedTheme, requireAuth, showMarkdownExample]);

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Chat Widget Test Page</h1>

            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={usePremium}
                                onChange={(e) => setUsePremium(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Use Premium Tier (OpenAI)</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={requireAuth}
                                onChange={(e) => setRequireAuth(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Require Authentication</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showMarkdownExample}
                                onChange={(e) => setShowMarkdownExample(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Show Markdown Example</span>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-medium text-gray-700">Theme</label>
                        <div className="flex space-x-4">
                            {(Object.keys(themes) as Array<keyof typeof themes>).map((themeName) => (
                                <button
                                    key={themeName}
                                    onClick={() => setSelectedTheme(themeName)}
                                    className={`px-4 py-2 rounded-md capitalize ${selectedTheme === themeName
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {themeName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                        <h3 className="font-semibold mb-2">Current Settings:</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Mode: {usePremium ? 'Premium (OpenAI)' : 'Free Tier'}</li>
                            <li>Theme: {selectedTheme}</li>
                            <li>Authentication: {requireAuth ? 'Required' : 'Optional'}</li>
                            <li>Markdown Example: {showMarkdownExample ? 'Enabled' : 'Disabled'}</li>
                        </ul>
                    </div>

                    {requireAuth && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="text-yellow-700">
                                When authentication is required, use these demo credentials:
                            </p>
                            <p className="text-yellow-600 text-sm mt-2">
                                Email: user@example.com<br />
                                Password: password123
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App; 