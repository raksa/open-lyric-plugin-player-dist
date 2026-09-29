import { type StrumInstrumentId, type StrumSoundfont } from './instruments.js';
import { type StrumPattern } from './patterns.js';
import { type StrumSoundEngine } from './StrumSoundEngine.js';
import { type WebAudioFontPlayerConstructor, type WebAudioFontPlayerInstance, type WebAudioFontPreset } from './webaudiofont.js';
/**
 * Plays one strum pattern at a time, looping, on the audio clock: step 1
 * sounds {@link START_DELAY_SECONDS} after the press, each later step one
 * step-length after the one before (`getStrumStepSeconds`), and after the last
 * step the grid starts again. A short timer queues strokes up to
 * {@link SCHEDULE_AHEAD_SECONDS} ahead. Each stroke is played the way its
 * instrument is (`planStroke`) and sounded by the voice engine
 * (`StrumSoundEngine.ts`), where every string rings until it is struck again.
 *
 * A stop cancels the queued strokes that have not sounded yet, lets a stroke
 * under way finish, and then damps the strings still ringing, as a player's
 * palm does (the instrument's `release`).
 *
 * It also plays a chord card's roll (`planChordRoll`), alongside a pattern and
 * untouched by a stop. A new roll damps the one before it.
 */
export interface StrumPlaybackRequest {
    pattern: StrumPattern;
    tempo: number;
    timeSignature: string;
    /** MIDI notes the pattern strums, in string order (piano: low to high). */
    chord: readonly number[];
    instrument: StrumInstrumentId;
}
export interface StrumChordRequest {
    /** The chord's notes, in the order they are struck. */
    midi: readonly number[];
    instrument: StrumInstrumentId;
}
export type StrumPlayerState = 'idle' | 'loading' | 'playing';
/** Browser seams, swapped out by the unit tests. */
export interface StrumPlayerRuntime {
    createAudioContext(): AudioContext;
    loadPlayer(): Promise<WebAudioFontPlayerConstructor>;
    loadPreset(player: WebAudioFontPlayerInstance, context: BaseAudioContext, soundfont: StrumSoundfont): Promise<WebAudioFontPreset>;
    /** The voice engine that sounds the notes, on the player's context. */
    createEngine(context: AudioContext): StrumSoundEngine;
    /** Draws a player's human wander, `0 ≤ n < 1`. Default `Math.random`. */
    random?(): number;
}
export declare const browserStrumPlayerRuntime: StrumPlayerRuntime;
export declare const SCHEDULE_AHEAD_SECONDS = 0.1;
/** Head room between the press and the first stroke. */
export declare const START_DELAY_SECONDS = 0.05;
/** The engine groups a pattern's notes, and a chord card's, apart. */
export declare const PATTERN_GROUP = "pattern";
export declare const CHORD_GROUP = "chord";
export declare class StrumPlayer {
    #private;
    onStep: ((patternId: string, stepNumber: number) => void) | null;
    onStateChange: ((state: StrumPlayerState, patternId: string | null, error?: unknown) => void) | null;
    constructor(runtime?: StrumPlayerRuntime);
    get state(): StrumPlayerState;
    /** The pattern loading or playing, if any. */
    get patternId(): string | null;
    /**
     * Creates and resumes the audio context without playing anything. Browsers
     * only allow that from a user gesture, before its first `await` — so a
     * caller with its own async work to do before {@link play} calls this first.
     */
    unlock(): void;
    /**
     * Loads and decodes a soundfont ahead of a play. Creates the audio context,
     * so call it from a user gesture.
     */
    preload(soundfont: StrumSoundfont): Promise<void>;
    /**
     * Stops whatever plays and starts `request`. Call it straight from the
     * user's gesture: the audio context is created and resumed before the first
     * `await`, as browsers require. Failures are reported through
     * `onStateChange`, not thrown.
     */
    play(request: StrumPlaybackRequest): Promise<void>;
    /**
     * Plays a chord card's roll (`planChordRoll`). It sounds alongside a playing
     * pattern, and a stop leaves it ringing; the next roll damps it. Call it
     * from the user's gesture, like {@link play}.
     *
     * Of presses made while the soundfont loads, only the last one plays.
     * Resolves `true` once the notes are queued, `false` when a later press took
     * over; rejects when the player or soundfont fails to load.
     */
    playChord(request: StrumChordRequest): Promise<boolean>;
    /** Swaps in an edited pattern mid-run; its next step plays the edit. */
    updatePattern(pattern: StrumPattern): void;
    stop(): void;
}
