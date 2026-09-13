import { Code2, Settings, Database, Wrench, Sparkles, Cpu, Users } from 'lucide-react';

export function SkillsSection() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
        Skills & Expertise
      </h2>

      {/* Skills Categories */}
      <div className="space-y-10">
        {/* 1. Frontend Development */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">Frontend Development</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['HTML', 'CSS', 'JavaScript/TypeScript', 'React', 'Angular', 'Tailwind CSS', 'D3.js', 'Material Design', 'Responsive Web Design'].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Backend & Systems */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">Backend & Systems</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Java', 'Python', 'C#', 'Kotlin', 'Spring Boot', 'Angular', '.NET 4.8', 'NodeJS'].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Database */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">Database</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['SQL', 'MongoDB', 'Neo4j', 'Redis', 'PostgreSQL'].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 4. AI & Fullstack Engineering */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">AI & Fullstack Engineering</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Deep Learning',
              'Transformers',
              'AI Agents',
              'LangGraph',
              'General Adversarial Networks',
              'CNNs',
              'Data Pipelines - ETL',
              'Spring AI',
              'RAG',
              'Tool routing & calling'
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Tools & DevOps */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">Tools & DevOps</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Git', 'GitHub', 'Docker', 'AWS', 'Kubernetes', 'Azure Services', 'Kafka', 'Maven', 'Postman', 'Tableau'].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 6. Controls Systems and Embedded Exposure */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">Controls Systems and Embedded Exposure</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['SCADA', 'Control Systems', 'Emerson DeltaV', 'OPC UA/DA', 'PID Control', 'Modbus TCP', 'Hardware in loop (HIL)'].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 7. Soft Skills */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-900">Soft Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Communication', 'Problem-Solving', 'Adaptability', 'Learning Agility', 'Teamwork', 'Creativity', 'Focus'].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
