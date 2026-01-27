<script setup lang="ts">
/**
 * @fileoverview Main application component for English Tenses learning app.
 */

import type { TenseData, CurrentExample, Position, Example } from '~/types';

/** All available tense IDs. */
const TENSE_IDS = [
  'simple-present',
  'simple-past',
  'simple-future',
  'present-continuous',
  'past-continuous',
  'future-continuous',
  'present-perfect',
  'past-perfect',
  'future-perfect',
  'present-perfect-continuous',
  'past-perfect-continuous',
  'future-perfect-continuous',
] as const;

/** Tense ID to name mapping. */
const TENSE_NAMES: Record<string, string> = {
  'simple-present': 'Simple Present',
  'simple-past': 'Simple Past',
  'simple-future': 'Simple Future',
  'present-continuous': 'Present Continuous',
  'past-continuous': 'Past Continuous',
  'future-continuous': 'Future Continuous',
  'present-perfect': 'Present Perfect',
  'past-perfect': 'Past Perfect',
  'future-perfect': 'Future Perfect',
  'present-perfect-continuous': 'Present Perfect Continuous',
  'past-perfect-continuous': 'Past Perfect Continuous',
  'future-perfect-continuous': 'Future Perfect Continuous',
};

/** Represents an example with its tense context. */
interface IndexedExample extends Example {
  tenseId: string;
  tenseName: string;
}

// State
const selectedTense = ref('');
const tenseData = ref<TenseData | null>(null);
const currentExample = ref<CurrentExample | null>(null);
const showFavorites = ref(false);
const tooltipWord = ref<string | null>(null);
const tooltipPosition = ref<Position>({ x: 0, y: 0 });
const previousFocusElement = ref<HTMLElement | null>(null);
const searchQuery = ref('');

// All examples from all tenses (for global search and random)
const allExamples = ref<IndexedExample[]>([]);
const allExamplesLoaded = ref(false);

// Current index for pagination within filtered results
const currentIndex = ref(0);

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

/** Loads all examples from all tense files. */
async function loadAllExamples(): Promise<void> {
  if (allExamplesLoaded.value) return;

  const examples: IndexedExample[] = [];

  for (const tenseId of TENSE_IDS) {
    try {
      const response = await fetch(`/data/${tenseId}.json`);
      const data: TenseData = await response.json();

      for (const example of data.examples) {
        examples.push({
          ...example,
          tenseId,
          tenseName: data.tense,
        });
      }
    } catch (e) {
      console.error(`Failed to load ${tenseId}:`, e);
    }
  }

  allExamples.value = examples;
  allExamplesLoaded.value = true;
}

// Load favorites and all examples on mount
onMounted(async () => {
  loadFromStorage();
  await loadAllExamples();
});

// Watch for tense changes
watch(selectedTense, async (tenseId) => {
  searchQuery.value = '';
  currentIndex.value = 0;

  if (!tenseId) {
    tenseData.value = null;
    currentExample.value = null;
    return;
  }

  showFavorites.value = false;

  try {
    const response = await fetch(`/data/${tenseId}.json`);
    tenseData.value = await response.json();
    showFirstExample();
  } catch (e) {
    console.error('Failed to load tense data:', e);
    tenseData.value = null;
    currentExample.value = null;
  }
});

// Watch for search query changes
watch(searchQuery, () => {
  currentIndex.value = 0;
  if (filteredExamples.value.length > 0) {
    showExampleAtIndex(0);
  } else {
    currentExample.value = null;
  }
});

/** Filtered examples based on search query and selected tense. */
const filteredExamples = computed((): IndexedExample[] => {
  const query = searchQuery.value.toLowerCase().trim();

  // If searching, use all examples
  if (query) {
    return allExamples.value.filter((example) =>
      example.sentence.toLowerCase().includes(query)
    );
  }

  // If a tense is selected, use only that tense's examples
  if (tenseData.value && selectedTense.value) {
    return tenseData.value.examples.map((example) => ({
      ...example,
      tenseId: selectedTense.value,
      tenseName: tenseData.value!.tense,
    }));
  }

  // Default: all examples
  return allExamples.value;
});

/** Total number of filtered examples. */
const totalExamples = computed(() => filteredExamples.value.length);

/** Shows example at specific index. */
function showExampleAtIndex(index: number): void {
  const examples = filteredExamples.value;
  if (!examples.length || index < 0 || index >= examples.length) {
    return;
  }

  const example = examples[index];
  if (!example) {
    return;
  }

  currentIndex.value = index;

  currentExample.value = {
    sentence: example.sentence,
    verb: example.verb,
    tenseId: example.tenseId,
    tenseName: example.tenseName,
  };
}

/** Shows the first example from filtered results. */
function showFirstExample(): void {
  showExampleAtIndex(0);
}

/** Shows a random example from filtered results. */
function showRandomExample(): void {
  const examples = filteredExamples.value;
  if (!examples.length) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * examples.length);
  showExampleAtIndex(randomIndex);
}

/** Navigates to the previous example. */
function showPreviousExample(): void {
  const examples = filteredExamples.value;
  if (!examples.length) return;

  const newIndex = currentIndex.value > 0 ? currentIndex.value - 1 : examples.length - 1;
  showExampleAtIndex(newIndex);
}

/** Navigates to the next example. */
function showNextExample(): void {
  const examples = filteredExamples.value;
  if (!examples.length) return;

  const newIndex = currentIndex.value < examples.length - 1 ? currentIndex.value + 1 : 0;
  showExampleAtIndex(newIndex);
}

/** Toggles the favorites view. */
function handleToggleFavorites(): void {
  showFavorites.value = !showFavorites.value;
  if (showFavorites.value) {
    selectedTense.value = '';
    tenseData.value = null;
    currentExample.value = null;
    searchQuery.value = '';
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

/** Whether examples are available for navigation. */
const hasExamples = computed(() => filteredExamples.value.length > 0);
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

          <div class="search-wrapper">
            <input
              v-model="searchQuery"
              type="search"
              class="search-input"
              placeholder="Search sentences..."
              aria-label="Search sentences across all tenses"
            />
          </div>

          <button
            class="btn"
            :disabled="!hasExamples"
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
          :tense-name="currentExample.tenseName"
          :is-favorite="isCurrentFavorite"
          :current-index="currentIndex"
          :total-count="totalExamples"
          :search-query="searchQuery"
          @prev="showPreviousExample"
          @next="showNextExample"
          @toggle-favorite="handleToggleCurrentFavorite"
          @word-click="handleWordClick"
        />

        <!-- No results message -->
        <div v-else-if="searchQuery && !showFavorites" class="card no-results">
          <p>No examples found matching "{{ searchQuery }}"</p>
        </div>

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
