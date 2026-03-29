import type { StudyTopic } from '@/data/books';

/** A seed used by the randomization engine to generate a unique prompt */
export interface PromptSeed {
  book: string;
  chapter: number;
  topic: StudyTopic;
  /** String key for localStorage dedup, e.g. "genesis-3-symbolism-imagery" */
  key: string;
}

/** A sub-question returned as part of a generated prompt */
export interface SubQuestion {
  question: string;
  verseReference?: string; // e.g. "Proverbs 21:20"
  verseText?: string;      // Actual ESV text fetched from API
  bibleGatewayUrl?: string;
}

/** A complete generated prompt with its sub-questions */
export interface GeneratedPrompt {
  /** The seed that generated this prompt */
  seed: PromptSeed;
  /** The main thought-provoking question */
  mainQuestion: string;
  /** Brief context/framing for the question */
  context: string;
  /** The primary verse reference for the main question */
  primaryReference: string; // e.g. "Proverbs 21:20"
  primaryVerseText?: string;
  primaryBibleGatewayUrl: string;
  /** Follow-up sub-questions for deeper study */
  subQuestions: SubQuestion[];
}

/** Shape of the API response from the Netlify function */
export interface GeneratePromptsResponse {
  prompts: GeneratedPrompt[];
  error?: string;
}

/** Request body for the generate-prompts Netlify function */
export interface GeneratePromptsRequest {
  seeds: PromptSeed[];
}

/** Request body for user-curated (Explore) prompt generation */
export interface ExploreRequest {
  book?: string;       // "Any" or a specific book name
  testament?: 'OT' | 'NT' | 'Any';
  topic?: StudyTopic;
  customQuery?: string; // Free-text user input
}

/** View state for the app */
export type AppView = 'home' | 'explore' | 'glossary' | 'reading-plan';

export interface GlossaryRelationship {
  name: string;
  relationship: string; // e.g. "Father of", "Wife of", "Disciple"
}

export interface GlossaryEntry {
  name: string;
  alternateNames: string[];
  nameMeaning: string;
  testament: 'OT' | 'NT' | 'Both';
  summary: string; // 2-3 sentences
  keyRelationships: GlossaryRelationship[];
  keyVerses: string[]; // e.g. ["Genesis 12:1", "Hebrews 11:8"]
}
