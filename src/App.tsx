import { useState, useRef, useCallback } from 'react';
import { FluidCanvas } from './components/fluid';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Watermark } from './sections/Watermark';
import { WelcomeModal } from './components/WelcomeModal';
import { MeSection } from './sections/MeSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { ContactSection } from './sections/ContactSection';
import { ChatSection } from './sections/ChatSection';
import { BottomToolbar } from './components/BottomToolbar';
import { ChatInput } from './components/ChatInput';
import { ChatMessages } from './components/ChatMessages';
import type { ChatMessage } from './types/chat';

type Section = 'landing' | 'me' | 'projects' | 'skills' | 'contact' | 'chat';

function App() {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('landing');
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const isNavigatingRef = useRef(false);

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

  const handleNavigate = useCallback((section: Exclude<Section, 'landing'>) => {
    // Prevent rapid navigation state updates
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;
    setActiveSection(section);

    // Reset navigation lock after a short delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  }, []);

  const handleAvatarClick = useCallback(() => {
    // Prevent rapid navigation state updates
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;
    setActiveSection('landing');

    // Reset navigation lock after a short delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  }, []);

  const handleChatStart = useCallback(async (messageText: string) => {
    // Transition to chat section
    setActiveSection('chat');

    // Create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: messageText,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    setChatMessages(prev => [...prev, userMessage]);

    // Call backend API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          history: [userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Add assistant response
      if (data.message) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          content: data.message,
          role: 'assistant',
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  }, []);

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
          <div className="animate-in fade-in duration-500">
            <Hero onNavigate={handleNavigate} onChatStart={handleChatStart} />
            <Watermark />
          </div>
        )}

        {/* Section View */}
        {!isLanding && (
          <div className="min-h-screen flex flex-col pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Small avatar at top */}
            <div className="flex justify-center pt-24 pb-6 animate-in zoom-in-50 duration-300">
              <button
                onClick={handleAvatarClick}
                className="w-20 h-20 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Return to landing page"
              >
                <img
                  src="/memoji.jpg"
                  alt="Siddhant Avatar"
                  className="w-full h-full object-cover scale-110"
                />
              </button>
            </div>

            {/* Section Content */}
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
              {activeSection === 'me' && <MeSection key="me" />}
              {activeSection === 'projects' && <ProjectsSection key="projects" />}
              {activeSection === 'skills' && <SkillsSection key="skills" />}
              {activeSection === 'contact' && <ContactSection key="contact" />}
              {activeSection === 'chat' && <ChatSection key="chat" messages={chatMessages} onAddMessage={addMessage} onNavigate={handleNavigate} />}
            </div>

            {/* Chat Messages - scrollable area above input (hidden in chat section) */}
            {activeSection !== 'chat' && (
              <div className="fixed bottom-44 left-0 right-0 flex justify-center px-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <ChatMessages messages={chatMessages} />
              </div>
            )}

            {/* Chat Input - pinned above toolbar (hidden in chat section) */}
            {activeSection !== 'chat' && (
              <div className="fixed bottom-32 left-0 right-0 flex justify-center px-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <ChatInput
                  messages={chatMessages}
                  onAddMessage={addMessage}
                  onNavigate={handleNavigate}
                />
              </div>
            )}

            {/* Bottom Toolbar */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100">
              <BottomToolbar
                activeSection={activeSection === 'chat' ? 'me' : activeSection as Exclude<Section, 'landing' | 'chat'>}
                onNavigate={handleNavigate}
                isCollapsed={isToolbarCollapsed}
                onToggleCollapse={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
              />
            </div>
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
