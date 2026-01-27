/**
 * @fileoverview Composable for dictionary API lookups with caching.
 */

import type {
    DictionaryResult,
    DictionaryMeaning,
    DictionaryApiEntry,
} from '~/types';

/** Cache for dictionary lookups to avoid redundant API calls. */
const cache = new Map<string, DictionaryResult>();

/**
 * Composable for looking up word definitions from the dictionary API.
 * Includes caching to prevent redundant API calls.
 */
export function useDictionary() {
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const result = ref<DictionaryResult | null>(null);

    /**
     * Cleans a word for API lookup by removing non-alphabetic characters.
     */
    function cleanWord(word: string): string {
        return word.toLowerCase().replace(/[^a-z']/g, '');
    }

    /**
     * Extracts phonetic pronunciation from API response.
     */
    function extractPhonetic(entry: DictionaryApiEntry): string | null {
        if (entry.phonetic) {
            return entry.phonetic;
        }
        if (entry.phonetics?.length) {
            const phoneticEntry = entry.phonetics.find((p) => p.text);
            if (phoneticEntry?.text) {
                return phoneticEntry.text;
            }
        }
        return null;
    }

    /**
     * Extracts meanings from API response, limited to first 3.
     */
    function extractMeanings(entry: DictionaryApiEntry): DictionaryMeaning[] {
        return entry.meanings.slice(0, 3).map((m) => ({
            partOfSpeech: m.partOfSpeech,
            definition: m.definitions[0]?.definition ?? '',
            example: m.definitions[0]?.example ?? null,
        }));
    }

    /**
     * Looks up a word in the dictionary API.
     * Returns cached result if available.
     */
    async function lookup(word: string): Promise<DictionaryResult | null> {
        const cleanedWord = cleanWord(word);

        if (!cleanedWord) {
            error.value = 'Invalid word';
            return null;
        }

        // Check cache first
        if (cache.has(cleanedWord)) {
            result.value = cache.get(cleanedWord)!;
            return result.value;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanedWord}`
            );

            if (!response.ok) {
                error.value = 'Definition not found';
                result.value = null;
                return null;
            }

            const data: DictionaryApiEntry[] = await response.json();
            const entry = data[0];

            const dictionaryResult: DictionaryResult = {
                word: cleanedWord,
                phonetic: extractPhonetic(entry),
                meanings: extractMeanings(entry),
            };

            // Cache the result
            cache.set(cleanedWord, dictionaryResult);
            result.value = dictionaryResult;

            return dictionaryResult;
        } catch {
            error.value = 'Failed to load definition';
            result.value = null;
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Clears the current result and error state.
     */
    function clear(): void {
        result.value = null;
        error.value = null;
    }

    return {
        isLoading: readonly(isLoading),
        error: readonly(error),
        result: readonly(result),
        lookup,
        clear,
    };
}
