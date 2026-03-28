# Selah-AI

**Thoughtful Bible study prompts, powered by AI.**

Selah-AI generates deep, thought-provoking study questions drawn from across Scripture — designed for avid adult Christians who want to go beyond surface-level reading and explore the symbolism, theology, and historical context of the Bible.

## Features

- **Daily Prompts** — Two fresh, randomized study questions on each visit, covering different books and topics
- **Explore Mode** — Choose a specific book, topic, or enter a custom focus to generate tailored study prompts
- **Verse References** — Every prompt includes specific Bible verse references (ESV) with one-click links to BibleGateway for further reading
- **Deep Sub-Questions** — Expand any prompt to reveal follow-up questions approaching the topic from symbolic, historical, and practical angles

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (custom warm devotional palette)
- Netlify Functions (serverless backend)
- Claude Haiku 4.5 (AI prompt generation)
- ESV Bible API (verse text)

## Getting Started

```bash
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY and ESV_API_KEY to .env
npx netlify dev
```

## About the Name

**Selah** (סֶלָה) appears 74 times in the Hebrew Bible, primarily in Psalms. While its exact meaning is debated, it's widely understood as a musical or liturgical pause — an invitation to stop, reflect, and meditate on what was just said. That's exactly what this app encourages.

---

Built by [Kishxi](https://github.com/Kishxi) | Powered by [Anthropic Claude](https://anthropic.com)
