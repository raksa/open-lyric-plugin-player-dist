import type { StrumSound } from './instrument-sounds.js';
import type { StrumDirection, StrumStep } from './patterns.js';
/**
 * How one step of a pattern becomes the notes a player sounds, and how a
 * chord card rolls its chord — the performance, before any sound is made
 * (`StrumSoundEngine.ts` plays it). Each instrument plays its own way
 * (`technique` in `instrument-sounds.ts`):
 *
 * - **Strum** (guitar, ukuleles). A down stroke crosses the strings in string
 *   order, lowest string first; an up stroke comes back from the highest and
 *   catches only the top `upShare` of them. A light down stroke — on an `e` or
 *   `a` sixteenth — skips a guitar's lowest string. Each string sounds
 *   `noteGap` after the one before: a little slower on a soft stroke, quicker
 *   on an up stroke. The strings the pick meets last sound a little softer.
 * - **Keys** (piano). A down stroke strikes the whole voicing, an up stroke
 *   the voicing without its lowest note — the right hand alone — a little
 *   softer. The notes land within a few milliseconds of each other.
 * - **Pluck** (bass). A down stroke plucks the voicing's lowest note, its
 *   root; an up stroke its highest, the octave. A bass sounds one note at a
 *   time.
 *
 * A stroke's force is its step's velocity (`getStepVelocity`). A player is
 * human: each stroke lands up to `humanize.timing` off the grid, and each note
 * wanders up to `humanize.velocity` in force and `humanize.detune` in tuning.
 * `random` draws those; one that always returns `0.5` plays exactly.
 */
export interface PlannedNote {
    pitch: number;
    /** Seconds after the stroke lands — after the roll starts, for a roll. */
    offset: number;
    /** Loudness, 0–1. */
    velocity: number;
    /**
     * The string (a piano's key) that sounds it — its index in the voicing. A
     * new note on a string damps the one ringing there; a bass has one.
     */
    slot: number;
    /** Cents off pitch. */
    detune: number;
    /** Stereo position, −1 (left) to 1 (right). */
    pan: number;
}
export interface StrokePlan {
    direction: StrumDirection;
    /** Seconds the stroke lands after its step; negative when early. */
    shift: number;
    /** The notes in the order the stroke meets them. */
    notes: PlannedNote[];
}
/** How loud a chord card's roll is. */
export declare const CHORD_ROLL_VELOCITY = 0.7;
/**
 * The voicing's notes a stroke sounds, as indexes into it, in the order the
 * stroke meets them.
 */
export declare function getStrokeStrings(count: number, direction: StrumDirection, velocity: number, sound: StrumSound, random: () => number): number[];
/** The notes of step `step`'s stroke, or `null` for a rest or no chord. */
export declare function planStroke(chord: readonly number[], step: StrumStep | null | undefined, sound: StrumSound, random?: () => number): StrokePlan | null;
/**
 * A chord card's play: the notes one after another in the order given — from
 * the first string listed — `rollGap` apart, each on its own string.
 */
export declare function planChordRoll(midi: readonly number[], sound: StrumSound, random?: () => number): PlannedNote[];
/** Seconds from a roll's first note to its last, before any wandering. */
export declare function getChordRollSeconds(sound: StrumSound, noteCount: number): number;
