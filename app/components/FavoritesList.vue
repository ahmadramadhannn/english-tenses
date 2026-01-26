<script setup lang="ts">
import type { FavoriteExample } from '~/composables/useFavorites'

const props = defineProps<{
  favorites: readonly FavoriteExample[]
}>()

const emit = defineEmits<{
  remove: [id: string]
  wordClick: [word: string, event: MouseEvent]
}>()

// Parse sentence into words for rendering
function parseWords(sentence: string, verb: string) {
  const matches = sentence.match(/[\w']+|[^\w\s]/g) || []
  return matches.map((word, index) => {
    const cleanWord = word.replace(/[^\w']/g, '')
    const isPunctuation = /^[^\w]+$/.test(word)
    const isVerb = cleanWord.toLowerCase() === verb.toLowerCase()
    
    return {
      id: index,
      text: word,
      cleanWord,
      isPunctuation,
      isVerb
    }
  })
}

function handleWordClick(word: { cleanWord: string; isPunctuation: boolean }, event: MouseEvent) {
  if (!word.isPunctuation && word.cleanWord) {
    emit('wordClick', word.cleanWord, event)
  }
}

function handleWordKeydown(word: { cleanWord: string; isPunctuation: boolean }, event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!word.isPunctuation && word.cleanWord) {
      emit('wordClick', word.cleanWord, event as unknown as MouseEvent)
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
