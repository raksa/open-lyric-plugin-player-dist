import { OpenLyricPlayer } from './OpenLyricPlayer.js';
/**
 * `OpenLyricPlayerPlayground` — hear an Open Lyric song's strumming patterns,
 * and every chord Open Lyric offers, on guitars, keyboards, ukuleles and
 * basses. Patterns are written in the notation's `Strumming Patterns`
 * syntax; it opens on the two patterns of the "Extended Worship Build" example
 * (Key E, 4/4, 70 bpm). Below them, every chord gets a card with its voicing
 * and a play button (`playground-chords.ts`).
 *
 * The UI over an {@link OpenLyricPlayer}. It renders into a root element of
 * its own inside `container`, and its styles are scoped to that root.
 *
 * Settings and patterns persist in localStorage under `storageKey` — a
 * convenience only; it starts from the example whenever nothing usable is
 * stored.
 */
export type OpenLyricPlayerTheme = 'light' | 'dark';
export interface OpenLyricPlayerPlaygroundOptions {
    /** Where the playground renders. Its existing content is left alone. */
    container: HTMLElement;
    /** A player to share with the host; otherwise the playground makes one. */
    player?: OpenLyricPlayer;
    /** `light` or `dark`; omitted, the system's colour scheme decides. */
    theme?: OpenLyricPlayerTheme;
    /**
     * localStorage key for the settings and patterns. Default
     * `openLyricStrumPlayer.v2`; `null` keeps nothing between visits.
     */
    storageKey?: string | null;
}
export declare class OpenLyricPlayerPlayground {
    #private;
    /** The player behind the UI — the one passed in, or the playground's own. */
    readonly player: OpenLyricPlayer;
    constructor(options: OpenLyricPlayerPlaygroundOptions);
    /** The root element, once rendered. */
    get element(): HTMLElement | null;
    /** `light`, `dark`, or `undefined` when the system decides. */
    get theme(): OpenLyricPlayerTheme | undefined;
    /** Switches the theme; `undefined` hands it back to the system. */
    setTheme(theme: OpenLyricPlayerTheme | undefined): void;
    /**
     * Renders into the container. Calling it again renders afresh, keeping the
     * settings and patterns.
     */
    render(): this;
    /**
     * Removes the playground and stops its pattern. A player the playground
     * made is destroyed with it; one passed in is left to its owner.
     */
    destroy(): void;
}
