import { Github, Info } from 'lucide-react';

interface HeaderProps {
  onInfoClick?: () => void;
  animate?: boolean;
}

export function Header({ onInfoClick, animate = false }: HeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 pointer-events-none ${
        animate ? 'animate-slide-in-from-top' : ''
      }`}
    >
      {/* Left button - Looking for a talent? */}
      <button
        className="pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Looking for a talent?"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" style={{ animationDuration: '1s' }} />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.6)]" />
        </span>
        <span className="text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap">Looking for a talent?</span>
      </button>

      {/* Right side buttons */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Info button */}
        <button
          onClick={onInfoClick}
          className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Information"
        >
          <Info className="w-5 h-5 text-gray-700" />
        </button>

        {/* Star button */}
        <a
          href="https://github.com/siddhant1599"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Star on GitHub"
        >
          <Github className="w-4 h-4 text-white" />
          <span className="text-xs sm:text-sm font-medium text-white">Star</span>
          <span className="text-xs sm:text-sm text-yellow-400">★ 1</span>
        </a>
      </div>
    </header>
  );
}
