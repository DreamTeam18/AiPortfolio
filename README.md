# AI Portfolio - Siddhant Saxena

An interactive AI-powered personal portfolio website featuring a chatbot interface where visitors can ask questions about Siddhant Saxena, along with dedicated sections for projects, skills, and contact information.

## Features

- **Interactive AI Chatbot**: Ask anything about Siddhant - powered by OpenRouter API with LLM integration
- **State-Based SPA Navigation**: Smooth transitions between sections without URL routing
- **WebGL Fluid Background**: Interactive fluid simulation canvas for visual appeal
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Modern Tech Stack**: React 19 + TypeScript + Vite 7 + Tailwind CSS 3.4
- **shadcn/ui Components**: Pre-built accessible UI component library
- **Project Showcase**: Horizontal carousel with detailed project modals
- **Skills Display**: Categorized skill tags across 6 areas of expertise
- **Contact Integration**: Direct links to email and social profiles

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/)

### Quick Start

Use the provided initialization script to set up and run the development environment:

```bash
./init.sh
```

This script will:
1. Check for Node.js and npm installation
2. Install all frontend dependencies
3. Start the Vite development server

The application will be available at **http://localhost:5173**

### Manual Setup

If you prefer manual setup:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Chatbot Backend (Optional - Implement Last)

The chatbot functionality requires a Node.js + Express backend:

1. Set up backend server (see implementation steps in app_spec.txt)
2. Configure OpenRouter API key in `.env` file:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
3. Start backend server:
   ```bash
   npm run server
   ```

**Note**: All UI sections work without the backend. The chatbot backend is integrated as the final step.

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.


## Project Structure

```
AIPortfolio/
├── src/
│   ├── App.tsx                    # Main app component with SPA routing
│   ├── sections/
│   │   ├── Header.tsx             # Fixed header with buttons
│   │   ├── Hero.tsx               # Landing page hero section
│   │   ├── Watermark.tsx          # "Saxena" watermark
│   │   ├── Me.tsx                 # About/Me section (to be created)
│   │   ├── Projects.tsx           # Projects carousel (to be created)
│   │   ├── Skills.tsx             # Skills display (to be created)
│   │   └── Contact.tsx            # Contact section (to be created)
│   ├── components/
│   │   ├── fluid/FluidCanvas.tsx  # WebGL fluid background
│   │   └── ui/                    # shadcn/ui components
│   └── public/
│       └── memoji.jpg             # Avatar image
├── init.sh                        # Development environment setup script
├── .autoforge/
│   └── prompts/
│       └── app_spec.txt           # Full project specification
└── features.db                    # SQLite database with 70 test features
```

## Implementation Status

This project uses an autonomous coding workflow:
- **70 features** defined in the feature database
- **5 Infrastructure features** (indices 0-4) verify frontend setup
- **65 Functional & Style features** cover all UI sections and interactions

Run `./init.sh` to start development. Future coding agents will implement features in parallel based on the dependency graph.

## Key Technologies

- **React 19** with TypeScript
- **Vite 7** for bundling and dev server
- **Tailwind CSS 3.4** for styling
- **shadcn/ui** component library
- **lucide-react** for icons
- **embla-carousel-react** for project carousel
- **WebGL** for fluid background animation
- **Node.js + Express** (backend - optional, for chatbot)
- **OpenRouter API** (for LLM chatbot - optional)

## About Siddhant Saxena

- **Current**: MS Data Science @ George Washington University (Expected Jan 2027)
- **Previous**: Software Development Engineer @ Emerson (2021-2025)
- **Location**: Washington, DC
- **Email**: siddhant.saxena@gwu.edu
- **GitHub**: [github.com/siddhant1599](https://github.com/siddhant1599)

## License

This project is licensed under the [MIT License](LICENSE).

---

Built with autonomous AI coding agents 🤖✨
