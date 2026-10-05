# Upgrading the GPTVoice section

For whoever finishes GPTVoice (the `gptvoice` agent or the main thread).
The site never makes a claim about GPTVoice that is not in **one file**:
`content/gptvoice.mjs`. You do not need to touch HTML or CSS.

## Rules

- Only write what you have verified on a real run. No voice counts, no speeds, no
  "supports X languages" unless you measured it.
- Every string has an `en` and an `fr` version. Keep both.
- Strings are plain text (the build escapes them). No HTML.
- Audio transcripts must match the audio **word for word**: they are the accessible
  alternative for deaf and hard-of-hearing visitors.

## Step by step

1. **Status.** In `content/gptvoice.mjs`, change `status`:
   - `"development"` (now): badge "In development", features labelled "Planned",
     no install block.
   - `"preview"`: badge "Preview", features labelled "What it does", install block shown.
   - `"released"`: badge "Available".
2. **Repository.** Set `repo` to the public URL, e.g.
   `"https://github.com/Connected-Mate/gptvoice"`. This adds a link in the card and
   the footer. Leave `null` while the repo is private.
3. **Install.** Set `install` to the exact commands, one string per line, e.g.
   `["git clone https://github.com/Connected-Mate/gptvoice.git", "cd gptvoice", "npm install", "./install.sh"]`.
   Set `installNote` to `{ en: "...", fr: "..." }` with the real requirements
   (Node version, plan, OS). Both are ignored while `status` is `"development"`.
4. **Features.** Edit the `features` list so it matches what actually ships.
   Remove anything that did not make it.
5. **Audio samples.**
   - Put the files in `assets/audio/` (create the folder). MP3, mono, 64 to 96 kbps,
     under ~500 kB each, a few seconds to 30 s. Normalize loudness (about -16 LUFS).
   - For each entry in `samples`, set `src` (e.g. `"assets/audio/keeper-en.mp3"`),
     `type` (`"audio/mpeg"` for MP3), and replace `transcript` with the exact words spoken.
     `lang` is the language spoken in the file (`"en"` or `"fr"`).
   - The first sample is the narration of the storyboard in the "Short film" section
     ("The Keeper"). Its current transcript is the script to record.
   - Add or remove samples freely. `id` must be lowercase letters, digits and dashes.
   - While `src` is `null`, the site shows "Audio sample coming soon" with the script.
6. **Short-film step.** When voice works, remove the "Coming soon" tag from the
   "Voice" step in `content/site.mjs` (`film.steps[2]`, both `en` and `fr`), and
   update the FAQ entry "When is GPTVoice coming?" (last item of `faq.items`).
   Also update `hero.lead` ("and voices soon") in both languages.
7. **Rebuild and test.**
   ```bash
   npm test          # rebuilds, then runs the checks
   npm run serve     # http://127.0.0.1:8765 to look at it
   ```
   The build refuses a sample whose file does not exist, an invalid `repo` URL or an
   invalid `status`. Note: one test asserts that GPTVoice shows no install block and no
   audio player while in development. Update `tests/site.test.mjs` (the
   "GPTVoice shown as in development" test) when you change the status.
8. Commit `content/gptvoice.mjs`, `assets/audio/*`, `index.html`, `fr/index.html`.

## Other GPTVoice blocks (all in `content/gptvoice.mjs`)

- `controls`: three tiers (Exact / Strong / Best effort), each with a note and items.
- `measured`: the benchmark figures. Only numbers that exist in the gptvoice repo's data files.
- `mcpTools`: the tool names Claude Code gets (the count in the heading is automatic).
- `voices` + `voiceLine`: the voice gallery. Each voice needs `assets/audio/voices/<id>-en.mp3`
  and `-fr.mp3` (the build fails otherwise). `voiceLine` must be the exact sentence the
  samples say, with `{Name}` where the voice says its own name.
- Demo clips live in `assets/audio/demo/` and are listed in `samples`.

## Optional

- A new mascot image: put a PNG in `design/source/`, add a job in
  `design/build_images.py`, run `npm run images`, then reference it in `build.mjs`
  (`IMG` table and the `picture(...)` call in the GPTVoice article).
