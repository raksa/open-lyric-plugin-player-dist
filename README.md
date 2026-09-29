# open-lyric-plugin-player

Hear an [Open Lyric](../open-lyric) song's strumming patterns, and every chord
Open Lyric offers, on ten instruments: acoustic, classical and electric
guitar, piano, electric piano, organ, ukulele, baritone ukulele, bass and
upright bass.

## Install

```bash
npm i open-lyric open-lyric-plugin-player
```

`open-lyric` is a peer dependency. This package contains no copy of it.

## Use

The full playground UI:

```js
import { OpenLyricPlayerPlayground } from 'open-lyric-plugin-player';

const root = document.getElementById('root');
const playground = new OpenLyricPlayerPlayground({ container: root, theme: 'dark' });
playground.render();
```

`theme` is `'light'` or `'dark'`. Leave it out and the system's colour scheme
decides. `playground.setTheme(…)` switches the theme at runtime.

The headless player:

```js
import { OpenLyricPlayer } from 'open-lyric-plugin-player';

const player = new OpenLyricPlayer();

// Call it from a user gesture, so the browser allows audio.
button.onclick = () =>
  player.playPattern({ pattern: 'd--u-- | d-u-d-', key: 'E', tempo: 70, instrument: 'guitar' });
```

The plugin for the `open-lyric` previews — a play button on every
strumming-pattern card, chords that play when clicked, and an Instrument
picker in the settings popup:

```js
import { OpenLyric } from 'open-lyric';
import { OpenLyricPluginPlayer } from 'open-lyric-plugin-player';

const preview = new OpenLyric({ container, value: song });
preview.addPlugin('player', new OpenLyricPluginPlayer());
await preview.mount();
```

It attaches to an `OpenLyricMarkdownManager` the same way.

`how-to_open-lyric-plugin-player.md` in this package covers every option,
method, event and error.

## Licenses

This package's code is MIT, its voice engine included. The sound it plays
ships as separate, unmodified asset files in `dist/assets/`:

- the WebAudioFont player script (GPL-3.0-or-later, by Sergey Surikov), which
  only decodes the soundfonts;
- the webaudiofontdata soundfonts of the FluidR3_GM bank (MIT).

The player script is loaded at runtime by its own `<script>` tag. It is never
bundled into the MIT code.
