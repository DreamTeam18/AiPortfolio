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
    id: 'survival-gan',
    category: 'Machine Learning Project',
    title: 'SurvGAN - Generative Adversarial Network',
    description: 'A three model generative architecture for synthesizing realistic survival data. The pipeline pairs a WGAN-GP generator with a DeepHit survival head and an XGBoost time to event model, then benchmarks the result against CTGAN and a plain GAN baseline through a synthcity evaluation harness measuring marginal, joint, and survival fidelity. The trained generator is served through a Flask inference API behind an Angular web interface, and the full study is written up in an accompanying research paper.',
    technologies: ['Python', 'PyTorch', 'WGAN-GP', 'DeepHit', 'XGBoost', 'CTGAN', 'synthcity', 'Flask', 'Angular'],
    gradient: 'from-slate-900 via-cyan-700 to-emerald-500',
    githubUrl: 'https://github.com/siddhant1599/SurvivalGAN_Generative-adversarial-networks'
  },
  {
    id: 'spring-microservices',
    category: 'Microservices Project',
    title: 'Spring Microservices',
    description: 'A distributed Spring Cloud system built from five independent services: a Eureka discovery-service for registration, an api-gateway as the single entry point, a centralized config-server, and order-service and inventory-service as the business domains. Services call each other declaratively through Feign clients, and Resilience4j guards every hop with circuit breakers, retries, and rate limiters so a slow or failing downstream degrades gracefully instead of cascading.',
    technologies: ['Java', 'Spring Boot', 'Spring Cloud', 'Eureka', 'API Gateway', 'Config Server', 'Feign', 'Resilience4j'],
    gradient: 'from-rose-500 via-fuchsia-600 to-purple-700',
    githubUrl: 'https://github.com/siddhant1599/Spring-MicroserviceRepo'
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
  },
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

  // Last position that still fills every visible slot, so we never scroll into blank space
  const maxIndex = Math.max(0, projects.length - slidesToShow);

  // Pull the carousel back in range when the viewport grows and reveals more cards
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
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

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mb-6">
        {Array.from({ length: maxIndex + 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              i === currentIndex
                ? 'w-6 bg-gray-900'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to project ${i + 1} of ${maxIndex + 1}`}
            aria-current={i === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {`Showing projects ${currentIndex + 1} to ${Math.min(currentIndex + slidesToShow, projects.length)} of ${projects.length}`}
      </p>

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
