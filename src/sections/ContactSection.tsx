import { ArrowRight, Linkedin, MessageCircle } from 'lucide-react';

export function ContactSection() {
  return (
    <div className="flex justify-center items-start px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl bg-[#F5F5F5] rounded-3xl p-8 md:p-12">
        {/* Header with handle */}
        <div className="flex items-center justify-between mb-8 gap-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Contacts</h2>
          <span className="text-sm sm:text-base md:text-lg text-gray-600 font-medium whitespace-nowrap">@Siddhant.Saxena</span>
        </div>

        {/* Email */}
        <div className="mb-8">
          <a
            href="mailto:siddhant.saxena@gwu.edu"
            className="flex items-center gap-2 sm:gap-3 text-gray-800 hover:text-blue-600 transition-colors group break-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            <span className="text-base sm:text-lg md:text-xl font-medium">siddhant.saxena@gwu.edu</span>
            <ArrowRight className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Social
          </h3>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/siddhant-saxena"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Linkedin className="h-5 w-5 flex-shrink-0 text-[#0A66C2]" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                LinkedIn
              </span>
            </a>

            {/* Discord */}
            <a
              href="#"
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <MessageCircle className="h-5 w-5 flex-shrink-0 text-[#5865F2]" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Discord
              </span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/siddhant1599"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-900"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Github
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
