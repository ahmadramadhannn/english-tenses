export interface FavoriteExample {
    id: string
    sentence: string
    verb: string
    tenseId: string
    tenseName: string
    addedAt: number
}

const STORAGE_KEY = 'english-tenses-favorites'

export function useFavorites() {
    const favorites = useState<FavoriteExample[]>('favorites', () => [])

    // Load favorites from localStorage on mount
    function loadFromStorage() {
        if (import.meta.client) {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                try {
                    favorites.value = JSON.parse(stored)
                } catch {
                    favorites.value = []
                }
            }
        }
    }

    // Save to localStorage
    function saveToStorage() {
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
        }
    }

    // Generate unique ID for a favorite
    function generateId(sentence: string, tenseId: string): string {
        return `${tenseId}-${sentence.slice(0, 20).replace(/\s/g, '_')}-${Date.now()}`
    }

    // Check if an example is a favorite
    function isFavorite(sentence: string, tenseId: string): boolean {
        return favorites.value.some(
            f => f.sentence === sentence && f.tenseId === tenseId
        )
    }

    // Add to favorites
    function addFavorite(example: {
        sentence: string
        verb: string
        tenseId: string
        tenseName: string
    }): void {
        if (isFavorite(example.sentence, example.tenseId)) {
            return
        }

        favorites.value.push({
            id: generateId(example.sentence, example.tenseId),
            sentence: example.sentence,
            verb: example.verb,
            tenseId: example.tenseId,
            tenseName: example.tenseName,
            addedAt: Date.now()
        })

        saveToStorage()
    }

    // Remove from favorites
    function removeFavorite(sentence: string, tenseId: string): void {
        favorites.value = favorites.value.filter(
            f => !(f.sentence === sentence && f.tenseId === tenseId)
        )
        saveToStorage()
    }

    // Remove by ID
    function removeFavoriteById(id: string): void {
        favorites.value = favorites.value.filter(f => f.id !== id)
        saveToStorage()
    }

    // Toggle favorite status
    function toggleFavorite(example: {
        sentence: string
        verb: string
        tenseId: string
        tenseName: string
    }): boolean {
        if (isFavorite(example.sentence, example.tenseId)) {
            removeFavorite(example.sentence, example.tenseId)
            return false
        } else {
            addFavorite(example)
            return true
        }
    }

    // Count
    const count = computed(() => favorites.value.length)

    return {
        favorites: readonly(favorites),
        count,
        loadFromStorage,
        isFavorite,
        addFavorite,
        removeFavorite,
        removeFavoriteById,
        toggleFavorite
    }
}
