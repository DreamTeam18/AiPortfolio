import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectDetailModal } from '../components/ProjectDetailModal';

interface Project {
  id: string;
  category: string;
  title: string;
  year: string;
  description: string;
  technologies: string[];
  gradient: string;
}

const projects: Project[] = [
  {
    id: 'airbnb',
    category: 'Backend Project',
    title: 'Airbnb - Hotel Booking System',
    year: '2021-2025',
    description: 'A comprehensive hotel booking system built with Spring Boot REST API, featuring resilience patterns with Resilience4j, PostgreSQL database, JWT authentication, Stripe payment integration, and dynamic pricing algorithms. This backend service handles millions of booking requests with high availability and fault tolerance.',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Stripe', 'JWT', 'Resilience4j'],
    gradient: 'from-orange-400 via-red-400 to-pink-400'
  },
  {
    id: 'laughgpt',
    category: 'Fullstack Project',
    title: 'LaughGPT',
    year: '2024',
    description: 'A fullstack application that integrates multiple AI models with a single prompt interface. Built with React and TypeScript on the frontend and Spring Boot with Java on the backend, this app demonstrates seamless integration of various AI APIs to provide intelligent responses.',
    technologies: ['React', 'TypeScript', 'Spring Boot', 'Java', 'AI APIs'],
    gradient: 'from-green-400 via-teal-400 to-cyan-400'
  },
  {
    id: 'kafka-demo',
    category: 'Microservices Project',
    title: 'Kafka Demo Project',
    year: '2024',
    description: 'A microservices architecture demonstration featuring Apache Kafka configuration with Spring Boot, Schema Registry integration, and multiple services including notification-service and user-service. This project showcases event-driven architecture patterns with Docker containerization and Confluent platform.',
    technologies: ['Java', 'Spring Boot', 'Apache Kafka', 'Docker', 'Confluent'],
    gradient: 'from-purple-400 via-violet-400 to-indigo-400'
  },
  {
    id: 'docker-repo',
    category: 'DevOps Project',
    title: 'Docker-repo',
    year: '2024',
    description: 'A fully containerized backend Spring Boot service with PostgreSQL database using Docker Compose. This project demonstrates best practices in containerization, including multi-stage builds with Maven, environment configuration, and orchestration of multiple services.',
    technologies: ['Java', 'Spring Boot', 'Docker', 'PostgreSQL', 'Maven'],
    gradient: 'from-blue-500 via-indigo-500 to-gray-700'
  }
];

export function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
            transform: `translateX(-${currentIndex * (100 / 3)}%)`
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2"
            >
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full h-64 rounded-2xl overflow-hidden cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
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
          className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
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
