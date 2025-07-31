import { useChatUI } from "../../contexts/ChatUIContext";
import { DefaultAvatar } from "../DefaultAvatar";

export const ChatTrigger: React.FC = () => {
    const { isOpen, setIsOpen } = useChatUI();

    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-full bg-primary p-3 text-white shadow-lg hover:bg-accent transition-colors ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <DefaultAvatar size={24} className="text-white" />
        </button>
    );
};