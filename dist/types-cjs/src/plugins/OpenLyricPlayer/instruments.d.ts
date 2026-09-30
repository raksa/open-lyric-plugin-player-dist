import { type ChordCard, type ChordDatabases } from './chord-library.js';
/**
 * The strum player's ten instruments: the WebAudioFont soundfont each sounds
 * with, and how it voices a chord (`chord-library.ts`). How each is played,
 * and the tone the voice engine gives it, is in `instrument-sounds.ts`.
 *
 * - **Soundfonts** are General MIDI presets of the FluidR3_GM bank (MIT), as
 *   published in `surikov.github.io/webaudiofontdata` (MIT), picked for a
 *   worship band: steel-string, nylon and clean electric guitars, grand and
 *   electric pianos, an organ, nylon guitar again for both ukuleles (General
 *   MIDI has no ukulele), and an electric and an upright bass. FluidR3 was
 *   chosen for realism: 22–44.1 kHz samples a few semitones apart, each
 *   ringing its natural decay for seconds before any loop, and every zone in
 *   tune within a few cents. The bass is an electric one because the upright
 *   bass's samples sound almost nothing above 150 Hz: on small speakers its
 *   line all but disappears. This app serves copies from
 *   `assets/webaudiofontdata/sound/`, each pinned by `sha384-` hash and
 *   checked at PACK time against the asset the build emitted, so a copy that
 *   no longer matches fails the build instead of silently sounding different.
 * - **Voicings.** Every instrument voices the song key's chord itself, in
 *   standard tuning, as its family does (`getVoicingInstrument`): the guitars
 *   as a guitar, the keyboards as a piano, the basses as a bass. A pattern
 *   strums that voicing.
 */
export type StrumInstrumentId = 'guitar' | 'classical-guitar' | 'electric-guitar' | 'piano' | 'electric-piano' | 'organ' | 'ukulele' | 'baritone-ukulele' | 'bass' | 'upright-bass';
export interface StrumSoundfont {
    /** WebAudioFont data file name, e.g. `0250_FluidR3_GM_sf2_file`. */
    key: string;
    /** The global the data file assigns its preset to. */
    variable: string;
    /** Where this app serves its copy of the data file. */
    url: string;
    /**
     * `sha384-` hash of the published file, which the copy must match. Checked
     * at pack time against the emitted asset (`scripts/pack-packages.ts`), never
     * sent as an `integrity` attribute — see `webaudiofont.ts#loadScriptOnce`.
     */
    integrity: string;
    /** General MIDI program and sample bank, for display. */
    title: string;
}
export interface StrumInstrument {
    id: StrumInstrumentId;
    label: string;
    soundfont: StrumSoundfont;
}
export interface StrumVoicing {
    /** The key chord that is strummed, e.g. `E` or `C#m`. */
    chord: string;
    /** MIDI notes in string order (piano: low to high). */
    midi: number[];
    card: ChordCard;
}
export declare const STRUM_SOUNDFONTS: {
    readonly steelGuitar: StrumSoundfont;
    readonly nylonGuitar: StrumSoundfont;
    readonly grandPiano: StrumSoundfont;
    readonly electricGuitar: StrumSoundfont;
    readonly electricPiano: StrumSoundfont;
    readonly organ: StrumSoundfont;
    readonly acousticBass: StrumSoundfont;
    readonly electricBass: StrumSoundfont;
};
export declare const STRUM_INSTRUMENTS: readonly StrumInstrument[];
export declare function getStrumInstrument(id: string): StrumInstrument | null;
/**
 * The chord a pattern strums on `instrumentId` in `keyText` — the key's
 * tonic chord (`E`, `C#m`) — or `null` when the key is unreadable or the
 * instrument has no voicing for it.
 */
export declare function resolveStrumVoicing(instrumentId: StrumInstrumentId, keyText: string, databases: ChordDatabases): StrumVoicing | null;
/** `56` → `G#3`, or `Ab3` in a key written with flats. */
export declare function getMidiNoteName(midi: number, keyText?: string): string;
