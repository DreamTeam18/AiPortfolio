import { User, FolderKanban, Layers, Mail, Smile, ChevronDown, ChevronUp } from 'lucide-react';

type Section = 'me' | 'projects' | 'skills' | 'contact';

interface BottomToolbarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function BottomToolbar({
  activeSection,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
}: BottomToolbarProps) {
  const buttons = [
    { id: 'me' as Section, icon: User, label: 'Me', color: '#329696' },
    { id: 'projects' as Section, icon: FolderKanban, label: 'Projects', color: '#3E9858' },
    { id: 'skills' as Section, icon: Layers, label: 'Skills', color: '#856ED9' },
    { id: 'contact' as Section, icon: Mail, label: 'Contact', color: '#C19433' },
    { id: 'me' as Section, icon: Smile, label: '😊', isSmile: true, color: '#329696' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm">
      {/* Toggle Button */}
      <div className="flex justify-center py-3 mb-1">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-expanded={!isCollapsed}
          aria-controls="toolbar-buttons"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-4 h-4 text-gray-400" />
              Show quick questions
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-gray-400" />
              Hide quick questions
            </>
          )}
        </button>
      </div>

      {/* Toolbar Buttons */}
      {!isCollapsed && (
        <div id="toolbar-buttons" className="flex items-center justify-center gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {buttons.map((button, idx) => {
            const isActive = button.id === activeSection;
            const Icon = button.icon;

            if (button.isSmile) {
              return (
                <button
                  key={`${button.id}-${idx}`}
                  onClick={() => onNavigate(button.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border flex-shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-label="Navigate to About Me"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="text-lg">😊</span>
                </button>
              );
            }

            return (
              <button
                key={`${button.id}-${idx}`}
                onClick={() => onNavigate(button.id)}
                className={`flex flex-row items-center gap-2 h-10 px-4 py-2 rounded-full border flex-shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive
                    ? 'border-blue-500 ring-2 ring-blue-500 text-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
                aria-label={`Navigate to ${button.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} strokeWidth={2} color={button.color} />
                <span className="text-sm font-medium">{button.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
