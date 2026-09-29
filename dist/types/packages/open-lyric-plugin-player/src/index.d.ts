/**
 * `open-lyric-plugin-player` — hear an Open Lyric song's strumming patterns,
 * and every chord Open Lyric offers, on guitars, keyboards, ukuleles and
 * basses — ten instruments.
 *
 * - `OpenLyricPlayer` is the headless player: patterns in the notation's
 *   `Strumming Patterns` syntax, chord voicings per instrument, FluidR3
 *   soundfonts played on the audio clock by its own voice engine, the way
 *   each instrument is played.
 * - `OpenLyricPlayerPlayground` is the full UI over it — song key/time/tempo,
 *   instruments, editable pattern cards, and a card for every chord.
 *
 * The WebAudioFont player script (GPL-3.0-or-later) and the four soundfonts
 * ship as separate, unmodified asset files loaded with SRI — never bundled
 * into this package's code.
 */
export { OpenLyricPlayer } from '../../../src/plugins/OpenLyricPlayer/OpenLyricPlayer.js';
export type { OpenLyricPatternRequest, OpenLyricPlayerEventMap, OpenLyricPlayerOptions, OpenLyricPlayerState, OpenLyricPlayerStateEvent, OpenLyricPlayerStepEvent, } from '../../../src/plugins/OpenLyricPlayer/OpenLyricPlayer.js';
export { OpenLyricPluginPlayer } from '../../../src/plugins/OpenLyricPlayer/OpenLyricPluginPlayer.js';
export type { OpenLyricPluginPlayerOptions } from '../../../src/plugins/OpenLyricPlayer/OpenLyricPluginPlayer.js';
export { OpenLyricPlayerPlayground } from '../../../src/plugins/OpenLyricPlayer/OpenLyricPlayerPlayground.js';
export type { OpenLyricPlayerPlaygroundOptions, OpenLyricPlayerTheme, } from '../../../src/plugins/OpenLyricPlayer/OpenLyricPlayerPlayground.js';
export type { StrumInstrument, StrumInstrumentId, StrumSoundfont, StrumVoicing, } from '../../../src/plugins/OpenLyricPlayer/instruments.js';
export type { StrumPattern, StrumPatternDefinition, StrumStep, } from '../../../src/plugins/OpenLyricPlayer/patterns.js';
export type { ChordCard } from '../../../src/plugins/OpenLyricPlayer/chord-library.js';
export { version } from './version.js';
