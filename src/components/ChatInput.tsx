import { useState } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';
import type { ChatMessage } from '../types/chat';

interface ChatInputProps {
  className?: string;
  messages: ChatMessage[];
  onAddMessage: (message: ChatMessage) => void;
}

export function ChatInput({ className = '', messages, onAddMessage }: ChatInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!searchQuery.trim()) return;

    const userMessageText = searchQuery;
    setSearchQuery('');
    setIsLoading(true);
    setError(null);

    // Create and add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: userMessageText,
      role: 'user',
      timestamp: new Date(),
    };
    onAddMessage(userMessage);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageText,
          history: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Add assistant response as a message
      if (data.message) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          content: data.message,
          role: 'assistant',
          timestamp: new Date(),
        };
        onAddMessage(assistantMessage);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Backend not running. Message saved but no AI response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className={`w-full max-w-lg ${className}`}>
      <div className="relative flex items-center rounded-full border border-gray-200 bg-white/30 py-2.5 pr-2 pl-6 backdrop-blur-lg transition-all hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything…"
          className="w-full border-none bg-transparent text-base text-gray-800 placeholder-gray-500 focus:outline-none"
          disabled={isLoading}
          aria-label="Ask me anything"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !searchQuery.trim()}
          className="flex items-center justify-center rounded-full bg-blue-500 p-2.5 text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
