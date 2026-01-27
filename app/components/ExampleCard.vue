<script setup lang="ts">
/**
 * @fileoverview Example card component displaying a sentence with clickable words.
 */

import type { Example, ParsedWord } from '~/types';

const props = defineProps<{
  example: Example;
  tenseName: string;
  isFavorite: boolean;
  currentIndex: number;
  totalCount: number;
  searchQuery?: string;
}>();

const emit = defineEmits<{
  prev: [];
  next: [];
  toggleFavorite: [];
  wordClick: [word: string, event: MouseEvent];
}>();

/**
 * Parses a sentence into individual words with metadata and indices.
 */
const words = computed((): ParsedWord[] => {
  const sentence = props.example.sentence;
  const wordRegex = /[\w']+|[^\w\s]/g;
  let match;
  const result: ParsedWord[] = [];
  let id = 0;

  while ((match = wordRegex.exec(sentence)) !== null) {
    const text = match[0];
    const start = match.index;
    const end = start + text.length;
    const cleanWord = text.replace(/[^\w']/g, '');
    const isPunctuation = /^[^\w]+$/.test(text);
    const isVerb = cleanWord.toLowerCase() === props.example.verb.toLowerCase();

    result.push({
      id: id++,
      text,
      start,
      end,
      cleanWord,
      isPunctuation,
      isVerb,
    });
  }
  return result;
});

const searchMatches = computed(() => {
  const rawQuery = props.searchQuery?.trim().toLowerCase();
  if (!rawQuery) return [];

  const query: string = rawQuery;
  const sentence = props.example.sentence.toLowerCase();
  const matches = [];
  let index = sentence.indexOf(query);
  while (index !== -1) {
    matches.push({ start: index, end: index + query.length });
    index = sentence.indexOf(query, index + 1);
  }
  return matches;
});

/**
 * Splits a word's text into matching and non-matching parts based on global matches.
 */
function getWordParts(word: ParsedWord): { text: string; isMatch: boolean }[] {
  const matches = searchMatches.value;
  if (!matches.length || word.isPunctuation) {
    return [{ text: word.text, isMatch: false }];
  }

  const parts: { text: string; isMatch: boolean }[] = [];
  const wordText = word.text;
  let charIndex = word.start;

  for (const char of wordText) {
    const isMatch = matches.some((m) => charIndex >= m.start && charIndex < m.end);

    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart.isMatch === isMatch) {
      lastPart.text += char;
    } else {
      parts.push({ text: char, isMatch });
    }
    charIndex++;
  }

  return parts;
}

function handleWordClick(word: ParsedWord, event: MouseEvent): void {
  if (!word.isPunctuation && word.cleanWord) {
    emit('wordClick', word.cleanWord, event);
  }
}

function handleWordKeydown(word: ParsedWord, event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (!word.isPunctuation && word.cleanWord) {
      emit('wordClick', word.cleanWord, event as unknown as MouseEvent);
    }
  }
}

/** Display string for pagination (1-indexed for users). */
const paginationDisplay = computed(() => {
  return `${props.currentIndex + 1} of ${props.totalCount}`;
});
</script>

<template>
  <article class="card example-card" aria-label="Example sentence">
    <header class="tense-info">
      <h2>{{ tenseName }}</h2>
    </header>

    <p class="sentence" aria-live="polite">
      <template v-for="word in words" :key="word.id">
        <span v-if="word.isPunctuation">{{ word.text }}</span>
        <span
          v-else
          class="word"
          :class="{ verb: word.isVerb }"
          role="button"
          tabindex="0"
          :aria-label="`${word.text}, click to see definition`"
          @click="handleWordClick(word, $event)"
          @keydown="handleWordKeydown(word, $event)"
        >
          <template v-for="(part, i) in getWordParts(word)" :key="i">
            <mark v-if="part.isMatch" class="search-match">{{ part.text }}</mark>
            <template v-else>{{ part.text }}</template>
          </template>
        </span>
        {{ ' ' }}
      </template>
    </p>

    <div class="example-actions">
      <button 
        class="btn btn-small btn-primary"
        aria-label="Previous example"
        @click="emit('prev')"
      >
        ← Prev
      </button>

      <span class="pagination-info" aria-live="polite">
        {{ paginationDisplay }}
      </span>

      <button
        class="btn btn-small"
        :aria-pressed="isFavorite"
        @click="emit('toggleFavorite')"
      >
        {{ isFavorite ? '★ Saved' : '☆ Save' }}
      </button>

      <button
        class="btn btn-small btn-primary"
        aria-label="Next example"
        @click="emit('next')"
      >
        Next →
      </button>
    </div>
  </article>
</template>
