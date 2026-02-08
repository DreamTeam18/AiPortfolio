import { Github, Circle } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4">
      {/* Left button - Looking for a talent? */}
      <button className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:bg-white transition-colors">
        <Circle className="w-2 h-2 fill-green-500 text-green-500" />
        <span className="text-sm font-medium text-gray-800">Looking for a talent?</span>
      </button>

      {/* Right button - Star */}
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-gray-900 transition-colors">
        <Github className="w-4 h-4 text-white" />
        <span className="text-sm font-medium text-white">Star</span>
        <span className="text-sm text-yellow-400">★ 1</span>
      </button>
    </header>
  );
}
