import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Project {
  id: string;
  category: string;
  title: string;
  year: string;
  description: string;
  technologies: string[];
  gradient: string;
}

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management: Focus the close button when modal opens
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  // Focus trap: Keep focus within modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-labelledby="project-modal-title"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-4 sm:p-8">
          {/* Category Label */}
          <p className="text-sm font-medium text-gray-600 mb-2">
            {project.category}
          </p>

          {/* Project Title */}
          <h2 id="project-modal-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {project.title}
          </h2>

          {/* Gray Card Section */}
          <div className="bg-gray-100 rounded-2xl p-6 space-y-4">
            {/* Year */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">YEAR</p>
              <p className="text-base text-gray-900">{project.year}</p>
            </div>

            {/* Description */}
            <div>
              <p className="text-base text-gray-800 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">TECHNOLOGIES</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
