<script setup lang="ts">
/**
 * @fileoverview Main application component for English Tenses learning app.
 */

import type { TenseData, CurrentExample, Position } from '~/types';

// State
const selectedTense = ref('');
const tenseData = ref<TenseData | null>(null);
const currentExample = ref<CurrentExample | null>(null);
const showFavorites = ref(false);
const tooltipWord = ref<string | null>(null);
const tooltipPosition = ref<Position>({ x: 0, y: 0 });
const previousFocusElement = ref<HTMLElement | null>(null);

// Composables
const {
  favorites,
  count: favoritesCount,
  loadFromStorage,
  isFavorite,
  toggleFavorite,
  removeFavoriteById,
} = useFavorites();

const {
  isLoading: tooltipLoading,
  error: tooltipError,
  result: tooltipResult,
  lookup,
  clear: clearTooltip,
} = useDictionary();

// Load favorites on mount
onMounted(() => {
  loadFromStorage();
});

// Watch for tense changes
watch(selectedTense, async (tenseId) => {
  if (!tenseId) {
    tenseData.value = null;
    currentExample.value = null;
    return;
  }

  showFavorites.value = false;

  try {
    const response = await fetch(`/data/${tenseId}.json`);
    tenseData.value = await response.json();
    showRandomExample();
  } catch (e) {
    console.error('Failed to load tense data:', e);
    tenseData.value = null;
    currentExample.value = null;
  }
});

/** Shows a random example from the current tense data. */
function showRandomExample(): void {
  if (!tenseData.value?.examples.length) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * tenseData.value.examples.length);
  const example = tenseData.value.examples[randomIndex];

  currentExample.value = {
    sentence: example.sentence,
    verb: example.verb,
    tenseId: selectedTense.value,
    tenseName: tenseData.value.tense,
  };
}

/** Toggles the favorites view. */
function handleToggleFavorites(): void {
  showFavorites.value = !showFavorites.value;
  if (showFavorites.value) {
    selectedTense.value = '';
    tenseData.value = null;
    currentExample.value = null;
  }
}

/** Handles word click to show dictionary tooltip. */
function handleWordClick(word: string, event: MouseEvent): void {
  previousFocusElement.value = event.target as HTMLElement;

  const rect = (event.target as HTMLElement).getBoundingClientRect();
  tooltipPosition.value = {
    x: rect.left,
    y: rect.bottom,
  };
  tooltipWord.value = word;
  lookup(word);
}

/** Closes the tooltip and returns focus. */
function closeTooltip(): void {
  tooltipWord.value = null;
  clearTooltip();

  if (previousFocusElement.value) {
    previousFocusElement.value.focus();
    previousFocusElement.value = null;
  }
}

/** Toggles favorite status for the current example. */
function handleToggleCurrentFavorite(): void {
  if (!currentExample.value) {
    return;
  }
  toggleFavorite(currentExample.value);
}

/** Handles clicks outside the tooltip to close it. */
function handleClickOutside(event: MouseEvent): void {
  if (tooltipWord.value) {
    const target = event.target as HTMLElement;
    if (!target.closest('.tooltip') && !target.classList.contains('word')) {
      closeTooltip();
    }
  }
}

/** Whether the current example is in favorites. */
const isCurrentFavorite = computed(() => {
  if (!currentExample.value) {
    return false;
  }
  return isFavorite(currentExample.value.sentence, currentExample.value.tenseId);
});
</script>

<template>
  <div @click="handleClickOutside">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <div class="container">
      <header>
        <h1>English Tenses</h1>
        <p class="subtitle">Learn through examples</p>
      </header>

      <main id="main-content">
        <section class="controls" aria-label="Controls">
          <TenseSelector v-model="selectedTense" />

          <button
            class="btn"
            @click="showRandomExample"
          >
            Random Example
          </button>

          <button
            class="btn"
            :aria-pressed="showFavorites"
            @click="handleToggleFavorites"
          >
            <span aria-hidden="true">{{ showFavorites ? '★' : '☆' }}</span>
            Favorites (<span aria-live="polite">{{ favoritesCount }}</span>)
          </button>
        </section>

        <!-- Example Card -->
        <ExampleCard
          v-if="currentExample && !showFavorites"
          :example="currentExample"
          :tense-name="tenseData?.tense ?? ''"
          :is-favorite="isCurrentFavorite"
          @next="showRandomExample"
          @toggle-favorite="handleToggleCurrentFavorite"
          @word-click="handleWordClick"
        />

        <!-- Favorites List -->
        <FavoritesList
          v-if="showFavorites"
          :favorites="favorites"
          @remove="removeFavoriteById"
          @word-click="handleWordClick"
        />

        <!-- Tooltip -->
        <WordTooltip
          v-if="tooltipWord"
          :word="tooltipWord"
          :is-loading="tooltipLoading"
          :error="tooltipError"
          :result="tooltipResult"
          :position="tooltipPosition"
          @close="closeTooltip"
        />
      </main>
    </div>
  </div>
</template>
