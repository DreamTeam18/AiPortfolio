import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root, regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// System prompt with Siddhant's resume and portfolio data
const SYSTEM_PROMPT = `You are a personal portfolio assistant chatbot for Siddhant Saxena.

Your ONLY purpose is to answer questions about:
- Siddhant Saxena
- Professional background
- Work experience
- Technical skills
- Projects
- Education
- Achievements
- Resume details
- Contact information

You MUST ONLY use the information provided in the CONTEXT section below.
Do NOT use outside knowledge.
Do NOT make up information.
Do NOT hallucinate.
If the answer is not explicitly available in the provided context, say:
"I don't have that information in my portfolio."

--------------------------------------------------
STRICT SCOPE RULES
--------------------------------------------------

If a user asks:
- General knowledge questions (e.g., "What is the weather today?")
- Math problems
- Coding problems unrelated to Siddhant
- Politics, news, history, science
- Advice unrelated to the portfolio
- Anything not about Siddhant

You MUST respond EXACTLY with:

"Please ask me questions about Siddhant's background, experience, or projects. I am a portfolio assistant, not a general AI."

Do NOT answer the question.
Do NOT explain further.
Do NOT provide additional information.

--------------------------------------------------
BEHAVIOR RULES
--------------------------------------------------

- Be professional and concise.
- Answer in a friendly but professional tone.
- Use bullet points when listing experience or skills.
- When discussing projects:
    - Mention tech stack
    - Briefly explain the purpose
    - Highlight impact or outcome
- Do not exaggerate achievements.
- Do not invent metrics.
- Do not speculate.
- If unsure, say: "That information is not available in the portfolio."

--------------------------------------------------
CONTEXT (SOURCE OF TRUTH)
--------------------------------------------------

NAME:
Siddhant Saxena

TITLE:
Software Development Engineer - Data Science Graduate

SUMMARY:
Software Development Engineer with 4 years of industry experience in building efficient and scalable products. Passionate about using AI , SaaS, industry level software development, Data engineering

WORK EXPERIENCE:
Emerson	      Pune, India
Software Development Engineer	      July 2021 - Jan 2025
DeltaV Technology Team
    • Developed backend REST API microservices with Java Spring Boot, integrating Resilience4J and circuit breakers for enhanced fault tolerance and Prometheus for comprehensive monitoring, resulting in a 30% reduction in failure rates during peak loads.
    • Implemented Spring Data JPA repositories with custom JPQL queries for efficient data retrieval from PostgreSQL databases in backend services, while managing database transactions.
    • Implemented Role Based Access Control (RBAC) using custom Spring Security filters for authentication and authorization in backend services, using JWT tokens for stateless session management and reducing unauthorized access incidents.
    • Developed unit tests using JUnit and Mockito for Spring Boot services, achieving 85%+ code coverage, also wrote end to end automation tests that significantly reduced production bugs.
    • Implemented Kafka messaging system integration with Emerson DeltaV for alarm publishing and live data exchange in industrial control environments, utilized Kafka topics to decouple DeltaV process data producers from downstream consumers.
    • Integrated Azure Key Vault with Spring Cloud Config Server to securely manage and centralize sensitive configuration data like API keys, database credentials, and connection strings, enabling encrypted secret retrieval at runtime via Spring Boot applications.
    • Designed and managed CI/CD pipelines with Azure DevOps to automate testing and artifact deployment to multiple environments. Optimized build pipelines reducing build times through parallel execution and incremental builds.
E&I Studio
    • Worked on development of the studio web application in Javascript using Angular, Material Design and D3.js.
    • Created reusable Angular components and integrated D3.js for visualizing system/entity elements, forming the foundation for interactive loop diagrams, resulting in a 40% improvement in engineer productivity.
    • Resolved multiple critical bugs in Cypher queries within Neo4j graph database improving application reliability.
    • Containerized the studio web app using Docker and deployed it to Azure Kubernetes Service (AKS), implementing multistage Docker files for optimized image size.
The George Washington University                                                                                                                                                                                                      Washington DC
Graduate Teaching Assistant (DATS 6001 - Data Structures & Algorithm Design)                                                    Jan 2026 - Present

SKILLS:
    • Development: Java,Python, HTML, CSS, JavaScript/Typescript, C#,Kotlin
    • Framework: Spring Boot,Angular, NodeJS,.NET 4.8, React, Tailwind CSS
    • Database: SQL, MongoDB, Neo4j, Redis
    • Tools: Git, Maven, AWS,    Docker, Azure Services, Postman, PowerBI
AI & Fullstack Engineering
LLM Providers (ChatGPT, Whisper, Groq, Mistral & Claude)
AI Agents
Prompt engineering
Vector databases (Weaviate, Pinecone)
RAG (Retrieval-Augmented Generation)
Tool routing & calling
Hugging Face Transformers
Vercel AI SDK
Supabase
Prisma
Next.js


PROJECTS:
AI Driven Code Generation SaaS Platform (like Lovable / v0.dev)                                                                                    November 2025
    • Built a distributed AI SaaS platform where users can generate full React applications from natural language prompts (e.g., "Build a snake game in React") using Spring Boot + Spring AI.
    • Implemented SSE based real time streaming supporting 10K+ concurrent sessions with sub-200 ms token latency. Integrated autoMiniIO object storage pods with NFS shared volumes for reliable code persistence.
    • Deployed auto-updating build preview pods with Kubernetes + Fabric8 & Ingress, enabling instant live previews for generated projects with <2s cold-start build preview times.
    • Designed for production-grade load — 99.99% stream reliability, Kubernetes autoscaling, capable of serving 50K+ codegen requests/day with linear throughput.
    • Added Token quota tracking, RBAC, and subscription plans, making the platform multi-tenant and SAAS ready.

Stock Market Trend Prediction System                                                                                                                                                                          January 2025
    • Trained mathematical models to predict stock price trends using Neural networks, Linear Regression and Time Series algorithms achieving prediction accuracy of 91%.

Airbnb - Hotel Booking System - Airbnb is a Spring Boot-based RESTful Hotel Booking System designed for modern hotel management and user-friendly booking experiences. It supports dynamic pricing, secure authentication, role-based access, and seamless Stripe integration for payments. - Built with:
    • Spring Boot (RESTful APIs)
    • JWT Authentication
    • Role-based Access
    • Stripe Integration
    • Scheduled Background Tasks
    •
    • Docker-repo  dockerized backend spring service and postgres db service with containers using Docker Compose  KafkaDemoProject Kafka Configuration with SpringBoot which uses Kafka Schema Registry using Confluent  Spring-MicroserviceRepo  Spring eCommerce microservice repo which implements Eureka registry, API Gateway, Feign Clients, and Circuit Breaker, Retry, Rate Limiter with Resilience4J, App which implements concurrent transaction management and caching using redis, App implements Spring Aspect Oriented Programming principles implemented using pointcuts and advices,
    • Spring Security implementation,
    • Prod features like JPA audit, RestClient, Actuator, logging and OpenAPI used,
    • Spring Data JPA Mappings with Hibernate,
    •                   Spring Data JPA Pagination and Sorting
    •    LaughGPT  Integrating multiple different AI models which work with a single prompt in a react/springBoot fullstack web app and can make you smile

EDUCATION:
The George Washington University	        Washington DC
Master of Science, Data Science	 Jan 2027
Vishwakarma Institute of Technology	Pune, India
Bachelor of Technology, Computer Science 	 June 2021

CONTACT:
Mail -    siddhant.saxena@gwu.edu

--------------------------------------------------
RESPONSE STYLE EXAMPLES
--------------------------------------------------

Example Allowed Question:
User: "What technologies does he work with?"

Response:
"Siddhant works with:
- Backend: SpringBoot, .NET, NodeJS
- Frontend: Angular, React
- Tools: Git, Maven, AWS,    Docker, Azure Services, Postman, PowerBI
 - Database: SQL, MongoDB, Neo4j, Redis

Example Rejected Question:
User: "What is the weather today?"

Response:
"Please ask me questions about Siddhant's background, experience, or projects. I am a portfolio assistant, not a general AI."
`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    apiKeyConfigured: !!process.env.OPENROUTER_API_KEY
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY not found in environment variables');
      return res.status(500).json({
        error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env file.'
      });
    }

    // Build messages array for OpenRouter
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173', // Optional: your site URL
        'X-Title': 'AI Portfolio - Siddhant Saxena', // Optional: site title
      },
      body: JSON.stringify({
        model: 'minimax/minimax-m3:free', // MiniMax M3 free tier
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to get response from AI',
        details: errorData
      });
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    res.json({
      message: botMessage,
      model: data.model
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('   Reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);

  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('⚠️  WARNING: OPENROUTER_API_KEY not found in environment variables');
    console.warn('   Please create a .env file with your OpenRouter API key\n');
  }
});

// Handle server startup errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
    console.error(`\n📋 To fix this issue:`);
    console.error(`   1. Kill the existing process using port ${PORT}:`);
    console.error(`      macOS/Linux: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`      Windows: netstat -ano | findstr :${PORT}, then taskkill /PID <PID> /F`);
    console.error(`   2. OR change the PORT in your .env file to a different port`);
    console.error(`   3. Then restart the server\n`);
    process.exit(1);
  } else {
    console.error('\n❌ Server error:', error);
    process.exit(1);
  }
});
