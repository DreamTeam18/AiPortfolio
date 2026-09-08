import { useState } from 'react';
import { Laugh, BriefcaseBusiness, Layers, UserRoundSearch, CircleEllipsis, ChevronDown, ChevronUp, ChevronRight, Sparkles, Users, Briefcase } from 'lucide-react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from './ui/drawer';

type Section = 'me' | 'projects' | 'skills' | 'contact';

interface BottomToolbarProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
  onAskQuestion?: (question: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const questionCategories = [
  {
    label: 'Me',
    icon: Users,
    questions: [
      { text: 'Who are you?', featured: true },
      { text: 'What are your passions?', featured: false },
      { text: 'How did you get started in tech?', featured: false },
      { text: 'Where do you see yourself in 5 years?', featured: false },
    ],
  },
  {
    label: 'Professional',
    icon: Briefcase,
    questions: [
      { text: 'Can I see your resume?', featured: true },
      { text: 'What makes you a valuable team member?', featured: false },
      { text: 'Tell me about your experience at Emerson.', featured: false },
      { text: 'What projects have you worked on?', featured: false },
    ],
  },
];

export function BottomToolbar({
  activeSection,
  onNavigate,
  onAskQuestion,
  isCollapsed,
  onToggleCollapse,
}: BottomToolbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const buttons = [
    { id: 'me' as Section, icon: Laugh, label: 'Me', color: '#329696' },
    { id: 'projects' as Section, icon: BriefcaseBusiness, label: 'Projects', color: '#3E9858' },
    { id: 'skills' as Section, icon: Layers, label: 'Skills', color: '#856ED9' },
    { id: 'contact' as Section, icon: UserRoundSearch, label: 'Contact', color: '#C19433' },
  ];

  const handleQuestionClick = (question: string) => {
    setDrawerOpen(false);
    onAskQuestion?.(question);
  };

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <div className="mb-2 flex justify-center">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 transition-colors hover:text-gray-700"
          aria-expanded={!isCollapsed}
          aria-controls="toolbar-buttons"
        >
          {isCollapsed ? (
            <>
              <ChevronUp size={14} />
              Show quick questions
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              Hide quick questions
            </>
          )}
        </button>
      </div>

      {/* Toolbar Buttons */}
      {!isCollapsed && (
        <div className="w-full">
          <div
            id="toolbar-buttons"
            className="flex w-full flex-wrap gap-1 md:gap-3"
            style={{ justifyContent: 'safe center' }}
          >
            {buttons.map((button) => {
              const Icon = button.icon;
              const isActive = button.id === activeSection;
              return (
                <button
                  key={button.id}
                  onClick={() => onNavigate(button.id)}
                  className={`h-auto min-w-[100px] flex-shrink-0 cursor-pointer rounded-xl border px-4 py-3 shadow-none backdrop-blur-sm transition-none active:scale-95 ${
                    isActive ? '' : 'border-neutral-200 bg-white/80 hover:bg-neutral-200/30'
                  }`}
                  // The active section is tinted with the button's own accent colour
                  style={isActive ? { borderColor: button.color, backgroundColor: `${button.color}14` } : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${button.label}`}
                >
                  <div className="flex items-center gap-3 text-gray-700">
                    <Icon size={18} strokeWidth={2} color={button.color} />
                    <span className="text-sm font-medium">{button.label}</span>
                  </div>
                </button>
              );
            })}

            {/* More button - opens drawer */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <button
                  className="group relative flex flex-shrink-0 items-center justify-center"
                  aria-label="More questions"
                >
                  <div className="flex h-auto cursor-pointer items-center space-x-1 rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-200 hover:bg-neutral-200/30">
                    <div className="flex items-center gap-3 text-gray-700">
                      <CircleEllipsis className="h-[20px] w-[18px]" />
                    </div>
                  </div>
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerTitle className="sr-only">Quick Questions</DrawerTitle>
                <div className="mx-auto w-full max-w-lg overflow-y-auto px-6 pb-8 pt-4">
                  {questionCategories.map((category) => {
                    const CategoryIcon = category.icon;
                    return (
                      <div key={category.label} className="mb-6">
                        <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                          <CategoryIcon size={18} className="text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{category.label}</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                          {category.questions.map((q) => (
                            <DrawerClose asChild key={q.text}>
                              <button
                                onClick={() => handleQuestionClick(q.text)}
                                className={`flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-left transition-colors ${
                                  q.featured
                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                }`}
                              >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                  {q.featured && <Sparkles size={14} />}
                                  {q.text}
                                </span>
                                <ChevronRight size={16} className={q.featured ? 'text-white/70' : 'text-gray-400'} />
                              </button>
                            </DrawerClose>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </div>
  );
}
