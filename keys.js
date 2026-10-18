/**
 * Baby Game Keyboard & Input Controller
 * Complete Chromebook Keyboard Mapping (80+ Keys) + Multi-Touch Sensor
 * Toddler-Proof Navigation Defense & Instant Audiovisual Feedback
 */

(() => {
  const audio = window.audioEngine;
  const effects = window.effectsEngine;
  const anime = window.animeEngine;
  const pokemon = window.pokemonEngine;

  // Track key press state for smooth hold/repeat prevention
  const activeKeys = new Set();

  // Track cycling states for each key (cycles 3 fun items per key!)
  const cycleState = {};

  // 3-Item Cycling Vocabulary Map for Toddler Learning (A-Z)
  // Each press cycles to a new fun object, official Pokémon, animal, or vehicle!
  const vocabMap = {
    KeyA: [
      { letter: 'A', word: 'APPLE 🍎', emoji: '🍎', img: null, sound: () => audio.playBoing(), fx: () => effects.spawnBouncingBall() },
      { letter: 'A', word: 'AERODACTYL 🦖', emoji: null, img: 'images/pokemon/aerodactyl.png', sound: () => audio.playLaser(), fx: () => effects.spawnLaserBeam() },
      { letter: 'A', word: 'ASTRONAUT 👨‍🚀', emoji: '🚀', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.cycleGalaxyWarp() }
    ],
    KeyB: [
      { letter: 'B', word: 'BALL ⚽', emoji: '⚽', img: null, sound: () => audio.playBoing(), fx: () => effects.spawnBouncingBall() },
      { letter: 'B', word: 'BLASTOISE 🐢', emoji: null, img: 'images/pokemon/blastoise.png', sound: () => audio.playDuckQuack(), fx: () => effects.cycleRainStorm() },
      { letter: 'B', word: 'BUTTERFLY 🦋', emoji: '🦋', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.spawnConfetti(250) }
    ],
    KeyC: [
      { letter: 'C', word: 'CAT 🐱', emoji: '🐱', img: null, sound: () => audio.playCatMeow(), fx: () => effects.spawnEmojiBurst(20) },
      { letter: 'C', word: 'CHARIZARD 🔥', emoji: null, img: 'images/pokemon/charizard.png', sound: () => audio.playLionRoar(), fx: () => effects.spawnFireworks() },
      { letter: 'C', word: 'CAR 🚗', emoji: '🚗', img: null, sound: () => audio.playPartyHorn(), fx: () => effects.spawnCandyRain(20) }
    ],
    KeyD: [
      { letter: 'D', word: 'DOG 🐶', emoji: '🐶', img: null, sound: () => audio.playDogBark(), fx: () => effects.spawnEmojiBurst(20) },
      { letter: 'D', word: 'DINOSAUR 🦕', emoji: '🦕', img: null, sound: () => audio.playDinoRoar(), fx: () => effects.triggerScreenShake(true) },
      { letter: 'D', word: 'DRUM 🥁', emoji: '🥁', img: null, sound: () => audio.playDrumKit(), fx: () => effects.spawnFireworks() }
    ],
    KeyE: [
      { letter: 'E', word: 'ELEPHANT 🐘', emoji: '🐘', img: null, sound: () => audio.playElephantTrumpet(), fx: () => effects.spawnBouncingBall() },
      { letter: 'E', word: 'ELECTRICITY ⚡', emoji: '⚡', img: null, sound: () => audio.playLaser(), fx: () => effects.spawnLightningBolt() },
      { letter: 'E', word: 'EARTH 🌍', emoji: '🌍', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.cycleGalaxyWarp() }
    ],
    KeyF: [
      { letter: 'F', word: 'FROG 🐸', emoji: '🐸', img: null, sound: () => audio.playFrogRibbit(), fx: () => effects.spawnBouncingBall() },
      { letter: 'F', word: 'FIREWORKS 🎆', emoji: '🎆', img: null, sound: () => audio.playBoom(), fx: () => effects.spawnFireworks() },
      { letter: 'F', word: 'FIRE TRUCK 🚒', emoji: '🚒', img: null, sound: () => audio.playPartyHorn(), fx: () => effects.spawnConfetti(200) }
    ],
    KeyG: [
      { letter: 'G', word: 'GALAXY 🌌', emoji: '🌌', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.cycleGalaxyWarp() },
      { letter: 'G', word: 'GIRAFFE 🦒', emoji: '🦒', img: null, sound: () => audio.playBoing(), fx: () => effects.spawnEmojiBurst(20) },
      { letter: 'G', word: 'GUITAR 🎸', emoji: '🎸', img: null, sound: () => audio.playLevelUp(), fx: () => effects.spawnLaserBeam() }
    ],
    KeyH: [
      { letter: 'H', word: 'HEART ❤️', emoji: '❤️', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.toggleFloatingHearts() },
      { letter: 'H', word: 'HORSE 🐴', emoji: '🐴', img: null, sound: () => audio.playDogBark(), fx: () => effects.spawnConfetti(200) },
      { letter: 'H', word: 'HELICOPTER 🚁', emoji: '🚁', img: null, sound: () => audio.playLaser(), fx: () => effects.spawnLaserBeam() }
    ],
    KeyI: [
      { letter: 'I', word: 'ICE CREAM 🍦', emoji: '🍦', img: null, sound: () => audio.playSlideWhistle(), fx: () => effects.spawnCandyRain(25) },
      { letter: 'I', word: 'IGLOO ❄️', emoji: '❄️', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.toggleCRTScanlines() },
      { letter: 'I', word: 'ISLAND 🏝️', emoji: '🏝️', img: null, sound: () => audio.playDuckQuack(), fx: () => effects.cycleRainStorm() }
    ],
    KeyJ: [
      { letter: 'J', word: 'JELLYFISH 🪼', emoji: '🪼', img: null, sound: () => audio.playSlideWhistle(), fx: () => effects.spawnBubble() },
      { letter: 'J', word: 'JUMP 🦘', emoji: '🦘', img: null, sound: () => audio.playBoing(), fx: () => effects.spawnBouncingBall() },
      { letter: 'J', word: 'JUICE 🧃', emoji: '🧃', img: null, sound: () => audio.playSlideWhistle(), fx: () => effects.spawnBubble() }
    ],
    KeyK: [
      { letter: 'K', word: 'KANGASKHAN 🦘', emoji: null, img: 'images/pokemon/kangaskhan.png', sound: () => audio.playDinoRoar(), fx: () => effects.spawnConfetti(300) },
      { letter: 'K', word: 'KITE 🪁', emoji: '🪁', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.toggleRainbow() },
      { letter: 'K', word: 'KOALA 🐨', emoji: '🐨', img: null, sound: () => audio.playBoing(), fx: () => effects.spawnBubble() }
    ],
    KeyL: [
      { letter: 'L', word: 'LION 🦁', emoji: '🦁', img: null, sound: () => audio.playLionRoar(), fx: () => effects.spawnFireworks() },
      { letter: 'L', word: 'LIGHTNING ⚡', emoji: '⚡', img: null, sound: () => audio.playLaser(), fx: () => effects.spawnLightningBolt() },
      { letter: 'L', word: 'LOLLIPOP 🍭', emoji: '🍭', img: null, sound: () => audio.playPartyHorn(), fx: () => effects.spawnCandyRain(30) }
    ],
    KeyM: [
      { letter: 'M', word: 'MONKEY 🐵', emoji: '🐵', img: null, sound: () => audio.playSlideWhistle(), fx: () => effects.spawnEmojiBurst(25) },
      { letter: 'M', word: 'MOON 🌙', emoji: '🌙', img: null, sound: () => audio.playOwlHoot(), fx: () => effects.cycleGalaxyWarp() },
      { letter: 'M', word: 'MUSIC 🎵', emoji: '🎵', img: null, sound: () => audio.playLevelUp(), fx: () => effects.toggleDiscoStrobe() }
    ],
    KeyN: [
      { letter: 'N', word: 'NIDOKING 👑', emoji: null, img: 'images/pokemon/nidoking.png', sound: () => audio.playDinoRoar(), fx: () => effects.triggerScreenShake(true) },
      { letter: 'N', word: 'NINJA 🥷', emoji: '🥷', img: null, sound: () => audio.playSaiyanAuraSound(), fx: () => { anime.setTheme('naruto'); updateThemeBadge(); } },
      { letter: 'N', word: 'NEST 🪺', emoji: '🪺', img: null, sound: () => audio.playBirdChirp(), fx: () => effects.spawnBubble() }
    ],
    KeyO: [
      { letter: 'O', word: 'OWL 🦉', emoji: '🦉', img: null, sound: () => audio.playOwlHoot(), fx: () => effects.spawnBubble() },
      { letter: 'O', word: 'OCTOPUS 🐙', emoji: '🐙', img: null, sound: () => audio.playDuckQuack(), fx: () => effects.cycleRainStorm() },
      { letter: 'O', word: 'ORANGE 🍊', emoji: '🍊', img: null, sound: () => audio.playBoing(), fx: () => effects.spawnBouncingBall() }
    ],
    KeyP: [
      { letter: 'P', word: 'PIKACHU ⚡', emoji: null, img: 'images/pokemon/pikachu.png', sound: () => audio.playLevelUp(), fx: () => effects.spawnLightningBolt() },
      { letter: 'P', word: 'PUPPY 🐶', emoji: '🐶', img: null, sound: () => audio.playDogBark(), fx: () => effects.spawnEmojiBurst(20) },
      { letter: 'P', word: 'POKÉMON DANCE 🐹', emoji: null, img: 'images/pokemon/pikachu_ani.gif', sound: () => audio.playLevelUp(), fx: () => togglePokemonDance() }
    ],
    KeyQ: [
      { letter: 'Q', word: 'QUEEN 👑', emoji: '👑', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.spawnFireworks() },
      { letter: 'Q', word: 'QUACK 🦆', emoji: '🦆', img: null, sound: () => audio.playDuckQuack(), fx: () => effects.spawnBubble() },
      { letter: 'Q', word: 'QUIET 🤫', emoji: '🤫', img: null, sound: () => audio.playOwlHoot(), fx: () => effects.toggleFloatingHearts() }
    ],
    KeyR: [
      { letter: 'R', word: 'RAINBOW 🌈', emoji: '🌈', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.toggleRainbow() },
      { letter: 'R', word: 'ROCKET 🚀', emoji: '🚀', img: null, sound: () => audio.playLaser(), fx: () => effects.spawnFireworks() },
      { letter: 'R', word: 'ROBOT 🤖', emoji: '🤖', img: null, sound: () => audio.playLevelUp(), fx: () => effects.cycleMatrixRain() }
    ],
    KeyS: [
      { letter: 'S', word: 'STARLY 🐦', emoji: null, img: 'images/pokemon/starly.png', sound: () => audio.playBirdChirp(), fx: () => effects.spawnBubble() },
      { letter: 'S', word: 'SUN ☀️', emoji: '☀️', img: null, sound: () => audio.playRooster(), fx: () => effects.triggerFlash() },
      { letter: 'S', word: 'SUPER SAIYAN ⚡', emoji: '⚡', img: null, sound: () => audio.playSaiyanAuraSound(), fx: () => { anime.setTheme('dbz'); updateThemeBadge(); } }
    ],
    KeyT: [
      { letter: 'T', word: 'BABY SHARK 🦈', emoji: '🦈', img: null, sound: () => {}, fx: () => toggleSharkSong() },
      { letter: 'T', word: 'TRAIN 🚂', emoji: '🚂', img: null, sound: () => audio.playPartyHorn(), fx: () => effects.spawnConfetti(250) },
      { letter: 'T', word: 'TURTLE 🐢', emoji: '🐢', img: null, sound: () => audio.playDuckQuack(), fx: () => effects.spawnBubble() }
    ],
    KeyU: [
      { letter: 'U', word: 'UNICORN 🦄', emoji: '🦄', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.spawnConfetti(300) },
      { letter: 'U', word: 'UMBRELLA ☂️', emoji: '☂️', img: null, sound: () => audio.playDuckQuack(), fx: () => effects.cycleRainStorm() },
      { letter: 'U', word: 'UFO 🛸', emoji: '🛸', img: null, sound: () => audio.playLaser(), fx: () => effects.cycleGalaxyWarp() }
    ],
    KeyV: [
      { letter: 'V', word: 'VENUSAUR 🌺', emoji: null, img: 'images/pokemon/venusaur.png', sound: () => audio.playLevelUp(), fx: () => effects.spawnConfetti(300) },
      { letter: 'V', word: 'VICTORY 🏆', emoji: '🏆', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.spawnFireworks() },
      { letter: 'V', word: 'VOLCANO 🌋', emoji: '🌋', img: null, sound: () => audio.playBoom(), fx: () => effects.spawnCandyRain(25) }
    ],
    KeyW: [
      { letter: 'W', word: 'WATER 🌊', emoji: '🌊', img: null, sound: () => audio.playDuckQuack(), fx: () => effects.cycleRainStorm() },
      { letter: 'W', word: 'WHALE 🐳', emoji: '🐳', img: null, sound: () => audio.playOwlHoot(), fx: () => effects.spawnBubble() },
      { letter: 'W', word: 'WIND 💨', emoji: '💨', img: null, sound: () => audio.playSlideWhistle(), fx: () => effects.spawnConfetti(200) }
    ],
    KeyX: [
      { letter: 'X', word: 'XYLOPHONE 🎵', emoji: '🎵', img: null, sound: () => audio.playChimeFanfare(), fx: () => effects.toggleCRTScanlines() },
      { letter: 'X', word: 'X-RAY 🩻', emoji: '🩻', img: null, sound: () => audio.playLaser(), fx: () => effects.toggleInvertColors() },
      { letter: 'X', word: 'X MARKS THE SPOT ❌', emoji: '🏴‍☠️', img: null, sound: () => audio.playLevelUp(), fx: () => effects.spawnFireworks() }
    ],
    KeyY: [
      { letter: 'Y', word: 'YAK 🐂', emoji: '🐂', img: null, sound: () => audio.playCowMoo(), fx: () => effects.spawnEmojiBurst(15) },
      { letter: 'Y', word: 'YOYO 🪀', emoji: '🪀', img: null, sound: () => audio.playBoing(), fx: () => effects.spawnBouncingBall() },
      { letter: 'Y', word: 'YACHT ⛵', emoji: '⛵', img: null, sound: () => audio.playDuckQuack(), fx: () => effects.cycleRainStorm() }
    ],
    KeyZ: [
      { letter: 'Z', word: 'ZIGZAGOON 🦝', emoji: null, img: 'images/pokemon/zigzagoon.png', sound: () => audio.playDogBark(), fx: () => effects.spawnBouncingBall() },
      { letter: 'Z', word: 'ZEBRA 🦓', emoji: '🦓', img: null, sound: () => audio.playSlideWhistle(), fx: () => effects.spawnEmojiBurst(20) },
      { letter: 'Z', word: 'ZAP ⚡', emoji: '⚡', img: null, sound: () => audio.playLaser(), fx: () => effects.spawnLaserBeam() }
    ]
  };

  // Numbers 1-0 Map with Emojis
  const numberMap = {
    Digit1: { num: '1', name: 'ONE DINO 🦖', emoji: '🦖', sound: () => audio.playDinoRoar() },
    Digit2: { num: '2', name: 'TWO DOGS 🐶🐶', emoji: '🐶', sound: () => audio.playDogBark() },
    Digit3: { num: '3', name: 'THREE CATS 🐱🐱🐱', emoji: '🐱', sound: () => audio.playCatMeow() },
    Digit4: { num: '4', name: 'FOUR DUCKS 🦆🦆🦆🦆', emoji: '🦆', sound: () => audio.playDuckQuack() },
    Digit5: { num: '5', name: 'FIVE LIONS 🦁🦁🦁🦁🦁', emoji: '🦁', sound: () => audio.playLionRoar() },
    Digit6: { num: '6', name: 'SIX FROGS 🐸🐸🐸🐸🐸🐸', emoji: '🐸', sound: () => audio.playFrogRibbit() },
    Digit7: { num: '7', name: 'SEVEN COWS 🐮🐮🐮🐮🐮🐮🐮', emoji: '🐮', sound: () => audio.playCowMoo() },
    Digit8: { num: '8', name: 'EIGHT SHEEP 🐑🐑🐑🐑🐑🐑🐑🐑', emoji: '🐑', sound: () => audio.playSheepBaa() },
    Digit9: { num: '9', name: 'NINE ELEPHANTS 🐘🐘🐘🐘🐘🐘🐘🐘🐘', emoji: '🐘', sound: () => audio.playElephantTrumpet() },
    Digit0: { num: '10', name: 'TEN BIRDS 🐦🐦🐦🐦🐦🐦🐦🐦🐦🐦', emoji: '🐦', sound: () => audio.playBirdChirp() }
  };

  // Update HUD Badges
  function updateThemeBadge() {
    const badge = document.getElementById('theme-badge');
    badge.innerText = anime.getThemeName();
  }

  function toggleSharkSong() {
    const isPlaying = audio.toggleBabyShark();
    const badge = document.getElementById('shark-badge');
    badge.innerText = isPlaying ? '🦈 Baby Shark: ON 🎶' : '🦈 Baby Shark: OFF';
    badge.classList.toggle('active', isPlaying);
    if (isPlaying) {
      effects.showSplashBanner('🦈', 'BABY SHARK DOO DOO!', null, '🦈');
      effects.spawnConfetti(200);
    }
  }

  function togglePokemonDance() {
    const intensity = pokemon.toggle();
    const badge = document.getElementById('poke-badge');
    const squadTitle = pokemon.getSquadName();
    badge.innerText = `🐹 ${squadTitle}`;
    badge.classList.toggle('active', intensity > 0);
    if (intensity > 0) {
      audio.playLevelUp();
      effects.showSplashBanner('🐹', squadTitle, 'images/pokemon/pikachu_ani.gif', null);
      effects.spawnFireworks();
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Master Key Down Handler
  function handleKeyDown(e) {
    audio.ensureContext();

    // Prevent Chromebook / browser navigation triggers that disrupt play
    const interceptedCodes = [
      'Backspace', 'Tab', 'Space', 'Slash', 'AltLeft', 'AltRight',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'BrowserBack',
      'BrowserForward', 'BrowserRefresh', 'F4', 'F5'
    ];
    if (interceptedCodes.includes(e.code) || interceptedCodes.includes(e.key)) {
      e.preventDefault();
    }

    const code = e.code;
    const key = e.key;

    // 1. Letters A - Z (Cycles through 3 distinct items per key!)
    if (vocabMap[code]) {
      const list = vocabMap[code];
      const curIdx = cycleState[code] || 0;
      const item = list[curIdx % list.length];
      cycleState[code] = (curIdx + 1) % list.length;

      effects.showSplashBanner(item.letter, item.word, item.img, item.emoji);
      audio.speakWord(item.word, code, curIdx % list.length);
      item.sound();
      item.fx();
      effects.triggerFlash();
      return;
    }

    // 2. Numbers 1 - 0
    if (numberMap[code]) {
      const item = numberMap[code];
      effects.showSplashBanner(item.num, item.name, null, item.emoji);
      audio.speakWord(`${item.num}! ${item.name}`, code);
      item.sound();
      effects.spawnBouncingBall();
      effects.spawnEmojiBurst(10);
      effects.triggerFlash();
      return;
    }

    // 3. Chromebook Top Row & Media Function Keys
    switch (code) {
      case 'Escape':
        effects.clearAllLayers();
        audio.playChimeFanfare();
        effects.showSplashBanner('🧹', 'ALL CLEAN!');
        break;

      case 'BrowserBack':
        effects.toggleCRTScanlines();
        audio.playLaser();
        effects.showSplashBanner('⏪', 'TIME WARP!');
        break;

      case 'BrowserForward':
        effects.cycleGalaxyWarp();
        audio.playLaser();
        effects.showSplashBanner('⏩', 'WARP SPEED!');
        break;

      case 'BrowserRefresh':
        effects.cycleRainStorm();
        audio.playDuckQuack();
        effects.showSplashBanner('🌊', 'WATER WAVE!');
        break;

      case 'F4': // Chromebook Fullscreen
        toggleFullscreen();
        audio.playLevelUp();
        effects.spawnFireworks();
        break;

      case 'F5': // Chromebook Overview / Window Switch
        effects.toggleDiscoStrobe();
        audio.playPartyHorn();
        effects.showSplashBanner('🪩', 'DISCO PARTY!');
        break;

      case 'BrightnessDown':
        audio.playOwlHoot();
        effects.showSplashBanner('🌙', 'NIGHT SKY!');
        break;

      case 'BrightnessUp':
        audio.playRooster();
        effects.triggerFlash();
        effects.showSplashBanner('☀️', 'SUNSHINE!');
        break;

      case 'AudioVolumeMute':
        const muted = audio.toggleMute();
        effects.showSplashBanner(muted ? '🔇' : '🔊', muted ? 'MUTED' : 'UNMUTED');
        break;

      case 'AudioVolumeDown':
        const volDown = audio.setVolume(-0.1);
        effects.showSplashBanner('🔉', `VOLUME ${volDown}%`);
        audio.playBoing();
        break;

      case 'AudioVolumeUp':
        const volUp = audio.setVolume(0.1);
        effects.showSplashBanner('🔊', `VOLUME ${volUp}%`);
        audio.playPartyHorn();
        break;

      // 4. Chromebook Navigation & Punctuation Keys
      case 'Backquote': // ` ~
        effects.cycleMatrixRain();
        audio.playLaser();
        effects.showSplashBanner('💻', 'MATRIX CODE!');
        break;

      case 'Minus': // - _
        effects.spawnLaserBeam();
        audio.playLaser();
        effects.showSplashBanner('⚡', 'MEGA LASER!');
        break;

      case 'Equal': // = +
        effects.spawnCandyRain(35);
        audio.playPartyHorn();
        effects.showSplashBanner('🍩', 'CANDY RAIN!');
        break;

      case 'Backspace':
        effects.spawnConfetti(100);
        audio.playBoing();
        effects.showSplashBanner('💥', 'POP!');
        break;

      case 'Tab': // Next Anime Theme!
        const newTheme = anime.nextTheme();
        updateThemeBadge();
        audio.playSaiyanAuraSound();
        effects.triggerScreenShake(false);
        effects.showSplashBanner('🎌', newTheme);
        break;

      case 'BracketLeft': // [
        effects.spawnFireworks(window.innerWidth * 0.25, window.innerHeight * 0.4);
        audio.playBoom();
        effects.showSplashBanner('🎆', 'BOOM LEFT!');
        break;

      case 'BracketRight': // ]
        effects.spawnFireworks(window.innerWidth * 0.75, window.innerHeight * 0.4);
        audio.playBoom();
        effects.showSplashBanner('🎆', 'BOOM RIGHT!');
        break;

      case 'Backslash': // \
        effects.toggleInvertColors();
        audio.playLaser();
        effects.showSplashBanner('🌀', 'COLOR INVERT!');
        break;

      case 'Enter':
        effects.triggerScreenShake(true);
        effects.triggerFlash();
        effects.spawnFireworks();
        effects.spawnConfetti(350);
        audio.playBoom();
        effects.showSplashBanner('💥', 'EARTHQUAKE!');
        break;

      case 'Space':
        effects.spawnFireworks();
        effects.spawnConfetti(300);
        effects.spawnEmojiBurst(30);
        effects.spawnCandyRain(20);
        effects.triggerScreenShake(true);
        audio.playPartyHorn();
        effects.showSplashBanner('🎉', 'BIG PARTY!');
        break;

      case 'ShiftLeft':
      case 'ShiftRight':
        effects.spawnLaserBeam();
        audio.playLaser();
        effects.showSplashBanner('💫', 'LASER SWEEP!');
        break;

      case 'ControlLeft':
      case 'ControlRight':
        const rev = effects.toggleReverseGravity();
        audio.playSlideWhistle();
        effects.showSplashBanner('🛸', rev ? 'ANTI-GRAVITY UP!' : 'NORMAL GRAVITY!');
        break;

      case 'AltLeft':
      case 'AltRight':
        effects.toggleInvertColors();
        audio.playLaser();
        effects.showSplashBanner('🌈', 'PSYCHEDELIC!');
        break;

      case 'MetaLeft': // Chromebook Search / Everything Key
      case 'MetaRight':
      case 'CapsLock':
        effects.toggleDiscoStrobe();
        audio.playLevelUp();
        effects.showSplashBanner('🔍', 'DISCO SEARCH!');
        break;

      case 'Semicolon':
        effects.spawnEmojiBurst(25);
        audio.playBoing();
        effects.showSplashBanner('😃', 'SMILEYS!');
        break;

      case 'Quote':
        effects.toggleRainbow();
        audio.playChimeFanfare();
        effects.showSplashBanner('🌟', 'TWINKLE STARS!');
        break;

      case 'Comma':
        effects.spawnBubble();
        effects.spawnBubble();
        audio.playDuckQuack();
        effects.showSplashBanner('🫧', 'SOAP BUBBLES!');
        break;

      case 'Period':
        effects.cycleGalaxyWarp();
        audio.playLaser();
        effects.showSplashBanner('☄️', 'METEOR SHOWER!');
        break;

      case 'Slash':
        effects.spawnCandyRain(30);
        audio.playLevelUp();
        effects.showSplashBanner('🎁', 'SURPRISE GIFT!');
        break;

      case 'ArrowLeft':
        effects.bouncingBalls.forEach(b => b.vx -= 15);
        audio.playLaser();
        effects.showSplashBanner('⬅️', 'WIND LEFT!');
        break;

      case 'ArrowRight':
        effects.bouncingBalls.forEach(b => b.vx += 15);
        audio.playLaser();
        effects.showSplashBanner('➡️', 'WIND RIGHT!');
        break;

      case 'ArrowUp':
        effects.bouncingBalls.forEach(b => b.vy = -20);
        audio.playBoing();
        effects.showSplashBanner('⬆️', 'ROCKET UP!');
        break;

      case 'ArrowDown':
        effects.cycleRainStorm();
        audio.playDuckQuack();
        effects.showSplashBanner('⬇️', 'RAIN DOWN!');
        break;

      default:
        // Generic fallback for any unexpected key
        effects.spawnFireworks();
        effects.spawnConfetti(100);
        audio.playBoing();
        effects.showSplashBanner(key.toUpperCase(), 'AWESOME!');
        break;
    }
  }

  // Pointer & Touch Event Handlers (for Touchscreen Chromebooks)
  function handleScreenTouch(e) {
    audio.ensureContext();
    const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth * 0.5);
    const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight * 0.5);

    effects.spawnFireworks(x, y);
    effects.spawnBouncingBall(x, y);
    audio.playBoing();
  }

  // Start Overlay Dismissal
  const startOverlay = document.getElementById('start-overlay');
  const btnStart = document.getElementById('btn-start');

  function dismissStartModal() {
    audio.ensureContext();
    startOverlay.classList.remove('active');
    effects.spawnConfetti(250);
    audio.playChimeFanfare();
    toggleFullscreen();
  }

  btnStart.addEventListener('click', dismissStartModal);
  startOverlay.addEventListener('click', dismissStartModal);

  // HUD Button Bindings
  document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);
  document.getElementById('btn-shark').addEventListener('click', toggleSharkSong);
  document.getElementById('btn-poke').addEventListener('click', togglePokemonDance);
  document.getElementById('btn-theme').addEventListener('click', () => {
    const newTheme = anime.nextTheme();
    updateThemeBadge();
    audio.playSaiyanAuraSound();
    effects.showSplashBanner('🎌', newTheme);
  });
  document.getElementById('btn-clear').addEventListener('click', () => {
    effects.clearAllLayers();
    audio.playChimeFanfare();
    effects.showSplashBanner('🧹', 'CLEARED!');
  });

  // Global Event Listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('pointerdown', (e) => {
    // If user clicked inside HUD buttons, don't trigger canvas splash
    if (e.target.closest('#game-hud') || e.target.closest('#start-overlay')) return;
    handleScreenTouch(e);
  });

  // Prevent accidental back navigation / reload
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';
  });

  // Init Theme badge
  updateThemeBadge();
})();
