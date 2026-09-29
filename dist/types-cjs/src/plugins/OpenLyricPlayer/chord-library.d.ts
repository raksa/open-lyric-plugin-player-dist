import type { Chord, ChordSettings } from 'svguitar';
import { type ChordDatabase } from '../OpenLyric/domain/chord-voicings.js';
import type { StrumInstrumentId } from './instruments.js';
/**
 * A voicing for every chord Open Lyric offers, on each of the strum player's
 * instruments — what a chord card draws and plays, and what a pattern strums
 * for the song key. Five instruments voice chords; the others borrow one's
 * voicings ({@link getVoicingInstrument}).
 *
 * - **Guitar and ukulele:** the easiest of the positions
 *   `@tombatossals/chords-db` (MIT, the database the editor's chord popup
 *   draws from) has for the chord and the one {@link generateFrettedVoicing}
 *   computes — only those that really spell the chord ({@link spellsChord}),
 *   ranked by the popup's `scorePosition`.
 * - **Baritone ukulele:** computed by {@link generateFrettedVoicing} on its
 *   standard tuning.
 * - **Bass:** the chord's bass note low on the neck, with its fifth and
 *   octave above ({@link getBassVoicing}).
 * - **Piano:** the chord's notes stacked in close root position from octave 3,
 *   a slash chord's bass an octave below.
 *
 * The lowest note of a guitar or baritone voicing is always the chord's bass
 * (its root, or a slash chord's bass). A ukulele is re-entrant — its G string
 * is tuned above its C — so it has no bass, and any inversion will do.
 *
 * Chords are read by Tonal, the music theory the editor uses. A name it cannot
 * read (`Cmaj2`, `Am4`, …) has no voicing on any instrument.
 */
/** Open-string MIDI notes, string order (lowest-pitched course first, except
 * the re-entrant ukulele), in standard tuning. */
export declare const STANDARD_TUNINGS: {
    readonly guitar: readonly [40, 45, 50, 55, 59, 64];
    readonly ukulele: readonly [67, 60, 64, 69];
    readonly 'baritone-ukulele': readonly [50, 55, 59, 64];
    readonly bass: readonly [28, 33, 38, 43];
};
export type FrettedInstrumentId = keyof typeof STANDARD_TUNINGS;
/** The instruments whose voicings the others borrow. */
export type VoicingInstrumentId = FrettedInstrumentId | 'piano';
/**
 * The instrument whose voicings `instrument` plays: a classical or electric
 * guitar voices a chord as a guitar does, an electric piano or organ as a
 * piano, an upright bass as a bass.
 */
export declare function getVoicingInstrument(instrument: StrumInstrumentId): VoicingInstrumentId;
export interface ChordDatabases {
    guitar: ChordDatabase;
    ukulele: ChordDatabase;
}
export interface OpenLyricChordGroup {
    name: string;
    chords: string[];
}
/** What Open Lyric makes of a chord name. */
export interface ChordSpelling {
    name: string;
    rootChroma: number;
    /** The lowest note: a slash chord's bass, else the root. */
    bassChroma: number;
    /** Every pitch class of the chord, bass included. */
    chromas: number[];
    /** Pitch classes a voicing must sound — all but the perfect fifth and inner
     * extensions a player may leave out. */
    requiredChromas: number[];
    /** The chord's intervals above the root, in semitones, low to high. */
    semitones: number[];
}
export interface FrettedVoicing {
    /** One fret per string, string order; `-1` muted, relative to `baseFret`. */
    frets: number[];
    baseFret: number;
    /** MIDI notes in string order, muted strings left out. */
    midi: number[];
    /** Relative frets a finger lays across. */
    barres: number[];
    /** chords-db fingerings, one per string (0 = none); computed voicings have none. */
    fingers?: number[];
    source: 'chords-db' | 'computed';
}
export interface PianoVoicing {
    /** The keys played, low to high. */
    midi: number[];
    /** The first and last key of the board drawn. */
    lowest: number;
    highest: number;
}
export type ChordCard = {
    kind: 'diagram';
    chord: string;
    voicing: FrettedVoicing;
    chart: {
        chord: Chord;
        settings: Partial<ChordSettings>;
    };
} | {
    kind: 'piano';
    chord: string;
    piano: PianoVoicing;
} | {
    kind: 'none';
    chord: string;
    /** `not-a-chord`: Tonal cannot read the name. `no-voicing`: nothing
     * playable was found for this instrument. */
    reason: 'not-a-chord' | 'no-voicing';
};
/**
 * Open Lyric's chord list (`CHORD_KEY_GROUPS`, the chords its editor
 * suggests), with each `F# / Gb` pair split into its two spellings.
 */
export declare function getOpenLyricChordGroups(): OpenLyricChordGroup[];
/** `C#m7/G#` → its root, bass and pitch classes, or `null` if unreadable. */
export declare function spellChord(chord: string): ChordSpelling | null;
/**
 * A voicing spells a chord when it sounds nothing outside it, sounds every
 * required note and — unless `requireBass` is off — has the chord's bass as
 * its lowest note.
 */
export declare function spellsChord(midi: readonly number[], spelling: ChordSpelling, { requireBass }?: {
    requireBass?: boolean;
}): boolean;
/** MIDI notes of a position, string order, muted strings left out. */
export declare function getPositionMidi(tuning: readonly number[], frets: readonly number[], baseFret: number): number[];
/**
 * The easiest playable voicing of `spelling` on a fretted instrument, found by
 * trying every fingering in each four-fret window of the neck:
 *
 * - at least `minNotes` strings sound, each a chord note, next to each
 *   other so the chord can be strummed;
 * - the voicing spells the chord ({@link spellsChord}, with `requireBass`);
 * - no more than four fingers, a barre across the lowest fret counting as one.
 *
 * Ranked like chords-db positions ({@link scoreVoicing}); `null` when nothing
 * fits.
 */
export declare function generateFrettedVoicing(tuning: readonly number[], spelling: ChordSpelling, { requireBass, minNotes, }?: {
    requireBass?: boolean;
    minNotes?: number;
}): FrettedVoicing | null;
/** The easiest chords-db position that spells the chord, or `null`. */
export declare function findDatabaseVoicing(database: ChordDatabase, tuning: readonly number[], spelling: ChordSpelling, { requireBass }?: {
    requireBass?: boolean;
}): (FrettedVoicing & {
    score: number;
}) | null;
/**
 * A bass line for the chord: its bass note on the lowest string that reaches
 * it within the first four frets, then — for a chord with a perfect fifth and
 * no slash bass — the fifth two frets up on the next string, and the octave
 * two frets up on the string after that.
 */
export declare function getBassVoicing(spelling: ChordSpelling): FrettedVoicing;
/** The voicing a fretted instrument plays for `spelling`, or `null`. */
export declare function getFrettedVoicing(instrument: FrettedInstrumentId, spelling: ChordSpelling, databases: ChordDatabases): FrettedVoicing | null;
/** The chord in close root position from octave 3, slash bass below. */
export declare function getPianoVoicing(spelling: ChordSpelling): PianoVoicing;
/** SVGuitar data and settings for a fretted voicing. */
export declare function getChordChart(instrument: FrettedInstrumentId, chord: string, voicing: FrettedVoicing): {
    chord: Chord;
    settings: Partial<ChordSettings>;
};
/** What a chord card shows, and plays, for `chord` on `instrument`. */
export declare function resolveChordCard(instrument: StrumInstrumentId, chord: string, databases: ChordDatabases): ChordCard;
/** The notes a card plays, in the order they are struck; empty for none. */
export declare function getChordCardMidi(card: ChordCard): number[];
/** Loads the chords-db guitar and ukulele tables once, on demand. */
export declare function loadChordDatabases(): Promise<ChordDatabases>;
