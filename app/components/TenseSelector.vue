<script setup lang="ts">
/**
 * @fileoverview Tense selector dropdown component.
 */

import type { Tense } from '~/types';

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

/** Available tenses for selection. */
const tenses: readonly Tense[] = [
  { id: 'simple-present', name: 'Simple Present' },
  { id: 'simple-past', name: 'Simple Past' },
  { id: 'simple-future', name: 'Simple Future' },
  { id: 'present-continuous', name: 'Present Continuous' },
  { id: 'past-continuous', name: 'Past Continuous' },
  { id: 'future-continuous', name: 'Future Continuous' },
  { id: 'present-perfect', name: 'Present Perfect' },
  { id: 'past-perfect', name: 'Past Perfect' },
  { id: 'future-perfect', name: 'Future Perfect' },
  { id: 'present-perfect-continuous', name: 'Present Perfect Continuous' },
  { id: 'past-perfect-continuous', name: 'Past Perfect Continuous' },
  { id: 'future-perfect-continuous', name: 'Future Perfect Continuous' },
];

function handleChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="tense-selector">
    <label for="tense-select" class="sr-only">Select a tense</label>
    <select
      id="tense-select"
      :value="modelValue"
      aria-label="Select an English tense to practice"
      @change="handleChange"
    >
      <option value="">Select a tense...</option>
      <option v-for="tense in tenses" :key="tense.id" :value="tense.id">
        {{ tense.name }}
      </option>
    </select>
  </div>
</template>
