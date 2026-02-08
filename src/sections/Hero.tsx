import { useState } from 'react';
import { ArrowRight, User, FolderKanban, Layers, Mail } from 'lucide-react';

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const navButtons = [
    { icon: User, label: 'Me', color: '#329696' },
    { icon: FolderKanban, label: 'Projects', color: '#3E9858' },
    { icon: Layers, label: 'Skills', color: '#856ED9' },
    { icon: Mail, label: 'Contact', color: '#C19433' },
  ];

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
        <div className="w-48 h-48 sm:w-72 sm:h-72 relative overflow-hidden rounded-full">
          <img
            src="/memoji.jpg"
            alt="Siddhant Avatar"
            className="w-full h-full object-cover scale-110 drop-shadow-xl"
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-lg mb-4">
        <div className="relative flex items-center rounded-full border border-gray-200 bg-white/30 py-2.5 pr-2 pl-6 backdrop-blur-lg transition-all hover:border-gray-300">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask me anything…"
            className="w-full border-none bg-transparent text-base text-gray-800 placeholder-gray-500 focus:outline-none"
          />
          <button className="flex items-center justify-center rounded-full bg-[#0171E3] p-2.5 text-white transition-colors hover:bg-blue-600">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {navButtons.map((button) => (
          <button
            key={button.label}
            className="aspect-square w-full cursor-pointer rounded-2xl border border-gray-200 bg-white/30 py-8 shadow-none backdrop-blur-lg active:scale-95 md:p-10 hover:bg-gray-50/30 transition-all"
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
