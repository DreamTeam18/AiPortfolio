import { useState } from 'react';
import { ArrowUp, User, FolderKanban, Layers, Mail, Loader2 } from 'lucide-react';
import { detectNavigationIntent } from '../utils/intentDetection';

type Section = 'me' | 'projects' | 'skills' | 'contact';

interface HeroProps {
  onNavigate: (section: Section) => void;
  onChatStart: (message: string) => void;
}

export function Hero({ onNavigate, onChatStart }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navButtons = [
    { id: 'me' as Section, icon: User, label: 'Me', color: '#329696' },
    { id: 'projects' as Section, icon: FolderKanban, label: 'Projects', color: '#3E9858' },
    { id: 'skills' as Section, icon: Layers, label: 'Skills', color: '#856ED9' },
    { id: 'contact' as Section, icon: Mail, label: 'Contact', color: '#C19433' },
  ];

  const handleSendMessage = () => {
    if (!searchQuery.trim() || isLoading) return;

    const userMessage = searchQuery;
    setSearchQuery('');

    // Check for navigation intent BEFORE transitioning to chat
    const detectedSection = detectNavigationIntent(userMessage);

    if (detectedSection) {
      // Navigate to the detected section directly with a brief loading state
      setIsLoading(true);
      setTimeout(() => {
        onNavigate(detectedSection);
        setIsLoading(false);
      }, 300);
      return;
    }

    // No navigation intent detected, transition to chat screen
    onChatStart(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pb-10 md:pb-20">
      {/* Greeting */}
      <div className="flex items-center gap-2 mb-2 mt-24 md:mt-4">
        <span className="text-xl md:text-2xl font-semibold text-gray-600">Hey, I'm Siddhant</span>
        <span className="text-xl md:text-2xl">👋</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
        AI Portfolio
      </h1>

      {/* Avatar */}
      <div className="relative mb-8">
        <div className="w-48 h-48 sm:w-72 sm:h-72 relative">
          <img
            src="/memoji.jpg"
            alt="Siddhant Avatar"
            className="w-full h-full object-cover mix-blend-multiply drop-shadow-xl"
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-lg mb-4">
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
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {navButtons.map((button) => (
          <button
            key={button.label}
            onClick={() => onNavigate(button.id)}
            className="aspect-square w-full cursor-pointer rounded-2xl border border-gray-200 bg-white/30 py-8 shadow-none backdrop-blur-lg active:scale-105 md:p-10 hover:bg-gray-50/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Navigate to ${button.label}`}
          >
            <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-700">
              <button.icon size={22} strokeWidth={2} color={button.color} />
              <span className="text-xs font-medium sm:text-sm">{button.label}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
