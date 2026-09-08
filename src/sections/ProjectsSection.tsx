import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectDetailModal } from '../components/ProjectDetailModal';

interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  technologies: string[];
  gradient: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    id: 'airbnb',
    category: 'Backend Project',
    title: 'Airbnb - Hotel Booking System',
    description: 'A comprehensive hotel booking system built with Spring Boot REST API. Persistence is handled with Spring Data JPA over PostgreSQL, while Spring Security provides role-based access control (RBAC) with JWT authentication across guest, host, and admin roles. Stripe powers payments, with webhooks handling asynchronous payment, payout, and refund events, and every endpoint is documented and testable through Swagger UI (OpenAPI). Rounded out with Resilience4j resilience patterns and dynamic pricing algorithms, this backend service handles booking requests with high availability and fault tolerance.',
    technologies: ['Java', 'Spring Boot', 'Spring Data JPA', 'Spring Security (RBAC)', 'PostgreSQL', 'Stripe Webhooks', 'JWT', 'Swagger UI', 'Resilience4j'],
    gradient: 'from-orange-600 via-red-600 to-pink-600',
    githubUrl: 'https://github.com/siddhant1599/Airbnb'
  },
  {
    id: 'laughgpt',
    category: 'Fullstack Project',
    title: 'LaughGPT',
    description: 'A fullstack application that integrates multiple AI models with a single prompt interface. Built with React and TypeScript on the frontend and Spring Boot with Java on the backend, this app demonstrates seamless integration of various AI APIs to provide intelligent responses.',
    technologies: ['React', 'TypeScript', 'Spring Boot', 'Java', 'AI APIs'],
    gradient: 'from-green-600 via-teal-600 to-cyan-600'
  },
  {
    id: 'kafka-demo',
    category: 'Microservices Project',
    title: 'Kafka Demo Project',
    description: 'A microservices architecture demonstration featuring Apache Kafka configuration with Spring Boot, Schema Registry integration, and multiple services including notification-service and user-service. This project showcases event-driven architecture patterns with Docker containerization and Confluent platform.',
    technologies: ['Java', 'Spring Boot', 'Apache Kafka', 'Docker', 'Confluent'],
    gradient: 'from-purple-600 via-violet-600 to-indigo-600',
    githubUrl: 'https://github.com/siddhant1599/KafkaDemoProject'
  },
  {
    id: 'docker-repo',
    category: 'DevOps Project',
    title: 'Docker-repo',
    description: 'A fully containerized backend Spring Boot service with PostgreSQL database using Docker Compose. This project demonstrates best practices in containerization, including multi-stage builds with Maven, environment configuration, and orchestration of multiple services.',
    technologies: ['Java', 'Spring Boot', 'Docker', 'PostgreSQL', 'Maven'],
    gradient: 'from-blue-500 via-indigo-500 to-gray-700',
    githubUrl: 'https://github.com/siddhant1599/Docker-repo'
  }
];

export function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [slidesToShow, setSlidesToShow] = useState(1);

  // Close modal when component unmounts (navigation away from Projects section)
  useEffect(() => {
    return () => {
      setSelectedProject(null);
    };
  }, []);

  // Update slidesToShow based on viewport size
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setSlidesToShow(3); // lg breakpoint - 3 cards
      } else if (width >= 768) {
        setSlidesToShow(2); // md breakpoint - 2 cards
      } else {
        setSlidesToShow(1); // mobile - 1 card
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-left">
        My Projects
      </h2>

      {/* Carousel Container */}
      <div className="relative mb-8 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
            >
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full h-64 rounded-2xl overflow-hidden cursor-pointer transform transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`View details for ${project.title}`}
              >
                <div className={`w-full h-full bg-gradient-to-br ${project.gradient} p-6 flex flex-col justify-end`}>
                  <div className="text-left text-white">
                    <p className="text-sm font-medium mb-2 opacity-90">
                      {project.category}
                    </p>
                    <h3 className="text-xl font-bold">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handlePrevious}
          className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
