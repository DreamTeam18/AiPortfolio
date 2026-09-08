import { useRef, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../types/chat';

// Blinking caret shown at the end of a message that is still streaming in.
function StreamingCursor() {
  return (
    <>
      <span
        className="inline-block w-[6px] h-[18px] bg-gray-400 align-middle ml-0.5"
        style={{ animation: 'cursorBlink 0.8s step-end infinite' }}
      />
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}

interface ChatSectionProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  /** Id of the message currently streaming in, if any. */
  streamingId?: string | null;
  onAvatarClick?: () => void;
}

export function ChatSection({ messages, isLoading, streamingId, onAvatarClick }: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Display all messages in the scrollable chat area
  const visibleMessages = useMemo(() => messages, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-col h-full">
      {/* Small memoji avatar at top - clickable to return to landing */}
      <div className="flex justify-center pt-6 pb-4">
        <button
          onClick={onAvatarClick}
          className="w-20 h-20 cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Return to landing page"
        >
          <img
            src="/memoji.webp"
            alt="Siddhant Avatar"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </button>
      </div>

      {/* Chat messages area - scrollable, taking up available space, with bottom padding for fixed elements */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-48">
        <div className="max-w-3xl mx-auto">
          {visibleMessages.map((message) => (
            <div key={message.id} className="mb-4">
              {message.role === 'assistant' ? (
                // Assistant messages: rendered markdown, left-aligned
                <div className="prose prose-sm max-w-none text-gray-900 leading-relaxed [&>p]:mb-3 [&>ul]:mb-3 [&>ol]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&_strong]:font-semibold [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mb-1">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                  {message.id === streamingId && <StreamingCursor />}
                </div>
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
          {isLoading && (
            <div className="mb-4 flex items-center gap-[5px]">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500"
                  style={{
                    animation: 'typingDot 1.4s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
              <style>{`
                @keyframes typingDot {
                  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
                  30% { opacity: 1; transform: translateY(-4px); }
                }
              `}</style>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
