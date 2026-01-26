<script setup lang="ts">
const props = defineProps<{
  word: string
  isLoading: boolean
  error: string | null
  result: {
    word: string
    phonetic: string | null
    meanings: Array<{
      partOfSpeech: string
      definition: string
      example: string | null
    }>
  } | null
  position: { x: number; y: number }
}>()

const emit = defineEmits<{
  close: []
}>()

const tooltipRef = ref<HTMLElement | null>(null)

// Calculate position to keep tooltip in viewport
const tooltipStyle = computed(() => {
  let left = props.position.x
  let top = props.position.y + 8

  // Adjust when on client side
  if (import.meta.client && tooltipRef.value) {
    const rect = tooltipRef.value.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Adjust horizontal position
    if (left + rect.width > viewportWidth - 16) {
      left = viewportWidth - rect.width - 16
    }
    if (left < 16) {
      left = 16
    }

    // Adjust vertical position (show above if no room below)
    if (top + rect.height > viewportHeight - 16) {
      top = props.position.y - rect.height - 8
    }
  }

  return {
    left: `${left}px`,
    top: `${top}px`
  }
})

// Close on Escape key
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Focus trap - return focus when closed
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  tooltipRef.value?.focus()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    ref="tooltipRef"
    class="tooltip"
    :style="tooltipStyle"
    role="tooltip"
    aria-live="polite"
    tabindex="-1"
  >
    <div class="tooltip-header">
      <span class="tooltip-word">{{ word }}</span>
      <span v-if="result?.phonetic" class="tooltip-phonetic">
        {{ result.phonetic }}
      </span>
    </div>

    <div class="tooltip-content">
      <div v-if="isLoading" class="tooltip-loading" aria-busy="true">
        Loading...
      </div>

      <div v-else-if="error" class="tooltip-error" role="alert">
        {{ error }}
      </div>

      <template v-else-if="result">
        <div
          v-for="(meaning, index) in result.meanings"
          :key="index"
          class="tooltip-meaning"
        >
          <div class="tooltip-pos">{{ meaning.partOfSpeech }}</div>
          <div class="tooltip-definition">{{ meaning.definition }}</div>
          <div v-if="meaning.example" class="tooltip-example">
            "{{ meaning.example }}"
          </div>
        </div>
      </template>
    </div>

    <button
      class="tooltip-close sr-only"
      @click="emit('close')"
      aria-label="Close definition"
    >
      Close
    </button>
  </div>
</template>

<style scoped>
.tooltip-close {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}

.tooltip-close:focus {
  position: static;
  clip: auto;
  width: auto;
  height: auto;
}
</style>
