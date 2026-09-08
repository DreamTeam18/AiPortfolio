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
import { streamChat } from './utils/streamChat';

type Section = 'landing' | 'me' | 'projects' | 'skills' | 'contact' | 'chat';

function App() {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('landing');
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
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

  // Predefined questions for each section's LLM call
  const sectionQuestions: Record<string, string> = {
    me: 'Who are you?',
    projects: 'What are your projects? Show me some of them.',
    skills: 'What are your skills? Give me some of your hard skills and soft skills.',
    contact: 'How can I reach you?',
  };

  const handleNavigate = useCallback(async (section: Exclude<Section, 'landing'>) => {
    // Prevent rapid navigation during animations
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;
    previousSectionRef.current = activeSection;

    // If it's a content section, open chat first, show question, then redirect
    const question = sectionQuestions[section];
    if (question) {
      // Step 1: Clear old messages and switch to chat screen
      setChatMessages([]);
      setIsChatLoading(true);
      setActiveSection('chat');

      // Step 2: Show the user question on screen
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: question,
        role: 'user',
        timestamp: new Date(),
      };
      setChatMessages([userMessage]);

      // Step 3: After a brief delay to show the question, redirect to the section
      setTimeout(() => {
        setIsChatLoading(false);
        setActiveSection(section);
        setChatMessages([]);
        isNavigatingRef.current = false;
      }, 1000);
      return;
    }

    // For non-content sections (e.g., chat), navigate directly
    setActiveSection(section);

    // Reset navigation lock after animation completes
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

  const updateMessage = useCallback((id: string, content: string) => {
    setChatMessages(prev => prev.map(m => (m.id === id ? { ...m, content } : m)));
  }, []);

  const handleChatStart = useCallback(async (messageText: string) => {
    // Clear old messages and transition to chat section
    setChatMessages([]);
    setActiveSection('chat');

    // Create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: messageText,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat (fresh start)
    setChatMessages([userMessage]);
    setIsChatLoading(true);

    // Call backend API - the response streams in token by token
    try {
      // The bubble is created on the first token, so the spinner stays up
      // until there is actually something to show.
      let assistantId = '';

      await streamChat({
        message: messageText,
        history: [userMessage],
        onDelta: (content) => {
          if (!assistantId) {
            assistantId = `assistant-${Date.now()}`;
            const id = assistantId;
            setIsChatLoading(false);
            setStreamingId(id);
            setChatMessages(prev => [...prev, {
              id,
              content,
              role: 'assistant',
              timestamp: new Date(),
            }]);
          } else {
            updateMessage(assistantId, content);
          }
        },
      });
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
    } finally {
      setIsChatLoading(false);
      setStreamingId(null);
    }
  }, [updateMessage]);

  const isLanding = activeSection === 'landing';
  const isChat = activeSection === 'chat';
  const isContentSection = !isLanding && !isChat;

  // Determine the toolbar active section for display
  const toolbarActiveSection = isChat ? 'me' as Exclude<Section, 'landing' | 'chat'> : activeSection as Exclude<Section, 'landing' | 'chat'>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* White background base */}
      <div className="fixed inset-0 bg-white z-0" />

      {/* Fluid Gradient Background - only on landing page */}
      {isLanding && <FluidCanvas />}

      {/* Content Overlay */}
      <div className="relative z-10">
        <Header onInfoClick={() => setIsWelcomeModalOpen(true)} animate={isLanding} />

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
          <div className={`container mx-auto flex h-screen max-w-3xl flex-col transition-opacity duration-300 ${shellMounted ? 'opacity-100' : 'opacity-0'}`}>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-2" style={{ paddingTop: '100px' }}>
              <div className="pb-4">
                <div className="flex h-full w-full flex-col px-4">
                  <div className="flex h-full w-full flex-col overflow-y-auto">

                    {/* Small avatar at top - persistent, no re-animation on section switch */}
                    {isContentSection && (
                      <div className="flex justify-center pb-6">
                        <button
                          onClick={handleAvatarClick}
                          className="w-24 h-24 cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="Return to landing page"
                        >
                          <img
                            src="/memoji.webp"
                            alt="Siddhant Avatar"
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </button>
                      </div>
                    )}

                    {/* Chat Screen avatar + messages */}
                    {isChat && (
                      <div className="flex-1 flex flex-col">
                        <ChatSection
                          key="chat"
                          messages={chatMessages}
                          isLoading={isChatLoading}
                          streamingId={streamingId}
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

                  </div>
                </div>
              </div>
            </div>

            {/* Sticky bottom area: toolbar + chat input */}
            <div className="sticky bottom-0 z-20 bg-white px-2 pt-3 md:px-0 md:pb-4">
              <div className="relative flex flex-col items-center gap-3">
                {/* Toolbar: chevron + buttons */}
                <BottomToolbar
                  activeSection={toolbarActiveSection}
                  onNavigate={handleNavigate}
                  onAskQuestion={handleChatStart}
                  isCollapsed={isToolbarCollapsed}
                  onToggleCollapse={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
                />

                {/* Chat Input - at the very bottom */}
                {isChat ? (
                  <ChatInput
                    className="mx-auto max-w-[736px] [&_form>div]:h-[58px]"
                    messages={chatMessages}
                    onAddMessage={addMessage}
                    onUpdateMessage={updateMessage}
                    onStreamingChange={setStreamingId}
                    onClearMessages={() => setChatMessages([])}
                    onLoadingChange={setIsChatLoading}
                    onNavigate={handleNavigate}
                  />
                ) : (
                  <ChatInput
                    className="mx-auto max-w-[736px] [&_form>div]:h-[58px]"
                    messages={chatMessages}
                    onAddMessage={addMessage}
                    onUpdateMessage={updateMessage}
                    onStreamingChange={setStreamingId}
                    onNavigate={handleNavigate}
                    onChatStart={handleChatStart}
                  />
                )}
              </div>
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
