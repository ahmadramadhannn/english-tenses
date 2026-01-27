# English Tenses

A simple app to practice English tenses. I built this because I wanted a quick way to see lots of example sentences for each tense, with the ability to look up words I don't know.

## What it does

- Shows example sentences for all 12 English tenses
- Click any word to see its definition (uses the free dictionary API)
- Search for specific words across all sentences
- Save sentences you want to review later

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## How the examples are generated

The sentences are auto-generated using `scripts/generate-examples.cjs`. It creates 2,000 sentences per tense by combining subjects, verbs, and objects that make sense together.

I spent some time making sure the grammar is correct - things like:
- "speak **to** someone" not "speak someone"  
- "listen **to** music" not "listen music"
- Animals only do animal things (no "the cat writes an email")

To regenerate:
```bash
node scripts/generate-examples.cjs
```

## Project structure

Nothing fancy here:
- `app/` - Vue components and composables
- `public/data/` - JSON files with all the sentences
- `scripts/` - The sentence generator

## Tech

Nuxt 3, Vue 3, TypeScript. Dictionary lookups via https://dictionaryapi.dev (free, no API key needed).
