/**
 * @fileoverview Composable for managing favorite examples with localStorage persistence.
 */

import type { FavoriteExample, CurrentExample } from '~/types';

/** LocalStorage key for favorites data. */
const STORAGE_KEY = 'english-tenses-favorites';

/**
 * Composable for managing favorite examples.
 * Persists favorites to localStorage for cross-session access.
 */
export function useFavorites() {
    const favorites = useState<FavoriteExample[]>('favorites', () => []);

    /**
     * Loads favorites from localStorage.
     * Should be called on component mount.
     */
    function loadFromStorage(): void {
        if (import.meta.client) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    favorites.value = JSON.parse(stored);
                } catch {
                    favorites.value = [];
                }
            }
        }
    }

    /**
     * Saves current favorites to localStorage.
     */
    function saveToStorage(): void {
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value));
        }
    }

    /**
     * Generates a unique ID for a favorite entry.
     */
    function generateId(sentence: string, tenseId: string): string {
        return `${tenseId}-${sentence.slice(0, 20).replace(/\s/g, '_')}-${Date.now()}`;
    }

    /**
     * Checks if a specific example is already in favorites.
     */
    function isFavorite(sentence: string, tenseId: string): boolean {
        return favorites.value.some(
            (f) => f.sentence === sentence && f.tenseId === tenseId
        );
    }

    /**
     * Adds an example to favorites if not already present.
     */
    function addFavorite(example: CurrentExample): void {
        if (isFavorite(example.sentence, example.tenseId)) {
            return;
        }

        const favorite: FavoriteExample = {
            id: generateId(example.sentence, example.tenseId),
            sentence: example.sentence,
            verb: example.verb,
            tenseId: example.tenseId,
            tenseName: example.tenseName,
            addedAt: Date.now(),
        };

        favorites.value.push(favorite);
        saveToStorage();
    }

    /**
     * Removes an example from favorites by sentence and tense.
     */
    function removeFavorite(sentence: string, tenseId: string): void {
        favorites.value = favorites.value.filter(
            (f) => !(f.sentence === sentence && f.tenseId === tenseId)
        );
        saveToStorage();
    }

    /**
     * Removes a favorite by its unique ID.
     */
    function removeFavoriteById(id: string): void {
        favorites.value = favorites.value.filter((f) => f.id !== id);
        saveToStorage();
    }

    /**
     * Toggles the favorite status of an example.
     * Returns true if added, false if removed.
     */
    function toggleFavorite(example: CurrentExample): boolean {
        if (isFavorite(example.sentence, example.tenseId)) {
            removeFavorite(example.sentence, example.tenseId);
            return false;
        }
        addFavorite(example);
        return true;
    }

    /** The total count of favorites. */
    const count = computed(() => favorites.value.length);

    return {
        favorites: readonly(favorites),
        count,
        loadFromStorage,
        isFavorite,
        addFavorite,
        removeFavorite,
        removeFavoriteById,
        toggleFavorite,
    };
}
