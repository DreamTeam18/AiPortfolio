import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import builderArt from '../assets/project-art/builder.svg';
import ganArt from '../assets/project-art/gan.svg';
import quizpilotArt from '../assets/project-art/quizpilot.svg';
import microservicesArt from '../assets/project-art/microservices.svg';
import kafkaArt from '../assets/project-art/kafka.svg';
import dockerArt from '../assets/project-art/docker.svg';
import airbnbArt from '../assets/project-art/airbnb.svg';
import securityArt from '../assets/project-art/security.svg';
import jpaArt from '../assets/project-art/jpa.svg';
import laughgptArt from '../assets/project-art/laughgpt.svg';

interface Project {
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
}

const projects: Project[] = [
  {
    id: 'builder-ai',
    category: 'AI SaaS Platform',
    title: 'Builder.ai - AI Code Generation SaaS Platform',
    period: 'Jun 2026',
    description: 'Built a distributed AI SaaS platform where users can generate full React applications from natural language prompts (e.g., “Build a snake game in React”) as cloud microservices on Spring AI.',
    highlights: [
      'Implemented SSE based real time streaming supporting long code generations. Persisted generated code to MinIO object storage with file metadata in PostgreSQL.',
      'Deployed auto updating build preview pods with Kubernetes + Fabric8 & Ingress, enabling instant live previews for generated projects with <2s cold-start build preview times.',
      'Decoupled code generation from file storage through Kafka events, idempotent on both write and acknowledgement paths. Avoided N+1 database reads by fetching chat messages and events together through JPA fetch joins.',
      'Added Token quota tracking, RBAC and inter service token propagation through OpenFeign, making the platform multi-tenant and SAAS ready.'
    ],
    technologies: ['Java', 'Spring Boot', 'Spring AI', 'Kafka', 'Kubernetes', 'Fabric8', 'MinIO', 'PostgreSQL', 'Redis', 'SSE', 'OpenFeign', 'Spring Data JPA', 'React'],
    gradient: 'from-zinc-900 via-indigo-800 to-violet-600',
    image: builderArt,
    githubUrl: 'https://github.com/siddhant1599/Builder.ai'
  },
  {
    id: 'survival-gan',
    category: 'Machine Learning Project',
    title: 'SurvGAN - Generative Adversarial Network',
    description: 'A three model generative architecture for synthesizing realistic survival data. The pipeline pairs a WGAN-GP generator with a DeepHit survival head and an XGBoost time to event model, then benchmarks the result against CTGAN and a plain GAN baseline through a synthcity evaluation harness measuring marginal, joint, and survival fidelity. The trained generator is served through a Flask inference API behind an Angular web interface, and the full study is written up in an accompanying research paper.',
    technologies: ['Python', 'PyTorch', 'WGAN-GP', 'DeepHit', 'XGBoost', 'CTGAN', 'synthcity', 'Flask', 'Angular'],
    gradient: 'from-slate-900 via-cyan-700 to-emerald-500',
    image: ganArt,
    githubUrl: 'https://github.com/siddhant1599/SurvivalGAN_Generative-adversarial-networks'
  },
  {
    id: 'quizpilot',
    category: 'Agentic AI',
    title: 'QuizPilot - LangGraph AI Quiz Coach',
    description: 'AI quiz coach built with Python and LangGraph featuring an orchestrator agent, specialist agents as tools, personalized questions, and resumable sessions',
    technologies: ['Agent Orchestration', 'AI Agent', 'LangGraph', 'Multi-Agent Systems', 'Tool Calling'],
    gradient: 'from-slate-900 via-blue-700 to-sky-400',
    image: quizpilotArt,
    githubUrl: 'https://github.com/siddhant1599/quizPilot-langgraph'
  },
  {
    id: 'spring-microservices',
    category: 'Microservices Project',
    title: 'Spring Microservices',
    description: 'A distributed Spring Cloud system built from five independent services: a Eureka discovery-service for registration, an api-gateway as the single entry point, a centralized config-server, and order-service and inventory-service as the business domains. Services call each other declaratively through Feign clients, and Resilience4j guards every hop with circuit breakers, retries, and rate limiters so a slow or failing downstream degrades gracefully instead of cascading.',
    technologies: ['Java', 'Spring Boot', 'Spring Cloud', 'Eureka', 'API Gateway', 'Config Server', 'Feign', 'Resilience4j'],
    gradient: 'from-rose-500 via-fuchsia-600 to-purple-700',
    image: microservicesArt,
    githubUrl: 'https://github.com/siddhant1599/Spring-MicroserviceRepo'
  },
  {
    id: 'kafka-demo',
    category: 'Microservices Project',
    title: 'Kafka Demo Project',
    description: 'A microservices architecture demonstration featuring Apache Kafka configuration with Spring Boot, Schema Registry integration, and multiple services including notification-service and user-service. This project showcases event-driven architecture patterns with Docker containerization and Confluent platform.',
    technologies: ['Java', 'Spring Boot', 'Apache Kafka', 'Docker', 'Confluent'],
    gradient: 'from-purple-600 via-violet-600 to-indigo-600',
    image: kafkaArt,
    githubUrl: 'https://github.com/siddhant1599/KafkaDemoProject'
  },
  {
    id: 'docker-repo',
    category: 'DevOps Project',
    title: 'Docker-repo',
    description: 'A fully containerized backend Spring Boot service with PostgreSQL database using Docker Compose. This project demonstrates best practices in containerization, including multi-stage builds with Maven, environment configuration, and orchestration of multiple services.',
    technologies: ['Java', 'Spring Boot', 'Docker', 'PostgreSQL', 'Maven'],
    gradient: 'from-blue-500 via-indigo-500 to-gray-700',
    image: dockerArt,
    githubUrl: 'https://github.com/siddhant1599/Docker-repo'
  },
  {
    id: 'airbnb',
    category: 'Backend Project',
    title: 'Airbnb - Hotel Booking System',
    description: 'A comprehensive hotel booking system built with Spring Boot REST API. Persistence is handled with Spring Data JPA over PostgreSQL, while Spring Security provides role-based access control (RBAC) with JWT authentication across guest, host, and admin roles. Stripe powers payments, with webhooks handling asynchronous payment, payout, and refund events, and every endpoint is documented and testable through Swagger UI (OpenAPI). Rounded out with Resilience4j resilience patterns and dynamic pricing algorithms, this backend service handles booking requests with high availability and fault tolerance.',
    technologies: ['Java', 'Spring Boot', 'Spring Data JPA', 'Spring Security (RBAC)', 'PostgreSQL', 'Stripe Webhooks', 'JWT', 'Swagger UI', 'Resilience4j'],
    gradient: 'from-orange-600 via-red-600 to-pink-600',
    image: airbnbArt,
    githubUrl: 'https://github.com/siddhant1599/Airbnb'
  },
  {
    id: 'spring-security',
    category: 'Security Project',
    title: 'Spring Security',
    description: 'A Spring Security reference application covering the full authentication and authorization surface of a production backend. It issues short-lived JWT access tokens alongside refresh tokens for silent renewal, supports OAuth2 client login for third-party identity providers, and enforces role-based access control with granular permission mapping so authority is checked per-endpoint rather than per-role alone. Active sessions are tracked and capped with an LRU eviction policy, bounding how many concurrent logins a single account can hold.',
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'OAuth2', 'RBAC', 'Maven'],
    gradient: 'from-gray-900 via-slate-700 to-red-700',
    image: securityArt,
    githubUrl: 'https://github.com/siddhant1599/Spring-SecurityApp'
  },
  {
    id: 'spring-data-jpa',
    category: 'Backend Project',
    title: 'Spring Data JPA Mappings',
    description: 'A hands-on reference for modeling relational data with Spring Data JPA and Hibernate, working through One-to-One, One-to-Many, and Many-to-Many entity relationships and the trade-offs each one carries. It demonstrates cascade operations for propagating persistence across associations, lazy versus eager fetching and the N+1 query behaviour that fetch strategy governs, and explicit join tables for owning the shape of many-to-many links rather than leaving it to convention.',
    technologies: ['Java', 'Spring Boot', 'Spring Data JPA', 'Hibernate', 'Maven'],
    gradient: 'from-amber-600 via-orange-600 to-yellow-500',
    image: jpaArt,
    githubUrl: 'https://github.com/siddhant1599/Spring-DataJPA-Mappings'
  },
  {
    id: 'laughgpt',
    category: 'Fullstack Project',
    title: 'LaughGPT',
    description: 'A fullstack application that integrates multiple AI models with a single prompt interface. Built with React and TypeScript on the frontend and Spring Boot with Java on the backend, this app demonstrates seamless integration of various AI APIs to provide intelligent responses.',
    technologies: ['React', 'TypeScript', 'Spring Boot', 'Java', 'AI APIs'],
    gradient: 'from-green-600 via-teal-600 to-cyan-600',
    image: laughgptArt,
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
                <div className={`relative w-full h-full bg-gradient-to-br ${project.gradient}`}>
                  {/* Project artwork */}
                  <div
                    className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-50"
                    style={{ backgroundImage: `url("${project.image}")` }}
                    aria-hidden="true"
                  />
                  {/* Scrim keeps the title legible over the artwork */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="relative h-full p-6 flex flex-col justify-end">
                    <div
                      className="text-left text-white"
                      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.6)' }}
                    >
                      <p className="text-sm font-semibold mb-2 tracking-wide">
                        {project.category}
                      </p>
                      <h3 className="text-xl font-bold">
                        {project.title}
                      </h3>
                    </div>
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
