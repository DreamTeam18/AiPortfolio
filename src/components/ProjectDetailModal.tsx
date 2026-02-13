import { X } from 'lucide-react';

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
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
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
