/**
 * Strum patterns in Open Lyric notation — the `Strumming Patterns` Config
 * field (`d--u-- | d-u---`), parsed by the notation's own parser
 * (`preview/helpers.ts`). One character is one sixteenth-note step; the
 * notation carries direction only, so each
 * stroke's loudness comes from where it falls in the bar
 * ({@link getStepVelocity}).
 */
export type StrumDirection = 'down' | 'up';
export interface StrumStep {
    direction: StrumDirection;
    /** Loudness, 0–1. */
    velocity: number;
}
/** What a page keeps and persists: the notation text is the source of truth. */
export interface StrumPatternDefinition {
    id: string;
    label: string;
    source: string;
}
export interface StrumPattern extends StrumPatternDefinition {
    /** Step `i` is the `i`-th character of the grid; `null` = rest. */
    steps: (StrumStep | null)[];
    /** The count printed under each step. */
    counts: string[];
    /** 0-based steps a `|` or space separator precedes. */
    groupBreaks: number[];
}
/** Loudness by position: bar downbeat, other beats, off-beats, the rest. */
export declare const STEP_VELOCITIES: {
    readonly downbeat: 0.9;
    readonly beat: 0.75;
    readonly offbeat: 0.65;
    readonly subdivision: 0.55;
};
export declare class StrumPatternError extends Error {
}
export declare function getTimeSignatureParts(timeSignature: string): {
    beats: number;
    unit: number;
};
/**
 * Seconds from one step to the next. The tempo counts the time signature's
 * unit, and a step is always a sixteenth note: `unit / 16` of a beat.
 */
export declare function getStrumStepSeconds(tempo: number, timeSignature: string): number;
/**
 * The count under step `index`, as the notation's preview prints it
 * (`getStrummingStepLabel` in `preview/helpers.ts`): `1 e & a` per beat, or
 * `1 &` per eighth in the eighth-counted times.
 */
export declare function getOpenLyricStepCount(index: number, timeSignature: string): string;
/**
 * How loud a stroke on step `index` is. Sixteenth grid: the bar's first beat
 * is loudest, then the other beats, the `&`s, and the `e`/`a` sixteenths.
 * Eighth-counted times (steps counted `1 & 2 & …`, one number per eighth)
 * accent each dotted quarter — every third eighth, so every sixth step — then
 * the other eighths, and the `&` sixteenths between them the softest.
 */
export declare function getStepVelocity(index: number, timeSignature: string): number;
/** One Open Lyric pattern line, e.g. `d--u-- | d-u---`. */
export declare function parseOpenLyricPattern(definition: StrumPatternDefinition, timeSignature: string): StrumPattern;
/**
 * Patterns typed or pasted in: the body of a `Strumming Patterns` field,
 * `// label` lines included, its `- Strumming Patterns:` header optional.
 */
export declare function readStrumPatternInput(text: string, createId: () => string, nextLabel: () => string): StrumPatternDefinition[];
/** The definition with step `index` cycled rest → down → up → rest. */
export declare function cycleStrumPatternStep(definition: StrumPatternDefinition, index: number, timeSignature: string): StrumPatternDefinition;
