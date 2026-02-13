import { Github, Circle, Info } from 'lucide-react';

interface HeaderProps {
  onInfoClick?: () => void;
}

export function Header({ onInfoClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4">
      {/* Left button - Looking for a talent? */}
      <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:bg-white transition-colors">
        <Circle className="w-2 h-2 fill-green-500 text-green-500" />
        <span className="text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap">Looking for a talent?</span>
      </button>

      {/* Right side buttons */}
      <div className="flex items-center gap-3">
        {/* Info button */}
        <button
          onClick={onInfoClick}
          className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:bg-white transition-colors"
        >
          <Info className="w-5 h-5 text-gray-700" />
        </button>

        {/* Star button */}
        <a
          href="https://github.com/siddhant1599"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-gray-900 transition-colors"
        >
          <Github className="w-4 h-4 text-white" />
          <span className="text-xs sm:text-sm font-medium text-white">Star</span>
          <span className="text-xs sm:text-sm text-yellow-400">★ 1</span>
        </a>
      </div>
    </header>
  );
}
