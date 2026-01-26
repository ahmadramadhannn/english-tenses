interface DictionaryEntry {
    word: string
    phonetic?: string
    phonetics?: Array<{ text?: string; audio?: string }>
    meanings: Array<{
        partOfSpeech: string
        definitions: Array<{
            definition: string
            example?: string
        }>
    }>
}

interface DictionaryResult {
    word: string
    phonetic: string | null
    meanings: Array<{
        partOfSpeech: string
        definition: string
        example: string | null
    }>
}

const cache = new Map<string, DictionaryResult>()

export function useDictionary() {
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const result = ref<DictionaryResult | null>(null)

    async function lookup(word: string): Promise<DictionaryResult | null> {
        const cleanWord = word.toLowerCase().replace(/[^a-z']/g, '')

        if (!cleanWord) {
            error.value = 'Invalid word'
            return null
        }

        // Check cache first
        if (cache.has(cleanWord)) {
            result.value = cache.get(cleanWord)!
            return result.value
        }

        isLoading.value = true
        error.value = null

        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`
            )

            if (!response.ok) {
                error.value = 'Definition not found'
                result.value = null
                return null
            }

            const data: DictionaryEntry[] = await response.json()
            const entry = data[0]

            // Extract phonetic
            let phonetic: string | null = null
            if (entry.phonetic) {
                phonetic = entry.phonetic
            } else if (entry.phonetics?.length) {
                const phoneticEntry = entry.phonetics.find(p => p.text)
                if (phoneticEntry?.text) {
                    phonetic = phoneticEntry.text
                }
            }

            // Extract meanings (limit to 3)
            const meanings = entry.meanings.slice(0, 3).map(m => ({
                partOfSpeech: m.partOfSpeech,
                definition: m.definitions[0]?.definition || '',
                example: m.definitions[0]?.example || null
            }))

            const dictionaryResult: DictionaryResult = {
                word: cleanWord,
                phonetic,
                meanings
            }

            // Cache the result
            cache.set(cleanWord, dictionaryResult)
            result.value = dictionaryResult

            return dictionaryResult
        } catch (e) {
            error.value = 'Failed to load definition'
            result.value = null
            return null
        } finally {
            isLoading.value = false
        }
    }

    function clear() {
        result.value = null
        error.value = null
    }

    return {
        isLoading: readonly(isLoading),
        error: readonly(error),
        result: readonly(result),
        lookup,
        clear
    }
}
