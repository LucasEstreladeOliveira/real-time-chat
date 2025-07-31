import { mountChatWidget } from './utils/mount';
import type { ChatMessage, ChatTheme, ChatWidgetProps } from './types';

function ChatAI(props: ChatWidgetProps) {
    return mountChatWidget(props);
}

export default ChatAI;
export type { ChatMessage, ChatTheme, ChatWidgetProps }; 