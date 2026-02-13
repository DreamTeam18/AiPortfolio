import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChatting?: () => void;
  onContactClick?: () => void;
}

export function WelcomeModal({
  open,
  onOpenChange,
  onStartChatting,
  onContactClick
}: WelcomeModalProps) {
  const handleStartChatting = () => {
    onStartChatting?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            Welcome to AI Portfolio
          </DialogTitle>
        </DialogHeader>

        <div className="bg-gray-100 rounded-lg p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">What's this ????</h3>
            <p className="text-gray-700 mb-2">
              I'm so excited to present my <strong>brand new AI Portfolio</strong>.
            </p>
            <p className="text-gray-700">
              Whether you're a recruiter, a friend, family member, or just curious,
              feel free to ask anything you want!
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Why ???</h3>
            <p className="text-gray-700 mb-1">Traditional portfolios can be limiting.</p>
            <p className="text-gray-700 mb-1">
              They can't adapt to every visitor's specific needs.
            </p>
            <p className="text-gray-700">
              <strong>
                My portfolio becomes exactly what you're interested in knowing about me and my work.
              </strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
          <Button
            onClick={handleStartChatting}
            className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-full"
          >
            Start Chatting
          </Button>

          <p className="text-sm text-gray-600 text-center">
            If you love it, please share it! Feedback is always welcome.{' '}
            <button
              onClick={onContactClick}
              className="text-black font-medium underline hover:no-underline"
            >
              Contact me
            </button>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
