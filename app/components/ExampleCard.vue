<script setup lang="ts">
interface Example {
  sentence: string
  verb: string
}

const props = defineProps<{
  example: Example
  tenseName: string
  isFavorite: boolean
}>()

const emit = defineEmits<{
  next: []
  toggleFavorite: []
  wordClick: [word: string, event: MouseEvent]
}>()

// Parse sentence into words, preserving punctuation
const words = computed(() => {
  const matches = props.example.sentence.match(/[\w']+|[^\w\s]/g) || []
  return matches.map((word, index) => {
    const cleanWord = word.replace(/[^\w']/g, '')
    const isPunctuation = /^[^\w]+$/.test(word)
    const isVerb = cleanWord.toLowerCase() === props.example.verb.toLowerCase()
    
    return {
      id: index,
      text: word,
      cleanWord,
      isPunctuation,
      isVerb
    }
  })
})

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
        >{{ word.text }}</span>
        {{ ' ' }}
      </template>
    </p>

    <div class="example-actions">
      <button
        class="btn btn-small"
        :aria-pressed="isFavorite"
        @click="emit('toggleFavorite')"
      >
        {{ isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites' }}
      </button>
      <button
        class="btn btn-small btn-primary"
        @click="emit('next')"
      >
        Next →
      </button>
    </div>
  </article>
</template>
