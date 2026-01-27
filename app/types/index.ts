/**
 * @fileoverview Shared type definitions for the English Tenses app.
 * Following Google TypeScript Style Guide: prefer interfaces over type aliases.
 */

// ============================================================================
// Tense Types
// ============================================================================

/** Represents a single tense option in the selector. */
export interface Tense {
    readonly id: string;
    readonly name: string;
}

/** Represents the structure of a tense data JSON file. */
export interface TenseData {
    readonly tense: string;
    readonly description: string;
    readonly examples: readonly Example[];
}

// ============================================================================
// Example Types
// ============================================================================

/** Represents a single example sentence with its highlighted verb. */
export interface Example {
    readonly sentence: string;
    readonly verb: string;
}

/** Represents the current example being displayed with tense context. */
export interface CurrentExample extends Example {
    readonly tenseId: string;
    readonly tenseName: string;
}

// ============================================================================
// Favorites Types
// ============================================================================

/** Represents a saved favorite example. */
export interface FavoriteExample extends CurrentExample {
    readonly id: string;
    readonly addedAt: number;
}

// ============================================================================
// Dictionary Types
// ============================================================================

/** Represents a single meaning from the dictionary API. */
export interface DictionaryMeaning {
    readonly partOfSpeech: string;
    readonly definition: string;
    readonly example: string | null;
}

/** Represents the processed dictionary result for display. */
export interface DictionaryResult {
    readonly word: string;
    readonly phonetic: string | null;
    readonly meanings: readonly DictionaryMeaning[];
}

/** Raw phonetic entry from the dictionary API response. */
export interface DictionaryApiPhonetic {
    readonly text?: string;
    readonly audio?: string;
}

/** Raw definition entry from the dictionary API response. */
export interface DictionaryApiDefinition {
    readonly definition: string;
    readonly example?: string;
}

/** Raw meaning entry from the dictionary API response. */
export interface DictionaryApiMeaning {
    readonly partOfSpeech: string;
    readonly definitions: readonly DictionaryApiDefinition[];
}

/** Raw entry from the dictionary API response. */
export interface DictionaryApiEntry {
    readonly word: string;
    readonly phonetic?: string;
    readonly phonetics?: readonly DictionaryApiPhonetic[];
    readonly meanings: readonly DictionaryApiMeaning[];
}

// ============================================================================
// UI Types
// ============================================================================

/** Represents a position for tooltip placement. */
export interface Position {
    readonly x: number;
    readonly y: number;
}

/** Represents a parsed word for rendering in sentences. */
export interface ParsedWord {
    readonly id: number;
    readonly text: string;
    readonly start: number;
    readonly end: number;
    readonly cleanWord: string;
    readonly isPunctuation: boolean;
    readonly isVerb: boolean;
}
