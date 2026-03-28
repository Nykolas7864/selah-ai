/**
 * Complete Bible book data with chapter counts and curated study topics.
 * Topics are tailored to each book's primary themes and content.
 * Used by the randomization engine to generate diverse, relevant prompts.
 */

export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'OT' | 'NT';
  category: BookCategory;
  topics: StudyTopic[];
  /** Whether this book is eligible for daily reading plan mode (chapters <= 31) */
  dailyPlanEligible: boolean;
}

export type BookCategory =
  | 'Law'            // Genesis-Deuteronomy
  | 'History'        // Joshua-Esther
  | 'Wisdom'         // Job-Song of Solomon
  | 'MajorProphet'   // Isaiah-Daniel
  | 'MinorProphet'   // Hosea-Malachi
  | 'Gospel'         // Matthew-John
  | 'Acts'           // Acts
  | 'PaulineEpistle' // Romans-Philemon
  | 'GeneralEpistle' // Hebrews-Jude
  | 'Apocalyptic';   // Revelation

export type StudyTopic =
  | 'Symbolism & Imagery'
  | 'Character Study'
  | 'Prophecy & Fulfillment'
  | 'Wisdom & Practical Living'
  | 'Historical Context'
  | 'Theology & Doctrine'
  | 'Moral Dilemmas'
  | 'Covenants & Promises'
  | 'Typology & Foreshadowing'
  | 'Poetry & Literary Devices'
  | 'Spiritual Warfare'
  | 'Justice & Righteousness'
  | 'Faith & Doubt'
  | 'Leadership & Authority'
  | 'Suffering & Redemption'
  | 'Community & Relationships'
  | 'Worship & Prayer'
  | 'Creation & Nature'
  | 'Law & Grace'
  | 'Miracles & Signs'
  | 'Parables & Teaching'
  | 'Identity & Calling';

/** All available study topics for the Explore panel */
export const ALL_TOPICS: StudyTopic[] = [
  'Symbolism & Imagery',
  'Character Study',
  'Prophecy & Fulfillment',
  'Wisdom & Practical Living',
  'Historical Context',
  'Theology & Doctrine',
  'Moral Dilemmas',
  'Covenants & Promises',
  'Typology & Foreshadowing',
  'Poetry & Literary Devices',
  'Spiritual Warfare',
  'Justice & Righteousness',
  'Faith & Doubt',
  'Leadership & Authority',
  'Suffering & Redemption',
  'Community & Relationships',
  'Worship & Prayer',
  'Creation & Nature',
  'Law & Grace',
  'Miracles & Signs',
  'Parables & Teaching',
  'Identity & Calling',
];

export const BIBLE_BOOKS: BibleBook[] = [
  // ─── OLD TESTAMENT ────────────────────────────────────────────

  // Law (Pentateuch)
  {
    name: 'Genesis',
    chapters: 50,
    testament: 'OT',
    category: 'Law',
    dailyPlanEligible: false,
    topics: [
      'Creation & Nature',
      'Covenants & Promises',
      'Character Study',
      'Typology & Foreshadowing',
      'Moral Dilemmas',
      'Symbolism & Imagery',
      'Faith & Doubt',
    ],
  },
  {
    name: 'Exodus',
    chapters: 40,
    testament: 'OT',
    category: 'Law',
    dailyPlanEligible: false,
    topics: [
      'Typology & Foreshadowing',
      'Leadership & Authority',
      'Symbolism & Imagery',
      'Covenants & Promises',
      'Law & Grace',
      'Worship & Prayer',
      'Miracles & Signs',
    ],
  },
  {
    name: 'Leviticus',
    chapters: 27,
    testament: 'OT',
    category: 'Law',
    dailyPlanEligible: true,
    topics: [
      'Symbolism & Imagery',
      'Theology & Doctrine',
      'Typology & Foreshadowing',
      'Worship & Prayer',
      'Law & Grace',
      'Justice & Righteousness',
    ],
  },
  {
    name: 'Numbers',
    chapters: 36,
    testament: 'OT',
    category: 'Law',
    dailyPlanEligible: false,
    topics: [
      'Leadership & Authority',
      'Faith & Doubt',
      'Community & Relationships',
      'Historical Context',
      'Moral Dilemmas',
      'Covenants & Promises',
    ],
  },
  {
    name: 'Deuteronomy',
    chapters: 34,
    testament: 'OT',
    category: 'Law',
    dailyPlanEligible: false,
    topics: [
      'Covenants & Promises',
      'Law & Grace',
      'Leadership & Authority',
      'Theology & Doctrine',
      'Worship & Prayer',
      'Justice & Righteousness',
    ],
  },

  // History
  {
    name: 'Joshua',
    chapters: 24,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Leadership & Authority',
      'Faith & Doubt',
      'Covenants & Promises',
      'Historical Context',
      'Spiritual Warfare',
      'Identity & Calling',
    ],
  },
  {
    name: 'Judges',
    chapters: 21,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Moral Dilemmas',
      'Leadership & Authority',
      'Character Study',
      'Justice & Righteousness',
      'Faith & Doubt',
      'Typology & Foreshadowing',
    ],
  },
  {
    name: 'Ruth',
    chapters: 4,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Character Study',
      'Typology & Foreshadowing',
      'Community & Relationships',
      'Covenants & Promises',
      'Symbolism & Imagery',
      'Identity & Calling',
    ],
  },
  {
    name: '1 Samuel',
    chapters: 31,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Character Study',
      'Leadership & Authority',
      'Moral Dilemmas',
      'Faith & Doubt',
      'Spiritual Warfare',
      'Identity & Calling',
    ],
  },
  {
    name: '2 Samuel',
    chapters: 24,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Character Study',
      'Leadership & Authority',
      'Moral Dilemmas',
      'Covenants & Promises',
      'Suffering & Redemption',
      'Justice & Righteousness',
    ],
  },
  {
    name: '1 Kings',
    chapters: 22,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Leadership & Authority',
      'Worship & Prayer',
      'Moral Dilemmas',
      'Prophecy & Fulfillment',
      'Character Study',
      'Faith & Doubt',
    ],
  },
  {
    name: '2 Kings',
    chapters: 25,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Leadership & Authority',
      'Historical Context',
      'Justice & Righteousness',
      'Miracles & Signs',
      'Spiritual Warfare',
    ],
  },
  {
    name: '1 Chronicles',
    chapters: 29,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Historical Context',
      'Worship & Prayer',
      'Leadership & Authority',
      'Covenants & Promises',
      'Theology & Doctrine',
    ],
  },
  {
    name: '2 Chronicles',
    chapters: 36,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: false,
    topics: [
      'Worship & Prayer',
      'Leadership & Authority',
      'Historical Context',
      'Prophecy & Fulfillment',
      'Justice & Righteousness',
      'Faith & Doubt',
    ],
  },
  {
    name: 'Ezra',
    chapters: 10,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Historical Context',
      'Identity & Calling',
      'Community & Relationships',
      'Worship & Prayer',
      'Leadership & Authority',
    ],
  },
  {
    name: 'Nehemiah',
    chapters: 13,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Leadership & Authority',
      'Community & Relationships',
      'Faith & Doubt',
      'Historical Context',
      'Worship & Prayer',
      'Identity & Calling',
    ],
  },
  {
    name: 'Esther',
    chapters: 10,
    testament: 'OT',
    category: 'History',
    dailyPlanEligible: true,
    topics: [
      'Character Study',
      'Identity & Calling',
      'Moral Dilemmas',
      'Historical Context',
      'Symbolism & Imagery',
      'Community & Relationships',
    ],
  },

  // Wisdom / Poetry
  {
    name: 'Job',
    chapters: 42,
    testament: 'OT',
    category: 'Wisdom',
    dailyPlanEligible: false,
    topics: [
      'Suffering & Redemption',
      'Theology & Doctrine',
      'Faith & Doubt',
      'Poetry & Literary Devices',
      'Character Study',
      'Creation & Nature',
      'Moral Dilemmas',
    ],
  },
  {
    name: 'Psalms',
    chapters: 150,
    testament: 'OT',
    category: 'Wisdom',
    dailyPlanEligible: false,
    topics: [
      'Worship & Prayer',
      'Poetry & Literary Devices',
      'Symbolism & Imagery',
      'Suffering & Redemption',
      'Prophecy & Fulfillment',
      'Faith & Doubt',
      'Creation & Nature',
    ],
  },
  {
    name: 'Proverbs',
    chapters: 31,
    testament: 'OT',
    category: 'Wisdom',
    dailyPlanEligible: true,
    topics: [
      'Wisdom & Practical Living',
      'Symbolism & Imagery',
      'Community & Relationships',
      'Justice & Righteousness',
      'Character Study',
      'Poetry & Literary Devices',
      'Moral Dilemmas',
    ],
  },
  {
    name: 'Ecclesiastes',
    chapters: 12,
    testament: 'OT',
    category: 'Wisdom',
    dailyPlanEligible: true,
    topics: [
      'Wisdom & Practical Living',
      'Theology & Doctrine',
      'Poetry & Literary Devices',
      'Faith & Doubt',
      'Symbolism & Imagery',
      'Moral Dilemmas',
    ],
  },
  {
    name: 'Song of Solomon',
    chapters: 8,
    testament: 'OT',
    category: 'Wisdom',
    dailyPlanEligible: true,
    topics: [
      'Symbolism & Imagery',
      'Poetry & Literary Devices',
      'Typology & Foreshadowing',
      'Community & Relationships',
    ],
  },

  // Major Prophets
  {
    name: 'Isaiah',
    chapters: 66,
    testament: 'OT',
    category: 'MajorProphet',
    dailyPlanEligible: false,
    topics: [
      'Prophecy & Fulfillment',
      'Typology & Foreshadowing',
      'Symbolism & Imagery',
      'Theology & Doctrine',
      'Suffering & Redemption',
      'Justice & Righteousness',
      'Worship & Prayer',
    ],
  },
  {
    name: 'Jeremiah',
    chapters: 52,
    testament: 'OT',
    category: 'MajorProphet',
    dailyPlanEligible: false,
    topics: [
      'Prophecy & Fulfillment',
      'Character Study',
      'Covenants & Promises',
      'Suffering & Redemption',
      'Identity & Calling',
      'Faith & Doubt',
    ],
  },
  {
    name: 'Lamentations',
    chapters: 5,
    testament: 'OT',
    category: 'MajorProphet',
    dailyPlanEligible: true,
    topics: [
      'Suffering & Redemption',
      'Poetry & Literary Devices',
      'Worship & Prayer',
      'Faith & Doubt',
      'Justice & Righteousness',
    ],
  },
  {
    name: 'Ezekiel',
    chapters: 48,
    testament: 'OT',
    category: 'MajorProphet',
    dailyPlanEligible: false,
    topics: [
      'Symbolism & Imagery',
      'Prophecy & Fulfillment',
      'Theology & Doctrine',
      'Worship & Prayer',
      'Typology & Foreshadowing',
      'Justice & Righteousness',
    ],
  },
  {
    name: 'Daniel',
    chapters: 12,
    testament: 'OT',
    category: 'MajorProphet',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Character Study',
      'Faith & Doubt',
      'Historical Context',
      'Symbolism & Imagery',
      'Spiritual Warfare',
    ],
  },

  // Minor Prophets
  {
    name: 'Hosea',
    chapters: 14,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Symbolism & Imagery',
      'Covenants & Promises',
      'Suffering & Redemption',
      'Typology & Foreshadowing',
      'Community & Relationships',
    ],
  },
  {
    name: 'Joel',
    chapters: 3,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Symbolism & Imagery',
      'Worship & Prayer',
      'Justice & Righteousness',
    ],
  },
  {
    name: 'Amos',
    chapters: 9,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Justice & Righteousness',
      'Prophecy & Fulfillment',
      'Historical Context',
      'Moral Dilemmas',
    ],
  },
  {
    name: 'Obadiah',
    chapters: 1,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Justice & Righteousness',
      'Historical Context',
    ],
  },
  {
    name: 'Jonah',
    chapters: 4,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Character Study',
      'Moral Dilemmas',
      'Typology & Foreshadowing',
      'Faith & Doubt',
      'Identity & Calling',
    ],
  },
  {
    name: 'Micah',
    chapters: 7,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Justice & Righteousness',
      'Prophecy & Fulfillment',
      'Theology & Doctrine',
      'Leadership & Authority',
    ],
  },
  {
    name: 'Nahum',
    chapters: 3,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Justice & Righteousness',
      'Prophecy & Fulfillment',
      'Historical Context',
      'Poetry & Literary Devices',
    ],
  },
  {
    name: 'Habakkuk',
    chapters: 3,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Faith & Doubt',
      'Theology & Doctrine',
      'Worship & Prayer',
      'Justice & Righteousness',
    ],
  },
  {
    name: 'Zephaniah',
    chapters: 3,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Justice & Righteousness',
      'Worship & Prayer',
    ],
  },
  {
    name: 'Haggai',
    chapters: 2,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Leadership & Authority',
      'Worship & Prayer',
      'Historical Context',
      'Identity & Calling',
    ],
  },
  {
    name: 'Zechariah',
    chapters: 14,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Symbolism & Imagery',
      'Typology & Foreshadowing',
      'Theology & Doctrine',
    ],
  },
  {
    name: 'Malachi',
    chapters: 4,
    testament: 'OT',
    category: 'MinorProphet',
    dailyPlanEligible: true,
    topics: [
      'Covenants & Promises',
      'Justice & Righteousness',
      'Worship & Prayer',
      'Prophecy & Fulfillment',
    ],
  },

  // ─── NEW TESTAMENT ────────────────────────────────────────────

  // Gospels
  {
    name: 'Matthew',
    chapters: 28,
    testament: 'NT',
    category: 'Gospel',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Parables & Teaching',
      'Character Study',
      'Theology & Doctrine',
      'Typology & Foreshadowing',
      'Law & Grace',
      'Miracles & Signs',
    ],
  },
  {
    name: 'Mark',
    chapters: 16,
    testament: 'NT',
    category: 'Gospel',
    dailyPlanEligible: true,
    topics: [
      'Character Study',
      'Miracles & Signs',
      'Identity & Calling',
      'Suffering & Redemption',
      'Faith & Doubt',
      'Leadership & Authority',
    ],
  },
  {
    name: 'Luke',
    chapters: 24,
    testament: 'NT',
    category: 'Gospel',
    dailyPlanEligible: true,
    topics: [
      'Parables & Teaching',
      'Character Study',
      'Community & Relationships',
      'Justice & Righteousness',
      'Worship & Prayer',
      'Miracles & Signs',
      'Historical Context',
    ],
  },
  {
    name: 'John',
    chapters: 21,
    testament: 'NT',
    category: 'Gospel',
    dailyPlanEligible: true,
    topics: [
      'Theology & Doctrine',
      'Symbolism & Imagery',
      'Identity & Calling',
      'Miracles & Signs',
      'Character Study',
      'Faith & Doubt',
      'Typology & Foreshadowing',
    ],
  },

  // Acts
  {
    name: 'Acts',
    chapters: 28,
    testament: 'NT',
    category: 'Acts',
    dailyPlanEligible: true,
    topics: [
      'Historical Context',
      'Community & Relationships',
      'Leadership & Authority',
      'Miracles & Signs',
      'Identity & Calling',
      'Spiritual Warfare',
      'Character Study',
    ],
  },

  // Pauline Epistles
  {
    name: 'Romans',
    chapters: 16,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Theology & Doctrine',
      'Law & Grace',
      'Faith & Doubt',
      'Justice & Righteousness',
      'Identity & Calling',
      'Covenants & Promises',
    ],
  },
  {
    name: '1 Corinthians',
    chapters: 16,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Community & Relationships',
      'Theology & Doctrine',
      'Moral Dilemmas',
      'Worship & Prayer',
      'Symbolism & Imagery',
      'Identity & Calling',
    ],
  },
  {
    name: '2 Corinthians',
    chapters: 13,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Suffering & Redemption',
      'Leadership & Authority',
      'Faith & Doubt',
      'Community & Relationships',
      'Identity & Calling',
    ],
  },
  {
    name: 'Galatians',
    chapters: 6,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Law & Grace',
      'Theology & Doctrine',
      'Faith & Doubt',
      'Identity & Calling',
      'Community & Relationships',
    ],
  },
  {
    name: 'Ephesians',
    chapters: 6,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Theology & Doctrine',
      'Community & Relationships',
      'Spiritual Warfare',
      'Identity & Calling',
      'Symbolism & Imagery',
    ],
  },
  {
    name: 'Philippians',
    chapters: 4,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Worship & Prayer',
      'Suffering & Redemption',
      'Identity & Calling',
      'Community & Relationships',
      'Faith & Doubt',
    ],
  },
  {
    name: 'Colossians',
    chapters: 4,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Theology & Doctrine',
      'Identity & Calling',
      'Community & Relationships',
      'Symbolism & Imagery',
    ],
  },
  {
    name: '1 Thessalonians',
    chapters: 5,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Community & Relationships',
      'Faith & Doubt',
      'Worship & Prayer',
    ],
  },
  {
    name: '2 Thessalonians',
    chapters: 3,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Theology & Doctrine',
      'Spiritual Warfare',
      'Community & Relationships',
    ],
  },
  {
    name: '1 Timothy',
    chapters: 6,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Leadership & Authority',
      'Community & Relationships',
      'Theology & Doctrine',
      'Identity & Calling',
    ],
  },
  {
    name: '2 Timothy',
    chapters: 4,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Leadership & Authority',
      'Suffering & Redemption',
      'Identity & Calling',
      'Faith & Doubt',
    ],
  },
  {
    name: 'Titus',
    chapters: 3,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Leadership & Authority',
      'Community & Relationships',
      'Law & Grace',
      'Theology & Doctrine',
    ],
  },
  {
    name: 'Philemon',
    chapters: 1,
    testament: 'NT',
    category: 'PaulineEpistle',
    dailyPlanEligible: true,
    topics: [
      'Community & Relationships',
      'Justice & Righteousness',
      'Law & Grace',
      'Character Study',
    ],
  },

  // General Epistles
  {
    name: 'Hebrews',
    chapters: 13,
    testament: 'NT',
    category: 'GeneralEpistle',
    dailyPlanEligible: true,
    topics: [
      'Typology & Foreshadowing',
      'Theology & Doctrine',
      'Faith & Doubt',
      'Covenants & Promises',
      'Worship & Prayer',
      'Character Study',
    ],
  },
  {
    name: 'James',
    chapters: 5,
    testament: 'NT',
    category: 'GeneralEpistle',
    dailyPlanEligible: true,
    topics: [
      'Wisdom & Practical Living',
      'Faith & Doubt',
      'Community & Relationships',
      'Justice & Righteousness',
      'Moral Dilemmas',
    ],
  },
  {
    name: '1 Peter',
    chapters: 5,
    testament: 'NT',
    category: 'GeneralEpistle',
    dailyPlanEligible: true,
    topics: [
      'Suffering & Redemption',
      'Identity & Calling',
      'Community & Relationships',
      'Faith & Doubt',
    ],
  },
  {
    name: '2 Peter',
    chapters: 3,
    testament: 'NT',
    category: 'GeneralEpistle',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Theology & Doctrine',
      'Faith & Doubt',
      'Moral Dilemmas',
    ],
  },
  {
    name: '1 John',
    chapters: 5,
    testament: 'NT',
    category: 'GeneralEpistle',
    dailyPlanEligible: true,
    topics: [
      'Theology & Doctrine',
      'Community & Relationships',
      'Identity & Calling',
      'Faith & Doubt',
      'Symbolism & Imagery',
    ],
  },
  {
    name: '2 John',
    chapters: 1,
    testament: 'NT',
    category: 'GeneralEpistle',
    dailyPlanEligible: true,
    topics: [
      'Community & Relationships',
      'Theology & Doctrine',
      'Faith & Doubt',
    ],
  },
  {
    name: '3 John',
    chapters: 1,
    testament: 'NT',
    category: 'GeneralEpistle',
    dailyPlanEligible: true,
    topics: [
      'Community & Relationships',
      'Leadership & Authority',
      'Character Study',
    ],
  },
  {
    name: 'Jude',
    chapters: 1,
    testament: 'NT',
    category: 'GeneralEpistle',
    dailyPlanEligible: true,
    topics: [
      'Spiritual Warfare',
      'Theology & Doctrine',
      'Faith & Doubt',
      'Historical Context',
    ],
  },

  // Apocalyptic
  {
    name: 'Revelation',
    chapters: 22,
    testament: 'NT',
    category: 'Apocalyptic',
    dailyPlanEligible: true,
    topics: [
      'Prophecy & Fulfillment',
      'Symbolism & Imagery',
      'Theology & Doctrine',
      'Spiritual Warfare',
      'Worship & Prayer',
      'Typology & Foreshadowing',
      'Poetry & Literary Devices',
    ],
  },
];

/** Helper: get books by testament */
export const getBooksByTestament = (testament: 'OT' | 'NT'): BibleBook[] =>
  BIBLE_BOOKS.filter((b) => b.testament === testament);

/** Helper: get books eligible for daily reading plan */
export const getDailyPlanBooks = (): BibleBook[] =>
  BIBLE_BOOKS.filter((b) => b.dailyPlanEligible);

/** Helper: find a book by name (case-insensitive) */
export const findBook = (name: string): BibleBook | undefined =>
  BIBLE_BOOKS.find((b) => b.name.toLowerCase() === name.toLowerCase());

/**
 * Generate a BibleGateway URL for a given passage.
 * @param book - Book name (e.g., "Proverbs")
 * @param chapter - Chapter number
 * @param verse - Optional verse or verse range (e.g., "20" or "1-5")
 * @param version - Bible version, defaults to ESV
 */
export const getBibleGatewayUrl = (
  book: string,
  chapter: number,
  verse?: string,
  version = 'ESV'
): string => {
  const passage = verse ? `${book}+${chapter}:${verse}` : `${book}+${chapter}`;
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(passage)}&version=${version}`;
};
