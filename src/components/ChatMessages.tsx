import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/chat';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mx-auto mb-4 max-h-[400px] overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                message.role === 'user'
                  ? 'bg-[#0171E3] text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
