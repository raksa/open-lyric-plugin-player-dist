# open-lyric-plugin-player — how to use the library

Hear an Open Lyric song's strumming patterns, and every chord Open Lyric
offers, on ten instruments: acoustic, classical and electric guitar, piano,
electric piano, organ, ukulele, baritone ukulele, bass and upright bass.

Scope: this document covers the `open-lyric-plugin-player` package only. For
the editor components see the `open-lyric` package's `how-to_open-lryic.md`,
and for the song notation (`Key`, `Time`, `Tempo`, `Strumming Patterns`) its
`schema.md`.

---

## Install

```bash
npm i open-lyric open-lyric-plugin-player
```

`open-lyric` is a **peer dependency**: the player reads the notation's key and
time lists, chord list and pattern parser from it rather than carrying a copy.

---

## Three exports

```js
import {
  OpenLyricPlayer,
  OpenLyricPlayerPlayground,
  OpenLyricPluginPlayer,
} from 'open-lyric-plugin-player';
```

- **`OpenLyricPlayer`** is the headless player. It has no DOM.
- **`OpenLyricPlayerPlayground`** is the full UI built on it: song key, time
  and tempo, instrument switches, editable pattern cards, and a card for every
  chord.
- **`OpenLyricPluginPlayer`** plugs the player into the `open-lyric` preview
  components, `OpenLyric` and `OpenLyricMarkdownManager`.

---

## `OpenLyricPluginPlayer`

```js
import { OpenLyric } from 'open-lyric';
import { OpenLyricPluginPlayer } from 'open-lyric-plugin-player';

const preview = new OpenLyric({ container, value: song });
preview.addPlugin('player', new OpenLyricPluginPlayer());
await preview.mount();
```

The same class attaches to an `OpenLyricMarkdownManager`. Attached, it adds:

- **A play button on every strumming-pattern card.** The `OpenLyric` preview
  draws the song's `Strumming Patterns` as cards under the song header; the
  Markdown preview draws them in the `Config` card. A press loops the pattern
  in the song's `Key`, `Tempo` and `Time`. On `OpenLyric` the key is the one
  the song is shown in, so a transposition changes what the pattern strums.
  Press again to stop. While a pattern plays, its button shows a stop square
  and the step sounding is highlighted on the card.
- **Chords that play.** A click on a chord (`[G]`, and the `Key` value) rolls
  it. The chord popover still opens as before, and gets a play button in its
  header that rolls the chord again. The popover of a `{p:#n}` pattern
  reference gets one that plays or stops that pattern, like its card's.
- **The chord on your instrument.** Next to a chord popover's play button, a
  view (eye) toggle swaps the popover's guitar diagram for the chord as the
  picked instrument plays it: its fret diagram (ukulele, bass, …) or lit piano
  keys, the instrument's name, and the notes. The ‹ › arrows either side of
  the name step through the instruments, wrapping around. This is the same as
  picking the instrument in the settings popup: the pick is stored and
  chords and patterns then play on it. The view stays on for the next chord
  until pressed again, and redraws when the instrument changes. A chord with no
  voicing on that instrument says so.
- **An Instrument picker in the settings popup** (the gear), listing every
  instrument. The popup's Reset returns it to the configured instrument.

With no `Key` a pattern strums C; with no `Tempo` it plays at 70.

A pattern plays until it is stopped, another pattern starts, or its card goes
away. A re-render keeps it going: an edited pattern changes mid-run, and a
changed key, tempo, time or instrument restarts it.

It works the same on the `OpenLyricDashboard`'s adopt-mode previews. There the
Instrument picker joins the panel's own settings popup, above its Reset, and a
card the panel swaps in without a full render gets its button back.

| Option       | Meaning                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `instrument` | The instrument to start on and the one Reset returns to. Default `'guitar'`. An unknown id throws.                       |
| `player`     | The `OpenLyricPlayer` to play through. Default: one player the whole page shares.                                        |
| `storageKey` | localStorage key for the instrument a reader picks. Default `openLyricPluginPlayer.instrument`. `null` stores nothing.  |

A reader's stored pick outranks `instrument`.

| Member                  | Does                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `instrument`            | The instrument patterns and chords play on. Setting it stores the pick, updates the picker, and restarts a pattern that is playing. |
| `resetInstrument()`     | Returns to the `instrument` option and forgets the stored pick. The popup's Reset calls it.                  |
| `stop()`                | Stops a pattern this plugin started.                                                                         |
| `player`                | The `OpenLyricPlayer` it plays through.                                                                      |
| `OpenLyricPluginPlayer.installShellStyle()` | Static. Adds the plugin's stylesheet to `document.head` for the page's lifetime. Optional: an attached plugin brings the sheet with it. |

**One instance per component.** The plugin's id is `'player'`, and it declares
the `lyric` and `markdown` surfaces. By default every instance plays through
one shared `OpenLyricPlayer`, so only one pattern sounds at a time on the page:
starting a pattern in one preview stops the pattern in another.

**Sound starts from the click.** Presses on the play buttons and chords are
user gestures, so the browser lets the audio start. The first press loads the
chord tables and the instrument's soundfont, and the button pulses until the
pattern plays.

**What it leaves alone.** The plugin only decorates the preview on the page.
`getValue()` and `getElementMap()` render their own markup, and the image and
print exports leave the play buttons out. Without the plugin
the preview is unchanged: no buttons, no picker, and chords only open their
popover. `removePlugin('player')` stops its pattern and takes the buttons and
the picker back off.

**Styling.** The stylesheet ships as its own file. Every rule is scoped under
the `data-ol-player` attribute the plugin puts on the preview it decorates, and
reads the preview's theme variables (`--song-view-chord`, `--preview-ol-chip-bg`,
…), so it follows the preview's theme. The play button is `.olpp-play`, with
`data-state` set to `idle`, `loading` or `playing`. A playing card has
`data-olpp-state="playing"`, and its highlighted step cells have
`data-olpp-step`. The popover's button is the same `.olpp-play`, styled under
`.ol-chord-popup`. The view toggle is `.olpp-view-toggle` (`aria-pressed`
while on), and the view it shows is `.olpp-view`, with `data-kind` set to
`diagram`, `piano` or `none`. Its arrows are `.olpp-view__arrow--previous`
and `.olpp-view__arrow--next`.

---

## `OpenLyricPlayerPlayground`

```js
const root = document.getElementById('root');
const playground = new OpenLyricPlayerPlayground({ container: root });
playground.render();
```

| Option       | Meaning                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `container`  | Required. The playground appends a root of its own (`.olp-playground`) and leaves existing content alone. |
| `theme`      | `'light'` or `'dark'`. Leave it out and the system's colour scheme decides. Any other value throws.       |
| `player`     | An `OpenLyricPlayer` to share with the host. Without one, the playground makes its own.                   |
| `storageKey` | localStorage key for the settings and patterns. Default `openLyricStrumPlayer.v2`. `null` stores nothing. |

| Member             | Does                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `render()`         | Renders into the container and returns the playground. Calling it again renders afresh with the same settings. |
| `setTheme(theme)`  | Switches to `'light'` or `'dark'`. `undefined` hands the choice back to the system. Works before or after `render()`. |
| `theme`            | The current theme, or `undefined` when the system decides.                                            |
| `element`          | The root element, or `null` before `render()` and after `destroy()`.                                  |
| `player`           | The `OpenLyricPlayer` behind the UI.                                                                  |
| `destroy()`        | Removes the UI and stops its pattern. It destroys a player it made itself. A player you passed in keeps running. |

**Styling.** The stylesheet ships as its own file. On the first `render()` the
playground adds it to `document.head` as one `<link data-olp-stylesheet>`, and
removes it when the last playground is destroyed. Every rule sits under
`.olp-playground`. The colours are CSS custom properties on that root
(`--accent`, `--surface`, `--text`, …), so a host can override them there. The
theme is the root's `data-theme` attribute.

The root paints its own background. To make it fill the page, size it, for
example with `#root > .olp-playground { min-height: 100vh; }`.

Several playgrounds can share a page. Each one mints its own element ids.

---

## `OpenLyricPlayer`

```js
const player = new OpenLyricPlayer();

button.addEventListener('click', () => {
  player.playPattern({ pattern: 'd--u-- | d-u-d-', key: 'E', time: '4/4', tempo: 70, instrument: 'guitar' });
});
stopButton.addEventListener('click', () => player.stop());
```

**Call every `play*` method, and `preload`, from a user gesture.** Browsers
only start audio from inside the gesture, before its first `await`. The player
unlocks the audio context synchronously, so call it straight from the handler.

| Member                                                | Does                                                                                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `OpenLyricPlayer.instruments`                         | The ten instruments: `guitar` (acoustic), `classical-guitar`, `electric-guitar`, `piano`, `electric-piano`, `organ`, `ukulele`, `baritone-ukulele`, `bass`, `upright-bass`. Each has an `id`, a `label` and a `soundfont`. The classical and electric guitars play a guitar's chord shapes, the electric piano and organ a piano's, the upright bass a bass's. |
| `playPattern({ pattern, key, tempo, time?, instrument? })` | Stops whatever is playing and loops the pattern until `stop()`. Defaults: `time` `'4/4'`, `instrument` `'guitar'`.      |
| `playChord(chord, instrument?)`                       | Rolls one chord, alongside any pattern that is playing. Resolves `true` once the notes are queued, or `false` when a later press took over. |
| `stop()`                                              | Stops the pattern. A stroke under way finishes, then the strings still ringing are damped over about a second, as a player's palm would. A chord roll rings on. |
| `updatePattern(pattern)`                              | Swaps an edited, parsed pattern in while it plays. The next step plays the edit.                                             |
| `preload(instrument?)`                                | Loads and decodes that instrument's soundfont ahead of time.                                                                 |
| `loadChords()`                                        | Loads the chord tables (chords-db) once. The `play*` methods call it themselves.                                             |
| `chordsLoaded`                                        | Whether the tables have loaded.                                                                                              |
| `getVoicing(instrument, key)`                         | The key's tonic chord as that instrument voices it: `{ chord, midi, card }`. `null` before the tables load, or when nothing fits. |
| `resolveChord(instrument, chord)`                     | What a chord looks like and plays: `{ kind: 'diagram' }`, `{ kind: 'piano' }`, or `{ kind: 'none', reason }`. `null` before the tables load. |
| `parsePattern(source \| definition, time?)`           | Parses a pattern written in notation. Throws on invalid text.                                                                |
| `state`, `patternId`                                  | `'idle'`, `'loading'` or `'playing'`, and the id of the pattern playing.                                                     |
| `on('state' \| 'step', listener)`                     | Subscribes to an event and returns the unsubscribe function.                                                                 |
| `destroy()`                                           | Drops every listener, then stops. Listeners are not told about that stop.                                                    |

**Patterns.** A pattern can be given in three forms:

- a notation string, which gets the id `'pattern'`;
- a `{ id, label, source }` definition;
- an already parsed pattern.

Each character of the notation is one sixteenth note:

| Character | Means                     |
| --------- | ------------------------- |
| `d`       | down                      |
| `u`       | up                        |
| `x`       | alternating               |
| `-`       | rest                      |
| `\|`      | a break between groups    |

A pattern strums the song key's tonic chord (`E`, `C#m`). The tempo counts the
time signature's unit.

**Errors.** `playPattern` rejects in two cases: the pattern does not parse, or
there is nothing to strum (an unreadable key, or no voicing on that
instrument). `playChord` rejects for a chord name Open Lyric's chord theory
cannot read (`Cmaj2`), for a chord with no voicing on the instrument, and for
an unknown instrument. A soundfont or player script that fails to load does
not reject `playPattern`. It arrives as a `state` event instead: `idle` with
an `error`.

**Events.**

- `state` sends `{ state, patternId, error? }`.
- `step` sends `{ patternId, stepNumber }`, where `stepNumber` is 1-based and
  is the step now sounding.

---

## How it sounds

Each instrument is played the way a player would play it:

- **Acoustic, classical and electric guitar, ukulele and baritone ukulele**
  strum across their strings in string order. A down stroke starts from the
  lowest string, so a ukulele's high G sounds first. An up stroke comes back
  from the highest string and catches only the top strings: about 60% of a
  guitar's, three of a baritone ukulele's four, all four of a ukulele's. A
  light down stroke, on an `e` or `a` sixteenth, skips a guitar's lowest
  string.
- **Piano, electric piano and organ** play the chord as one, and an up stroke
  plays it without its lowest note (the right hand alone). The piano sounds
  as if the sustain pedal were down. The organ holds its notes until they are
  played again and barely changes with a stroke's force, as an organ's keys
  do.
- **Bass and upright bass** pluck one note a stroke: the root on a down
  stroke, the octave on an up stroke. The bass is an electric one, with the
  harmonics an amplifier gives it, so its line carries even on laptop and
  phone speakers. The upright is darker, as the instrument is.

A string rings until it is struck again or dies away. The strings a stroke
does not touch ring on. A soft stroke sounds darker than a hard one. Each
stroke lands a few milliseconds off the grid, and each note varies a little in
force and tuning, so no two strokes sound the same.

A chord card rolls its notes one string at a time, and a bass plucks them in
turn. A new roll damps the one before it.

The sound has a stereo image, with strings and keys spread across it, and a
short room reverb. A peak limiter keeps it from clipping. Every instrument
plays a pattern at about the same loudness.

---

## Sound files

The player loads its sound from separate asset files that ship in `dist/assets/`:

- the WebAudioFont player script (GPL-3.0-or-later), which only decodes the
  soundfonts — the package's own MIT code plays the notes;
- eight General MIDI soundfonts of the FluidR3_GM bank, from webaudiofontdata
  (MIT): steel-string guitar, nylon guitar (the classical guitar and both
  ukuleles), clean electric guitar, grand piano, electric piano, percussive
  organ, electric bass (pick) and acoustic bass (the upright).

A page loads only the soundfont of the instrument it plays. The room reverb is
synthesised in code and loads no file.

Each file is byte-for-byte the published file, and each loads through its own
`<script>` with an SRI hash. The package code refers to them with
`new URL(…, import.meta.url)`, so a bundler that handles that pattern
(Vite, webpack 5, Rollup, esbuild) copies them next to the host's bundle. Do
not let any tool transform or re-encode them. A changed byte fails the SRI
check, and that sound will not load.

The player script is never bundled into this package's MIT code. It is only
loaded at runtime.

---

## Version

```js
import { version as playerVersion } from 'open-lyric-plugin-player';
```

This is the package's own version, taken from its `package.json`. It changes
independently of the core `open-lyric` version.
