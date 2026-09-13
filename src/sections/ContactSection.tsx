import { ArrowRight } from 'lucide-react';

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
        <div className="mb-6">
          <a
            href="mailto:siddhantsaxenaa18@gmail.com"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            <span className="text-base sm:text-lg font-medium">siddhantsaxenaa18@gmail.com</span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-6">
          <a
            href="www.linkedin.com/in/siddhant-saxena-sde"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://leetcode.com/u/krzyyy13337/"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Leetcode
          </a>
          <a
            href="https://github.com/siddhant1599"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Github
          </a>
        </div>
      </div>
    </div>
  );
}
