import { useState } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';
import type { ChatMessage } from '../types/chat';
import { detectNavigationIntent, getNavigationMessage, type Section } from '../utils/intentDetection';
import { streamChat } from '../utils/streamChat';

interface ChatInputProps {
  className?: string;
  messages: ChatMessage[];
  onAddMessage: (message: ChatMessage) => void;
  onUpdateMessage: (id: string, content: string) => void;
  onStreamingChange?: (id: string | null) => void;
  onClearMessages?: () => void;
  onLoadingChange?: (loading: boolean) => void;
  onNavigate?: (section: Section) => void;
  onChatStart?: (message: string) => void; // For non-chat sections to switch to chat screen
}

export function ChatInput({ className = '', messages, onAddMessage, onUpdateMessage, onStreamingChange, onClearMessages, onLoadingChange, onNavigate, onChatStart }: ChatInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!searchQuery.trim()) return;

    const userMessageText = searchQuery;
    setSearchQuery('');

    // Check for navigation intent FIRST (before adding messages)
    const detectedSection = detectNavigationIntent(userMessageText);

    if (detectedSection && onNavigate) {
      // Add user message for navigation intent
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: userMessageText,
        role: 'user',
        timestamp: new Date(),
      };
      onAddMessage(userMessage);

      // Add navigation message
      const navMessage = getNavigationMessage(detectedSection);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: navMessage,
        role: 'assistant',
        timestamp: new Date(),
      };
      onAddMessage(assistantMessage);

      // Navigate to the detected section
      // Use a small delay so the user can see the response before navigation
      setTimeout(() => {
        onNavigate(detectedSection);
      }, 500);

      return;
    }

    // No navigation intent detected
    // If we're in a non-chat section (onChatStart is provided), switch to chat screen
    // The parent (App.tsx handleChatStart) will handle adding messages and calling API
    if (onChatStart) {
      onChatStart(userMessageText);
      return;
    }

    // We're already in the chat section - clear old messages, show only current Q&A
    onClearMessages?.();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: userMessageText,
      role: 'user',
      timestamp: new Date(),
    };
    onAddMessage(userMessage);

    setIsLoading(true);
    onLoadingChange?.(true);
    setError(null);

    try {
      // The bubble is created on the first token, so the spinner stays up
      // until there is actually something to show.
      let assistantId = '';

      await streamChat({
        message: userMessageText,
        history: [...messages, userMessage],
        onDelta: (content) => {
          if (!assistantId) {
            assistantId = `assistant-${Date.now()}`;
            setIsLoading(false);
            onLoadingChange?.(false);
            onStreamingChange?.(assistantId);
            onAddMessage({
              id: assistantId,
              content,
              role: 'assistant',
              timestamp: new Date(),
            });
          } else {
            onUpdateMessage(assistantId, content);
          }
        },
      });
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Backend not running. Message saved but no AI response.');
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
      onStreamingChange?.(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className={`w-full pb-2 md:pb-8 ${className}`}>
      <form
        className="relative w-full md:px-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="mx-auto flex items-center rounded-full border border-[#E5E5E9] bg-[#ECECF0] py-2 pr-2 pl-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything"
            className="text-md w-full border-none bg-transparent text-black placeholder:text-gray-500 focus:outline-none"
            disabled={isLoading}
            aria-label="Ask me anything"
          />
          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="flex items-center justify-center rounded-full bg-[#0171E3] p-2 text-white disabled:opacity-50"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ArrowUp className="h-6 w-6" />
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
