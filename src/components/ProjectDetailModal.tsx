import { ExternalLink, X } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  technologies: string[];
  gradient: string;
  image: string;
  period?: string;
  highlights?: string[];
  githubUrl?: string;
  architectureImages?: {
    src: string;
    title: string;
    description: string;
  }[];
}

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle close with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300); // Match the duration-300 animation
  }, [onClose]);

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
        handleClose();
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
  }, [handleClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-labelledby="project-modal-title"
        aria-modal="true"
        className={`relative flex w-full max-w-5xl flex-col bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[min(95dvh,calc(100dvh-2rem))] transition-all duration-300 ${
          isClosing
            ? 'scale-95 opacity-0'
            : 'scale-100 opacity-100 animate-in fade-in zoom-in-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="absolute top-4 right-7 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="project-modal-scroll m-2 min-h-0 overflow-y-auto overscroll-contain p-2 sm:p-6">
          {/* Category Label */}
          <p className="text-sm font-medium text-gray-600 mb-2 pr-10">
            {project.category}
          </p>

          {/* Project Title */}
          <h2 id="project-modal-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {project.title}
          </h2>

          {/* Gray Card Section */}
          <div className="bg-gray-100 rounded-2xl p-6 space-y-4">
            {/* Description */}
            <div>
              {project.period && (
                <p className="text-sm font-semibold text-gray-500 mb-2">{project.period}</p>
              )}
              <p className="text-base text-gray-800 leading-relaxed">
                {project.description}
              </p>
              {project.highlights && (
                <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-gray-400">
                  {project.highlights.map((point) => (
                    <li key={point} className="text-base text-gray-800 leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Technologies */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">TECHNOLOGIES</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub Link */}
            {project.githubUrl && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">SOURCE CODE</p>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-950 px-2.5 text-xs font-medium leading-none text-white shadow-sm transform-gpu transition-transform duration-200 ease-out hover:scale-105 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transform-none dark:border-zinc-300 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-100"
                  aria-label={`View ${project.title} on GitHub (opens in a new tab)`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span>View on GitHub</span>
                </a>
              </div>
            )}
          </div>

          {project.architectureImages && project.architectureImages.length > 0 && (
            <section className="mt-8" aria-labelledby="project-architecture-title">
              <h3 id="project-architecture-title" className="text-2xl font-bold text-gray-900">
                Architecture &amp; walkthrough
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Explore the application and its architecture. Select an image to open it at full size.
              </p>
              <div className="mt-5 space-y-6">
                {project.architectureImages.map((diagram) => (
                  <figure key={diagram.src} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <a
                      href={diagram.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                      aria-label={`Open ${diagram.title} at full size (opens in a new tab)`}
                    >
                      <img
                        src={diagram.src}
                        alt={diagram.description}
                        loading="lazy"
                        decoding="async"
                        className="block h-auto w-full"
                      />
                      <span className="flex items-center justify-end gap-1.5 px-4 py-2 text-xs font-medium text-blue-600 group-hover:underline">
                        Open full size
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </a>
                    <figcaption className="border-t border-gray-100 bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900">{diagram.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{diagram.description}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
