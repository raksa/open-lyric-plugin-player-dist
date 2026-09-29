import type { StrumSoundfont } from './instruments.js';
/**
 * The strum player's soundfonts are loaded and decoded by Sergey Surikov's
 * WebAudioFont, at runtime, with a `<script>` per file from copies this app
 * serves itself (`assets/`, whose README says where each came from). No other
 * host is involved. The notes are then played by this repo's own voice engine
 * (`StrumSoundEngine.ts`), not by WebAudioFont's player:
 *
 * - The player is webaudiofont **2.5.57**, the npm package's
 *   `npm/dist/WebAudioFontPlayer.js` byte for byte. It is GPL-3.0-or-later,
 *   so it stays a file of its own, beside its license, rather than bundled
 *   into this MIT code. Only its `adjustPreset` is called, to decode the
 *   samples.
 * - The soundfonts are MIT files from `surikov.github.io/webaudiofontdata`
 *   (see `STRUM_SOUNDFONTS`).
 *
 * Every script is pinned with SRI. Each preset is decoded completely before it
 * is handed back, so the first stroke of a fresh load is never dropped.
 */
/**
 * One sample of a soundfont and the keys it sounds. `adjustPreset` fills in
 * the numbers a data file leaves out, and decodes `buffer`.
 */
export interface WebAudioFontZone {
    buffer?: AudioBuffer;
    keyRangeLow?: number;
    keyRangeHigh?: number;
    /** The sample's pitch, in cents of a MIDI note (`6000` = middle C). */
    originalPitch?: number;
    /** Semitones and cents the zone retunes the sample by. */
    coarseTune?: number;
    fineTune?: number;
    /** The sample's own rate, which `loopStart` and `loopEnd` count in. */
    sampleRate?: number;
    loopStart?: number;
    loopEnd?: number;
    /** Seconds into the buffer the sample starts. */
    delay?: number;
}
export interface WebAudioFontPreset {
    zones: WebAudioFontZone[];
}
export interface WebAudioFontPlayerInstance {
    /** Decodes every zone's sample into its `buffer`, some asynchronously. */
    adjustPreset(context: BaseAudioContext, preset: WebAudioFontPreset): void;
}
export type WebAudioFontPlayerConstructor = new () => WebAudioFontPlayerInstance;
export declare const WEBAUDIOFONT_PLAYER_SCRIPT: {
    readonly url: string;
    readonly integrity: "sha384-Dvf7U4nlcDoz6ty0yygUFW1OkoynFUAy62/rMn8ERLrMEaW5Spe0Vqt2oq6gJw6U";
};
/** Adds `<script src integrity>` once per URL; a failed load may be retried. */
export declare function loadScriptOnce(url: string, integrity: string): Promise<void>;
export declare function loadWebAudioFontPlayer(): Promise<WebAudioFontPlayerConstructor>;
/**
 * Loads a soundfont's data file and decodes every sample of it
 * (`player.adjustPreset`), then waits until each zone has its buffer.
 */
export declare function loadSoundfontPreset(player: WebAudioFontPlayerInstance, context: BaseAudioContext, soundfont: StrumSoundfont): Promise<WebAudioFontPreset>;
