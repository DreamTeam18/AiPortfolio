import { User, FolderKanban, Layers, Mail, Smile } from 'lucide-react';

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
      <div className="flex justify-center py-2">
        <button
          onClick={onToggleCollapse}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-expanded={!isCollapsed}
          aria-controls="toolbar-buttons"
        >
          {isCollapsed ? 'Show quick questions' : 'Hide quick questions'}
        </button>
      </div>

      {/* Toolbar Buttons */}
      {!isCollapsed && (
        <div id="toolbar-buttons" className="flex items-center justify-center sm:justify-center gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {buttons.map((button, idx) => {
            const isActive = button.id === activeSection;
            const Icon = button.icon;

            return (
              <button
                key={`${button.id}-${idx}`}
                onClick={() => onNavigate(button.id)}
                className={`flex flex-col items-center justify-center min-w-[60px] flex-shrink-0 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={button.isSmile ? 'Navigate to About Me' : `Navigate to ${button.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {button.isSmile ? (
                  <span className="text-2xl">{button.label}</span>
                ) : (
                  <>
                    <Icon size={20} strokeWidth={2} color={button.color} />
                    <span className="text-xs mt-1">{button.label}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
