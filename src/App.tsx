import { useState, useRef, useCallback, useEffect } from 'react';
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
import type { ChatMessage } from './types/chat';

type Section = 'landing' | 'me' | 'projects' | 'skills' | 'contact' | 'chat';

function App() {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('landing');
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const isNavigatingRef = useRef(false);
  const previousSectionRef = useRef<Section>('landing');
  // Track whether we just entered from landing (for initial shell animation)
  const [shellMounted, setShellMounted] = useState(false);

  // When we transition from landing to a section, trigger shell mount animation
  useEffect(() => {
    if (activeSection !== 'landing' && !shellMounted) {
      setShellMounted(true);
    } else if (activeSection === 'landing') {
      setShellMounted(false);
    }
  }, [activeSection, shellMounted]);

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
    // Prevent rapid navigation during animations
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;
    previousSectionRef.current = activeSection;
    setActiveSection(section);

    // Reset navigation lock after animation completes (500ms matches animation duration)
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);
  }, [activeSection]);

  const handleAvatarClick = useCallback(() => {
    // Prevent rapid navigation during animations
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;
    previousSectionRef.current = activeSection;
    setActiveSection('landing');

    // Reset navigation lock after animation completes
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);
  }, [activeSection]);

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
  const isChat = activeSection === 'chat';
  const isContentSection = !isLanding && !isChat;

  // Determine the toolbar active section for display
  const toolbarActiveSection = isChat ? 'me' as Exclude<Section, 'landing' | 'chat'> : activeSection as Exclude<Section, 'landing' | 'chat'>;

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

        {/*
          PERSISTENT SHELL: avatar, toolbar, and chat input stay stable
          during section-to-section navigation. Only the inner content area
          re-renders with a fade transition.
        */}
        {!isLanding && (
          <div className={`min-h-screen flex flex-col ${isChat ? '' : 'pb-32'} transition-opacity duration-300 ${shellMounted ? 'opacity-100' : 'opacity-0'}`}>

            {/* Small avatar at top - persistent, no re-animation on section switch */}
            {isContentSection && (
              <div className="flex justify-center pt-24 pb-6">
                <button
                  onClick={handleAvatarClick}
                  className="w-20 h-20 cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Return to landing page"
                >
                  <img
                    src="/memoji.jpg"
                    alt="Siddhant Avatar"
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </button>
              </div>
            )}

            {/* Chat Screen avatar + messages */}
            {isChat && (
              <div className="flex-1 flex flex-col pt-20">
                <ChatSection
                  key="chat"
                  messages={chatMessages.slice(-4)}
                  onAvatarClick={handleAvatarClick}
                />
              </div>
            )}

            {/* Section Content - ONLY this area re-animates on section switch */}
            {isContentSection && (
              <div key={activeSection} className="flex-1 animate-in fade-in duration-300">
                {activeSection === 'me' && <MeSection />}
                {activeSection === 'projects' && <ProjectsSection />}
                {activeSection === 'skills' && <SkillsSection />}
                {activeSection === 'contact' && <ContactSection />}
              </div>
            )}

            {/* Chat Input - persistent, pinned above toolbar, no re-animation */}
            <div className="fixed bottom-32 left-0 right-0 flex justify-center px-4 z-10">
              {isChat ? (
                <ChatInput
                  messages={chatMessages}
                  onAddMessage={addMessage}
                  onNavigate={handleNavigate}
                />
              ) : (
                <ChatInput
                  messages={chatMessages}
                  onAddMessage={addMessage}
                  onNavigate={handleNavigate}
                  onChatStart={handleChatStart}
                />
              )}
            </div>

            {/* Bottom Toolbar - persistent, no re-animation on section switch */}
            <BottomToolbar
              activeSection={toolbarActiveSection}
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
