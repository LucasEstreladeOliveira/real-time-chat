import { mountChatWidget } from './utils/mount';
import { ChatWidgetProps } from './types';

function ChatAI(props: ChatWidgetProps) {
    return mountChatWidget(props);
}

export type { ChatWidgetProps };
export default ChatAI; 