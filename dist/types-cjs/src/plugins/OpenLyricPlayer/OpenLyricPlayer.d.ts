import { type ChordCard, type ChordDatabases } from './chord-library.js';
import { type StrumInstrument, type StrumInstrumentId, type StrumVoicing } from './instruments.js';
import { type StrumPattern, type StrumPatternDefinition } from './patterns.js';
import { type StrumPlayerRuntime, type StrumPlayerState } from './StrumPlayer.js';
/**
 * `OpenLyricPlayer` — the headless player: an Open Lyric song's strumming
 * patterns, and any chord Open Lyric can read, played on ten instruments —
 * acoustic, classical and electric guitar, piano, electric piano, organ,
 * ukulele, baritone ukulele, bass and upright bass. No DOM of its own;
 * `OpenLyricPlayerPlayground` is the UI built on it.
 *
 * It owns one {@link StrumPlayer} (one audio context, one soundfont cache) and
 * the chords-db tables the fretted voicings come from, loaded once on first
 * use. Every `play*` method must be called from a user gesture: the audio
 * context is unlocked before anything is awaited, as browsers require.
 */
export type OpenLyricPlayerState = StrumPlayerState;
export interface OpenLyricPlayerOptions {
    /** Browser seams (audio context, player + soundfont loaders); for tests. */
    runtime?: StrumPlayerRuntime;
}
export interface OpenLyricPlayerStateEvent {
    state: OpenLyricPlayerState;
    /** The pattern loading or playing; `null` when idle. */
    patternId: string | null;
    /** Set when a play failed (the player script or soundfont did not load). */
    error?: unknown;
}
export interface OpenLyricPlayerStepEvent {
    patternId: string;
    /** 1-based step of the pattern now sounding. */
    stepNumber: number;
}
export interface OpenLyricPlayerEventMap {
    state: OpenLyricPlayerStateEvent;
    step: OpenLyricPlayerStepEvent;
}
export interface OpenLyricPatternRequest {
    /**
     * The pattern: Open Lyric notation (`'d--u-- | d-u-d-'`), a
     * `{ id, label, source }` definition, or an already parsed pattern.
     */
    pattern: string | StrumPatternDefinition | StrumPattern;
    /** The song's key (`Config` → `Key`); a pattern strums its tonic chord. */
    key: string;
    /** Beats per minute, counting the time signature's unit. */
    tempo: number;
    /** Time signature (`Config` → `Time`). Default `4/4`. */
    time?: string;
    /** Default `guitar`. */
    instrument?: StrumInstrumentId;
}
export declare class OpenLyricPlayer {
    #private;
    /** Every instrument, in display order. */
    static readonly instruments: readonly StrumInstrument[];
    constructor(options?: OpenLyricPlayerOptions);
    get state(): OpenLyricPlayerState;
    /** The pattern loading or playing, if any. */
    get patternId(): string | null;
    /** Whether the chord tables have loaded — until then voicings are `null`. */
    get chordsLoaded(): boolean;
    /** Subscribes to `state` or `step`; returns the unsubscribe. */
    on<K extends keyof OpenLyricPlayerEventMap>(type: K, listener: (event: OpenLyricPlayerEventMap[K]) => void): () => void;
    /** Loads the chords-db tables once; every later call shares the load. */
    loadChords(): Promise<ChordDatabases>;
    /**
     * The chord a pattern strums in `key` on `instrument` — the key's tonic
     * chord in that instrument's voicing. `null` when the key is unreadable,
     * the instrument has no voicing for it, or the chords have not loaded
     * ({@link loadChords}).
     */
    getVoicing(instrument: StrumInstrumentId, key: string): StrumVoicing | null;
    /**
     * What `chord` looks like, and plays, on `instrument`: a chord diagram, piano
     * keys, or `none` with the reason. `null` until the chords have loaded.
     */
    resolveChord(instrument: StrumInstrumentId, chord: string): ChordCard | null;
    /** Parses a pattern in Open Lyric notation against a time signature. */
    parsePattern(pattern: string | StrumPatternDefinition, time?: string): StrumPattern;
    /**
     * Loads and decodes an instrument's soundfont ahead of a play. Creates the
     * audio context, so call it from a user gesture.
     */
    preload(instrument?: StrumInstrumentId): Promise<void>;
    /**
     * Stops whatever plays and loops `request.pattern` until {@link stop}.
     * Rejects when the pattern does not parse or there is nothing to strum (an
     * unreadable key, no voicing); a soundfont that fails to load is reported
     * through the `state` event instead, as `idle` with an `error`.
     */
    playPattern(request: OpenLyricPatternRequest): Promise<void>;
    /**
     * Rolls `chord` once on `instrument`, alongside any playing pattern. Of
     * presses made while the soundfont loads only the last one plays: resolves
     * `true` once queued, `false` when a later press took over. Rejects when the
     * chord has nothing to play or the soundfont fails to load.
     */
    playChord(chord: string, instrument?: StrumInstrumentId): Promise<boolean>;
    /** Swaps in an edited pattern mid-run; its next step plays the edit. */
    updatePattern(pattern: StrumPattern): void;
    /**
     * Stops the pattern: a stroke under way finishes, then its ringing strings
     * are damped as a player's palm would. A chord roll rings on.
     */
    stop(): void;
    /** Drops every listener, then stops — silently. */
    destroy(): void;
}
