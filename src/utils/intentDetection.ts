/**
 * Intent Detection Utility
 * Detects navigation intent from user messages to avoid unnecessary LLM calls
 */

export type Section = 'me' | 'projects' | 'skills' | 'contact';

interface IntentPattern {
  section: Section;
  keywords: string[];
}

// Define patterns for each section with comprehensive keyword matching
const INTENT_PATTERNS: IntentPattern[] = [
  {
    section: 'projects',
    keywords: [
      'project',
      'projects',
      'work',
      'portfolio',
      'built',
      'created',
      'developed',
      'show me your work',
      'what have you built',
      'what did you build',
      'github',
    ],
  },
  {
    section: 'skills',
    keywords: [
      'skill',
      'skills',
      'expertise',
      'technology',
      'technologies',
      'tech stack',
      'programming',
      'language',
      'languages',
      'framework',
      'frameworks',
      'what can you do',
      'what do you know',
      'abilities',
    ],
  },
  {
    section: 'contact',
    keywords: [
      'contact',
      'contacts',
      'email',
      'reach',
      'connect',
      'get in touch',
      'how to contact',
      'how can i reach',
      'linkedin',
      'discord',
      'social',
      'hire',
      'reach out',
    ],
  },
  {
    section: 'me',
    keywords: [
      'about you',
      'who are you',
      'tell me about yourself',
      'yourself',
      'introduce',
      'introduction',
      'bio',
      'background',
      'story',
      'about yourself',
    ],
  },
];

/**
 * Detects navigation intent from a user message
 * Returns the section to navigate to, or null if no clear intent is detected
 *
 * @param message - The user's message
 * @returns The section to navigate to, or null
 */
export function detectNavigationIntent(message: string): Section | null {
  if (!message || typeof message !== 'string') {
    return null;
  }

  // Normalize the message: lowercase and trim
  const normalizedMessage = message.toLowerCase().trim();

  // If the message is just a section name, navigate directly
  if (['projects', 'skills', 'contact', 'me'].includes(normalizedMessage)) {
    return normalizedMessage as Section;
  }

  // Track matches per section
  const sectionMatches: Record<Section, number> = {
    projects: 0,
    skills: 0,
    contact: 0,
    me: 0,
  };

  // Check each pattern
  for (const pattern of INTENT_PATTERNS) {
    for (const keyword of pattern.keywords) {
      // Use word boundary matching to avoid false positives
      // e.g., "skill" shouldn't match within "unskilled"
      const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (regex.test(normalizedMessage)) {
        sectionMatches[pattern.section]++;
      }
    }
  }

  // Find the section with the most matches
  let maxMatches = 0;
  let detectedSection: Section | null = null;

  for (const [section, count] of Object.entries(sectionMatches)) {
    if (count > maxMatches) {
      maxMatches = count;
      detectedSection = section as Section;
    }
  }

  // Only return a section if we have at least one match
  // This avoids false positives on general questions
  return maxMatches > 0 ? detectedSection : null;
}

/**
 * Get a friendly response message for a detected section
 *
 * @param section - The section that was detected
 * @returns A friendly message to show before navigation
 */
export function getNavigationMessage(section: Section): string {
  const messages: Record<Section, string> = {
    projects: "Sure! Let me show you my projects.",
    skills: "Here are my skills and expertise!",
    contact: "Here's how you can reach me!",
    me: "Let me tell you about myself!",
  };

  return messages[section];
}
