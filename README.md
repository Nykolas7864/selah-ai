# Selah-AI

**Thoughtful Bible study prompts, powered by AI.**

Selah-AI generates deep, thought-provoking study questions drawn from across Scripture — designed for avid adult Christians who want to go beyond surface-level reading and explore the symbolism, theology, and historical context of the Bible.

## Features

- **Daily Prompts** — Two fresh, randomized study questions on each visit, covering different books and topics
- **Explore Mode** — Choose a specific book, topic, or enter a custom focus to generate tailored study prompts
- **Biblical Names Glossary** — Searchable A-Z reference of 150+ significant biblical figures with name meanings, summaries, key relationships, and verse references
- **Name Highlighting** — Biblical figures mentioned in study prompts are highlighted; click any name to see their glossary entry in a side panel (desktop) or bottom sheet (mobile)
- **AI Reading Plans** — Describe your study interests and timeline; AI generates a personalized daily reading plan with progress tracking persisted in localStorage
- **Save & Share** — Copy or download any study prompt or reading plan as plain text
- **Verse References** — Every prompt includes specific Bible verse references (ESV) with one-click links to BibleGateway

## Tech Stack

- React 19 + TypeScript 5.7 + Vite 6
- Tailwind CSS (custom warm devotional palette)
- Netlify Functions (serverless backend)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — AI prompt and reading plan generation
- ESV Bible API (verse text)
- Vitest + Testing Library (unit and component tests)

## Getting Started

```bash
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY and ESV_API_KEY to .env
npx netlify dev
```

## Running Tests

```bash
npm run test
```

## Screenshots

_Coming soon_

## About the Name

**Selah** (סֶלָה) appears 74 times in the Hebrew Bible, primarily in Psalms. While its exact meaning is debated, it's widely understood as a musical or liturgical pause — an invitation to stop, reflect, and meditate on what was just said. That's exactly what this app encourages.

---

Built by [Kishxi](https://github.com/Kishxi) | Powered by [Anthropic Claude](https://anthropic.com)
