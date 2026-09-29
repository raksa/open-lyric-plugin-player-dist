import { type StrumInstrument } from './instruments.js';
import type { OpenLyricPlayer } from './OpenLyricPlayer.js';
/**
 * The playground's Chords section: every chord Open Lyric offers. Point at a
 * chord (or focus it) and a card shows its voicing on the selected instrument
 * — a chord diagram, or piano keys — with a play button that rolls the chord.
 * Pressing the chord itself plays it too.
 *
 * The card stays up while the pointer is on it and goes shortly after the
 * pointer leaves.
 */
export interface ChordLibraryOptions {
    /** The playground root: the card mounts here, inside its theme tokens. */
    root: HTMLElement;
    groups: HTMLElement;
    summary: HTMLElement;
    /** Unique within the page — the card's id, for `aria-describedby`. */
    cardId: string;
    player: OpenLyricPlayer;
    /** Aborted when the playground goes; drops the document listeners. */
    signal: AbortSignal;
    getInstrument(): StrumInstrument;
    getKey(): string;
    onError(message: string): void;
}
export interface ChordLibrary {
    /** Re-reads the instrument and key into the chords and any open card. */
    refresh(): void;
}
export declare function mountChordLibrary(options: ChordLibraryOptions): ChordLibrary;
