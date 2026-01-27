<script setup lang="ts">
/**
 * @fileoverview Favorites list component displaying saved examples.
 */

import type { FavoriteExample, ParsedWord } from '~/types';

const props = defineProps<{
  favorites: readonly FavoriteExample[];
}>();

const emit = defineEmits<{
  remove: [id: string];
  wordClick: [word: string, event: MouseEvent];
}>();

/**
 * Parses a sentence into individual words with metadata.
 */
function parseWords(sentence: string, verb: string): ParsedWord[] {
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
    const isVerb = cleanWord.toLowerCase() === verb.toLowerCase();

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
</script>

<template>
  <section class="card favorites-container" aria-label="Your favorite examples">
    <h2>Your Favorites</h2>

    <p v-if="favorites.length === 0" class="no-favorites">
      No favorites yet. Add some examples!
    </p>

    <ul v-else class="favorites-list" role="list">
      <li
        v-for="fav in favorites"
        :key="fav.id"
        class="favorite-item"
      >
        <p class="sentence">
          <template v-for="word in parseWords(fav.sentence, fav.verb)" :key="word.id">
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
            >{{ word.text }}</span>
            {{ ' ' }}
          </template>
        </p>
        <span class="tense-label">{{ fav.tenseName }}</span>
        <button
          class="remove-btn"
          :aria-label="`Remove '${fav.sentence.slice(0, 30)}...' from favorites`"
          @click="emit('remove', fav.id)"
        >
          ✕
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.favorites-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
