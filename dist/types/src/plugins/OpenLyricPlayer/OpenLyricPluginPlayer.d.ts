import { OpenLyricPlayer } from './OpenLyricPlayer.js';
import { type StrumInstrumentId } from './instruments.js';
import type { OpenLyricComponentHost, OpenLyricContributions, OpenLyricPlugin, OpenLyricRenderContext, OpenLyricSurface } from '../../editor/components/index.js';
/**
 * `OpenLyricPluginPlayer` — the strum player as a plugin for the two preview
 * components, `OpenLyric` (`lyric`) and `OpenLyricMarkdownManager`
 * (`markdown`):
 *
 * - every strumming-pattern card gets a play/stop button, and the step
 *   sounding is marked on the card while it plays;
 * - a click on a chord (a key note) rolls it, and so does the ▶ the chord
 *   popup gets; beside it, a view toggle shows the chord on the instrument
 *   (its diagram, or piano keys) in place of the popup's guitar diagram. A
 *   strumming-pattern reference's popup gets a ▶ that plays its pattern;
 * - the preview's settings popup gets an instrument picker
 *   (`contributes.settings`).
 *
 * Attach one instance per component. Every instance plays through one
 * `OpenLyricPlayer` shared by the page unless it is handed its own, so one
 * pattern sounds at a time across the embeds.
 */
export interface OpenLyricPluginPlayerOptions {
    /**
     * The instrument to play on until a reader picks another in the settings
     * popup, and what Reset returns to. Default `guitar`.
     */
    instrument?: StrumInstrumentId;
    /** The player to sound through. Default: one shared by the page. */
    player?: OpenLyricPlayer;
    /**
     * localStorage key remembering the instrument a reader picked. Default
     * `openLyricPluginPlayer.instrument`; `null` remembers nothing.
     */
    storageKey?: string | null;
}
export declare class OpenLyricPluginPlayer implements OpenLyricPlugin {
    #private;
    readonly id = "player";
    readonly apiVersion: 1;
    readonly surfaces: readonly OpenLyricSurface[];
    readonly contributes: OpenLyricContributions;
    /**
     * Put the plugin's stylesheet in `document.head` for the page's lifetime,
     * without attaching the plugin — the page-level counterpart of the sheet an
     * attached plugin installs into its component. Idempotent. The sheet only
     * styles render roots the plugin has marked, so it changes nothing on a page
     * that never attaches it.
     */
    static installShellStyle(): void;
    constructor(options?: OpenLyricPluginPlayerOptions);
    /** The player patterns and chords sound through. */
    get player(): OpenLyricPlayer;
    /** The instrument patterns and chords play on. */
    get instrument(): StrumInstrumentId;
    /**
     * Switch instruments: remembered, reflected in every settings popup showing
     * the picker, and a pattern playing here restarts on the new one.
     */
    set instrument(next: StrumInstrumentId);
    /** Back to the configured instrument, forgetting the reader's pick. */
    resetInstrument(): void;
    /** Stop a pattern this plugin started, wherever it plays. */
    stop(): void;
    install(host: OpenLyricComponentHost): void;
    uninstall(host: OpenLyricComponentHost): void;
    /**
     * Attached to a preview that is already mounted, nothing has rendered with
     * this plugin yet — render once so the cards get their buttons.
     */
    onMount(host: OpenLyricComponentHost): void;
    onUnmount(host: OpenLyricComponentHost): void;
    onAfterRender(host: OpenLyricComponentHost, context: OpenLyricRenderContext): void;
}
