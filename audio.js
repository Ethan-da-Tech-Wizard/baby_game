/**
 * Baby Game Audio Engine
 * 100% Procedural Web Audio API & SpeechSynthesis
 * Zero external asset dependencies - works completely offline!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.babySharkRunning = false;
    this.babySharkStep = 0;
    this.babySharkTimer = null;
    this.volumeLevel = 0.6;
    this.speechUnlocked = false;
    this.dadVoiceManifest = {};
    this.loadDadManifest();
  }

  loadDadManifest() {
    fetch('audio/dad/manifest.json')
      .then(res => res.json())
      .then(data => {
        this.dadVoiceManifest = data || {};
        const count = Object.keys(this.dadVoiceManifest).length;
        if (count > 0) {
          const badge = document.getElementById('dad-badge');
          if (badge) {
            badge.innerText = `🎙️ Dad's Voice: ${count} Clips!`;
            badge.classList.add('active');
          }
        }
      })
      .catch(() => {
        this.dadVoiceManifest = {};
      });
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(delta) {
    this.volumeLevel = Math.max(0.1, Math.min(1.0, this.volumeLevel + delta));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volumeLevel, this.ctx.currentTime);
    }
    return Math.round(this.volumeLevel * 100);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volumeLevel, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // ==========================================
  // 🦈 PROCEDURAL BABY SHARK THEME ENGINE
  // ==========================================
  // Iconic Melody in D Major:
  // D4 - E4 - G4 - G4 - G4 - G4 - G4 - G4 (Baby shark, doo doo doo doo doo doo)
  // D4 - E4 - G4 - G4 - G4 - G4 - G4 - G4 (Baby shark, doo doo doo doo doo doo)
  // D4 - E4 - G4 - G4 - G4 - G4 - G4 - G4 (Baby shark, doo doo doo doo doo doo)
  // G4 - G4 - F#4 (Baby shark!)
  toggleBabyShark() {
    this.ensureContext();
    this.babySharkRunning = !this.babySharkRunning;
    if (this.babySharkRunning) {
      this.babySharkStep = 0;
      this.playBabySharkSequence();
    } else {
      if (this.babySharkTimer) {
        clearTimeout(this.babySharkTimer);
        this.babySharkTimer = null;
      }
    }
    return this.babySharkRunning;
  }

  playBabySharkSequence() {
    if (!this.babySharkRunning || !this.ctx) return;

    // Pitch frequencies
    const D4 = 293.66;
    const E4 = 329.63;
    const G4 = 392.00;
    const Fs4 = 369.99;
    const G3 = 196.00;
    const D3 = 146.83;

    // Phrase notes: [pitch, durationSeconds, bassPitch, isStaccato]
    const phrase = [
      // "Ba-by"
      [D4, 0.28, D3, false],
      [E4, 0.28, D3, false],
      // "Shark doo doo doo doo doo doo"
      [G4, 0.22, G3, true],
      [G4, 0.22, G3, true],
      [G4, 0.22, G3, true],
      [G4, 0.16, G3, true],
      [G4, 0.16, G3, true],
      [G4, 0.28, G3, false],
      [0,   0.14, 0,  false], // small breath

      // Repeat 2
      [D4, 0.28, D3, false],
      [E4, 0.28, D3, false],
      [G4, 0.22, G3, true],
      [G4, 0.22, G3, true],
      [G4, 0.22, G3, true],
      [G4, 0.16, G3, true],
      [G4, 0.16, G3, true],
      [G4, 0.28, G3, false],
      [0,   0.14, 0,  false],

      // Repeat 3
      [D4, 0.28, D3, false],
      [E4, 0.28, D3, false],
      [G4, 0.22, G3, true],
      [G4, 0.22, G3, true],
      [G4, 0.22, G3, true],
      [G4, 0.16, G3, true],
      [G4, 0.16, G3, true],
      [G4, 0.28, G3, false],
      [0,   0.14, 0,  false],

      // "Ba-by Shark!"
      [G4, 0.32, G3, false],
      [G4, 0.32, G3, false],
      [Fs4, 0.70, D3, false],
      [0,   0.45, 0,  false] // Pause before loop
    ];

    const note = phrase[this.babySharkStep % phrase.length];
    const pitch = note[0];
    const dur = note[1];
    const bass = note[2];

    if (pitch > 0) {
      this.playMarimbaTone(pitch, dur);
      if (bass > 0) {
        this.playBassPluck(bass, dur);
        // Add upbeat percussion tap
        this.playDrumTap();
      }
    }

    this.babySharkStep++;
    this.babySharkTimer = setTimeout(() => {
      this.playBabySharkSequence();
    }, dur * 1000);
  }

  playMarimbaTone(freq, dur) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm wooden chime timbre
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  playBassPluck(freq, dur) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + dur);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  playDrumTap() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // ==========================================
  // 🦁 10+ PROCEDURAL ANIMAL SOUND GENERATORS
  // ==========================================

  // 1. Cow (Moooo)
  playCowMoo() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(125, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, now);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  // 2. Duck (Quack Quack)
  playDuckQuack() {
    this.ensureContext();
    if (this.isMuted) return;
    for (let i = 0; i < 2; i++) {
      const delay = i * 0.22;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.18);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, now);
      filter.Q.value = 5;

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.19);
    }
  }

  // 3. Dog (Woof Woof!)
  playDogBark() {
    this.ensureContext();
    if (this.isMuted) return;
    for (let i = 0; i < 2; i++) {
      const delay = i * 0.18;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    }
  }

  // 4. Cat (Meowww)
  playCatMeow() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.85);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.9);
  }

  // 5. Sheep (Baaaa!)
  playSheepBaa() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const tremolo = this.ctx.createOscillator();
    const tremoloGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(230, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.9);

    // Tremolo modulation
    tremolo.frequency.setValueAtTime(11, now);
    tremoloGain.gain.setValueAtTime(0.2, now);

    tremolo.connect(tremoloGain);
    tremoloGain.connect(gain.gain);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.95);

    osc.connect(gain);
    gain.connect(this.masterGain);

    tremolo.start(now);
    osc.start(now);
    tremolo.stop(now + 1.0);
    osc.stop(now + 1.0);
  }

  // 6. Lion (Rooaaar!)
  playLionRoar() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(65, now + 1.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.linearRampToValueAtTime(700, now + 0.4);
    filter.frequency.linearRampToValueAtTime(200, now + 1.4);
    filter.Q.value = 6;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.45);
  }

  // 7. Frog (Ribbit Ribbit)
  playFrogRibbit() {
    this.ensureContext();
    if (this.isMuted) return;
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.12;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    }
  }

  // 8. Elephant (Trumpet Pawoo!)
  playElephantTrumpet() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.25);
    osc.frequency.linearRampToValueAtTime(480, now + 0.85);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  // 9. Songbird (Tweet Tweet!)
  playBirdChirp() {
    this.ensureContext();
    if (this.isMuted) return;
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.14;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.linearRampToValueAtTime(3600, now + 0.04);
      osc.frequency.linearRampToValueAtTime(2200, now + 0.09);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  // 10. Dino (Roar!)
  playDinoRoar() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(45, now + 1.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.value = 8;

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.55);
  }

  // 11. Owl (Hoo Hoo)
  playOwlHoot() {
    this.ensureContext();
    if (this.isMuted) return;
    for (let i = 0; i < 2; i++) {
      const delay = i * 0.35;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.28);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  // 12. Rooster (Cock-a-doodle-doo)
  playRooster() {
    this.ensureContext();
    if (this.isMuted) return;
    const notes = [
      [360, 0.12], [450, 0.12], [540, 0.16], [720, 0.45]
    ];
    let timeAcc = 0;
    notes.forEach(([pitch, dur]) => {
      const now = this.ctx.currentTime + timeAcc;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + dur + 0.02);
      timeAcc += dur * 0.9;
    });
  }

  // ==========================================
  // 💥 COMICAL SOUND EFFECTS & INSTRUMENTS
  // ==========================================

  playBoing() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.35);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playLaser() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  playBoom() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  playChimeFanfare() {
    this.ensureContext();
    if (this.isMuted) return;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chords.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  playLevelUp() {
    this.ensureContext();
    if (this.isMuted) return;
    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);
    });
  }

  playPartyHorn() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(370, now);
    osc.frequency.linearRampToValueAtTime(520, now + 0.3);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  playSlideWhistle() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  playDrumKit() {
    this.ensureContext();
    if (this.isMuted) return;
    // Kick + Snare burst
    this.playBoom();
    setTimeout(() => {
      this.playLaser();
    }, 120);
  }

  playSaiyanAuraSound() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.8);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.8);
    filter.Q.value = 5;

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.9);
  }

  // ==========================================
  // 🗣️ TODDLER SPEECH / DAD VOICE ENGINE
  // ==========================================
  speakWord(text, keyCode) {
    if (this.isMuted) return;

    // Check if Dad's custom voice file is recorded for this key!
    if (keyCode && this.dadVoiceManifest && this.dadVoiceManifest[keyCode]) {
      try {
        const audio = new Audio(this.dadVoiceManifest[keyCode]);
        audio.volume = this.volumeLevel;
        audio.play().catch(() => {
          this.playSpeechSynthFallback(text);
        });
        return;
      } catch (e) {
        // Fall back to synth
      }
    }

    this.playSpeechSynthFallback(text);
  }

  playSpeechSynthFallback(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // clear queue for instant responsiveness
      const utter = new SpeechSynthesisUtterance(text);
      utter.pitch = 1.35; // friendly toddler pitch
      utter.rate = 0.95;  // easy to hear
      window.speechSynthesis.speak(utter);
    } catch (e) {
      // safe fallback if speech is blocked
    }
  }
}

// Global Audio Singleton
window.audioEngine = new SoundEngine();
