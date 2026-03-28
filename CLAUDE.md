# Selah-AI — Project Context for Claude Agent

## What Is This Project?
**Selah-AI** is a Bible study web app that generates thoughtful, AI-powered study prompts for avid adult Christians. "Selah" is the Hebrew pause/meditation marker found in Psalms — the app encourages users to pause, reflect, and go deeper into Scripture.

**Developer:** Kishxi (Nykolas) — Senior SWE at Goldman Sachs, learning MERN stack. Prefers efficiency-first development, direct communication, and mentorship-style AI collaboration.

---

## Architecture Overview

```
selah-ai/
├── src/                          # React frontend (Vite + TypeScript)
│   ├── components/               # UI components
│   │   ├── Header.tsx            # Nav toggle: Daily / Explore
│   │   ├── PromptCard.tsx        # Expandable prompt card (compact → full)
│   │   ├── ExplorePanel.tsx      # User-curated prompt generation
│   │   ├── BookSelector.tsx      # Bible book dropdown (grouped by testament)
│   │   ├── TopicSelector.tsx     # Topic chips selector
│   │   ├── VerseDisplay.tsx      # Verse blockquote + BibleGateway link
│   │   └── LoadingState.tsx      # Loading animation
│   ├── data/
│   │   └── books.ts             # All 66 books + chapter counts + curated topics
│   ├── lib/
│   │   ├── randomEngine.ts      # Seed generation + localStorage dedup
│   │   └── api.ts               # Client-side fetch calls to Netlify Functions
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Root component with view routing
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind directives + custom animations
├── netlify/
│   └── functions/
│       ├── generate-prompts.ts  # Main serverless function (orchestrates Haiku + ESV)
│       └── utils/
│           ├── anthropic.ts     # Claude Haiku client + system prompt
│           └── esv.ts           # ESV Bible API client
├── public/                      # Static assets (needs favicon/icon)
├── netlify.toml                 # Build + redirect config
├── tailwind.config.ts           # Custom warm devotional color palette
├── .env.example                 # Required env vars template
└── package.json                 # Dependencies and scripts
```

---

## Tech Stack
- **Frontend:** React 19 + Vite 6 + TypeScript 5.7 + Tailwind CSS 3
- **Backend:** Netlify Functions (serverless, TypeScript)
- **AI:** Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — $1/$5 per million tokens
- **Bible Data:** ESV API (free, 5000 queries/day) for verse text + BibleGateway.com for external reading links
- **Deployment:** Netlify (same pattern as date-spotter, kishxi, surprise-me)
- **No database** — localStorage for client-side seed tracking only

---

## How the System Works

### Home Page Flow (Daily Prompts)
1. `App.tsx` calls `generateRandomSeeds(2)` from `randomEngine.ts`
2. Engine picks random `book + chapter + topic` combos, checks localStorage for recent collisions
3. Seeds sent to `/api/generate-prompts` (Netlify Function)
4. Function calls Claude Haiku with a biblical scholar system prompt → gets JSON with question + sub-questions + verse refs
5. Function calls ESV API to fetch actual verse text for each reference
6. Response assembled and returned to frontend
7. Two `PromptCard` components render in compact mode
8. User taps one → card expands to show context, verse text, sub-questions, BibleGateway links
9. Seeds marked as seen in localStorage

### Explore Page Flow (Curated Prompts)
1. User selects Book (dropdown), Topic (chips), optional custom text query
2. Request sent to same `/api/generate-prompts` function with different payload shape
3. Same Haiku + ESV pipeline
4. Results displayed as expanded `PromptCard`(s)

---

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Create .env file from template
cp .env.example .env

# 3. Add your API keys to .env:
#    - ANTHROPIC_API_KEY: Get from https://console.anthropic.com/
#    - ESV_API_KEY: Register an app at https://api.esv.org/ (free, instant)

# 4. Run with Netlify Dev (proxies functions + Vite)
npx netlify dev

# 5. Open http://localhost:8888
```

---

## Environment Variables (REQUIRED)
| Variable | Source | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com | Kishxi already has one from date-spotter |
| `ESV_API_KEY` | api.esv.org | Free registration, non-commercial |

For Netlify deployment: set these in Netlify Dashboard → Site → Environment Variables.

---

## Design Direction

**"Beautiful Devotional Journal"** — NOT dark/techy.

- **Colors:** Warm parchment backgrounds, olive greens, muted golds, wine accents (see `tailwind.config.ts` custom palette)
- **Typography:** Merriweather (serif, for headings/questions), Inter (sans, for UI text)
- **Tone:** Calm, warm, inviting — like opening a well-loved study Bible
- **Layout:** Max-width 3xl (~768px), centered, generous whitespace
- **Interactions:** Smooth expand/collapse on cards, subtle hover states

---

## Known TODOs and Implementation Notes

### Must Fix Before First Run
- [ ] Path aliases: Vite config has `@/` alias but TypeScript paths need to resolve correctly. May need to verify `vite-tsconfig-paths` or adjust.
- [ ] The Netlify Function uses `@anthropic-ai/sdk` which needs to be available at build time in the functions directory. May need a separate `package.json` in `netlify/functions/` or configure Netlify's bundler.
- [ ] `border-l-3` in VerseDisplay.tsx is not a default Tailwind class — either add to config or use `border-l-[3px]`.

### Feature TODOs
- [ ] **Explore panel chapter randomization:** Currently hardcoded to chapter 1 in the Netlify function's explore handler. Should randomize based on selected book's chapter count.
- [ ] **Error handling refinement:** Add retry logic and better user-facing error messages.
- [ ] **Favicon/icon:** Need an SVG icon for the app (referenced in index.html as `selah-icon.svg`).
- [ ] **Mobile responsiveness:** Components are built responsive-first but need testing on actual mobile viewports.
- [ ] **ESV API fallback:** If verse fetch fails, the card should still display gracefully without verse text.

### Future Features (Day 2 / Post-MVP)
- [ ] **Daily Reading Plan mode:** Data model is ready (`dailyPlanEligible` flag on books, Proverbs has 31 chapters = 31 days). Would use date's day-of-month as chapter index instead of random.
- [ ] **User accounts + database:** Move to Railway backend, PostgreSQL for storing user preferences and prompt history.
- [ ] **Share prompts:** Generate a shareable link or image for a specific prompt.
- [ ] **Prompt bookmarking:** Save favorites to localStorage (pre-database) or user account (post-database).

---

## Key Files to Understand First
1. `src/data/books.ts` — The data foundation. All 66 books, chapters, topic mappings.
2. `netlify/functions/utils/anthropic.ts` — The system prompt that shapes Haiku's output. This is where question quality is tuned.
3. `src/lib/randomEngine.ts` — The freshness logic. Seed generation + localStorage dedup.
4. `src/App.tsx` — Root component, orchestrates the daily prompt loading flow.

---

## Coding Conventions (from Kishxi)
- TypeScript strict mode
- Functional components with hooks
- Tailwind for all styling (no separate CSS files beyond index.css)
- `@/` path alias for `src/` imports
- ESLint with React hooks + refresh plugins
- Always create/update README.md when project changes significantly
