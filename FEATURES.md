# Selah-AI — Autonomous Overnight Build Instructions

> **For the Claude Code agent running `--dangerously-skip-permissions`.**
> Work through this file top to bottom. Commit each feature separately with a clear message.
> Run `npm run build` after every feature to verify TypeScript compiles clean.
> If you get stuck on something for more than a few minutes, skip it with a `// TODO:` comment, commit what you have, and move on to the next item.
> At the end, deploy to Netlify with `npx netlify deploy --build --prod`.
> Do NOT modify `.env` or commit secrets. Do NOT break existing Daily/Explore functionality.

---

## IMPORTANT CONTEXT

- **Stack:** React 19 + Vite 6 + TypeScript 5.7 + Tailwind CSS 3 + Netlify Functions
- **AI Backend:** Claude Haiku 4.5 via `@anthropic-ai/sdk`, ESV Bible API for verse text
- **Design system:** Warm devotional theme — parchment/olive/wine/gold palette. Merriweather serif for headings, Inter sans for UI text. Max-width 3xl centered layout.
- **Path alias:** `@/` maps to `src/`
- **No database** — localStorage only
- **Rollback tag:** `v0.1-mvp` — if something catastrophic happens, `git reset --hard v0.1-mvp`

---

## PHASE 1: FEATURES (implement in this exact order)

---

### Feature 1: Save/Share Prompts

**Goal:** Let users copy or download their generated study prompts as text.

**Create these files:**

#### `src/lib/formatPrompt.ts`
- Export `formatPromptAsText(prompt: GeneratedPrompt): string`
  - Format a single prompt as readable plain text with sections:
    ```
    [Book] — Topic

    QUESTION: {mainQuestion}

    CONTEXT: {context}

    PRIMARY VERSE ({primaryReference}):
    "{primaryVerseText}"

    GO DEEPER:
    1. {subQuestion.question}
       Verse: {subQuestion.verseReference} — "{subQuestion.verseText}"
    2. ...
    ```
- Export `formatPromptsAsText(prompts: GeneratedPrompt[], title?: string): string`
  - Wraps multiple prompts with a header: `"Selah-AI Study Prompts — {date}"` and separators between them
  - Also add the ESV attribution at the bottom
- Export `copyToClipboard(text: string): Promise<boolean>`
  - Wraps `navigator.clipboard.writeText()` in try/catch, returns success boolean
- Export `downloadAsTextFile(text: string, filename: string): void`
  - Creates a Blob with `text/plain` type, generates object URL, creates temporary `<a>` element, triggers download, revokes URL

#### `src/components/ShareButtons.tsx`
- Props: `{ prompts: GeneratedPrompt[] }`
- Render a horizontal flex row with two buttons:
  - "Copy All" — calls `copyToClipboard(formatPromptsAsText(prompts))`, shows "Copied!" for 2 seconds via local state + setTimeout
  - "Download" — calls `downloadAsTextFile(formatPromptsAsText(prompts), \`selah-prompts-${new Date().toISOString().slice(0,10)}.txt\`)`
- Styling: `font-sans text-sm`, olive-600 text color, parchment-100 bg, rounded-lg, gap-3, hover:bg-parchment-200
- Use simple Unicode icons or inline SVGs for clipboard (📋) and download (⬇) — keep it simple

**Modify these files:**

#### `src/components/PromptCard.tsx`
- In the expanded section, next to the existing "Collapse" button, add a "Copy" button
- Clicking it copies `formatPromptAsText(prompt)` for that single card
- Show brief "Copied!" feedback (2s timeout)

#### `src/App.tsx`
- Import ShareButtons
- Render `<ShareButtons prompts={dailyPrompts} />` after the prompt cards list, before the "Generate new prompts" button
- Only show when `!loading && !error && dailyPrompts.length > 0`

#### `src/components/ExplorePanel.tsx`
- Import ShareButtons
- Render `<ShareButtons prompts={prompts} />` after the results, only when `prompts.length > 0`

**Commit message:** `"Add save/share functionality — copy and download prompt text"`

---

### Feature 2: Biblical Names Glossary

**Goal:** A searchable glossary of ~150-200 significant biblical figures with name meanings, summaries, and relationships.

**Create these files:**

#### `src/types/index.ts` — ADD these types (don't remove existing ones)
```typescript
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
```

Also update `AppView`:
```typescript
export type AppView = 'home' | 'explore' | 'glossary' | 'reading-plan';
```

#### `src/data/glossary.ts`
- Export `GLOSSARY_ENTRIES: GlossaryEntry[]` — sorted alphabetically by name
- **Generate ~150-200 entries using your own biblical knowledge.** Do NOT try to browse the internet. You know the Bible well enough.
- Must include at minimum these figures (and many more): Adam, Eve, Abel, Cain, Enoch, Noah, Abraham, Sarah, Hagar, Ishmael, Isaac, Rebekah, Jacob, Esau, Rachel, Leah, Joseph (son of Jacob), Judah, Moses, Aaron, Miriam, Joshua, Caleb, Rahab, Deborah, Gideon, Samson, Delilah, Ruth, Naomi, Boaz, Hannah, Samuel, Saul (king), David, Jonathan, Bathsheba, Solomon, Elijah, Elisha, Isaiah, Jeremiah, Ezekiel, Daniel, Hosea, Joel, Amos, Jonah, Micah, Habakkuk, Malachi, Esther, Mordecai, Nehemiah, Ezra, Job, Absalom, Nathan (prophet), Jezebel, Ahab, Hezekiah, Josiah, Nebuchadnezzar, Cyrus, Zerubbabel, Mary (mother of Jesus), Joseph (husband of Mary), Jesus, John the Baptist, Peter, Andrew, James (son of Zebedee), John (apostle), Philip (apostle), Bartholomew/Nathanael, Matthew/Levi, Thomas, James (son of Alphaeus), Judas Iscariot, Matthias, Paul/Saul of Tarsus, Barnabas, Timothy, Titus, Luke, Stephen, Philip (deacon), Silas, Priscilla, Aquila, Apollos, Mary Magdalene, Martha, Lazarus, Nicodemus, Pontius Pilate, Herod the Great, Herod Antipas, Caiaphas, Barabbas, Zacchaeus, Cornelius, Lydia
- Each entry must have ALL fields filled in (no empty arrays unless genuinely appropriate)
- Export helper: `findGlossaryEntry(name: string): GlossaryEntry | undefined` — case-insensitive match on name or alternateNames
- Export helper: `getAllGlossaryNames(): string[]` — flat array of all names + alternateNames, sorted longest-first (important for Feature 3 matching)

#### `src/components/GlossaryCard.tsx`
- Props: `{ entry: GlossaryEntry; onNameClick?: (name: string) => void }`
- Layout:
  - Name as `font-serif text-lg font-semibold text-olive-900`
  - Name meaning in parentheses: `font-sans text-sm italic text-olive-500`
  - Testament badge: OT = `bg-olive-100 text-olive-700`, NT = `bg-wine-100 text-wine-700`, Both = `bg-gold-100 text-gold-700` — small rounded-full chip
  - Summary paragraph: `font-sans text-sm text-olive-700 leading-relaxed`
  - Key relationships: horizontal flex-wrap of clickable chips (`bg-parchment-200 text-olive-600 rounded-full px-2 py-0.5 text-xs cursor-pointer hover:bg-parchment-300`). Format as "relationship: name" (e.g. "Father of: Isaac"). If `onNameClick` is provided, clicking a relationship chip calls it with that name.
  - Key verses: small text list, `text-xs text-olive-400`
- Card wrapper: `bg-white rounded-2xl border border-parchment-200 shadow-sm p-5` (matches PromptCard style)

#### `src/components/GlossaryPage.tsx`
- State: `searchQuery: string`, `activeLetter: string | null`
- Layout:
  - Title: `font-serif text-2xl text-olive-800 mb-2` — "Biblical Figures"
  - Subtitle: `font-sans text-sm text-olive-500 mb-6` — "Explore the people of Scripture — their names, stories, and significance."
  - **Search bar:** Full-width input, `rounded-xl border border-parchment-300 bg-parchment-50 px-4 py-3 text-sm`, placeholder "Search by name or keyword...", `focus:ring-2 focus:ring-gold-400`
  - **A-Z letter bar:** `flex flex-wrap gap-1 my-4`. 26 letter buttons. Active: `bg-olive-600 text-white`. Inactive: `bg-parchment-100 text-olive-600 hover:bg-parchment-200`. Each is `w-8 h-8 rounded-full text-xs font-sans font-medium flex items-center justify-center`.
  - **Results:** Filter by search query (match name, alternateNames, summary — case-insensitive) AND/OR active letter (first character of name). When neither filter is active, show all entries grouped by first letter with letter section headers (`font-serif text-lg text-olive-700 border-b border-parchment-200 pb-1 mb-3 mt-6`).
  - **Empty state:** "No figures found matching '{query}'" in olive-500 italic
- The `onNameClick` handler on GlossaryCards should set `searchQuery` to the clicked name and clear `activeLetter`
- Add debounce on search input (300ms) — use a simple `setTimeout`/`clearTimeout` pattern, no library needed

**Modify these files:**

#### `src/components/Header.tsx`
- Refactor the nav to use a mapped array:
  ```typescript
  const NAV_ITEMS: { label: string; view: AppView }[] = [
    { label: 'Daily', view: 'home' },
    { label: 'Explore', view: 'explore' },
    { label: 'Glossary', view: 'glossary' },
    { label: 'Plans', view: 'reading-plan' },
  ];
  ```
- Map over `NAV_ITEMS` to render buttons. Keep same styling but reduce `px-4` to `px-3`.
- Add `overflow-x-auto` to the nav container for narrow mobile screens.

#### `src/App.tsx`
- Import GlossaryPage
- Add `{view === 'glossary' && <GlossaryPage />}` in the main render

**Commit message:** `"Add Biblical Names Glossary — ~150+ figures with search and A-Z navigation"`

---

### Feature 3: Name Highlighting in Prompts

**Goal:** When study prompts display text, highlight names of biblical figures that exist in the glossary. Clicking a highlighted name shows their glossary description in a side panel (desktop) or bottom sheet (mobile).

**Create these files:**

#### `src/lib/nameHighlighter.ts`
```typescript
export interface TextSegment {
  text: string;
  isName: boolean;
  glossaryName?: string; // canonical glossary name for lookup
}
```
- Import `getAllGlossaryNames` and `findGlossaryEntry` from glossary data
- Export `highlightNames(text: string): TextSegment[]`
  - Get all names from glossary, sorted **longest first** (so "John the Baptist" matches before "John")
  - Scan the text left-to-right greedily: at each position, check if any name matches (case-insensitive)
  - **Word boundary check:** character before match must be non-alphanumeric (or start of string), character after must be non-alphanumeric (or end of string). This prevents matching "Daniel" inside "Daniels".
  - If match found: push a name segment with `glossaryName` set to the canonical entry name (use `findGlossaryEntry` to get it), advance past the match
  - If no match: accumulate the character into a plain text segment
  - Return the array of segments
- Handle edge cases: empty text returns `[{ text: '', isName: false }]`, text with no names returns single plain segment

#### `src/components/HighlightedText.tsx`
- Props: `{ text: string; onNameClick: (name: string) => void; className?: string }`
- Calls `highlightNames(text)` and maps segments:
  - Plain text: `<span>{segment.text}</span>`
  - Name: `<span className="font-semibold text-gold-700 underline decoration-dotted decoration-gold-400/60 cursor-pointer hover:text-gold-800 hover:decoration-gold-500 transition-colors" onClick={() => onNameClick(segment.glossaryName!)}>{segment.text}</span>`
- Wrap in a `<span className={className}>` container

#### `src/components/FigurePanel.tsx`
- Props: `{ entry: GlossaryEntry | null; onClose: () => void }`
- When `entry` is null, render nothing (return null)
- **Desktop (md+ breakpoint):** Use Tailwind `hidden md:block` for the desktop variant. Fixed position on the right side: `fixed right-0 top-20 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white shadow-xl rounded-l-2xl p-6 border-l border-parchment-200 z-20`. Animate in with `animate-slideInRight`.
- **Mobile (below md):** Use `md:hidden` for the mobile variant. Fixed to bottom: `fixed inset-x-0 bottom-0 max-h-[60vh] overflow-y-auto bg-white shadow-xl rounded-t-2xl p-6 z-30`. Add a semi-transparent backdrop: `fixed inset-0 bg-black/30 z-20` that closes the panel on click. Animate with `animate-slideUpFromBottom`.
- Content layout (same for both):
  - Close button: `absolute top-3 right-3`, X icon, `text-olive-400 hover:text-olive-600`
  - Name: `font-serif text-xl font-bold text-olive-900`
  - Name meaning: `font-sans text-sm italic text-olive-500 mt-1`
  - Testament badge (same styling as GlossaryCard)
  - Summary: `font-sans text-sm text-olive-700 leading-relaxed mt-3`
  - Key Relationships: chips matching GlossaryCard style, `mt-3`
  - Key Verses: `text-xs text-olive-400 mt-3`
- On mobile, when panel opens, prevent body scroll (`document.body.style.overflow = 'hidden'`), restore on close. Use useEffect cleanup.

#### `src/index.css` — ADD these animations
```css
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideUpFromBottom {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slideInRight {
  animation: slideInRight 0.25s ease-out;
}

.animate-slideUpFromBottom {
  animation: slideUpFromBottom 0.3s ease-out;
}
```

**Modify these files:**

#### `src/components/PromptCard.tsx`
- Add state: `const [selectedFigure, setSelectedFigure] = useState<GlossaryEntry | null>(null)`
- Import `HighlightedText`, `FigurePanel`, `findGlossaryEntry` from their respective files
- Create handler: `const handleNameClick = (name: string) => { const entry = findGlossaryEntry(name); if (entry) setSelectedFigure(entry); }`
- Replace plain text `{prompt.mainQuestion}` with `<HighlightedText text={prompt.mainQuestion} onNameClick={handleNameClick} className="font-serif text-lg leading-relaxed text-olive-900" />`
- Replace plain text `{prompt.context}` with `<HighlightedText text={prompt.context} onNameClick={handleNameClick} className="text-olive-700 font-sans leading-relaxed" />`
- Replace plain text `{sq.question}` in sub-questions with `<HighlightedText text={sq.question} onNameClick={handleNameClick} className="font-sans text-olive-800 leading-relaxed" />`
- Render `<FigurePanel entry={selectedFigure} onClose={() => setSelectedFigure(null)} />` inside the expanded section (after sub-questions, before collapse button)
- Import `GlossaryEntry` type from `@/types`

**Commit message:** `"Add name highlighting in prompts with glossary side panel / bottom sheet"`

---

### Feature 4: AI Reading Plan Generator

**Goal:** Users describe what they want to study and a timeline, and AI generates a personalized daily reading plan that persists in localStorage with progress tracking.

**Create these files:**

#### `src/types/index.ts` — ADD these types
```typescript
export interface ReadingPlanEntry {
  day: number;
  book: string;
  chapters: string; // e.g. "1-3" or "5"
  description: string; // why this reading matters for the topic
}

export interface ReadingPlan {
  title: string;
  description: string;
  topics: string[];
  customDescription?: string;
  timeline: string;
  totalDays: number;
  entries: ReadingPlanEntry[];
  createdAt: string; // ISO date string
}

export interface ReadingPlanProgress {
  completedDays: number[];
}

export const PLAN_TOPICS = [
  'The Apostles & Disciples',
  'Miracles of Jesus',
  'Old Testament Prophecy',
  'Wisdom Literature',
  'The Early Church',
  'Women of the Bible',
  'Parables of Jesus',
  'Creation & Genesis',
  'Kings & Kingdoms',
  'The Psalms & Worship',
  "Paul's Missionary Journeys",
  'Covenant History',
  'Suffering & Perseverance',
  'Prayer in Scripture',
  'The Life of Christ',
  'Prophets & Their Messages',
] as const;

export type PlanTopic = typeof PLAN_TOPICS[number];

export const PLAN_TIMELINES = [
  '1 week',
  '2 weeks',
  '1 month',
  '3 months',
  '6 months',
  '1 year',
] as const;
```

#### `netlify/functions/generate-reading-plan.ts`
- New Netlify function, same pattern as `generate-prompts.ts`
- Accept POST with: `{ topics: string[], customDescription?: string, timeline: string }`
- Map timeline to day count: `{ '1 week': 7, '2 weeks': 14, '1 month': 30, '3 months': 90, '6 months': 180, '1 year': 365 }`
- Call Claude Haiku with a system prompt:
  ```
  You are a biblical reading plan designer. Create a structured daily Bible reading plan based on the user's interests and timeline.

  Sequence readings logically — chronological where appropriate, thematic grouping for topical studies. Space readings proportionally across the timeline. Each day should be a manageable amount (1-3 chapters typically, occasionally more for shorter books).

  You MUST respond in valid JSON matching this structure:
  {
    "title": "A descriptive title for the plan",
    "description": "1-2 sentences describing what this plan covers",
    "entries": [
      { "day": 1, "book": "Book Name", "chapters": "1-3", "description": "Why this reading matters" },
      ...
    ]
  }

  Generate entries for EVERY day of the plan (all {totalDays} days). Do not skip days.
  ```
- Use `max_tokens: 4096` (plans can be long, especially for 6-month or 1-year plans)
- For very long plans (90+ days), consider instructing Haiku to generate in weekly blocks to keep descriptions concise
- Strip markdown code fences before JSON.parse (same pattern as anthropic.ts)
- Wrap JSON.parse in try/catch with user-friendly error
- Return: `{ plan: { title, description, entries, totalDays } }`

#### `src/lib/api.ts` — ADD this function
```typescript
export async function generateReadingPlan(options: {
  topics: string[];
  customDescription?: string;
  timeline: string;
}): Promise<ReadingPlan> {
  // POST to /api/generate-reading-plan
  // Parse response, construct full ReadingPlan object with createdAt timestamp
}
```

#### `src/components/PlanTopicSelector.tsx`
- Props: `{ selected: string[]; onChange: (topics: string[]) => void }`
- Import `PLAN_TOPICS` from types
- Render chips for each topic, multi-select (clicking toggles in/out of array)
- Selected: `bg-olive-600 text-white shadow-sm`
- Unselected: `bg-parchment-100 text-olive-600 hover:bg-parchment-200 border border-parchment-300`
- Same chip styling as TopicSelector

#### `src/components/ReadingPlanForm.tsx`
- Props: `{ onPlanGenerated: (plan: ReadingPlan) => void }`
- State: `selectedTopics: string[]`, `customDescription: string`, `timeline: string` (default "2 weeks"), `loading: boolean`, `error: string | null`
- Layout:
  - Title: "Create Your Reading Plan" (font-serif text-xl)
  - Subtitle: "Choose topics, describe your interests, and pick a timeline." (font-sans text-sm text-olive-500)
  - PlanTopicSelector
  - Custom description textarea (same styling as ExplorePanel's textarea): label "Describe your focus (optional)", placeholder e.g. "I want to learn about all the miracles Jesus performed and understand the context behind each one..."
  - Timeline selector: `<select>` dropdown with PLAN_TIMELINES options, same styling as BookSelector
  - "Generate My Plan" button: full-width, olive-700 bg, matches ExplorePanel's generate button
- Validation: at least one topic selected OR custom description provided. Show error if neither.
- On submit: call `generateReadingPlan()`, on success call `onPlanGenerated(plan)`

#### `src/components/ReadingPlanDisplay.tsx`
- Props: `{ plan: ReadingPlan; progress: ReadingPlanProgress; onToggleDay: (day: number) => void; onStartOver: () => void }`
- Layout:
  - Plan header: title (font-serif text-xl), description, timeline badge (olive-100 chip), created date (text-xs text-olive-400)
  - **Progress bar:** `h-3 rounded-full bg-parchment-200` track with `bg-olive-600 rounded-full` fill. Width = `(completedDays.length / totalDays) * 100%`. Show percentage text next to it: `font-sans text-sm text-olive-600 font-medium`
  - **Daily entries list:** Scrollable container. Each entry is a row:
    - Checkbox input (styled: `accent-olive-600 w-4 h-4`)
    - Day number badge: `bg-parchment-200 text-olive-700 rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium`
    - Book + chapters: `font-sans text-sm font-medium text-olive-800`
    - Description: `font-sans text-xs text-olive-500`
    - Completed days: `bg-olive-50` row background, `line-through text-olive-400` on book/chapters text
  - **Action buttons row:** "Copy Plan" and "Download Plan" buttons (reuse `formatPromptsAsText` pattern — create a `formatPlanAsText` function in `src/lib/formatPrompt.ts`), plus "Start Over" button (`text-wine-600 hover:text-wine-700`)
- `formatPlanAsText(plan: ReadingPlan, progress: ReadingPlanProgress): string` — add to formatPrompt.ts:
  ```
  READING PLAN: {title}
  {description}
  Timeline: {timeline} | Progress: X/{totalDays} days complete

  Day 1: {book} {chapters}
  {description}
  [x] Completed  /  [ ] Not started

  Day 2: ...
  ```

#### `src/components/ReadingPlanPage.tsx`
- Manages two states: "create" form vs "active" plan display
- On mount: check localStorage for `selah-reading-plan` and `selah-reading-plan-progress`
- If plan exists in localStorage, show ReadingPlanDisplay. Otherwise show ReadingPlanForm.
- `onPlanGenerated(plan)`: save to `localStorage.setItem('selah-reading-plan', JSON.stringify(plan))`, initialize empty progress `{ completedDays: [] }`, switch to display
- `onToggleDay(day)`: toggle day number in/out of `completedDays` array, update state and localStorage
- `onStartOver()`: show `window.confirm('This will replace your current reading plan. Are you sure?')`, if confirmed clear both localStorage keys, switch to form view
- If viewing active plan, show a small "Create New Plan" link above the plan that triggers the same confirm flow

**Modify:**
- `src/App.tsx` — add `{view === 'reading-plan' && <ReadingPlanPage />}`
- Header.tsx should already have "Plans" nav button from Feature 2's nav refactor

**Commit message:** `"Add AI Reading Plan generator with localStorage persistence and progress tracking"`

---

## PHASE 2: TESTING & QA

**Goal:** Add test infrastructure and write tests for all new and existing features.

### Step 1: Install and configure testing
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts` at project root:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

### Step 2: Write unit tests

#### `src/lib/__tests__/randomEngine.test.ts`
- Test `generateRandomSeeds(2)` returns 2 unique seeds
- Test seeds have valid book, chapter (within range), and topic
- Test `markSeedsAsDisplayed` writes to localStorage
- Test `clearSeenSeeds` clears localStorage
- Mock localStorage for tests

#### `src/lib/__tests__/formatPrompt.test.ts`
- Test `formatPromptAsText` produces expected text format
- Test `formatPromptsAsText` includes header and separators
- Test `formatPlanAsText` formats reading plan correctly
- Test `copyToClipboard` calls navigator.clipboard.writeText
- Test `downloadAsTextFile` creates and clicks download link

#### `src/lib/__tests__/nameHighlighter.test.ts`
- Test basic name matching: "God told Moses to..." → segments with "Moses" marked as name
- Test word boundary: "Daniels" should NOT match "Daniel"
- Test longest-first: "John the Baptist" should match before "John"
- Test case insensitivity
- Test no matches returns single plain segment
- Test empty string input
- Test multiple names in one string

#### `src/data/__tests__/glossary.test.ts`
- Test all entries have required fields (name, nameMeaning, testament, summary non-empty)
- Test no duplicate primary names
- Test alternateNames don't collide with other primary names
- Test `findGlossaryEntry` works for primary names
- Test `findGlossaryEntry` works for alternate names (case-insensitive)
- Test `getAllGlossaryNames` returns sorted longest-first array

### Step 3: Write component tests

#### `src/components/__tests__/ShareButtons.test.tsx`
- Test "Copy All" button calls clipboard API
- Test "Download" button triggers file download
- Test "Copied!" feedback appears and disappears

#### `src/components/__tests__/GlossaryPage.test.tsx`
- Test search filters entries by name
- Test A-Z letter filter works
- Test empty state shows when no results
- Test clicking relationship chip updates search

#### `src/components/__tests__/ReadingPlanPage.test.tsx`
- Test shows form when no plan in localStorage
- Test shows display when plan exists in localStorage
- Test toggling a day updates progress
- Test "Start Over" clears plan from localStorage

### Step 4: Run tests
```bash
npm run test
```
Fix any failing tests. Commit all tests.

**Commit message:** `"Add Vitest test suite — unit tests for utilities, data, and components"`

---

## PHASE 3: POLISH & HARDENING

### 3.1: Error Boundary

Create `src/components/ErrorBoundary.tsx`:
- React class component (error boundaries must be class components)
- Catches errors in the React tree, renders a friendly fallback UI:
  - "Something went wrong" heading
  - "Try refreshing the page" message
  - "Refresh" button that calls `window.location.reload()`
  - Styled with the parchment/wine theme

Modify `src/App.tsx`:
- Wrap the entire return JSX in `<ErrorBoundary>`

**Commit message:** `"Add React ErrorBoundary for graceful error recovery"`

### 3.2: API Hardening

Modify `netlify/functions/utils/esv.ts`:
- Add 1 retry with a 2-second delay if the first request fails
- Only retry on 5xx errors or network failures, not 4xx

Modify `netlify/functions/utils/anthropic.ts`:
- Wrap the `JSON.parse` in a try/catch
- If parsing fails, throw a descriptive error: `"AI response was not valid JSON. Please try again."`

**Commit message:** `"Harden API layer — ESV retry logic, Anthropic JSON validation"`

### 3.3: README & CLAUDE.md Updates

Update `README.md`:
- Add sections for all 4 new features (Glossary, Name Highlighting, Save/Share, Reading Plans)
- Update the "Features" list
- Update tech stack if anything was added
- Add screenshots section placeholder

Update `CLAUDE.md`:
- Mark completed TODO items with [x]
- Add new TODO items for future features
- Update the architecture section with new files

**Commit message:** `"Update README and CLAUDE.md with new features documentation"`

### 3.4: SEO & Accessibility

Modify `index.html`:
- Add Open Graph meta tags: `og:title`, `og:description`, `og:type` (website), `og:url`
- Add `<meta name="theme-color" content="#f9f3e8">` (parchment-50)

Add accessibility improvements across components:
- `aria-label` on nav buttons in Header
- `aria-expanded` on PromptCard for expand/collapse
- `role="search"` on GlossaryPage search
- `aria-label` on FigurePanel close button
- Keyboard navigation: Escape key closes FigurePanel
- Focus trap on mobile bottom sheet

**Commit message:** `"Improve SEO meta tags and accessibility (ARIA, keyboard nav)"`

### 3.5: Performance

Modify `src/components/GlossaryPage.tsx`:
- Debounce search input already done in Feature 2

If glossary.ts is very large (>200KB), consider lazy loading:
```typescript
const glossaryData = await import('@/data/glossary');
```
Only do this if the file is genuinely large. If under 200KB, skip.

**Commit message (if applicable):** `"Lazy-load glossary data for better initial bundle size"`

---

## FINAL STEP: DEPLOY

After all phases are complete:

```bash
npm run build
npm run test
npx netlify deploy --build --prod
git push origin master
```

**Commit message for any final tweaks:** `"Final polish and production deployment"`

---

## IF YOU RUN OUT OF FEATURES TO IMPLEMENT

If all 3 phases are complete and you still have capacity, here are bonus tasks in priority order:

1. **Add loading skeletons** — Replace the bouncing dots in LoadingState with skeleton cards that match PromptCard shape (pulsing gray rectangles)
2. **Add a "Verse of the Day" widget** — Small card above the daily prompts showing a random well-known verse (hardcode a list of ~100 popular verses, pick one per day based on date)
3. **Offline detection** — Show a banner when the user is offline ("You're offline — prompts require an internet connection")
4. **Dark mode** — Add a toggle in the header, use Tailwind's `dark:` variants. Dark palette: dark slate backgrounds, lighter parchment text, muted gold accents

---

## EMERGENCY ROLLBACK

If something goes catastrophically wrong:
```bash
git reset --hard v0.1-mvp
git push --force origin master
npx netlify deploy --build --prod
```
