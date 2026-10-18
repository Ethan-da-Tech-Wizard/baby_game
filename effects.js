/**
 * Baby Game Screen Effects Engine
 * Massive visual transformations, particle engines, and ambient layer manager
 */

class EffectsEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Transient Particle Systems
    this.confetti = [];
    this.fireworks = [];
    this.bouncingBalls = [];
    this.floatingBubbles = [];
    this.candyRain = [];
    this.emojis = [];
    this.lasers = [];
    this.lightningBolts = [];

    // Persistent Ambient Layers & State
    this.activeLayers = {
      matrixRain: 0,     // 0=off, 1=low, 2=high
      rainStorm: 0,      // 0=off, 1=gentle, 2=storm
      rainbow: false,
      galaxyWarp: 0,     // 0=off, 1=cruising, 2=hyperdrive
      laserGrid: false,
      floatingHearts: false,
      crtScanlines: false,
      discoStrobe: false,
      reverseGravity: false,
      bulletTime: false
    };

    // Matrix Rain state
    this.matrixDrops = [];

    // Starfield state
    this.stars = [];
    this.initStarfield();

    // Resize handling
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Start Main Render Loop
    this.lastTime = performance.now();
    this.renderLoop = this.renderLoop.bind(this);
    requestAnimationFrame(this.renderLoop);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Reinit matrix columns
    const columns = Math.floor(this.width / 22);
    this.matrixDrops = [];
    for (let i = 0; i < columns; i++) {
      this.matrixDrops[i] = Math.floor(Math.random() * -50);
    }
  }

  initStarfield() {
    this.stars = [];
    for (let i = 0; i < 200; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1600,
        z: Math.random() * 1000 + 10,
        size: Math.random() * 2 + 1,
        color: ['#fff', '#67e8f9', '#fbcfe8', '#fef08a'][Math.floor(Math.random() * 4)]
      });
    }
  }

  // ==========================================
  // ⚡ INSTANTANEOUS VISUAL TRIGGERS
  // ==========================================

  triggerFlash() {
    const strobe = document.getElementById('strobe-overlay');
    strobe.classList.remove('flash');
    void strobe.offsetWidth; // trigger reflow
    strobe.classList.add('flash');
  }

  triggerScreenShake(isViolent = false) {
    const cls = isViolent ? 'shake-quake' : 'shake-gentle';
    document.body.classList.remove('shake-gentle', 'shake-quake');
    void document.body.offsetWidth;
    document.body.classList.add(cls);
    setTimeout(() => {
      document.body.classList.remove(cls);
    }, isViolent ? 600 : 300);
  }

  showSplashBanner(letter, word, imgUrl = null, emoji = null) {
    const banner = document.getElementById('splash-banner');
    const letterEl = document.getElementById('splash-letter');
    const wordEl = document.getElementById('splash-word');
    const imgEl = document.getElementById('splash-img');
    const emojiEl = document.getElementById('splash-emoji');

    letterEl.innerText = letter;
    wordEl.innerText = word;

    if (imgUrl) {
      imgEl.src = imgUrl;
      imgEl.classList.remove('hidden');
      if (emojiEl) emojiEl.classList.add('hidden');
    } else if (emoji) {
      if (emojiEl) {
        emojiEl.innerText = emoji;
        emojiEl.classList.remove('hidden');
      }
      imgEl.classList.add('hidden');
    } else {
      imgEl.classList.add('hidden');
      if (emojiEl) emojiEl.classList.add('hidden');
    }

    banner.classList.remove('hidden');
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => {
      banner.classList.add('hidden');
    }, 2400);
  }

  // 1. Confetti Cannon Blast
  spawnConfetti(count = 200) {
    const colors = ['#ff2a6d', '#05d9e8', '#ffec3d', '#00f076', '#a855f7', '#ff6b6b'];
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: this.width * 0.5 + (Math.random() - 0.5) * 200,
        y: this.height * 0.5 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 28,
        vy: -Math.random() * 25 - 5,
        size: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 15,
        alpha: 1.0
      });
    }
  }

  // 2. Fireworks Blast
  spawnFireworks(x, y) {
    const fx = x || Math.random() * (this.width * 0.8) + this.width * 0.1;
    const fy = y || Math.random() * (this.height * 0.5) + this.height * 0.15;
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#34d399', '#c084fc', '#ffffff'];
    const hue = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 3;
      this.fireworks.push({
        x: fx,
        y: fy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: hue,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.012
      });
    }
  }

  // 3. Lightning Flash with Jagged Forked Branches
  spawnLightningBolt() {
    this.triggerFlash();
    this.triggerScreenShake(false);

    const startX = Math.random() * (this.width * 0.8) + this.width * 0.1;
    const segments = [];
    let curX = startX;
    let curY = 0;

    while (curY < this.height * 0.85) {
      const nextX = curX + (Math.random() - 0.5) * 80;
      const nextY = curY + Math.random() * 60 + 20;
      segments.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });
      curX = nextX;
      curY = nextY;
    }

    this.lightningBolts.push({
      segments: segments,
      alpha: 1.0,
      width: Math.random() * 5 + 4
    });
  }

  // 4. Bouncing Beach Balls (Physics)
  spawnBouncingBall(x, y) {
    const colors = ['#f43f5e', '#06b6d4', '#eab308', '#84cc16', '#a855f7'];
    this.bouncingBalls.push({
      x: x || Math.random() * this.width,
      y: y || 80,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -10,
      radius: Math.random() * 35 + 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      bounceFactor: 0.82
    });
  }

  // 5. Floating Soap Bubbles
  spawnBubble(x, y) {
    this.floatingBubbles.push({
      x: x || Math.random() * this.width,
      y: y || this.height + 40,
      radius: Math.random() * 32 + 18,
      speedY: -(Math.random() * 2.5 + 1.2),
      wobbleSpeed: Math.random() * 0.05 + 0.02,
      wobbleOffset: Math.random() * Math.PI * 2,
      alpha: 0.75
    });
  }

  // 6. Candy & Donut Rain
  spawnCandyRain(count = 15) {
    const treats = ['🍩', '🍭', '🍬', '🍦', '🧁', '🍪', '🍎', '🍓', '🍌', '🍕'];
    for (let i = 0; i < count; i++) {
      this.candyRain.push({
        x: Math.random() * this.width,
        y: -50 - Math.random() * 150,
        emoji: treats[Math.floor(Math.random() * treats.length)],
        speedY: Math.random() * 5 + 3,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 6,
        size: Math.random() * 24 + 28
      });
    }
  }

  // 7. Bouncing Emojis
  spawnEmojiBurst(count = 15) {
    const emojis = ['😃', '🤩', '🥳', '😎', '🎉', '🌟', '🦄', '🐶', '🚀', '🌈'];
    for (let i = 0; i < count; i++) {
      this.emojis.push({
        x: this.width * 0.5,
        y: this.height * 0.5,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.5) * 22 - 6,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 28 + 32,
        alpha: 1.0
      });
    }
  }

  // 8. Laser Beam Shot
  spawnLaserBeam() {
    this.lasers.push({
      y: Math.random() * (this.height * 0.7) + this.height * 0.15,
      thickness: Math.random() * 18 + 8,
      color: ['#05d9e8', '#ff2a6d', '#00f076', '#ffec3d'][Math.floor(Math.random() * 4)],
      alpha: 1.0
    });
  }

  // ==========================================
  // 🔄 AMBIENT LAYER TOGGLES & CYCLES
  // ==========================================

  cycleMatrixRain() {
    this.activeLayers.matrixRain = (this.activeLayers.matrixRain + 1) % 3;
    return this.activeLayers.matrixRain;
  }

  cycleRainStorm() {
    this.activeLayers.rainStorm = (this.activeLayers.rainStorm + 1) % 3;
    return this.activeLayers.rainStorm;
  }

  toggleRainbow() {
    this.activeLayers.rainbow = !this.activeLayers.rainbow;
    return this.activeLayers.rainbow;
  }

  cycleGalaxyWarp() {
    this.activeLayers.galaxyWarp = (this.activeLayers.galaxyWarp + 1) % 3;
    return this.activeLayers.galaxyWarp;
  }

  toggleLaserGrid() {
    this.activeLayers.laserGrid = !this.activeLayers.laserGrid;
    return this.activeLayers.laserGrid;
  }

  toggleFloatingHearts() {
    this.activeLayers.floatingHearts = !this.activeLayers.floatingHearts;
    return this.activeLayers.floatingHearts;
  }

  toggleCRTScanlines() {
    this.activeLayers.crtScanlines = !this.activeLayers.crtScanlines;
    const crt = document.getElementById('crt-overlay');
    crt.classList.toggle('active', this.activeLayers.crtScanlines);
    return this.activeLayers.crtScanlines;
  }

  toggleDiscoStrobe() {
    this.activeLayers.discoStrobe = !this.activeLayers.discoStrobe;
    const disco = document.getElementById('disco-overlay');
    disco.classList.toggle('active', this.activeLayers.discoStrobe);
    return this.activeLayers.discoStrobe;
  }

  toggleInvertColors() {
    const invert = document.getElementById('invert-overlay');
    invert.classList.toggle('active');
  }

  toggleReverseGravity() {
    this.activeLayers.reverseGravity = !this.activeLayers.reverseGravity;
    return this.activeLayers.reverseGravity;
  }

  toggleBulletTime() {
    this.activeLayers.bulletTime = !this.activeLayers.bulletTime;
    return this.activeLayers.bulletTime;
  }

  clearAllLayers() {
    this.confetti = [];
    this.fireworks = [];
    this.bouncingBalls = [];
    this.floatingBubbles = [];
    this.candyRain = [];
    this.emojis = [];
    this.lasers = [];
    this.lightningBolts = [];

    this.activeLayers.matrixRain = 0;
    this.activeLayers.rainStorm = 0;
    this.activeLayers.rainbow = false;
    this.activeLayers.galaxyWarp = 0;
    this.activeLayers.laserGrid = false;
    this.activeLayers.floatingHearts = false;
    this.activeLayers.crtScanlines = false;
    this.activeLayers.discoStrobe = false;
    this.activeLayers.reverseGravity = false;
    this.activeLayers.bulletTime = false;

    document.getElementById('crt-overlay').classList.remove('active');
    document.getElementById('disco-overlay').classList.remove('active');
    document.getElementById('invert-overlay').classList.remove('active');
    document.body.classList.remove('shake-gentle', 'shake-quake');
  }

  // ==========================================
  // 🎨 MAIN ANIMATION LOOP
  // ==========================================

  renderLoop(timeNow) {
    const delta = (timeNow - this.lastTime) * 0.001;
    this.lastTime = timeNow;
    const timeScale = this.activeLayers.bulletTime ? 0.3 : 1.0;

    // 1. Render Anime Backdrop Layer
    if (window.animeEngine) {
      window.animeEngine.render(this.ctx, this.width, this.height);
    } else {
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 2. Galaxy Warp Layer
    if (this.activeLayers.galaxyWarp > 0) {
      this.renderStarfield(timeScale);
    }

    // 3. Persistent Sky Rainbow
    if (this.activeLayers.rainbow) {
      this.renderRainbow();
    }

    // 4. Matrix Digital Rain Layer
    if (this.activeLayers.matrixRain > 0) {
      this.renderMatrixRain(timeScale);
    }

    // 5. Rainstorm Cloud & Droplets Layer
    if (this.activeLayers.rainStorm > 0) {
      this.renderRainStorm(timeScale);
    }

    // 6. Laser Grid Layer
    if (this.activeLayers.laserGrid) {
      this.renderLaserGrid(timeNow * 0.002);
    }

    // 7. Dancing Pokémon Troupe Layer
    if (window.pokemonEngine) {
      window.pokemonEngine.render(this.ctx, this.width, this.height);
    }

    // 8. Render Particles & Physics Objects
    this.updateAndDrawBouncingBalls(timeScale);
    this.updateAndDrawBubbles(timeScale);
    this.updateAndDrawCandyRain(timeScale);
    this.updateAndDrawConfetti(timeScale);
    this.updateAndDrawFireworks(timeScale);
    this.updateAndDrawEmojis(timeScale);
    this.updateAndDrawLasers();
    this.updateAndDrawLightning();

    if (this.activeLayers.floatingHearts) {
      this.renderFloatingHearts(timeNow * 0.003);
    }

    requestAnimationFrame(this.renderLoop);
  }

  // Rainbow Arch
  renderRainbow() {
    this.ctx.save();
    const cx = this.width * 0.5;
    const cy = this.height * 0.95;
    const rainbowColors = [
      'rgba(239, 68, 68, 0.45)',
      'rgba(249, 115, 22, 0.45)',
      'rgba(234, 179, 8, 0.45)',
      'rgba(34, 197, 94, 0.45)',
      'rgba(59, 130, 246, 0.45)',
      'rgba(168, 85, 247, 0.45)'
    ];

    const baseRadius = Math.min(this.width, this.height) * 0.6;
    for (let i = 0; i < rainbowColors.length; i++) {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, baseRadius + i * 18, Math.PI, Math.PI * 2);
      this.ctx.strokeStyle = rainbowColors[i];
      this.ctx.lineWidth = 18;
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // Starfield Warp
  renderStarfield(timeScale) {
    this.ctx.save();
    const cx = this.width * 0.5;
    const cy = this.height * 0.5;
    const speed = (this.activeLayers.galaxyWarp === 2 ? 38 : 12) * timeScale;

    for (let s of this.stars) {
      s.z -= speed;
      if (s.z <= 0) {
        s.z = 1000;
        s.x = (Math.random() - 0.5) * 1600;
        s.y = (Math.random() - 0.5) * 1600;
      }

      const k = 400 / s.z;
      const px = s.x * k + cx;
      const py = s.y * k + cy;

      if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
        const rad = Math.max(0.5, (1 - s.z / 1000) * 4);
        this.ctx.beginPath();
        this.ctx.arc(px, py, rad, 0, Math.PI * 2);
        this.ctx.fillStyle = s.color;
        this.ctx.fill();

        // Warp Streak
        if (this.activeLayers.galaxyWarp === 2) {
          const prevK = 400 / (s.z + speed * 2);
          const oldPx = s.x * prevK + cx;
          const oldPy = s.y * prevK + cy;
          this.ctx.strokeStyle = s.color;
          this.ctx.lineWidth = rad;
          this.ctx.beginPath();
          this.ctx.moveTo(oldPx, oldPy);
          this.ctx.lineTo(px, py);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.restore();
  }

  // Matrix Rain
  renderMatrixRain(timeScale) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 255, 120, 0.85)';
    this.ctx.font = '18px monospace';
    const glyphs = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';

    for (let i = 0; i < this.matrixDrops.length; i++) {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * 22;
      const y = this.matrixDrops[i] * 22;

      this.ctx.fillText(char, x, y);

      if (y > this.height && Math.random() > 0.975) {
        this.matrixDrops[i] = 0;
      }
      this.matrixDrops[i] += (this.activeLayers.matrixRain === 2 ? 1.8 : 1.0) * timeScale;
    }
    this.ctx.restore();
  }

  // Rainstorm & Cloud
  renderRainStorm(timeScale) {
    this.ctx.save();
    const count = this.activeLayers.rainStorm === 2 ? 60 : 25;
    this.ctx.strokeStyle = 'rgba(125, 211, 252, 0.7)';
    this.ctx.lineWidth = 2;

    for (let i = 0; i < count; i++) {
      const rx = (Math.random() * this.width);
      const ry = (Math.random() * this.height);
      const len = 25;
      this.ctx.beginPath();
      this.ctx.moveTo(rx, ry);
      this.ctx.lineTo(rx - 6, ry + len);
      this.ctx.stroke();
    }

    // Top Thundercloud
    this.ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    this.ctx.beginPath();
    this.ctx.ellipse(this.width * 0.5, 0, this.width * 0.6, 90, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  // Laser Grid
  renderLaserGrid(phase) {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 42, 109, 0.4)';
    this.ctx.lineWidth = 2;

    // Horizontal Scanning Lines
    for (let y = 0; y < this.height; y += 40) {
      const offset = Math.sin(phase + y * 0.05) * 15;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + offset);
      this.ctx.lineTo(this.width, y + offset);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // Physics Bouncing Balls
  updateAndDrawBouncingBalls(timeScale) {
    const gravity = (this.activeLayers.reverseGravity ? -0.4 : 0.45) * timeScale;
    for (let i = this.bouncingBalls.length - 1; i >= 0; i--) {
      const b = this.bouncingBalls[i];
      b.vy += gravity;
      b.x += b.vx * timeScale;
      b.y += b.vy * timeScale;

      // Floor & Ceiling bounce
      if (b.y + b.radius >= this.height) {
        b.y = this.height - b.radius;
        b.vy = -b.vy * b.bounceFactor;
      } else if (b.y - b.radius <= 0) {
        b.y = b.radius;
        b.vy = -b.vy * b.bounceFactor;
      }

      // Wall bounce
      if (b.x + b.radius >= this.width || b.x - b.radius <= 0) {
        b.vx = -b.vx * 0.9;
        b.x = Math.max(b.radius, Math.min(this.width - b.radius, b.x));
      }

      // Draw Ball
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = b.color;
      this.ctx.shadowColor = b.color;
      this.ctx.shadowBlur = 15;
      this.ctx.fill();

      // Cute Smiling Face on Ball
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.15, b.radius * 0.15, 0, Math.PI * 2);
      this.ctx.arc(b.x + b.radius * 0.3, b.y - b.radius * 0.15, b.radius * 0.15, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#000';
      this.ctx.beginPath();
      this.ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.15, b.radius * 0.08, 0, Math.PI * 2);
      this.ctx.arc(b.x + b.radius * 0.3, b.y - b.radius * 0.15, b.radius * 0.08, 0, Math.PI * 2);
      this.ctx.fill();

      // Smile mouth
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y + b.radius * 0.1, b.radius * 0.3, 0.1, Math.PI - 0.1);
      this.ctx.stroke();

      this.ctx.restore();
    }
  }

  // Floating Soap Bubbles
  updateAndDrawBubbles(timeScale) {
    this.ctx.save();
    for (let i = this.floatingBubbles.length - 1; i >= 0; i--) {
      const b = this.floatingBubbles[i];
      b.y += b.speedY * timeScale;
      b.wobbleOffset += b.wobbleSpeed;
      const curX = b.x + Math.sin(b.wobbleOffset) * 12;

      if (b.y < -50) {
        this.floatingBubbles.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(curX, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      this.ctx.lineWidth = 3;
      this.ctx.fill();
      this.ctx.stroke();

      // Shiny Bubble Glint
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(curX - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.22, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  // Candy Rain
  updateAndDrawCandyRain(timeScale) {
    this.ctx.save();
    for (let i = this.candyRain.length - 1; i >= 0; i--) {
      const c = this.candyRain[i];
      c.y += c.speedY * timeScale;
      c.rotation += c.spin * timeScale;

      if (c.y > this.height + 60) {
        this.candyRain.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.font = `${c.size}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(c.emoji, 0, 0);
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  // Confetti
  updateAndDrawConfetti(timeScale) {
    this.ctx.save();
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx * timeScale;
      c.y += c.vy * timeScale;
      c.vy += 0.45 * timeScale; // gravity
      c.rotation += c.spin * timeScale;
      c.alpha -= 0.007 * timeScale;

      if (c.alpha <= 0 || c.y > this.height + 40) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.fillStyle = c.color;
      this.ctx.globalAlpha = c.alpha;
      this.ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  // Fireworks
  updateAndDrawFireworks(timeScale) {
    this.ctx.save();
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const f = this.fireworks[i];
      f.x += f.vx * timeScale;
      f.y += f.vy * timeScale;
      f.vy += 0.15 * timeScale;
      f.alpha -= f.decay * timeScale;

      if (f.alpha <= 0) {
        this.fireworks.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      this.ctx.fillStyle = f.color;
      this.ctx.globalAlpha = f.alpha;
      this.ctx.shadowColor = f.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  // Emojis
  updateAndDrawEmojis(timeScale) {
    this.ctx.save();
    for (let i = this.emojis.length - 1; i >= 0; i--) {
      const e = this.emojis[i];
      e.x += e.vx * timeScale;
      e.y += e.vy * timeScale;
      e.vy += 0.3 * timeScale;
      e.alpha -= 0.012 * timeScale;

      if (e.alpha <= 0 || e.y > this.height + 50) {
        this.emojis.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = e.alpha;
      this.ctx.font = `${e.size}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(e.emoji, e.x, e.y);
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  // Laser Beams
  updateAndDrawLasers() {
    this.ctx.save();
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.alpha -= 0.08;
      if (l.alpha <= 0) {
        this.lasers.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(0, l.y);
      this.ctx.lineTo(this.width, l.y);
      this.ctx.strokeStyle = l.color;
      this.ctx.lineWidth = l.thickness;
      this.ctx.globalAlpha = l.alpha;
      this.ctx.shadowColor = l.color;
      this.ctx.shadowBlur = 20;
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // Lightning
  updateAndDrawLightning() {
    this.ctx.save();
    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      const b = this.lightningBolts[i];
      b.alpha -= 0.12;
      if (b.alpha <= 0) {
        this.lightningBolts.splice(i, 1);
        continue;
      }

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.shadowBlur = 25;
      this.ctx.lineWidth = b.width;
      this.ctx.globalAlpha = b.alpha;

      for (let seg of b.segments) {
        this.ctx.beginPath();
        this.ctx.moveTo(seg.x1, seg.y1);
        this.ctx.lineTo(seg.x2, seg.y2);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }

  // Floating Hearts
  renderFloatingHearts(phase) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(244, 63, 94, 0.75)';
    this.ctx.font = '32px Arial';
    for (let i = 0; i < 15; i++) {
      let x = (this.width / 15) * i + Math.sin(phase + i) * 20;
      let y = ((phase * 120 + i * 180) % (this.height + 100));
      this.ctx.fillText('❤️', x, this.height - y);
    }
    this.ctx.restore();
  }
}

// Global Effects Instance
window.effectsEngine = new EffectsEngine();
