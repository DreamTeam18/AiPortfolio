export function MeSection() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left: Photo */}
        <div className="flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-full aspect-square max-w-md rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
            <img
              src="/headshot_photo.png"
              alt="Siddhant Saxena"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Siddhant Saxena
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            26 · Washington, DC
          </p>
          <div className="text-base text-gray-700 leading-relaxed mb-6 space-y-3">
            <p>Hey 👋 I'm Siddhant.</p>
            <p>I'm a masters student specializing in <span className="font-medium text-gray-900">Data Science</span> at <span className="font-medium text-gray-900">George Washington University</span>. I have <span className="font-medium text-gray-900">4 years</span> of software development experience at <span className="font-medium text-gray-900">Emerson</span>.</p>
            <p>I'm passionate about AI, distributed systems, SaaS and entrepreneurship.</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
        {['AI', 'Software Engineer', 'Distributed systems', 'Deep Learning', 'Agentic AI', 'Spring Boot', 'Java', '.NET' , 'C#', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Kafka', 'React', 'Angular', 'SQL', 'Neo4j', 'DeltaV', 'SCADA'].map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
