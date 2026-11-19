// ==============================================================================
// Program: audio.js
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 18, 2026
// Purpose: 100% Procedural Web Audio API sound synthesis and speech engine.
//          Constructs dynamic audio graphs using OscillatorNodes, BiquadFilterNodes,
//          and GainNodes with ADSR envelopes to generate instruments, animal cries,
//          cartoon sound effects, and SpeechSynthesis voice prompts without external files.
// ============================================================================== 
// How this file fits: index.html loads this first. It creates one SoundEngine and publishes it as window.audioEngine; keys.js, effects.js and anime.js
// call its play* and speakWord methods, and nothing else in the app produces sound. It reads audio/dad/manifest.json (written by record_dad.py)
// for optional recorded voice clips and falls back to the browser's speech synthesis when a clip is missing.
// Design decision: no audio files are needed for sound effects, so the game works offline and the repository stays small.
// Known limits: the AudioContext cannot start before a user gesture, so the first sound after page load comes only after the start overlay is tapped.

// SoundEngine: every sound in the game is synthesised at runtime with the Web Audio API
// (oscillator -> optional filter -> gain envelope -> masterGain -> speakers). The only audio
// files are optional recorded voice clips described by audio/dad/manifest.json.
//
// Common patterns used by the sound methods below:
//   - ensureContext() first, because browsers only start audio after a user gesture.
//   - Early return when muted, so no nodes are created at all.
//   - Gain envelopes ramp to 0.01 rather than 0 because exponentialRampToValueAtTime
//     cannot target exactly 0.
//   - Each oscillator is stopped slightly after its envelope ends so nodes are freed.
class SoundEngine {
  // State: ctx/masterGain are created lazily in init(). volumeLevel is 0.1-1.0; babyShark* fields drive
  // the looping song; dadVoiceManifest maps key codes to recorded clip paths.
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.babySharkRunning = false;
    this.babySharkStep = 0;

    // Holds the pending setTimeout id so toggling the song off can cancel the next note.
    this.babySharkTimer = null;

    // 0.6 is a moderate default so a first-time sound is not startling for a toddler or a parent in a quiet room.
    this.volumeLevel = 0.6;

    // (Declared for completeness; no code in this file reads it.)
    this.speechUnlocked = false;

    // Empty object (not null) so lookups like manifest[key] are always safe before the fetch completes.
    this.dadVoiceManifest = {};
    // Fetch the optional voice-clip manifest right away; failure is fine (speech synthesis is the fallback).
    this.loadDadManifest();
  }

  // Load audio/dad/manifest.json: { 'KeyA_1': 'path.mp3', 'KeyA_intro': ..., ... }. On success the
  // HUD badge shows how many clips exist; any error leaves the manifest empty.
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

    // STEP-BY-STEP EDUCATIONAL GUIDE: PROCEDURAL AUDIO RENDERING PIPELINE
  // 1. AudioContext Initialization: Lazily constructs AudioContext upon first user touch/keypress.
  // 2. Master Gain Staging: Creates master GainNode connected directly to ctx.destination.
  // 3. State Resumption: Automatically calls ctx.resume() if suspended by browser autoplay policy.
// Create the AudioContext (webkit-prefixed fallback for old browsers) and the master gain node
// that every sound routes through. Idempotent.
init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);

    // Every sound connects to masterGain, so volume and mute are one-node changes instead of touching each sound.
    this.masterGain.connect(this.ctx.destination);
  }

  // Create the context if needed and resume it if the browser suspended it (autoplay policy). Cheap, so every
  // sound method and input handler calls it.
  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Adjust volume by delta, clamped to 0.1-1.0 (never fully silent; use mute for that). Returns the
  // new level as an integer percent for the HUD. While muted the gain stays at 0.
  setVolume(delta) {
    // Floor at 0.1 so the volume keys can never silently reach zero and make a parent think the game is broken.
    this.volumeLevel = Math.max(0.1, Math.min(1.0, this.volumeLevel + delta));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volumeLevel, this.ctx.currentTime);
    }
    return Math.round(this.volumeLevel * 100);
  }

  // Flip mute by setting master gain to 0 or back to the volume. Returns the new muted state.
  // Note: recorded voice clips use this.volumeLevel directly and are guarded by isMuted in speakWord.
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
  // Start/stop the Baby Shark loop. Starting resets to the first note; stopping cancels the pending
  // setTimeout so the sequence halts. Returns true when now playing.
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

  // Play ONE note of the song and schedule the next via setTimeout (so the loop is self-driven and
  // stoppable). Each phrase entry is [pitch Hz, duration s, bass pitch Hz, staccato flag]; a pitch
  // of 0 is a rest. babySharkStep walks the table modulo its length, which makes it loop forever.
  playBabySharkSequence() {
    if (!this.babySharkRunning || !this.ctx) return;

    // Frequencies in Hz for equal temperament: D4 = 293.66 is the melody's tonic. G3/D3 are an octave below and form the bass line.
    // Pitch frequencies
    const D4 = 293.66;
    const E4 = 329.63;
    const G4 = 392.00;
    const Fs4 = 369.99;
    const G3 = 196.00;
    const D3 = 146.83;

    // Phrase notes: [pitch, durationSeconds, bassPitch, isStaccato]
    // Note table: three 'Baby shark doo doo...' phrases, each followed by a short breath rest, then the
    // closing 'Baby shark!' and a longer pause before the loop restarts.
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

    // Modulo wraps the step counter, so the song repeats forever until toggled off.
    const note = phrase[this.babySharkStep % phrase.length];
    const pitch = note[0];
    const dur = note[1];
    const bass = note[2];

    if (pitch > 0) {
      // Melody note plus (when a bass note is given) a bass pluck and a drum tap for rhythm.
      this.playMarimbaTone(pitch, dur);
      if (bass > 0) {
        this.playBassPluck(bass, dur);
        // Add upbeat percussion tap
        this.playDrumTap();
      }
    }

    // Next note is scheduled for exactly this note's duration, which keeps the tempo even. setTimeout drifts slightly, which is acceptable for a toddler song.
    this.babySharkStep++;
    this.babySharkTimer = setTimeout(() => {
      this.playBabySharkSequence();
    }, dur * 1000);
  }

  // Melody voice: triangle wave with a 15 ms attack and exponential decay, giving a soft wooden-mallet tone.
  playMarimbaTone(freq, dur) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm wooden chime timbre
    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  // Bass voice: sine that glides down ~15% over its length, like a plucked string.
  playBassPluck(freq, dur) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + dur);

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  // Short soft kick: sine sweeping 140 Hz -> 45 Hz in 80 ms.
  playDrumTap() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // ==========================================
  // 🦁 10+ PROCEDURAL ANIMAL SOUND GENERATORS
  // ==========================================

  // 1. Cow (Moooo)
  // Low sawtooth glide (125 -> 95 Hz) through a low-pass filter for a muffled 'moo'.
  playCowMoo() {
    this.ensureContext();

    // Muted engines create no nodes at all, which saves CPU and means nothing is queued up that could play later when unmuted.
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

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 1.25);
  }

  // 2. Duck (Quack Quack)
  // Two quick quacks: falling sawtooth through a band-pass filter near 850 Hz. Also reused as the generic 'water' sound.
  playDuckQuack() {
    this.ensureContext();
    if (this.isMuted) return;

    // Two repeats offset by `delay` seconds on the audio clock (not setTimeout), so the quacks are sample-accurate.
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

      // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
      osc.start(now);
      osc.stop(now + 0.19);
    }
  }

  // 3. Dog (Woof Woof!)
  // Two short barks: triangle wave dropping 280 -> 90 Hz in 140 ms.
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

      // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
      osc.connect(gain);
      gain.connect(this.masterGain);

      // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
      osc.start(now);
      osc.stop(now + 0.15);
    }
  }

  // 4. Cat (Meowww)
  // Sawtooth sweep up to 680 Hz then down to 320 Hz through a band-pass filter, like a rising-falling 'meow'.
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

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.9);
  }

  // 5. Sheep (Baaaa!)
  // Sawtooth with tremolo: a slow 11 Hz oscillator is connected to the gain param itself (AM), giving the bleating wobble.
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

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.95);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    tremolo.start(now);
    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    tremolo.stop(now + 1.0);
    osc.stop(now + 1.0);
  }

  // 6. Lion (Rooaaar!)
  // Low sawtooth falling 110 -> 65 Hz; the low-pass cutoff opens then closes (320 -> 700 -> 200 Hz) to shape the roar.
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

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 1.45);
  }

  // 7. Frog (Ribbit Ribbit)
  // Three rapid short square-wave blips falling 95 -> 60 Hz.
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

      // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
      osc.connect(gain);
      gain.connect(this.masterGain);

      // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
      osc.start(now);
      osc.stop(now + 0.09);
    }
  }

  // 8. Elephant (Trumpet Pawoo!)
  // Sawtooth sweep up from 260 to 540 Hz (easing to 480 Hz) with a swell-then-fade envelope.
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

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.95);
  }

  // 9. Songbird (Tweet Tweet!)
  // Three high sine chirps (2400 -> 3600 -> 2200 Hz in under 0.1 s each), 140 ms apart.
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

      // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
      osc.connect(gain);
      gain.connect(this.masterGain);

      // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  // 10. Dino (Roar!)
  // Very low sawtooth falling 90 -> 45 Hz through a resonant (Q=8) low-pass filter.
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

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 1.55);
  }

  // 11. Owl (Hoo Hoo)
  // Two soft sine hoots (480 -> 420 Hz) with a gentle attack, 350 ms apart.
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

      // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
      osc.connect(gain);
      gain.connect(this.masterGain);

      // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  // 12. Rooster (Cock-a-doodle-doo)
  // Four rising notes scheduled back-to-back; timeAcc accumulates 90% of each duration so notes slightly
  // overlap, making a 'cock-a-doodle-doo' phrase.
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

      // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

      // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
      osc.connect(gain);
      gain.connect(this.masterGain);

      // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
      osc.start(now);
      osc.stop(now + dur + 0.02);
      timeAcc += dur * 0.9;
    });
  }

  // ==========================================
  // 💥 COMICAL SOUND EFFECTS & INSTRUMENTS
  // ==========================================

  // Cartoon spring: sine rising from 150 to 600 Hz.
  playBoing() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.35);

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Classic 'pew': sawtooth falling fast from 980 to 60 Hz in 220 ms.
  playLaser() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Explosion: triangle wave plunging 120 -> 30 Hz with a loud start and exponential decay.
  playBoom() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.7);
  }

  // Arpeggio of C5-E5-G5-C6 sine tones started 80 ms apart (overlapping bell-like fanfare).
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

      // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
      osc.connect(gain);
      gain.connect(this.masterGain);

      // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  // Six square-wave notes 70 ms apart, video-game style jingle.
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

      // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
      osc.connect(gain);
      gain.connect(this.masterGain);

      // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
      osc.start(now);
      osc.stop(now + 0.18);
    });
  }

  // Sawtooth rising 370 -> 520 Hz like a party blower.
  playPartyHorn() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(370, now);
    osc.frequency.linearRampToValueAtTime(520, now + 0.3);

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Sine rising quickly 300 -> 1400 Hz.
  playSlideWhistle() {
    this.ensureContext();
    if (this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Fake drum hit: a boom followed 120 ms later by a laser blip as the snare.
  playDrumKit() {
    this.ensureContext();
    if (this.isMuted) return;
    // Kick + Snare burst
    this.playBoom();
    setTimeout(() => {
      this.playLaser();
    }, 120);
  }

  // Power-up swell: low sawtooth rising 60 -> 180 Hz while a band-pass filter sweeps 300 -> 800 Hz.
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

    // Volume envelope on the audio clock: an initial level, then a ramp to a near-silent 0.01 (exponential ramps cannot reach exactly 0).
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    // Wire the graph: oscillator -> (filter) -> gain envelope -> master volume -> speakers.
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Start now and stop just after the envelope ends so the nodes can be garbage-collected.
    osc.start(now);
    osc.stop(now + 0.9);
  }

  // ==========================================
  // 🗣️ TODDLER SPEECH / DAD VOICE ENGINE
  // ==========================================
  // Say a word aloud. Preference order:
  //   1. A recorded Dad-voice clip: manifest key '<code>_<n>' (n = cycle index + 1), else '<code>'.
  //   2. Optionally preceded by the '<code>_intro' clip ('A is for...'): always the first time for a key,
  //      then 55% of the time afterwards.
  //   3. Browser speech synthesis (playSpeechSynthFallback) if no clip exists or playback fails.
  // Any voice still playing is stopped first so words never overlap.
  // `text` is what the child sees on the banner; keyCode and cycleIdx pick which recorded clip matches it (see manifest naming above).
  speakWord(text, keyCode, cycleIdx = 0) {
    if (this.isMuted) return;

    // Stop previous voice playback if still speaking
    // Without stopping the previous clip, mashing keys would stack voices into noise; a toddler presses many keys per second.
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      } catch (e) {}
      this.currentVoiceAudio = null;
    }

    // Check if Dad's custom voice file is recorded for this specific cycle word or general key!
    // Specific per-variant clip first, then the key-wide clip.
    // Manifest keys: KeyA_1 / KeyA_2 / KeyA_3 for the three words of a letter, KeyA for a single clip, KeyA_intro for "A is for...".
    const partKey = `${keyCode}_${cycleIdx + 1}`;
    const clipPath = (this.dadVoiceManifest && this.dadVoiceManifest[partKey]) ||
                     (this.dadVoiceManifest && this.dadVoiceManifest[keyCode]);
    const introPath = this.dadVoiceManifest && this.dadVoiceManifest[`${keyCode}_intro`];

    // "Letter is for..." Phonics logic:
    // User requested: sometimes say "A is for..." before the word so that
    // all variants (Apple, Aerodactyl, Astronaut) experience "the letter is for"
    // Lazily created record of which keys have already had their intro played.
    if (!this._letterIntroPlayed) this._letterIntroPlayed = {};

    // The intro always plays on a key's first press, then only about half the time so repeated presses do not become tiresome.
    const shouldPlayIntro = !!introPath && (!this._letterIntroPlayed[keyCode] || Math.random() < 0.55);
    this._letterIntroPlayed[keyCode] = true;

    if (clipPath) {
      try {
        if (shouldPlayIntro) {
          const introAudio = new Audio(introPath);
          introAudio.volume = this.volumeLevel;
          this.currentVoiceAudio = introAudio;

          // Chain: when the intro clip ends, play the word clip (errors ignored).
          // Chained with onended rather than played together so the intro and the word never overlap.
          introAudio.onended = () => {
            try {
              const wordAudio = new Audio(clipPath);
              wordAudio.volume = this.volumeLevel;
              this.currentVoiceAudio = wordAudio;
              wordAudio.play().catch(() => {});
            } catch (e) {}
          };

          // play() rejects when autoplay is blocked or the file is missing; the word clip is tried directly, and if that also fails speech synthesis takes over.
          introAudio.play().catch(() => {
            // Fallback directly to the word clip
            const wordAudio = new Audio(clipPath);
            wordAudio.volume = this.volumeLevel;
            this.currentVoiceAudio = wordAudio;
            wordAudio.play().catch(() => this.playSpeechSynthFallback(text, keyCode));
          });
          return;
        } else {
          const wordAudio = new Audio(clipPath);
          wordAudio.volume = this.volumeLevel;
          this.currentVoiceAudio = wordAudio;
          wordAudio.play().catch(() => {
            // Reached when there is no clip, or setting one up threw: the child still hears the word.
            this.playSpeechSynthFallback(text, keyCode);
          });
          return;
        }
      } catch (e) {
        // Fall back to synth
      }
    }

    this.playSpeechSynthFallback(text, keyCode);
  }

  // Speak with the browser's speech synthesis. Emojis are stripped so they are not read out. For letter
  // keys, 55% of the time the phrase becomes 'A is for APPLE', matching the clip behaviour above.
  playSpeechSynthFallback(text, keyCode) {
    // Some embedded browsers lack speech synthesis; silently skipping is better than throwing inside a key handler.
    if (!('speechSynthesis' in window)) return;
    try {
      // Cancel anything queued so the new word is heard immediately.
      window.speechSynthesis.cancel(); // clear queue for instant responsiveness
      let phrase = text;
      // Strip emojis from text for clean speech synthesis
      // The Unicode emoji property removes pictographs that synthesis would read as long names ("red apple"). The `u` flag is required for the property escape. Note: this class also matches digits, so a number in the text is stripped too.
      const cleanWord = text.replace(/[\p{Emoji}\u200d]+/gu, '').trim();
      if (keyCode && keyCode.startsWith('Key') && Math.random() < 0.55) {
        const letter = keyCode.slice(3);
        phrase = `${letter} is for ${cleanWord}`;
      } else {
        phrase = cleanWord;
      }
      const utter = new SpeechSynthesisUtterance(phrase);
      // Slightly high pitch and slower rate to suit a toddler audience.
      utter.pitch = 1.35; // friendly toddler pitch
      utter.rate = 0.95;  // easy to hear
      window.speechSynthesis.speak(utter);
    } catch (e) {
      // safe fallback if speech is blocked
    }
  }
}

// Global Audio Singleton
// Global singleton shared with effects.js, anime.js and keys.js through window.audioEngine.
window.audioEngine = new SoundEngine();
