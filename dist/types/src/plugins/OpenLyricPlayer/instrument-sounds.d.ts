import type { StrumInstrumentId } from './instruments.js';
/**
 * How each of the strum player's instruments is played, and how it sounds —
 * the performance and tone the voice engine (`StrumSoundEngine.ts`) gives the
 * soundfont samples, so a pattern sounds like a player on a real instrument
 * rather than a sampler repeating itself:
 *
 * - **Technique.** The guitars and both ukuleles strum across their strings
 *   in string order, so the re-entrant ukulele's high G sounds first on a
 *   down stroke. A piano, electric piano or organ strikes the voicing as one
 *   chord, the right hand alone on an up stroke. A bass plucks one note a
 *   stroke.
 * - **Touch.** How fast a stroke crosses the strings, which strings an up
 *   stroke catches, how much a stroke's force changes the sound
 *   (`dynamics` — an organ's keys barely do), and how far a player's timing,
 *   force and tuning wander from stroke to stroke (`humanize`).
 * - **Tone.** A soft stroke sounds darker than a hard one (`tone`), as on the
 *   real instrument. The `body` filter takes a small instrument's low end away
 *   — a ukulele sounds from nylon-guitar samples — and a bass's `drive` adds
 *   the harmonics an amplifier gives it, which carry its line on small
 *   speakers that cannot play its low fundamentals. The room is a short, warm
 *   reverb.
 * - **Ring.** A string (a key) rings until it is struck again, damped, or
 *   dies away. `sustain` shortens a small body's ring; `tail` fades a sample
 *   once it runs into its loop (an organ holds its note); `damping` is how
 *   fast a re-struck string lets go of its old note; `release` is a stop, the
 *   player's palm (the piano's dampers) settling on the strings.
 *
 * Every time here is in seconds; a time constant is the time a sound takes to
 * fall to about a third (−8.7 dB).
 */
export type StrumTechnique = 'strum' | 'keys' | 'pluck';
export interface StrumSound {
    technique: StrumTechnique;
    /**
     * Seconds between neighbouring notes of a stroke at full force: a strum's
     * crossing of the strings, or how loosely a keyboard's chord lands.
     */
    noteGap: number;
    /** Share of the sounding strings an up stroke catches, from the highest. */
    upShare: number;
    /** Seconds between the notes of a chord card's roll. */
    rollGap: number;
    /** Low-pass cutoff (Hz), at middle C, of the softest and the hardest stroke. */
    tone: {
        soft: number;
        hard: number;
    };
    /** How much a stroke's force changes its loudness: 1 fully, 0 not at all. */
    dynamics: number;
    /** Time constant of the body's decay on top of the sample's own; 0: none. */
    sustain: number;
    /** Time constant of the fade once a sample runs into its sustain loop. */
    tail: number;
    /** Longest a note rings. */
    maxRing: number;
    /** Time constant a re-struck string or key lets go of its old note with. */
    damping: number;
    /** Time constant of a stop: the palm or the dampers on the strings. */
    release: number;
    /** Pan of the outermost strings or keys, each side of centre (0–1). */
    width: number;
    /**
     * The body: a high-pass (Hz), an optional presence peak (Hz, dB), and an
     * optional `drive` — the share of amp-like harmonics mixed in (0–1).
     */
    body: {
        highpass: number;
        presence?: {
            frequency: number;
            gain: number;
        };
        drive?: number;
    };
    /** Share of the sound sent to the room reverb (0–1). */
    room: number;
    /**
     * Output gain, balancing the instruments against each other: measured so a
     * pattern on each plays at about the same loudness (−13 LUFS).
     */
    level: number;
    /**
     * How far a player wanders, at most, each way: a stroke's timing
     * (seconds), a note's force (a share of it) and tuning (cents).
     */
    humanize: {
        timing: number;
        velocity: number;
        detune: number;
    };
}
export declare const STRUM_SOUNDS: Readonly<Record<StrumInstrumentId, StrumSound>>;
export declare function getStrumSound(instrument: StrumInstrumentId): StrumSound;
