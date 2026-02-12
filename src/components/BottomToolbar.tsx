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
    { id: 'me' as Section, icon: User, label: 'Me' },
    { id: 'projects' as Section, icon: FolderKanban, label: 'Projects' },
    { id: 'skills' as Section, icon: Layers, label: 'Skills' },
    { id: 'contact' as Section, icon: Mail, label: 'Contact' },
    { id: 'me' as Section, icon: Smile, label: '😊', isSmile: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200">
      {/* Toggle Button */}
      <div className="flex justify-center py-2">
        <button
          onClick={onToggleCollapse}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isCollapsed ? 'Show quick questions' : 'Hide quick questions'}
        </button>
      </div>

      {/* Toolbar Buttons */}
      {!isCollapsed && (
        <div className="flex items-center justify-center gap-2 px-4 pb-4 overflow-x-auto">
          {buttons.map((button, idx) => {
            const isActive = button.id === activeSection;
            const Icon = button.icon;

            return (
              <button
                key={`${button.id}-${idx}`}
                onClick={() => onNavigate(button.id)}
                className={`flex flex-col items-center justify-center min-w-[60px] px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {button.isSmile ? (
                  <span className="text-2xl">{button.label}</span>
                ) : (
                  <>
                    <Icon size={20} strokeWidth={2} />
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
