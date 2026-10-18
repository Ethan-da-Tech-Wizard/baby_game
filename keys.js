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

  // Vocabulary Map for Toddler Learning (A-Z) with Featured Pokémon & Toddler Favorites
  const vocabMap = {
    KeyA: { letter: 'A', word: 'AERODACTYL 🦖', sound: () => audio.playLaser(), fx: () => { pokemon.summon('aerodactyl'); effects.spawnLaserBeam(); } },
    KeyB: { letter: 'B', word: 'BLASTOISE 🐢', sound: () => audio.playDuckQuack(), fx: () => { pokemon.summon('blastoise'); effects.cycleRainStorm(); } },
    KeyC: { letter: 'C', word: 'CHARIZARD 🔥', sound: () => audio.playLionRoar(), fx: () => { pokemon.summon('charizard'); effects.spawnFireworks(); } },
    KeyD: { letter: 'D', word: 'DOG 🐶', sound: () => audio.playDogBark(), fx: () => effects.spawnFireworks() },
    KeyE: { letter: 'E', word: 'ELEPHANT 🐘', sound: () => audio.playElephantTrumpet(), fx: () => effects.spawnLightningBolt() },
    KeyF: { letter: 'F', word: 'FROG 🐸', sound: () => audio.playFrogRibbit(), fx: () => effects.spawnFireworks() },
    KeyG: { letter: 'G', word: 'GALAXY 🌌', sound: () => audio.playChimeFanfare(), fx: () => effects.cycleGalaxyWarp() },
    KeyH: { letter: 'H', word: 'HEART ❤️', sound: () => audio.playChimeFanfare(), fx: () => effects.toggleFloatingHearts() },
    KeyI: { letter: 'I', word: 'ICE CREAM 🍦', sound: () => audio.playSlideWhistle(), fx: () => effects.spawnCandyRain(20) },
    KeyJ: { letter: 'J', word: 'TOGEPI 🐣', sound: () => audio.playChimeFanfare(), fx: () => { pokemon.summon('togepi'); effects.spawnConfetti(200); } },
    KeyK: { letter: 'K', word: 'KANGASKHAN 🦘', sound: () => audio.playDinoRoar(), fx: () => { pokemon.summon('kangaskhan'); effects.spawnEmojiBurst(20); } },
    KeyL: { letter: 'L', word: 'LION 🦁', sound: () => audio.playLionRoar(), fx: () => effects.spawnEmojiBurst(20) },
    KeyM: { letter: 'M', word: 'MONKEY 🐵', sound: () => audio.playSlideWhistle(), fx: () => effects.spawnConfetti(150) },
    KeyN: { letter: 'N', word: 'NIDOKING 👑', sound: () => audio.playDinoRoar(), fx: () => { pokemon.summon('nidoking'); effects.triggerScreenShake(false); } },
    KeyO: { letter: 'O', word: 'OWL 🦉', sound: () => audio.playOwlHoot(), fx: () => effects.spawnBubble() },
    KeyP: { letter: 'P', word: 'POKÉMON PARTY 🐹', sound: () => audio.playLevelUp(), fx: () => togglePokemonDance() },
    KeyQ: { letter: 'Q', word: 'QUEEN 👑', sound: () => audio.playChimeFanfare(), fx: () => effects.spawnFireworks() },
    KeyR: { letter: 'R', word: 'RAINBOW 🌈', sound: () => audio.playChimeFanfare(), fx: () => effects.toggleRainbow() },
    KeyS: { letter: 'S', word: 'STARLY 🐦', sound: () => audio.playBirdChirp(), fx: () => { pokemon.summon('starly'); effects.spawnBubble(); } },
    KeyT: { letter: 'T', word: 'BABY SHARK 🦈', sound: () => {}, fx: () => toggleSharkSong() },
    KeyU: { letter: 'U', word: 'UNICORN 🦄', sound: () => audio.playChimeFanfare(), fx: () => effects.spawnEmojiBurst(25) },
    KeyV: { letter: 'V', word: 'VENUSAUR 🌺', sound: () => audio.playLevelUp(), fx: () => { pokemon.summon('venusaur'); effects.spawnConfetti(300); } },
    KeyW: { letter: 'W', word: 'WATER 🌊', sound: () => audio.playDuckQuack(), fx: () => effects.cycleRainStorm() },
    KeyX: { letter: 'X', word: 'XYLOPHONE 🎵', sound: () => audio.playChimeFanfare(), fx: () => effects.toggleCRTScanlines() },
    KeyY: { letter: 'Y', word: 'YUMMY 🍩', sound: () => audio.playPartyHorn(), fx: () => effects.spawnCandyRain(25) },
    KeyZ: { letter: 'Z', word: 'ZIGZAGOON 🦝', sound: () => audio.playDogBark(), fx: () => { pokemon.summon('zigzagoon'); effects.spawnBouncingBall(); } }
  };

  // Numbers 1-0 Map
  const numberMap = {
    Digit1: { num: '1', name: 'ONE DINO 🦖', sound: () => audio.playDinoRoar() },
    Digit2: { num: '2', name: 'TWO DOGS 🐶🐶', sound: () => audio.playDogBark() },
    Digit3: { num: '3', name: 'THREE CATS 🐱🐱🐱', sound: () => audio.playCatMeow() },
    Digit4: { num: '4', name: 'FOUR DUCKS 🦆🦆🦆🦆', sound: () => audio.playDuckQuack() },
    Digit5: { num: '5', name: 'FIVE LIONS 🦁🦁🦁🦁🦁', sound: () => audio.playLionRoar() },
    Digit6: { num: '6', name: 'SIX FROGS 🐸🐸🐸🐸🐸🐸', sound: () => audio.playFrogRibbit() },
    Digit7: { num: '7', name: 'SEVEN COWS 🐮🐮🐮🐮🐮🐮🐮', sound: () => audio.playCowMoo() },
    Digit8: { num: '8', name: 'EIGHT SHEEP 🐑🐑🐑🐑🐑🐑🐑🐑', sound: () => audio.playSheepBaa() },
    Digit9: { num: '9', name: 'NINE ELEPHANTS 🐘🐘🐘🐘🐘🐘🐘🐘🐘', sound: () => audio.playElephantTrumpet() },
    Digit0: { num: '10', name: 'TEN BIRDS 🐦🐦🐦🐦🐦🐦🐦🐦🐦🐦', sound: () => audio.playBirdChirp() }
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
      effects.showSplashBanner('🦈', 'BABY SHARK DOO DOO!');
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
      effects.showSplashBanner('🐹', squadTitle);
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

    // 1. Letters A - Z
    if (vocabMap[code]) {
      const item = vocabMap[code];
      effects.showSplashBanner(item.letter, item.word);
      audio.speakWord(item.word, code);
      item.sound();
      item.fx();
      effects.triggerFlash();
      return;
    }

    // 2. Numbers 1 - 0
    if (numberMap[code]) {
      const item = numberMap[code];
      effects.showSplashBanner(item.num, item.name);
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
