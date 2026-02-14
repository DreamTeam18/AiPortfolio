import { ChatMessages } from '../components/ChatMessages';
import { ChatInput } from '../components/ChatInput';
import type { ChatMessage } from '../types/chat';
import type { Section } from '../utils/intentDetection';

interface ChatSectionProps {
  messages: ChatMessage[];
  onAddMessage: (message: ChatMessage) => void;
  onNavigate?: (section: Section) => void;
}

export function ChatSection({ messages, onAddMessage, onNavigate }: ChatSectionProps) {
  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-16rem)] px-4 py-8">
      {/* Chat Messages */}
      <div className="w-full max-w-3xl flex-1 overflow-y-auto mb-8">
        <ChatMessages messages={messages} />
      </div>

      {/* Chat Input - fixed at bottom of chat section */}
      <div className="w-full max-w-3xl">
        <ChatInput messages={messages} onAddMessage={onAddMessage} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
