# Trailer study: Hinokami Chronicles Steam trailer → the Veilbound trailer

Reference: `~/Downloads/Demon Slayer -Kimetsu no Yaiba- The Hinokami Chronicles on Steam.mp4` (1:05.6, 1920×1080, 29.97 fps, AV1 + AAC stereo). It's a visual reference only; nothing from it (names, characters, logos, music, kanji) goes into Veilbound.

Method: hard-cut detection (`ffmpeg select=gt(scene,0.28)`), contact sheets at 1 fps (0–22 s, 50–65 s) and 2 fps (22–50 s), and a 0.25 s loudness envelope of the soundtrack.

## Structure of the reference

| Time | Section | What it does |
| --- | --- | --- |
| 0–5.9 | Publisher logos | Silent black cards. Audio is nearly silent until 6.2 s. |
| 6.2–11 | Title build | Hard music hit at 6.25 s (loudest moment of the opening). The logo burns in with fire and embers over a dark forest. Then a push into the logo. |
| 11–21.8 | Character reveal | Ink-brush character reveal: hands, legs and eyes in extreme close-up, while brush kanji of the name are written stroke by stroke. Ends on a full-body pose framed by vertical kanji and gold cloud patterns. |
| 21.8–22.3 | Hard cut to gameplay | A 1-frame black-and-white ink "impact frame" of the forest. |
| 22.3–39.5 | Gameplay montage | Cuts every 0.5–3 s. Mostly a side-on ¾ two-shot, both fighters full body, at a low camera height. Interrupted by authored close-ups: a sword-clash close-up with radial speed lines (23.0), a low-angle crescent arc (26.5), a three-quarter face close-up mid-art (27.5), a hit flash star burst (31.0), a blade clash X-flash (32.0), a dodge ring (32.5), a ground slam with a debris fountain (33.5–35.5), a face close-up with brush-ink vertical streaks (34.5–35.0), a white shockwave dome (36.5) and a launch with a body flying through the frame (37.0). |
| 39.5–49.5 | Special art sequence | A crimson "art" with a cut-in close-up (40.0–40.5, radial speed lines and a coloured background), sweeping arcs (41.0), an RGB-split glitch close-up (42.5), an over-the-shoulder rush (43.0), callouts "Blood Demon Art!" and "Exploding Blood!" (45–47.5), then a full-screen explosion of petals and blood (48–49). |
| 49.5–53.5 | Tagline | Glitchy painted text on a dark scene; one word turns red. |
| 54–62 | End card | Logo, release date, platform and publisher logos, legal line. |
| 63–65 | Sting | Publisher sting. |

Soundtrack: one big hit at 6.25 s, a rhythmic bed under the gameplay (most onsets line up with cuts: 26.0, 35.5, 36.75, 40.0, 41.25, 43.25), a swell into the art finale (47–50 s), and the tagline and end card on a decaying tail.

What makes the gameplay feel like a trailer:
1. The camera is never behind the character. It holds a side-on two-shot, and every big moment cuts to an authored close-up and back.
2. There's no HUD in the gameplay shots: no health bars and no button prompts.
3. Effects are drawn, not simulated: ink impact frames, star bursts, crescent arcs, speed lines, dust and rock fountains, petals.
4. The characters show emotion in close-ups between actions.
5. Specials get a cut-in portrait, a callout title and a coloured full-screen finish.

## How the repo already matches

The Combat v2 work (see HANDOFF.md) built most of the gameplay language:

- `game/duel-camera.js` provides the side-on ¾ two-shot plus cue shots for clash, lock, parry, launch, down, dash, kick, a 3-shot art and a KO orbit.
- `game/anime-fx.js` provides ink and invert impact frames, star bursts, clash X-flashes, crescents, speed lines, dust and debris, shockwave domes, afterimages, cut-ins with brush kanji, the VS splash, callouts and a hit counter.

## The Veilbound trailer (what `game/trailer.js` does)

The user's structure (v3, 2026-11-14): a single introduction (bow, draw, then the VS splash), then one continuous fight. The fighters move around each environment, leaping and fighting in the air like the reference's aerial exchanges. Film angles are creative, mixing wides and close-ups. The trailer runs no longer than 1:10, and the end card reads "VEILBOUND / An Original Adventure".

| Time (v3) | Beat |
| --- | --- |
| 0–2.6 | 鐘 VEILBOUND title |
| 2.6–7.2 | Cloudveil Sanctuary: three landmark pans, then a crane onto the training court |
| 7.2–12.5 | The pair (wide), the formal bow, the draw close-up and low two-shot |
| 12.5–14.5 | VS splash, then "Fight" |
| 14.5–23.9 | Sanctuary fight; the duel leaps into the waterfall garden |
| 23.9–34.3 | Lamplight Avenue: drop-in, Haru's Rising Tempest, a leap down a side street |
| 34.3–44.7 | Burning Rooftops: drop-in, Mitsuki's Thousand Toll, a leap across the roofs |
| 44.7–58.4 | Nightwright's Meridian: drop-in, Mitsuki's Ember Bell Descent, a leap, the blade lock, Haru's Sky-Current Crescent, KO |
| 58.4–64.3 | "Ring the severed bells." and the end card |

Camera language in the fight follows the reference: authored event shots for clashes, parries, launches, locks, arts and the KO. Between them, a rotation alternates wides (establishing, crane, overhead, orbit) with close-ups (faces, over-the-shoulder, worm's-eye, Dutch tilt, blades in frame), plus a tracking shot alongside every leap.

Render: `node tools/trailer-capture.mjs` steps the game frame by frame (`?capture&trailer`), screenshots each frame and encodes H.264 with ffmpeg, so motion is perfectly even at any machine speed.

Not done yet: a soundtrack and sound effects. The reference relies on its music for pacing (the 6.25 s hit, the swell into the finale). Sound effects must come from an AI SFX model or the user's own samples, not be hand-synthesized. Quote the cost first.
