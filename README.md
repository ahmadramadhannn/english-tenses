# 📚 English Tenses Learning App

An interactive web application to learn English tenses through practical examples. Click any word to see its definition, save your favorite sentences, and search across all tenses.

## ✨ Features

### Core Learning
- **12 English Tenses** — All major tenses from Simple Present to Future Perfect Continuous
- **2,000 Examples Per Tense** — 24,000 total unique, grammatically correct sentences
- **Highlighted Verbs** — Main verbs are highlighted to help identify tense patterns

### Interactive Tools
- **Click-to-Define** — Click any word to see its pronunciation, part of speech, and definition
- **Search Sentences** — Find sentences containing specific words or phrases across all tenses
- **Random Examples** — Get random sentences for varied practice
- **Pagination** — Navigate through examples with Previous/Next buttons

### Personalization
- **Save Favorites** — Bookmark sentences you want to review later
- **Persistent Storage** — Favorites are saved in your browser and persist between sessions

### Accessibility
- **Keyboard Navigation** — Full keyboard support for all interactive elements
- **Screen Reader Friendly** — Proper ARIA labels and semantic HTML
- **Skip to Content** — Skip link for keyboard users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd learn-english

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run generate` | Generate static site |
| `node scripts/generate-examples.cjs` | Regenerate all example sentences |

## 📁 Project Structure

```
learn-english/
├── app/
│   ├── app.vue              # Main application component
│   ├── components/          # Vue components
│   │   ├── ExampleCard.vue  # Displays sentence with clickable words
│   │   ├── FavoritesList.vue# List of saved favorites
│   │   ├── TenseSelector.vue# Tense dropdown selector
│   │   └── WordTooltip.vue  # Dictionary popup tooltip
│   ├── composables/         # Vue composables
│   │   ├── useDictionary.ts # Dictionary API integration
│   │   └── useFavorites.ts  # Favorites management
│   ├── types/               # TypeScript type definitions
│   └── assets/css/          # Global styles
├── public/
│   └── data/                # Generated JSON files (one per tense)
├── scripts/
│   └── generate-examples.cjs # Example sentence generator
└── nuxt.config.ts           # Nuxt configuration
```

## 🌐 API

The app uses the [Free Dictionary API](https://dictionaryapi.dev/) for word definitions. No API key required.

## 📝 Regenerating Examples

If you want to regenerate the example sentences:

```bash
node scripts/generate-examples.cjs
```

This will create 2,000 unique sentences for each of the 12 tenses in `public/data/`.

### Generator Features
- Semantically correct verb-object combinations
- Proper prepositions (speak **to**, listen **to**, etc.)
- Subject-type restrictions (humans, animals, organizations)
- Time expressions appropriate to each tense

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) with Vue 3
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS custom properties
- **Dictionary**: [Free Dictionary API](https://dictionaryapi.dev/)

## 📖 The 12 Tenses

| Tense | Example |
|-------|---------|
| Simple Present | She **reads** books every day. |
| Simple Past | She **read** a book yesterday. |
| Simple Future | She **will read** a book tomorrow. |
| Present Continuous | She **is reading** a book now. |
| Past Continuous | She **was reading** when I called. |
| Future Continuous | She **will be reading** at 8 PM. |
| Present Perfect | She **has read** that book. |
| Past Perfect | She **had read** it before the movie. |
| Future Perfect | She **will have read** it by Friday. |
| Present Perfect Continuous | She **has been reading** for hours. |
| Past Perfect Continuous | She **had been reading** for hours. |
| Future Perfect Continuous | She **will have been reading** for hours. |

## 📄 License

MIT
