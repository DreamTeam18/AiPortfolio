import { useRef, useEffect, useMemo } from 'react';
import type { ChatMessage } from '../types/chat';

interface ChatSectionProps {
  messages: ChatMessage[];
  onAvatarClick?: () => void;
}

export function ChatSection({ messages, onAvatarClick }: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Display all messages in the scrollable chat area
  const visibleMessages = useMemo(() => messages, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Small memoji avatar at top - clickable to return to landing */}
      <div className="flex justify-center pt-6 pb-4">
        <button
          onClick={onAvatarClick}
          className="w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Return to landing page"
        >
          <img
            src="/memoji.jpg"
            alt="Siddhant Avatar"
            className="w-full h-full object-cover scale-110"
          />
        </button>
      </div>

      {/* Chat messages area - scrollable, taking up available space, with bottom padding for fixed elements */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-48">
        <div className="max-w-3xl mx-auto">
          {visibleMessages.map((message) => (
            <div key={message.id} className="mb-4">
              {message.role === 'assistant' ? (
                // Assistant messages: plain left-aligned text paragraphs (NOT bubbles)
                <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              ) : (
                // User messages: right-aligned blue rounded pill
                <div className="flex justify-end">
                  <div className="bg-[#0171E3] text-white rounded-2xl px-4 py-2 max-w-[80%]">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
