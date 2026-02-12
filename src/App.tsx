import { useState } from 'react';
import { FluidCanvas } from './components/fluid';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Watermark } from './sections/Watermark';
import { WelcomeModal } from './components/WelcomeModal';
import { MeSection } from './sections/MeSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import { BottomToolbar } from './components/BottomToolbar';
import { ChatInput } from './components/ChatInput';

type Section = 'landing' | 'me' | 'projects' | 'skills' | 'contact';

function App() {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('landing');
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  const handleStartChatting = () => {
    // Focus on the chat input
    const chatInput = document.querySelector('input[placeholder*="Ask me anything"]') as HTMLInputElement;
    if (chatInput) {
      chatInput.focus();
    }
  };

  const handleContactClick = () => {
    // Close welcome modal and navigate to contact section
    setIsWelcomeModalOpen(false);
    setActiveSection('contact');
  };

  const handleNavigate = (section: Exclude<Section, 'landing'>) => {
    setActiveSection(section);
  };

  const handleAvatarClick = () => {
    setActiveSection('landing');
  };

  const isLanding = activeSection === 'landing';

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* White background base */}
      <div className="fixed inset-0 bg-white z-0" />

      {/* Fluid Gradient Background */}
      <FluidCanvas />

      {/* Content Overlay */}
      <div className="relative z-10">
        <Header onInfoClick={() => setIsWelcomeModalOpen(true)} />

        {/* Landing Page */}
        {isLanding && (
          <>
            <Hero onNavigate={handleNavigate} />
            <Watermark />
          </>
        )}

        {/* Section View */}
        {!isLanding && (
          <div className="min-h-screen flex flex-col pb-32">
            {/* Small avatar at top */}
            <div className="flex justify-center pt-24 pb-6">
              <button
                onClick={handleAvatarClick}
                className="w-20 h-20 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src="/memoji.jpg"
                  alt="Siddhant Avatar"
                  className="w-full h-full object-cover scale-110"
                />
              </button>
            </div>

            {/* Section Content */}
            <div className="flex-1">
              {activeSection === 'me' && <MeSection />}
              {activeSection === 'projects' && <ProjectsSection />}
              {activeSection === 'skills' && (
                <div className="text-center text-gray-500 py-20">
                  Skills section coming soon...
                </div>
              )}
              {activeSection === 'contact' && <ContactSection />}
            </div>

            {/* Chat Input - pinned above toolbar */}
            <div className="fixed bottom-32 left-0 right-0 flex justify-center px-4 z-10">
              <ChatInput />
            </div>

            {/* Bottom Toolbar */}
            <BottomToolbar
              activeSection={activeSection as Exclude<Section, 'landing'>}
              onNavigate={handleNavigate}
              isCollapsed={isToolbarCollapsed}
              onToggleCollapse={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
            />
          </div>
        )}
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        open={isWelcomeModalOpen}
        onOpenChange={setIsWelcomeModalOpen}
        onStartChatting={handleStartChatting}
        onContactClick={handleContactClick}
      />
    </div>
  );
}

export default App;
