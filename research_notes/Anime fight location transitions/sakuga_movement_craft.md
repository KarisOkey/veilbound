# Sakuga and animation craft for fast, weighty sword-fight movement (jumps, aerials, chases), translated for procedural Three.js fighters

Scope note: these notes answer the six key questions. Each section gives sourced findings first, then inferences. The inferences include procedural recipes for two code-built 3D fighters driven by keyframed poses and IK, with particle and overlay effects. Everything under "Inferences" is my synthesis, not documented fact. Several animator-specific sources (animetudes.com, fullfrontal.moe, artistunknown.info) could not be fetched during this session (DNS failure or 502). Claims from them come from search-result snippets and are flagged as such.

The diagnosis for "two people floating in the air" comes first, because every section feeds into it. In the cited material, floatiness comes from five things:
1. Real-world or low gravity, with symmetric rise and fall.
2. Smooth, evenly interpolated motion with no held poses.
3. No contact events: no crouch, no push-off frame, no landing compression, no debris or dust.
4. A camera that moves faster than the bodies' contact cues. Nakamura himself said his Bebop ep. 24 camera pull made characters "seem to fly rather than run".
5. Showing the whole parabola uninterrupted instead of cutting.

---

## 1. Named techniques and animators: what they do with timing, impact frames, smears, anticipation, follow-through and camera

### Takeaway
The documented core of anime action is **framerate modulation**: within a single cut, the drawing rate shifts between ones, twos and threes, with long holds on key poses. That modulation is layered with **impact frames** (Nakamura is cited at 41 in 31 seconds in one fight), straight-line **smears and motion-blur lines**, **cube debris with irregular timing**, and a **camera attached to the movement** that changes lens with distance (Itano). Lighting-driven compositing ties 2D bodies into 3D space (ufotable). Weight comes from contrast (hold, then snap, then hold), not from smoothness.

### Cited Findings

**Timing vocabulary (ones, twos, threes, framerate modulation)**
- Framerate modulation means "changes in the rate of drawings per second" inside one uninterrupted cut. Ones is a new drawing every frame (24/s), twos is each drawing held 2 frames (12/s), threes is held 3 frames (8/s). The film framerate stays at 24; only the drawing rate changes. — [Wave Motion Cannon, "An Introduction to Framerate Modulation"](https://wavemotioncannon.com/2016/12/31/an-introduction-to-framerate-modulation/)
- Lower drawing rates suggest size and weight. In Otsuka's *Horus, Prince of the Sun* (1968), the rock golem and ice monster are partly on threes, and their "slow, deliberate movements suggest their titanic power and weight". Per the same article, Otsuka's approach became standard industry practice. — [Wave Motion Cannon](https://wavemotioncannon.com/2016/12/31/an-introduction-to-framerate-modulation/)
- Shingo Natsume, in a *Gurren Lagann* sequence, slows the drawing rate as a robot rises (to suggest distance) and speeds it up as it crashes down. This is the documented anime analogue of a slow ascent and fast descent. — [Wave Motion Cannon](https://wavemotioncannon.com/2016/12/31/an-introduction-to-framerate-modulation/)
- Miyazaki's *Samurai Giants* (early 1970s) is mostly on threes, with the pitcher's throw on twos to convey speed. In Hosoda's *Digimon Adventure*, the fireball is on ones, the bird on twos switching to ones when hurt, and electric effects on threes "to emphasize impact". In *One-Punch Man*, the Sea King's face is held longer on the kick impact so the hit registers more strongly. — [Wave Motion Cannon](https://wavemotioncannon.com/2016/12/31/an-introduction-to-framerate-modulation/)
- Ones are not automatically better. Richard Williams praised ones for "compulsive viewing" but noted they can look "mushy". *March Comes in like a Lion* is on ones yet feels stilted because its inbetweens are mechanical. — [Wave Motion Cannon](https://wavemotioncannon.com/2016/12/31/an-introduction-to-framerate-modulation/)
- Kanada's early work (*Zambot 3*) uses irregular framerates, which make motion feel "more lifelike and organic". — [Wave Motion Cannon](https://wavemotioncannon.com/2016/12/31/an-introduction-to-framerate-modulation/)
- Normal-speed animation is mostly done on twos (12 drawings per 24 frames). Limited animation drops to 12 fps or fewer. "Full limited animation" means animating with key drawings only and no inbetweens. — [GarageFarm, "Limited Animation"](https://garagefarm.net/blog/limited-animation-what-is-it); [ANN Lexicon, "Shot on threes"](https://AnimeNewsNetwork.com/encyclopedia/lexicon.php?id=61)
- 3D precedent: at GDC 2015, Arc System Works (Junya Motomura) explained that *Guilty Gear Xrd* uses limited animation in 3D. Animators used "stepped"/"held" keys instead of computer inbetweening, choosing clear poses over smooth motion. The talk compares the two versions at about the 31-minute mark. — [GDC Vault listing](https://gdcvault.com/play/1022031/GuiltyGearXrd-s-Art-Style-The); [Game Developer coverage](https://gamedeveloper.com/art/see-i-guilty-gear-xrd-i-s-striking-2d-3d-art-deconstructed-at-gdc-2015); [Steam discussion with timestamp](https://steamcommunity.com/app/520440/discussions/0/2570942392197641710)

**Yutaka Nakamura (Bones; *Cowboy Bebop*, *Sword of the Stranger*, *Soul Eater*, *My Hero Academia*, *Mob Psycho 100*, *One-Punch Man*)**
- Wikipedia describes his action as "dynamic and unique action sequences that often make very heavy use of impact frames". He storyboards his own scenes, combines distinctive camerawork with animation timing, and draws detailed, often cube-shaped debris ("yutapon cubes"). His final action scene in *Sword of the Stranger* (2007), where he was action animation supervisor, is called "one of his most notable animation works". — [Wikipedia: Yutaka Nakamura](https://en.wikipedia.org/wiki/Yutaka_Nakamura)
- Impact-frame density: his Deku vs. Todoroki finale (MHA) reportedly has **41 impact frames in 31 seconds**. This is secondhand, from an Italian article that cites Sakugabooru and Sakuga Blog. — [AnimeClick (via search snippet)](https://www.animeclick.it/news/65864-larma-segreta-di-todoroki-e-di-studio-bones-lanimazione-di-yutaka-nakamura)
- Nakamura's own words (WEB Anime Style 2003 interview, English translation):
  - "the foundation of action is to deceive the eye"
  - motion blur "has to have a straight line in it or else it's no good", with effects "expressed in pencil lines"
  - after the director's note "The camera work should be attached to the movements", they used gradual pans that pull the camera along
  - he called his *Bebop* ep. 24 work "a bit too much": a fast camera pull made the characters **seem to fly rather than run**
  - the high jump in ep. 12 was "added later", justified by Jupiter's gravity
  - he studied hit and cut reactions in Hong Kong action and historical films: "The light reactions are most important ones"
  - the team studied a Bruce Lee film frame by frame for Spike's kick
  - on the Utena staircase, line spacing of about a millimeter made four frames unworkable, so he used two
  — [Wave Motion Cannon, Nakamura interview part 2](https://wavemotioncannon.com/2016/11/02/interview-yutaka-nakamura-web-anime-style-7192003-part-2/)
- Debris style: animetudes (via search snippet) says the "Nakamura debris" lineage has "irregular framerates and free motion across the screen, all the flying objects look like they have a will of their own". The same source calls his style a blend of "fluidity and overload", and a separate piece contrasts his "gliding" animation with Matsumoto's. — [animetudes, Kanada style now (snippet)](https://animetudes.com/2021/07/09/the-kanada-style-now/); [animetudes, Nagata/Hashimoto (snippet)](https://animetudes.com/2021/08/07/current-trends-in-action-animation-hiroto-nagata-and-ryuki-hashimoto/). The snippet attributes the "Nakamura debris" origin to the 80s, which suggests it may refer to *Takashi* Nakamura rather than Yutaka. This is ambiguous in the snippet.
- fullfrontal.moe (snippet) on a Nakamura cut: "when the hands join, he uses heavy smears that make shapes disappear in favor of pure movement". — [fullfrontal.moe (snippet)](https://fullfrontal.moe/?p=1063)
- His style is imitated. In *Mob Psycho 100* ep. 11, Hakuyu Go's setpiece is called a Nakamura homage for its "background animation surrounded by darkness", "cube shaped debris" and "experimental approaches". The same post praises Naoki Miyajima's Teru vs. Sakurai sword fight for "the thoroughness of the body motion during such a hectic scene", with Yoshimichi Kameda among the animation directors supervising. — [Sakuga Blog, Mob Psycho 100 ep. 11](https://blog.sakugabooru.com/2016/09/20/mob-psycho-100-episode-11/)

**Ichirō Itano ("Itano circus")**
- What it is: acrobatic aerial combat with close-range dogfights, twisting contrails, and large missile salvos with spiralling, erratic smoke trails, while targets dodge at high speed. It became famous on *Macross* (1982–83) and continued in *Macross Plus* and *Megazone 23*. — [Wikipedia: Ichirō Itano](https://en.wikipedia.org/wiki/Ichir%C5%8D_Itano)
- Origin: as a student, Itano strapped rocket fireworks to a car's front fork and fired them while chasing friends on a beach: "The chase was more interesting than the attack when I played this." — [Wikipedia](https://en.wikipedia.org/wiki/Ichir%C5%8D_Itano)
- Camera:
  - "Angle animation": the lens changes with distance, so distant subjects read telephoto, mid-range standard and near subjects fisheye. A missile starts telephoto and widens into a curved view as it approaches.
  - "Moving-body perspective": the camera moves freely, like skydiving footage, following the subject subjectively with frame-in and frame-out. "With 3DCG, the camera's slight lag becomes especially noticeable."
  - Itano: "The orbit is the most important for a missile."
  - Destruction plays in stages: internal detonation first, then collapse from the shockwave, with flickering light.
  — [Wikipedia](https://en.wikipedia.org/wiki/Ichir%C5%8D_Itano)
- The name first appeared in *My Anime* magazine in 1982 and echoes Minoru Genda's "Genda Circus" aerobatic formation. Itano credited Kanada's effects work as an inspiration. — [Wikipedia](https://en.wikipedia.org/wiki/Ichir%C5%8D_Itano)

**Norio Matsumoto (*Naruto* / *Naruto Shippuden*)**
- Described as a pillar of "flow animation": smears, fluid motion, and animation almost systematically on ones and twos. Single frames often look like "featureless masses". He worked with Atsushi Wakabayashi on *Naruto* eps. 30, 71 and 133 and *Shippuden* ep. 167. Flow animators approached fights with "increasing attention to choreography". — [animetudes, "The new generation of the 1990's" (search snippet only; page unreachable)](https://animetudes.com/2021/06/04/the-new-generation-of-the-1990s/); [AniList: Norio Matsumoto (snippet)](https://www.anilist.co/staff/100991/Norio-Matsumoto); [animetudes, Kanada style now (snippet)](https://animetudes.com/2021/07/09/the-kanada-style-now/)

**Kou Yoshinari**
- Hiroyuki Imaishi calls Kou's work "very dense" and "more oriented towards elevating his representation in a meticulous and realistic way". Kou is Yoh Yoshinari's older brother. Yoh is known for representing volume and perspective with spheres, especially smoke and explosions. — [Wave Motion Cannon, Yoh Yoshinari interview](https://wavemotioncannon.com/2016/12/19/yoh-yoshinari-interview-animestyle-032013-part-13/); [Wikipedia: Yoh Yoshinari](https://en.wikipedia.org/wiki/Yoh_Yoshinari)

**Yoshimichi Kameda (*Mob Psycho 100*, *FMA: Brotherhood*, *One-Punch Man*)**
- Kameda keyed the first *Mob Psycho 100* PV largely alone, which let him set the characters' movement styles. His *One-Punch Man* work made him familiar with ONE's designs. — [ANN, "Interview: The Staff of Mob Psycho 100"](https://www.animenewsnetwork.com:443/feature/2019-09-09/interview-the-staff-of-mob-psycho-100/.150874)

**ufotable compositing (Yuichi Terao, director of photography / digital chief)**
- Terao: "if you do the lighting correctly, the characters will blend into the backgrounds no matter what style they're drawn in." For *Heaven's Feel I* he built shadow depth with "a complex array of gradients in the shadows" and left "corner[s] of the scene where the light wouldn't reach". He also said "The more you strive for realism, the more contrived it appears." — [ANN, Interview: Yuichi Terao (2018)](https://www.animenewsnetwork.com/feature/2018-01-10/interview-yuichi-terao-chief-of-ufotable-digital-team/.125658)
- For *Infinity Castle*, the team built 3D scenes, placed cameras at many angles and used trial and error to find the most intense dynamic shot. They added 3D camera work and effects to 2D animation for depth and density. Both points come from interview snippets via Deadline and Popverse. — [Popverse interview](https://www.thepopverse.com/movies-demon-slayer-kimetsu-no-yaiba-yuichi-terao-interview-making-the-infinity-castle-feel-infinite)

### Inferences (procedural translation)
- **Pose-rate modulation in Three.js.** Keep root motion and the camera on ones (every render frame). Sample the skeleton pose on a stepped clock: `poseHz = 12` (twos) for normal action, `8` (threes) for heavy wind-ups and recoveries, `24–60` (ones) only for whip-fast swings and smears. Implement as `if (t - lastPoseT >= 1/poseHz) { applyPose(sample(t)); lastPoseT = t; }`. This is the Guilty Gear Xrd stepped-key idea. Decoupling the rates gives snap without jittery travel.
- **Hold, snap, hold.** Author each attack and leap as key poses with explicit hold durations, not tweens. For example: anticipation pose held 4–6 frames at 24 fps (~0.17–0.25 s), 1–2 frames of smear and transition, contact or impact pose held 3–6 frames, then follow-through ease-out on twos. The documented One-Punch Man hold on impact supports lengthening the impact pose.
- **Impact frames as an overlay.** On a hit or landing, render 1–3 frames (at 60 fps, ~2–4 frames each) of inverted or monochrome silhouette, either a full-screen post pass (invert plus threshold) or flat black/white materials. Then hit-stop (Section 5). The 41-in-31-seconds density suggests roughly one impact flash per beat in a climactic exchange, not one per fight.
- **Straight-line smears.** Per Nakamura, motion blur must be straight. Spawn a camera-facing ribbon or quad stretched along the blade's or limb's velocity vector for 1–2 render frames during the fastest pose transition. Optionally scale the limb mesh along velocity for that frame (squash/stretch smear).
- **Yutapon cube debris.** On landings and blade clashes, spawn 6–20 small flat-shaded cubes with random spin. Give each its own stepped update rate (randomly 8, 12 or 24 Hz) so they move irregularly, "with a will of their own". Use hard ballistic gravity and a short life (0.4–0.8 s).
- **Itano camera.** Pull the camera FOV wider as the subject approaches (telephoto at distance, around 25–35° FOV; wide/fisheye close, around 70–90° FOV) and lag it slightly behind the subject with a critically damped spring. Use frame-in and frame-out: let fighters exit the frame edge, then cut.
- **Nakamura's warning applied.** If the camera tracks a leaping pair perfectly and fast, they will read as flying. Lock the camera to the ground or a landmark for a beat at take-off and landing so the world, not the camera, carries the motion.
- **Ufotable lesson.** Grounding is partly lighting. Add a contact shadow (blob or decal) under each fighter whose size and opacity scale with height above the nearest surface. Use a rim light and the same key light direction as the environment. A missing or static shadow is a primary cause of "floating".

### Gaps
- No primary source found for Takashi Hashimoto's techniques. Searches returned nothing relevant.
- No source found describing Norio Matsumoto's *Mob Psycho 100* work specifically.
- No primary Matsumoto or Kameda interview text on timing (frame counts, holds) was retrieved.
- Kou Yoshinari's methods are documented only via Imaishi's brief characterization.
- No per-cut frame-by-frame timing charts (e.g., the exact hold lengths in Nakamura's *Sword of the Stranger* duel) were found. Those would require Sakugabooru frame-stepping, which wasn't possible here.
- The artistunknown.info cut-by-cut analysis of Nakamura on MHA #68 returned 502. It likely contains the most concrete Nakamura timing breakdown.

---

## 2. Jump and leap anatomy: anticipation, push-off, ascent, apex, descent, landing, recovery; timings; why "gravity" is so high; floaty versus snappy

### Takeaway
Games design jumps from **apex height and time-to-apex**, not from real gravity. The documented norm is an **asymmetric arc where the fall is faster than the rise**. Super Mario Bros. falling gravity is about **3.2 to 3.6 times** its rising gravity. Celeste applies **half gravity** near the apex for a readable hang. Real-world gravity makes a several-metre leap last 2 seconds or more, which reads as floating.

### Cited Findings
- Pittman's GDC 2016 "Math for Game Programmers: Building a Better Jump" (Minor Key Games) designs the jump from apex height *h* and time-to-apex *t*: **g = 2h/t²** and **v₀ = 2h/t**. Horizontal velocity comes from time, height and lateral distance. The talk reportedly also advocates raising gravity after the apex. Cited from secondary summaries; the talk itself is free on GDC Vault. — [Designing platformer player controls (blog summary)](https://traversingvirtual.blogspot.com/2024/07/designing-platformer-player-controls.html); [GDQuest, Kinematic jump formulas](https://www.gdquest.com/library/kinematic_jump_formulas)
- GDQuest's implementation:
  - `jump_speed = 2h / t_peak`
  - `jump_gravity = 2h / t_peak²`
  - `fall_gravity = 2h / t_descent²`
  - `horizontal_speed = distance / (t_peak + t_descent)`
  - Example values: h = 50, t_peak = 0.4 s, t_descent = 0.25 s, distance = 100.
  - It recommends an asymmetric jump where the rise is slower than the fall, because this "makes it easier for the player to control the jump height and landing".
  - In 3D, make jump speed positive and gravity negative.
  — [GDQuest](https://www.gdquest.com/library/kinematic_jump_formulas)
- Super Mario Bros. (NTSC) values from the disassembly-based reference:
  - Rising gravity with A held is 0x20 (32) at low speed, 0x1E (30) at walking speed and 0x28 (40) at running speed.
  - Falling gravity is 0x70 (112), 0x60 (96) and 0x90 (144) respectively, so the fall ratio is **3.2 to 3.6 times**.
  - Initial vertical speed is −4 (or −5 when running).
  - Releasing A while rising, or reaching the apex, immediately switches to falling gravity.
  — [SMBpedia movement](https://simplistic6502.github.io/smb1_tll/smbpedia_movement.html)
- Swink's *Game Feel* (as summarized) says gravity roughly triples at the apex of Mario's jump. This agrees with the disassembly ratio above. — [Designing platformer player controls](https://traversingvirtual.blogspot.com/2024/07/designing-platformer-player-controls.html)
- Celeste (Maddy Thorson): when jump is held, "the top of your jump has half gravity applied. It's subtle, but this gives you more time to adjust for landing, and also just looks/feels pleasant." Coyote time and jump buffering are also used (Section 5). — [Maddy Thorson, "Celeste & Forgiveness"](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html); [GameSpot coverage](https://www.gamespot.com/articles/celeste-dev-explains-how-they-made-their-game-feel/1100-6474775/)
- *The Animator's Survival Kit* has dedicated chapters "Run, Jump, Skip and Leap" and "Weight on a Jump" (from the table of contents; text not retrieved). — [Scribd TOC](https://www.scribd.com/doc/47396295/The-Animator-s-Survival-Kit)
- Anticipation stores energy before a jump, and its size can be broad or subtle. Too short and the jump feels sudden; too long and the flow breaks. — [Animation Mentor](https://animationmentor.com/blog/anticipation-the-12-basic-principles-of-animation/); [CG Wire](https://blog.cg-wire.com/timing-animation-principle)
- A claim attributed to Williams that anything under 4 frames doesn't register visually is **unverified secondhand**. — [Animator Island](https://www.animatorisland.com/?p=4041)
- Anime precedent for slow-up, fast-down: Natsume's *Gurren Lagann* rise slows and the crash speeds up (Section 1). Nakamura justified an exaggerated high jump with "Jupiter's gravity", an acknowledgement that big jumps are a stylized liberty. — [Wave Motion Cannon, Framerate modulation](https://wavemotioncannon.com/2016/12/31/an-introduction-to-framerate-modulation/); [Nakamura interview](https://wavemotioncannon.com/2016/11/02/interview-yutaka-nakamura-web-anime-style-7192003-part-2/)

### Inferences (procedural translation, with worked numbers)
- **Why real gravity floats.** At g = 9.81 m/s², a 6 m-high leap takes t_up = √(2·6/9.81) ≈ 1.11 s, so about 2.2 s of airtime. On screen that is a long, slow parabola with nothing happening: the "two people floating" look. Even a 1 m real hop has t_up ≈ 0.45 s.
- **Recommended landmark-leap profile** (6 m apex above take-off, 20 m gap):
  - `t_up = 0.35 s` gives v₀ = 2·6/0.35 ≈ **34.3 m/s** and g_up = 12/0.35² ≈ **98 m/s² (~10 g)**.
  - Optional apex hang of **0.06–0.12 s**: apply **0.3–0.5×** gravity while |v_y| < ~3 m/s (Celeste-style). Or literally hold the pose on threes for 2–3 pose ticks while root motion barely moves.
  - `t_down = 0.20–0.25 s` gives g_down = 12/0.22² ≈ **248 m/s²**, a fall/rise ratio of about 2.5×. SMB uses 3.2–3.6×, GDQuest's example about 2.6×.
  - Horizontal: v_x = 20 / (0.35 + 0.22) ≈ **35 m/s**, ideally with ease-out toward the landing point so the last metres decelerate into the compression.
  - Total airborne time is about **0.6–0.7 s** for a big leap. Short rooftop hops (1–2 m high, 4–6 m gap) take about 0.35–0.45 s.
- **Phase table** (render at 60 fps; poses stepped at 12 Hz unless noted):
  1. **Anticipation/crouch**: 0.10–0.20 s (6–12 render frames). Hips drop 25–40% of leg length via IK foot-lock, spine pitches forward, sword arm draws back, pose held on threes. Bigger leap, longer crouch.
  2. **Push-off**: 1–2 pose ticks (0.04–0.08 s). Full leg extension and toe contact last. Spawn a dust ring plus small debris cubes at the foot and a brief ground decal crack. Snap the camera with a small upward kick.
  3. **Ascent**: 0.25–0.4 s. Stretched pose (body elongated along velocity, ~1.05–1.1 scale on that axis), trailing limbs and coat on a lag spring. Speed lines.
  4. **Apex**: 0.06–0.15 s hold. Tuck or "strike pose" (sword raised, knees up). This is where a mid-air exchange or impact frame goes. Pose held on threes.
  5. **Descent**: 0.18–0.25 s. Fast, legs extending toward the target. IK reaches feet to the predicted landing surface during the last ~0.1 s, so feet arrive before the hips.
  6. **Landing compression**: 0.05–0.1 s. Hips drop beyond the crouch depth (~40–50% leg length), one hand or the sword tip may touch down, 2–4 frames of hit-stop, camera shake (vertical bias), dust ring, debris cubes, surface decal.
  7. **Recovery**: 0.15–0.3 s ease-out on twos back to stance. Can be cancelled into a run or attack for flow.
- **Snappy versus floaty checklist:**
  - Snappy: high gravity, fall gravity at least 2× rise gravity, short or zero time near zero velocity except a deliberate held apex pose, stepped poses, contact events at both ends, and a contact shadow that shrinks and grows with height.
  - Floaty: symmetric parabola, real gravity, linear interpolation, camera locked on the bodies, no compression.

### Gaps
- The Pittman talk's actual slides (e.g., his specific example values and the exact post-apex gravity multiplier) were not retrieved. Values above come from secondary summaries.
- No retrieved source gives canonical anime frame counts for each jump phase. The phase timings above are inference from the game-feel numbers plus general animation principles.
- The Hollow Knight jump analyses were not found or retrieved. No figures for Hollow Knight.
- Celeste's exact apex half-gravity threshold and coyote/buffer durations are not published in the primary article.
- The Williams book text on jump timing was not retrieved.

---

## 3. Surface contact: wall kicks, wall runs, ledge grabs, landing on poles or ridges, roof slides, skids with sparks or dust, kicking off an opponent's blade

### Takeaway
Sources documenting anime-specific surface-contact craft are thin. The transferable, documented principles:
- Contact must be an **event**, with a held pose, debris or dust, and a reaction (Nakamura: "the light reactions are most important").
- Games are **generous about contact windows** (Celeste wall-jumps from 2 px, or a quarter tile, away).
- **Never kill momentum** at contact (Insomniac).

Every touch of a surface during a leap should look like it *redirects* force. That is what makes multiple contacts read as grounded traversal rather than flight.

### Cited Findings
- Celeste allows a wall jump from **2 pixels away** from the wall, "a quarter of a tile" at 320×180. A super wall-jump while dashing upward works from about **5 px** ("more than half a tile"; author hedges "I think"). Jumping off a moving platform adds its momentum, and a boosted jump is kept "a few frames" after the platform stops. Jump corner correction "wiggle[s] you to the side" around a corner you bonk. — [Maddy Thorson, Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html)
- Insomniac's Spider-Man: the creative director said "We didn't want to stop the players' momentum at all". Ryan Smith said the camera is key to showing the "impact of your change in momentum", and the camera looks down when you dive. — [GamesRadar](https://www.gamesradar.com/it-took-three-whole-years-for-insomniac-to-get-marvels-spider-mans-web-swinging-just-right); [NME feature](https://www.nme.com/en_asia/features/gaming-features/how-the-web-swinging-of-marvels-spider-man-makes-its-superhero-fantasy-soar-3287547)
- Nakamura on reactions: "The light reactions are most important ones". To keep the curvature and movement of reactions, "you must consider what drawing to put in". — [Nakamura interview pt 2](https://wavemotioncannon.com/2016/11/02/interview-yutaka-nakamura-web-anime-style-7192003-part-2/)
- Itano's destruction staging plays in steps: internal detonation, then shockwave collapse, with flickering light. — [Wikipedia: Itano](https://en.wikipedia.org/wiki/Ichir%C5%8D_Itano)

### Inferences (procedural recipes)
- **Wall kick.**
  - Approach at speed, then plant the foot via IK on a raycast hit point. Contact pose held 2–3 pose ticks (0.1–0.17 s): knee bent ~90°, body nearly horizontal, sword arm out for balance.
  - Spawn a cracked decal plus 4–8 debris cubes plus a dust puff along the wall normal.
  - Relaunch along the reflected vector (wall normal plus upward component) with v ≈ 0.8–1.0× incoming speed.
  - 2–3 frames of micro hit-stop on the plant sell force.
  - Allow a generous snap distance (Celeste analogue: ~0.3–0.5 m) so planned choreography never visibly misses.
- **Wall run.**
  - Gravity ≈ 0.2–0.3× for at most 0.4–0.6 s, then fall-off or kick.
  - Alternate IK foot plants on the wall every ~0.12 s (twos), with a dust puff on each plant and the body tilted ~60–75° toward the wall.
  - Each footfall is a contact event. Without them it reads as hovering.
- **Ledge or ridge grab.**
  - Hand IK to the ledge edge, then arrest velocity over 2 frames rather than 1, plus a slight overshoot downward (~0.1–0.2 m) and spring back. That overshoot sells mass.
  - Pull up over 0.2–0.3 s on twos.
- **Landing on poles, roof ridges, lanterns.**
  - Both feet IK to a single point, knees deep, arms out.
  - Add a wobble on the pole or object (rotational spring, 2–3 oscillations over 0.4 s) and a shower of tile chips or dust.
  - The *object* reacting is what proves weight.
- **Roof slide.**
  - Body leaning back ~30°, one hand and the trailing foot dragging. Continuous dust/tile-chip emitter at the contact points (rate proportional to speed).
  - Speed builds along the slope (g·sinθ, stylized ×2–3).
  - Tiles kicked loose tumble off the edge (Itano-style secondary destruction).
- **Skid-stop.**
  - Decelerate at ~30–60 m/s² over 0.2–0.4 s.
  - Feet IK-locked to the ground, sliding, with a dust spray cone opposite to travel. Sparks if the sword tip drags on stone (additive streak particles with 0.15–0.3 s life, gravity-affected).
  - Low camera with lateral shake decaying over the skid.
  - End on a held pose (hold 0.2–0.3 s) before the next action.
- **Kicking off an opponent's blade.**
  - Treat it as a clash: both fighters get hit-stop (4–8 frames), a spark burst at the blade contact, and an impact-frame flash.
  - The kicker relaunches upward or backward. The defender's arms recoil (Nakamura's "light reaction") and their feet skid back 0.3–0.6 m with dust.
  - The reaction on the *other* fighter is what proves the force was real.

### Gaps
- No documented frame counts found for anime wall-kick or ledge-grab cuts.
- No specific Sakuga Blog breakdown of rooftop or wall traversal was retrieved.
- Insomniac's GDC traversal talks ("Concrete Jungle Gym" 2019; "Higher, Faster, Farther" 2024) were not retrievable. Only press summaries.
- No Sucker Punch (*Ghost of Tsushima* / *inFAMOUS*) traversal talk was found in this session.

---

## 4. Chase grammar: parallel running, rooftop hopping (many short hops), crossing over, exchanging blows while running

### Takeaway
Documented sources here are sparse. Itano's camera grammar (subjective tracking camera, frame-in and frame-out, lens shift with distance, "the chase was more interesting than the attack") is the best-sourced model. For a pair of fighters, the inference is to choreograph the chase as **a rhythm of short ground-contact beats and crossing lines** rather than one long arc. Every contact is an opportunity for dust, sound and a pose hold, and every crossing is an opportunity to cut.

### Cited Findings
- Itano: "The chase was more interesting than the attack." His camera "follows the subject subjectively, using frame-in and frame-out to add realism". With 3DCG, the camera's slight lag becomes especially noticeable. Missile paths are erratic and spiralling, and "The orbit is the most important". — [Wikipedia: Itano](https://en.wikipedia.org/wiki/Ichir%C5%8D_Itano)
- Nakamura: gradual pans that "pull the camera along" create movement. Over-fast camera pulls made running characters "seem to fly". — [Nakamura interview pt 2](https://wavemotioncannon.com/2016/11/02/interview-yutaka-nakamura-web-anime-style-7192003-part-2/)
- Flow animators (Matsumoto et al.) approached fights with "increasing attention to choreography" (snippet). — [animetudes (snippet)](https://animetudes.com/2021/07/09/the-kanada-style-now/)
- Insomniac kept momentum unbroken and used the camera to show momentum changes (Section 3). — [GamesRadar](https://www.gamesradar.com/it-took-three-whole-years-for-insomniac-to-get-marvels-spider-mans-web-swinging-just-right)

### Inferences (procedural chase grammar)
- **Many short hops instead of one leap.** Break a landmark-to-landmark transition into 3–6 hops of 0.35–0.45 s airtime, each with a 0.08–0.15 s ground contact (crouch-land-push compressed into one pose tick or two). Contacts every ~0.5 s give a running rhythm. Insert one big leap (0.6–0.7 s) only as the climax beat.
- **Parallel running.** Offset the fighters laterally by 3–6 m, with hop phases offset by about half a cycle so one is always grounded. Track the camera from the side with a slight lag (Itano). Sword hands swap sides every few hops.
- **Crossing over.** Their paths intersect, one hopping over the other at apex (an apex hold is a natural place for a slash and blade clash, with hit-stop, sparks and an impact frame). Cut on the cross or have one fighter frame-out.
- **Exchanging blows while running.**
  - Use the clash as a speed-modulating event: both freeze for 4–8 frames of hit-stop, then both get knocked apart laterally with a skid (dust).
  - Resume running at full speed. Don't decelerate for the attack; the Insomniac rule is to keep momentum.
- **Camera schedule.**
  - Alternate (a) a side tracking shot with lag, (b) a low ground-locked shot where fighters pass overhead (the ground stays still, which proves height and speed), (c) an Itano angle-animation shot where a fighter approaches from telephoto distance to a fisheye close-up, and (d) a top-down or high shot showing the landmark route.
  - 1–2.5 s per shot.

### Gaps
- No Sakuga Blog or video-essay breakdown of a specific rooftop chase was retrieved (e.g., *Naruto* rooftop travel, *Demon Slayer* rooftop sequences, *Sword of the Stranger*).
- No documented shot-length statistics for anime chases.

---

## 5. Game-feel research: hit-stop, camera shake, landing squash, coyote time, jump curves (Pittman, Celeste, Hollow Knight, Insomniac/Sucker Punch)

### Takeaway
Hit-stop freezes **both** attacker and victim, and its length scales with hit strength. Smash Ultimate uses `frames = d·0.65 + 6` (d = damage %), capped at 30 frames. Vlambeer's "Art of Screenshake" demonstrated about 30 small layered tweaks (hit pause, camera kick, knockback, permanence of debris, screen shake) that together transform feel. Celeste documents coyote time, jump buffering and half-gravity apex as forgiving "cheats".

### Cited Findings
- **Sakurai on hitstop:** "When you strike the opponent, both parties momentarily freeze, emphasizing the power of impact." Damage vibrations during hitstop are "difficult to implement in 3D fighting games". It is sometimes paired with screen shake for powerful moves. — [Source Gaming translation of Sakurai's Famitsu column vol. 490](https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/)
- **Smash hitlag formulas:**

  | Game | Hitlag (frames, d = damage) | Cap |
  |---|---|---|
  | Melee | ⌊d/3 + 3⌋ | 20 |
  | Brawl / Smash 4 | ⌊(d·0.3846 + 5)·h⌋ | 30 |
  | Ultimate | ⌊(d·0.65 + 6)·h·e·s⌋ | 30 |

  - Electric multiplier e = 1.5×; crouch-cancel 0.67×.
  - Example: a 15% hit gives 8 frames (Melee), 10 (Brawl/Smash 4) or 15 (Ultimate).
  - The attacker freezes on the frame the hit lands. The victim freezes on the first frame of the flinch animation **and shakes**.
  - Hitboxes remain active during hitlag.
  — [SmashWiki: Hitlag](https://www.ssbwiki.com/Hitlag)
- Hitstop length correlates with attack power across fighting games and varies per move (e.g., Sol's 5P vs. Fafnir in Guilty Gear). — [SmashWiki](https://www.ssbwiki.com/Hitlag); [Fantasy Strike glossary](https://wiki.gbl.gg/w/Fantasy_Strike/Glossary)
- **Vlambeer, "The Art of Screenshake" (Jan Willem Nijman):** demonstrates ~30 minor tweaks to a dull shooter. Partial list from a recreation's devlog:
  - animation
  - lower time-to-kill
  - faster fire rate
  - muzzle flash
  - impact effects
  - enemy knockback
  - **permanence** (debris stays)
  - camera lerp
  - screenshake
  - player knockback
  - **hit pause**
  - weapon recoil
  - random explosions
  - (from a separate slide deck) bigger explosions, more permanence (smoke), slow motion

  Camera kick means kicking the camera back a set number of pixels from the aim point, on top of shake. — [Recreation devlog breakdown](https://dkliao.itch.io/the-art-of-screenshake-recreation/devlog/451576/quick-breakdown-of-all-the-effects); [Game Developer](https://gamedeveloper.com/design/vlambeer-co-founder-shares-advice-on-building-better-action-games)
- **Celeste forgiveness mechanics:** coyote time (jump "for a short time after leaving a ledge"), jump buffering (press jump "a short time before landing" and jump on the exact landing frame), half-gravity apex, corner correction, and the wall-jump windows above. No durations are published. — [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html)
- **Jump curves:** Pittman/GDQuest formulas and SMB asymmetric gravity (Section 2). — [GDQuest](https://www.gdquest.com/library/kinematic_jump_formulas); [SMBpedia](https://simplistic6502.github.io/smb1_tll/smbpedia_movement.html)
- **Insomniac:** GDC 2019 "Concrete Jungle Gym" (Doug Sheahan) and GDC 2024 "Higher, Faster, Farther" covered swing design and a camera built to increase the sense of speed and power. Only press summaries were retrieved. — [GDC news](https://gdconf.com/news/swing-gdc-and-learn-about-making-marvels-spider-man-top-bottom); [GDC 2024 session page](https://schedule.gdconf.com/session/higher-faster-farther-evolving-traversal-in-marvels-spider-man-2/900249)

### Inferences (procedural values for the Three.js fighters)
- **Hit-stop scale** (60 fps), loosely derived from Smash Ultimate's d·0.65+6 range:

  | Event | Hit-stop |
  |---|---|
  | Light parry tap | 3–4 frames |
  | Normal slash hit | 6–9 frames |
  | Heavy hit or blade clash | 10–15 frames |
  | Finisher | 18–24 frames, plus an impact frame |
  | Landing from a big leap | 2–4 frames |
  | Wall-kick plant | 2–3 frames |

  - Freeze both fighters' pose clocks and root motion, but keep particles and the camera shake running. The world keeps "ringing" while bodies freeze.
  - Shake the victim mesh ±2–4 cm at 30 Hz during the freeze (Sakurai/Smash).
- **Camera shake.** Trauma-based: shake = trauma² × noise, decaying ~1.5–2.5 trauma/s.
  - Vertical bias for landings, directional along hit vector for strikes.
  - Add a camera "kick" of 5–15 cm (or 1–3° pitch) toward the impact direction, recovering over 0.15 s.
- **Landing squash.** Stretch along velocity on descent (scale ~1.05–1.1 along velocity, 0.95 across). On contact, squash (~0.9 vertical, 1.05 horizontal) for 2–4 frames, then spring back with a damped overshoot. Combine with IK hip-drop for a code-built rig.
- **Coyote and buffer for AI choreography.** Even for scripted fighters, a "landing snap" window helps: if a fighter's predicted landing is within ~0.3–0.5 m of the landmark surface, snap the IK foot target and finish the arc onto it. Choreography then never visibly misses or hovers. Player-facing coyote/buffer windows of ~0.1 s are a common convention, but not documented in the retrieved primary sources.
- **Permanence.** Leave decals (cracks, scorch, skid marks) and settled debris on landmarks for the rest of the fight. Vlambeer's "permanence" step argues this compounds the impression of force.

### Gaps
- Hollow Knight jump analyses: not found or retrieved.
- Sucker Punch traversal talks: not found.
- Kyle Pittman's own slide numbers: not retrieved.
- "Juice it or lose it" (Martin Jonasson and Petri Purho, GDC Europe 2012) was not retrieved in this session.
- Celeste's coyote and buffer frame counts are not in the primary article. Commonly cited numbers (e.g., ~0.1 s) were not verified.
- The Vlambeer talk's full 30-item list was not retrieved; the partial list comes from a third-party recreation.

---

## 6. Practical rules of thumb: airtime (seconds), apex hang, and how often to cut during a jump

### Takeaway
No retrieved source gives a canonical anime "airtime" rule. Combining documented game values (rise of about 0.4 s, fall of about 0.25 s; fall gravity about 2.5–3.6× rise gravity; apex half-gravity) with anime framerate modulation (slow up, fast down, long hold on impact) gives these working targets:
- **0.35–0.45 s** airtime per short hop
- **0.6–0.8 s** for a hero leap
- **0.06–0.15 s** apex hang
- **a cut or a contact event at least every ~0.5–0.7 s**, so no uninterrupted parabola lasts longer than one beat

### Cited Findings
- GDQuest example: time to peak 0.4 s, time to descent 0.25 s (total 0.65 s). — [GDQuest](https://www.gdquest.com/library/kinematic_jump_formulas)
- SMB fall gravity is 3.2–3.6× rise gravity, and release or apex switches immediately to fall gravity. — [SMBpedia](https://simplistic6502.github.io/smb1_tll/smbpedia_movement.html)
- Celeste half gravity at apex for readability and control. — [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html)
- Anime uses slower drawing rates for ascent and distance and faster rates for the crash (Natsume, *Gurren Lagann*), with lengthened holds on impact (*One-Punch Man*). — [Wave Motion Cannon](https://wavemotioncannon.com/2016/12/31/an-introduction-to-framerate-modulation/)
- Nakamura: over-fast camera pulls turn running into flying. The camera should be "attached to the movements". — [Nakamura interview](https://wavemotioncannon.com/2016/11/02/interview-yutaka-nakamura-web-anime-style-7192003-part-2/)
- ufotable finds the "most intense dynamic shot" by placing multiple 3D cameras and testing (Terao, via interview snippet). — [Popverse](https://www.thepopverse.com/movies-demon-slayer-kimetsu-no-yaiba-yuichi-terao-interview-making-the-infinity-castle-feel-infinite)
- Itano: frame-in and frame-out, lens shift with distance, slight camera lag. — [Wikipedia: Itano](https://en.wikipedia.org/wiki/Ichir%C5%8D_Itano)

### Inferences (rules of thumb for the landmark-leap problem)
1. **Gravity.** Never use 9.81 m/s². Derive gravity from height and time: g_up = 2h/t_up², with t_up of 0.25–0.4 s. Then g_down at 2.5–3.5× g_up. Expect g_up of about 60–120 m/s² for 2–6 m leaps.
2. **Airtime.** Short hop 0.35–0.45 s. Big landmark leap 0.6–0.8 s including apex hang. Anything longer than ~1 s should be broken by a mid-air event (clash, wall kick, pole touch) or a cut.
3. **Apex hang.** 0.06–0.15 s, made from *pose* (held strike or tuck pose on threes) and reduced gravity (0.3–0.5×). Don't hang without a pose change; a hang with no pose reads as floating.
4. **Cutting.** For a big leap, use 2–3 shots:
   - (a) Take-off from a low, ground-locked camera: crouch, dust, debris, fighter exits frame-top.
   - (b) Apex in a wide or Itano telephoto-to-wide shot showing both fighters and the gap, possibly with the clash and impact frame.
   - (c) Landing from a new angle with the camera already waiting at the destination (the fighter frames in, compression, shake, debris).
   Skipping part of the ascent between shots (a jump cut on the arc) is acceptable and anime-typical, and it removes most floating time. Each shot runs 0.25–0.8 s.
5. **Bookend every arc with contact.** Every airborne segment starts with a push-off event and ends with a landing event: pose hold, particles, hit-stop of 2–4 frames, shake, decal, contact-shadow snap.
6. **Contact shadow and lighting.** A shadow blob under each fighter that shrinks and fades with height, with no shadow-less frames. Rim light matching the environment key (Terao: correct lighting makes characters blend "no matter what style").
7. **Two-fighter offset.** Never have both fighters at apex at the same time with the same arc. Offset take-off by 0.1–0.25 s and vary arc heights (one low and fast, one high and slower), so they read as two bodies with mass, not one rigid formation.
8. **Stepped poses.** Body poses on twos or threes (12/8 Hz), root and camera on ones. Smears and speed lines bridge the fastest transitions.
9. **Camera lag versus lock.** Camera lag of 0.08–0.15 s while tracking. Lock or slow the camera at take-off and landing. Never pull the camera faster than the fighters' ground-contact rhythm.

### Gaps
- No primary source found that states anime airtime norms in seconds or a cut frequency for jumps. Rules 2–4 are inference.
- No shot-length analysis of jump cuts in specific sakuga scenes (e.g., *Sword of the Stranger* climax, *Demon Slayer* rooftop leaps) was retrieved. Frame-stepping those on Sakugabooru (tags: `yutaka_nakamura`, `smears`, `debris`, `impact_frames`) would confirm or refine these numbers.
