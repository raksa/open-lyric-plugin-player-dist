import type { StrumSound } from './instrument-sounds.js';
import type { WebAudioFontPreset, WebAudioFontZone } from './webaudiofont.js';
/**
 * The strum player's voice engine: plays soundfont samples the way a real
 * instrument sounds them, on the audio clock. It is this repo's own MIT code;
 * WebAudioFont only loads and decodes the samples (`webaudiofont.ts`).
 *
 * Each note is its sample, pitched from the soundfont zone nearest its key,
 * through a chain of its own:
 *
 * - **Tone** — a low-pass that opens with force and pitch, since a soft stroke
 *   is darker than a hard one and a high string brighter than a low one.
 * - **Envelope** — the sample's own attack and decay. A body's `sustain`
 *   shortens the ring, the sample's loop fades out over `tail` instead of
 *   droning, and no note outlasts `maxRing`. Each zone's level is evened out
 *   against the others, so no string of a chord jumps out, and each sample
 *   starts where it becomes audible — some carry milliseconds of silence
 *   before the pluck, which would make every note late.
 * - **Damper** — a string (`slot`) sounds one note: a new note there lets go
 *   of the old one over `damping`, while the strings it does not touch ring
 *   on. `damp` settles a whole group, as a palm on the strings.
 * - **Pan** — each string or key has its place across the stereo field.
 *
 * The notes of one instrument meet on its bus: the body (a high-pass, a
 * presence peak for a small instrument, and a bass's drive — soft saturation
 * band-limited to the harmonics a small speaker can play, mixed in under the
 * dry sound as an amplifier's would be), then the dry mix and a send into the
 * room — a convolution reverb whose impulse is synthesised here (a warm,
 * 1.3 s room), so no file is loaded for it. A peak limiter keeps loud strums
 * from clipping without flattening them.
 */
export interface StrumNote {
    preset: WebAudioFontPreset;
    sound: StrumSound;
    /** MIDI note. */
    pitch: number;
    /** Audio-clock time it sounds. */
    time: number;
    /** Loudness, 0–1. */
    velocity: number;
    /** Cents off pitch. */
    detune?: number;
    /** −1 (left) to 1 (right). */
    pan?: number;
    /** The string or key it sounds on: a new note there damps this one. */
    slot: string;
    /** The notes `damp` settles together, e.g. a pattern's or a chord card's. */
    group: string;
}
export interface StrumVoice {
    /** Audio-clock time the note sounds. */
    readonly time: number;
    /** Silences the note if it has not sounded yet; a sounding note rings on. */
    cancel(): void;
}
export interface StrumSoundEngine {
    /** Schedules a note; `null` when the soundfont has no sample for it. */
    play(note: StrumNote): StrumVoice | null;
    /**
     * Lets go of every note of `group` from `time`, over `timeConstant`. Notes
     * that would only sound after `time` are cancelled.
     */
    damp(group: string, time: number, timeConstant: number): void;
}
/** How a zone's sample is played: its level correction and where it starts. */
export interface ZoneTrim {
    /** Evens the zone's level out against the preset's other zones. */
    gain: number;
    /** Seconds into the sample it becomes audible. */
    start: number;
}
export declare const ROOM: {
    /** Seconds the room takes to fall 60 dB. */
    readonly decay: 1.3;
    /** Seconds before the first reflection. */
    readonly preDelay: 0.012;
    /** How much darker the tail grows than the first reflections (0–1). */
    readonly damping: 0.85;
};
/** A zone's key: its root, after the soundfont's tuning (semitones). */
export declare function getZoneRoot(zone: WebAudioFontZone): number;
/**
 * The zone that sounds `pitch`: of those whose key range holds it, the one
 * whose root is nearest; else the zone whose range is nearest.
 */
export declare function findZone(preset: WebAudioFontPreset, pitch: number): WebAudioFontZone | null;
/** Whether the zone has a sustain loop (WebAudioFont's rule). */
export declare function hasLoop(zone: WebAudioFontZone): boolean;
/** Low-pass cutoff (Hz) for a note of `velocity` at `pitch`. */
export declare function getToneCutoff(sound: StrumSound, velocity: number, pitch: number): number;
/**
 * The gain a note of `velocity` sounds at, before its zone and instrument:
 * `velocity ** 1.5`, as far as the instrument's `dynamics` lets force count.
 */
export declare function getVelocityGain(velocity: number, dynamics?: number): number;
/**
 * The drive's transfer curve: a soft saturation leaning to one side, so it
 * adds both odd and even harmonics, from −1 to 1 over `size` points.
 */
export declare function createDriveCurve(size?: number): Float32Array<ArrayBuffer>;
/**
 * How to play a zone's sample, measured once per preset: the gain that evens
 * its level out — the preset's median level over the zone's, within ×½ to
 * ×2 — and the silence to skip before it.
 */
export declare function getZoneTrim(preset: WebAudioFontPreset, zone: WebAudioFontZone): ZoneTrim;
/**
 * A stereo room impulse: noise decaying `decay` seconds to −60 dB after a
 * short pre-delay, darkening as it fades, each channel drawn apart so the room
 * sounds wide.
 */
export declare function createRoomImpulse(sampleRate: number, random?: () => number, { decay, preDelay, damping }?: typeof ROOM): [Float32Array, Float32Array];
export declare class WebAudioStrumSoundEngine implements StrumSoundEngine {
    #private;
    constructor(context: BaseAudioContext, destination?: AudioNode);
    play(note: StrumNote): StrumVoice | null;
    damp(group: string, time: number, timeConstant: number): void;
}
