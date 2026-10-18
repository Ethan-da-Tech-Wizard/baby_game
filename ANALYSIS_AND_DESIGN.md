# Baby Game: Chromebook Toddler Sensory Playground (Analysis, Design & Mapping Document)

## 1. System Analysis & Product Vision

### 1.1 Persona & Target User
- **Target User**: 2-year-old toddler exploring a dedicated Chrome OS Chromebook.
- **Physical Interaction Profile**:
  - High-frequency "key smashing" (multiple keys pressed simultaneously or held down).
  - Rapid, non-sequential key mashing.
  - Occasional touchscreen taps and trackpad smacks.
  - Zero tolerance for accidental navigation away from the game (e.g., Backspace going back in history, Esc exiting without confirmation, accidental link clicks).
- **Sensory & Cognitive Goals**:
  - Immediate, 100% responsive audiovisual feedback for every single physical key on the Chromebook.
  - Drastic, distinct visual changes across the entire viewport.
  - Toddler-approved audio: iconic "Baby Shark" procedural melody toggle, 10+ cheerful animal sounds, comical sound effects (boing, lasers, pops, drums), and speech synthesis announcing letters/words.
  - Age-appropriate anime backgrounds: high-energy heroic running and fighting loops (Naruto dash, Luffy gear charge, DBZ Super Saiyan aura charging) with **strictly zero nudity, fan service, or gore**.
  - Dancing Pokémon-style pocket-monster mascots (Pikachu electric dance, Charmander flame wiggle, Squirtle bubble hop, Gengar groove) with toggleable intensity.
  - Visual effect intensity cycle: `Low -> Medium -> Mega Intense -> Off -> Repeat`.

### 1.2 Deployment & Chromebook Portability Requirements
- **One-Click Experience**: Public GitHub repository with automated GitHub Pages hosting.
- **Zero-Dependency Offline Support**: Fully client-side web application (HTML5 Canvas + WebGL + Web Audio API + SpeechSynthesis + Service Worker).
- Works straight in Chrome browser in Fullscreen mode (`F4` or Fullscreen key on Chromebook).
- No server or login needed. Works out of the box on Chrome OS, Arch Linux, macOS, or Windows.

---

## 2. Chromebook Keyboard Architecture & Comprehensive Key Matrix

Standard Chromebook keyboards feature an 80-key US layout with dedicated Chrome OS top-row function keys and the Search/Everything key (replacing Caps Lock).

Every key is mapped to:
1. **Screen Drastic Visual Effect**: Fullscreen visual transformation / particle explosion / canvas filter / shader-like animation.
2. **Audio Trigger**: Procedural synth sound, animal sound, speech, or Baby Shark song toggle.
3. **Toggle / Intensity State**: Increments or toggles active ambient layers.

### Complete Keymap Specification Table

| Key Code | Chrome OS Physical Key | Drastic Fullscreen Visual Effect | Sound / Vocal Effect | Persistent / Toggle Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Escape** | `Esc` | Cosmic Reset / Golden Spiral Galaxy Vortex | Chime Fanfare | Resets active layers to clean slate |
| **BrowserBack** | `← (Back)` | Retro CRT Glitch & Rewind Time Warp | Rewind Tape Zap | Toggles CRT Scanlines / Glitch intensity |
| **BrowserForward** | `→ (Forward)` | Hyperdrive Warp Speed Stars & Light Streaks | Warp Drive Whoosh | Toggles Starfield Hyperdrive speed |
| **BrowserRefresh** | `⟳ (Reload)` | Geyser Splashdown / Water Wave Tsunami | Water Bubble Splash | Cycles Water World / Wave intensity |
| **F4 / Fullscreen** | `[ ] (Fullscreen)` | Fullscreen Toggle + Diamond Sparkle Blast | Magical Fairy Wand | Toggles Browser Fullscreen & Sparkles |
| **F5 / Overview** | `[ll] (Window Switch)` | Split-Screen Multiverse Kaleidoscope | Sci-Fi Dimension Warp | Toggles 4-way Kaleidoscope Mirror |
| **BrightnessDown** | `☼- (Dim)` | Eclipse / Night Sky Fireflies & Lunar Glow | Owl Hoot (`Hoo Hoo!`) | Lowers ambient lighting / Deep space mode |
| **BrightnessUp** | `☼+ (Bright)` | Solar Flare / Supernova Golden Light Blast | Rooster Morning Crow (`Cock-a-doodle-doo!`) | Boosts ambient brightness / Neon overdrive |
| **AudioVolumeMute** | `🔇 (Mute)` | Silent Floating Soap Bubbles (pop on click) | Gentle bubble "Plink" | Toggles global audio mute / unmute |
| **AudioVolumeDown** | `🔉 (Vol -)` | Deep Sea Submarine Sonar Rings | Soft Deep Submarine Ping | Decreases global master volume |
| **AudioVolumeUp** | `🔊 (Vol +)` | Neon Disco Equalizer Laser Bars | Loud Party Horn Fanfare | Increases global master volume |
| **Backquote (`)** | `` ` / ~ `` | Matrix Neon Green Digital Rain Cascade | Retro 8-Bit Cyber Zap | Toggles Matrix Rain Layer |
| **Digit1** | `1` | Giant Bouncing Number '1' + 1 Dancing Dino | Voice: *"One! Uno! 1!"* + Dino Roar | Spawns persistent giant bouncing 1 |
| **Digit2** | `2` | Giant Bouncing Number '2' + 2 Jumping Puppies | Voice: *"Two! Doggy Bark!"* + `Woof Woof!` | Spawns puppy troupe |
| **Digit3** | `3` | Giant Bouncing Number '3' + 3 Fluttering Butterflies | Voice: *"Three! Cat Meow!"* + `Meow Meow!` | Spawns butterfly swarm |
| **Digit4** | `4` | Giant Bouncing Number '4' + 4 Quacking Ducklings | Voice: *"Four! Duck Quack!"* + `Quack Quack!` | Spawns duckling parade |
| **Digit5** | `5` | Giant Bouncing Number '5' + 5 Roaring Lions | Voice: *"Five! Lion Roar!"* + `Roooaar!` | Spawns lion pride |
| **Digit6** | `6` | Giant Bouncing Number '6' + 6 Ribbit Frogs | Voice: *"Six! Frog Ribbit!"* + `Ribbit Ribbit!` | Spawns lilypad frogs |
| **Digit7** | `7` | Giant Bouncing Number '7' + 7 Mooing Cows | Voice: *"Seven! Cow Moo!"* + `Moooooo!` | Spawns pasture cows |
| **Digit8** | `8` | Giant Bouncing Number '8' + 8 Baaing Sheep | Voice: *"Eight! Sheep Baa!"* + `Baaaa!` | Spawns fluffy sheep |
| **Digit9** | `9` | Giant Bouncing Number '9' + 9 Trumpeting Elephants | Voice: *"Nine! Elephant Trumpet!"* + `Pawoo!` | Spawns elephant stomp |
| **Digit0** | `0` | Giant Bouncing Number '0' + 10 Chirping Songbirds | Voice: *"Zero / Ten! Birds Chirp!"* + `Tweet!` | Spawns fluttering songbirds |
| **Minus (-)** | `- / _` | Giant Laser Beam Slices Screen in Half | Heavy Sci-Fi Laser Cannon Blast | Toggles horizontal laser grid |
| **Equal (=)** | `= / +` | Massive Candy & Donut Rainfall | Sweet Jingle Bells Chime | Toggles food/candy rain intensity |
| **Backspace** | `⌫ Backspace` | Screen Muncher Monster Chomp Animation | Cartoon "Nom Nom Nom" Chomp | Eats random floating particles |
| **Tab** | `Tab` | Background Anime Reel Switch (Naruto/Luffy/DBZ) | Power-up Saiyan Whoosh | Cycles next Anime Background Theme |
| **KeyQ** | `Q` | Queen Crown Fireworks & Royal Sparkles | Royal Trumpet Fanfare | Spawns glitter crown |
| **KeyW** | `W` | Wild Wind Tornado & Spinning Autumn Leaves | Gusty Wind Howl | Toggles Windstorm intensity |
| **KeyE** | `E` | Electric Thunderstorm & Forked Lightning Flash | Thunder Clap & Electric Zap | Toggles Lightning Storm frequency |
| **KeyR** | `R` | Double Rainbow Arch + Shooting Stars | Harp Glissando Arpeggio | Toggles Persistent Sky Rainbow |
| **KeyT** | `T` | **BABY SHARK SONG TOGGLE (The Anthem!)** | **Full Baby Shark Synthesized Melody** | **Toggles Baby Shark music On/Off** |
| **KeyY** | `Y` | Yoyo & Spinning Colorful Pinwheels | Whistling Spin Boing | Toggles spinning pinwheel vortex |
| **KeyU** | `U` | UFO Alien Abduction Tractor Beam | Retro Alien Theremin Warp | Spawns beaming UFO |
| **KeyI** | `I` | Ice Freeze / Frost Crystals Cover Screen | Ice Crack & Crystal Chime | Toggles frozen tundra screen filter |
| **KeyO** | `O` | Ocean Giant Waves & Floating Jellyfish | Soothing Ocean Surf Waves | Toggles underwater ambient mode |
| **KeyP** | `P` | **DANCING POKÉMON CREW (Pikachu, Charmander, Squirtle)** | High-Energy Chiptune Dance Beat | Cycles Pokémon Dance Party (1→4→Off) |
| **BracketLeft ([)**| `[` | Left-Side Hydraulic Screen Slam & Shunt | Heavy Metal Thud | Slams screen leftward |
| **BracketRight (])**| `]` | Right-Side Hydraulic Screen Slam & Shunt | Heavy Metal Clang | Slams screen rightward |
| **Backslash (\\)**| `\` | Diagonal Hyperspace Rainbow Warp Tunnel | Hyperspace Doppler Warp | Toggles 3D warp tunnel |
| **CapsLock / Search**| `🔍 Search` | Giant Magnifying Glass Zoom & Disco Strobe | Pop Funky Synth Horn | Toggles Disco Strobe / Magnifier |
| **KeyA** | `A` | Giant Bouncing 'A' + Flying Red Apples | Voice: *"A! Apple! Amazing!"* + Pop | Spawns letter A + apples |
| **KeyS** | `S` | Super Saiyan Gold Energy Flame Aura | DBZ Ki Aura Hum & Super Zap | Toggles Super Saiyan Aura on screen |
| **KeyD** | `D` | Drum Kit Shockwave Burst (Bass/Snare/Cymbal) | Punchy Drum Solo Blast | Triggers progressive drum break |
| **KeyF** | `F` | Fireworks Finale (Multi-Color Rocket Salvo) | Booming Firework Explosions | Spawns 12 fireworks rockets |
| **KeyG** | `G` | Galaxy Nebula Spiral with 500 Sparkling Stars | Celestial Ambient Chime | Toggles glowing spiral galaxy |
| **KeyH** | `H` | Floating Hearts Shower & Valentine Sparkles | Romantic Music Box Chime | Toggles gentle heart rain |
| **KeyJ** | `J` | Juggling Clown Balls & Confetti Streamers | Cartoon Slide Whistle (`Weee-oop!`) | Spawns bouncing juggling balls |
| **KeyK** | `K` | Karate Chop Screen Split & Energy Slash | Dramatic Anime Martial Arts `Kiai!` | Slashes screen in half with energy |
| **KeyL** | `L` | Lava Volcano Eruption & Fire Sparks | Volcano Rumble & Crackle | Toggles volcanic flame spark layer |
| **Semicolon (;)** | `; / :` | Bouncing Neon Smiley Faces & Emoji Stampede | Giggling Baby Laugh | Spawns 15 happy floating emojis |
| **Quote (')** | `' / "` | Twinkling Constellations & Crescent Moon | Gentle Lullaby Star Chime | Toggles night sky constellation |
| **Enter** | `Enter ↵` | MEGA EXPLOSION + Screen Shake Earthquake | Massive Thunderous BOOM! | Triggers maximum intensity screen shake |
| **ShiftLeft** | `Shift (Left)` | Left Laser Cannon Sweep & Disco Beams | Sci-Fi Pulse Sweep | Toggles rotating left lasers |
| **KeyZ** | `Z` | Sleepy ZZZs + Floating Pajama Clouds | Sweet Snoring & Music Box | Toggles lullaby cloud mode |
| **KeyX** | `X` | Kaleidoscope Rainbow Kaleidoscope Hexagon | Crystal Bells Accord | Toggles 6-fold Kaleidoscope |
| **KeyC** | `C` | Confetti Cannon Blast (300 Fluttering Ribbons) | Party Horn `Toot Toot!` | Bursts high-density confetti |
| **KeyV** | `V` | Video Game Level Up Banner & Golden Trophies | 8-Bit Victory Fanfare | Spawns arcade Level Up burst |
| **KeyB** | `B` | Bouncy Beach Balls with Physics Collisions | Rubber Spring "Boing Boing" | Adds 5 physics bouncing balls |
| **KeyN** | `N` | Naruto Ninja Shadow Clones Run Across Screen | Ninja Wind Shuriken Whoosh | Clones sprint across screen |
| **KeyM** | `M` | Musical Notes Symphony Floating Everywhere | Piano Glissando Run | Emits musical notes trail |
| **Comma (,)** | `, / <` | Swirling Fish Aquarium School Swarm | Water Droplets Bubbling | Spawns swimming clownfish & tangs |
| **Period (.)** | `. / >` | Cosmic Meteor Shower & Shooting Comet Trails | Whooshing Meteor Streaks | Spawns shooting comet barrage |
| **Slash (/)** | `/ / ?` | Mystery Surprise Box Opening (Gift Burst) | Surprise Spring Jack-in-the-Box | Opens giant animated mystery box |
| **ShiftRight** | `Shift (Right)`| Right Laser Cannon Sweep & Neon Strobe | Sci-Fi Beam Pulse | Toggles rotating right lasers |
| **ControlLeft** | `Ctrl (Left)` | Gravity Reversal (Everything Floats Upward!) | Reverse Gravity Anti-Grav Swoop | Inverts screen particle gravity |
| **AltLeft** | `Alt (Left)` | Psychedelic Color Inversion / Thermo Vision | Electric Static Pulse | Inverts all screen colors |
| **Space** | `Spacebar` | GIANT CENTER STAMPEDE (All Creatures Dance) | Mega Bass Drop + Chiptune Party | Mega Celebration Event |
| **AltRight** | `Alt (Right)` | Mirror Mode (Flips Viewport Horizontally) | Mirror Swish Glissando | Flips screen left-to-right |
| **ControlRight** | `Ctrl (Right)`| Slow-Motion Bullet Time & Golden Trails | Deep Pitch-shifted Slowdown | Slows all animations to 0.3x |
| **ArrowLeft** | `← (Left Arrow)`| Gale Force Wind Blows Everything Left | Gusty Wind Left | Pushes particles leftward |
| **ArrowRight**| `→ (Right Arrow)`| Gale Force Wind Blows Everything Right | Gusty Wind Right | Pushes particles rightward |
| **ArrowUp** | `↑ (Up Arrow)` | Rocket Launch into Outer Space | Rocket Booster Rumble | Blasts spaceship toward top |
| **ArrowDown** | `↓ (Down Arrow)` | Heavy Rain & Puddle Splash Storm | Rainstorm Downpour Audio | Toggles intense thunderstorm rain |

---

## 3. Audio Engineering Specification

### 3.1 Procedural Web Audio Engine (100% Offline & Reliable)
To guarantee that the game works instantly on a Chromebook anywhere (even in an airplane, car, or without Wi-Fi) without missing asset 404s or copyright takedowns:
1. **The Baby Shark Anthem**:
   - Synthesized using marimba-like pitched pulse oscillators and bright sub-bass.
   - Accurately plays the iconic *Baby Shark Doo Doo Doo Doo Doo Doo* progression in D major:
     `D4 - E4 - G4 - G4 - G4 - G4 - G4 - G4 (Baby shark, doo doo doo doo doo doo!)`
     `D4 - E4 - G4 - G4 - G4 - G4 - G4 - G4 (Baby shark, doo doo doo doo doo doo!)`
     `D4 - E4 - G4 - G4 - G4 - G4 - G4 - G4 (Baby shark, doo doo doo doo doo doo!)`
     `G4 - G4 - F#4 (Baby shark!)`
   - Repeat loop with toggle switch (`KeyT` and touch button).
2. **10+ Animal Sounds Synthesizer**:
   - **Cow**: Low pitch triangle oscillator with vowel formant filter (120Hz down to 80Hz).
   - **Duck**: Dual sawtooth nasal filter with rapid vibrato quack envelope (600Hz -> 350Hz).
   - **Dog**: Pitch-bent bark impulse with noise burst filter (280Hz -> 90Hz).
   - **Cat**: Gliding pitch bend with crying formant (440Hz -> 650Hz -> 300Hz).
   - **Sheep**: Sawtooth wave with LFO amplitude tremolo simulating baa-ing (220Hz with 12Hz tremolo).
   - **Lion**: Sub-frequency roar with white noise distortion and resonant lowpass sweep.
   - **Frog**: Low croaking square wave with 3-burst envelope (90Hz burst).
   - **Elephant**: High trumpet brass blast using frequency modulated sine wave (350Hz -> 520Hz).
   - **Bird**: High frequency chirps and trills (2500Hz -> 3800Hz).
   - **Dino**: Roaring sub-bass tremor with harmonic crunch.
3. **Comical FX & Musical Toys**:
   - Boing, laser, confetti pop, drum kicks, snares, cymbals, harp arpeggios, slide whistles, fart/horn, party horns.
4. **Speech Synthesis Engine**:
   - Uses native `window.speechSynthesis` with warm, high-pitched toddler-friendly pitch (`pitch = 1.3`, `rate = 0.95`).
   - Speaks the letter, number, or animal loudly and clearly.

---

## 4. Visual Effects & Anime Background Architecture

### 4.1 Background Anime Action System
Toddler-approved, energetic, heroic themes:
1. **Theme 1: Luffy Gear Charge / Straw Hat Sprint**:
   - Animated SVG/Canvas cartoon running sequence with steam aura, bouncing rubber limbs, and dynamic speed lines.
2. **Theme 2: Naruto Ninja Dash & Rasengan Swirl**:
   - Leaf Village headband warrior dashing through bamboo forest with swirling cyan chakra spiral.
3. **Theme 3: DBZ Super Saiyan Golden Ki Burst**:
   - Golden electric lightning sparks, rising golden flame aura particles, and shaking rocky terrain.
4. **Theme 4: Pokémon Island Adventure**:
   - Lush tropical anime meadow with blue sky, fluffy clouds, and wandering pocket monsters.
- Includes a button/key (`Tab`) to easily cycle through anime backdrops or upload custom clips/GIFs.

### 4.2 Dancing Pocket-Monster Crew (`KeyP`)
- Four distinct hand-crafted, high-detail vector cartoon dancers:
  - **Electric Mouse (Pikachu-style)**: Wiggles ears, sparks red cheeks, bounces side to side.
  - **Fire Salamander (Charmander-style)**: Waves fiery tail, wiggles arms, headbangs.
  - **Water Turtle (Squirtle-style)**: Puts on sunglasses, shoots bubbles, spins on shell.
  - **Singing Puff (Jigglypuff-style)**: Floats and inflates, holding a microphone.
- Three intensity levels: Single dancer -> Full crew -> Hyper rave disco dance -> Off.

### 4.3 Toddler Lock & Browser Defenses
- Fullscreen auto-prompt on first click.
- `e.preventDefault()` on keys that trigger browser navigation (Backspace, Tab, Space, Slash, Alt, etc.).
- `beforeunload` dialog prompt to prevent accidental tab closing.
- Touchscreen support: Tapping or dragging anywhere on the screen triggers fireworks and randomized key reactions for little hands touching the Chromebook screen.

---

## 5. Production & Support Cycle

1. **Analysis**: Verified toddler user needs, hardware constraints of Chrome OS, and public repository requirements.
2. **Design**: Complete 80-key mapping table, procedural audio architecture, anime backdrop loops, and dancing Pokémon sprites.
3. **Build**: Standalone single-directory web application with responsive canvas, Web Audio synth, responsive CSS, and service worker for PWA offline caching.
4. **Production**: Hosted via GitHub Pages with one-click URL and public repo setup.
5. **Support & Maintenance**: Self-contained architecture, zero external CDN dependencies that can rot, responsive touch & keyboard controls.
