import { useState } from 'react';
import { FluidCanvas } from './components/fluid';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Watermark } from './sections/Watermark';
import { WelcomeModal } from './components/WelcomeModal';

function App() {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const handleStartChatting = () => {
    // Focus on the chat input
    const chatInput = document.querySelector('input[placeholder*="Ask me anything"]') as HTMLInputElement;
    if (chatInput) {
      chatInput.focus();
    }
  };

  const handleContactClick = () => {
    // Close welcome modal and navigate to contact section
    // TODO: Wire up navigation when contact section is implemented
    setIsWelcomeModalOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* White background base */}
      <div className="fixed inset-0 bg-white z-0" />

      {/* Fluid Gradient Background */}
      <FluidCanvas />

      {/* Content Overlay */}
      <div className="relative z-10">
        <Header onInfoClick={() => setIsWelcomeModalOpen(true)} />
        <Hero />
        <Watermark />
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
