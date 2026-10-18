/**
 * Baby Game Anime & Pokémon Troupe Engine
 * High-performance vector rendering for anime backdrops & dancing characters
 * Toddler-safe: Heroic action, energetic animations, strictly zero violence/nudity
 */

class AnimeBackdropEngine {
  constructor() {
    this.themes = ['dbz', 'naruto', 'luffy', 'pokemon'];
    this.themeNames = {
      dbz: '⚡ DBZ Super Saiyan Aura',
      naruto: '🍥 Naruto Ninja Dash & Rasengan',
      luffy: '🍖 Luffy Gear Rubber Sprint',
      pokemon: '🌴 Pokémon Island Adventure'
    };
    this.currentThemeIndex = 0;
    this.auraIntensity = 1.0;
    this.particles = [];
    this.leaves = [];
    this.steamPuffs = [];
    this.time = 0;

    // Init theme particle pools
    this.initParticles();
  }

  getCurrentTheme() {
    return this.themes[this.currentThemeIndex];
  }

  getThemeName() {
    return this.themeNames[this.getCurrentTheme()];
  }

  nextTheme() {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    this.initParticles();
    return this.getThemeName();
  }

  setTheme(name) {
    const idx = this.themes.indexOf(name);
    if (idx !== -1) {
      this.currentThemeIndex = idx;
      this.initParticles();
    }
  }

  initParticles() {
    this.particles = [];
    this.leaves = [];
    this.steamPuffs = [];

    // Pre-populate particles for backdrops
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 6 + 2,
        speedY: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 3,
        alpha: Math.random() * 0.8 + 0.2,
        hue: Math.random() > 0.5 ? 50 : 40 // Gold / yellow
      });
    }

    for (let i = 0; i < 35; i++) {
      this.leaves.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 12 + 8,
        speedX: -(Math.random() * 8 + 5),
        speedY: Math.random() * 3 - 1,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.1
      });
    }
  }

  render(ctx, width, height) {
    this.time += 0.04;
    const theme = this.getCurrentTheme();

    switch (theme) {
      case 'dbz':
        this.renderDBZTheme(ctx, width, height);
        break;
      case 'naruto':
        this.renderNarutoTheme(ctx, width, height);
        break;
      case 'luffy':
        this.renderLuffyTheme(ctx, width, height);
        break;
      case 'pokemon':
        this.renderPokemonIslandTheme(ctx, width, height);
        break;
    }
  }

  // 1. DBZ Super Saiyan Ki Aura Backdrop
  renderDBZTheme(ctx, width, height) {
    // Deep starry cosmic gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#110324');
    grad.addColorStop(0.5, '#290647');
    grad.addColorStop(1, '#571302');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Saiyan Ground / Mountain Crags
    ctx.fillStyle = '#1a0d00';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 120);
    ctx.lineTo(width * 0.25, height - 160);
    ctx.lineTo(width * 0.5, height - 130);
    ctx.lineTo(width * 0.75, height - 180);
    ctx.lineTo(width, height - 110);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Central Saiyan Golden Ki Aura
    const auraPulse = Math.sin(this.time * 4) * 0.15 + 0.85;
    const auraGrad = ctx.createRadialGradient(
      width / 2, height * 0.65, 50,
      width / 2, height * 0.65, width * 0.55 * auraPulse
    );
    auraGrad.addColorStop(0, 'rgba(255, 255, 120, 0.45)');
    auraGrad.addColorStop(0.3, 'rgba(255, 200, 0, 0.3)');
    auraGrad.addColorStop(0.7, 'rgba(255, 100, 0, 0.15)');
    auraGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, width, height);

    // Golden Flame Particle Streams (Rising from ground)
    ctx.save();
    for (let p of this.particles) {
      p.y -= p.speedY;
      p.x += Math.sin(this.time * 2 + p.y * 0.01) * 2;
      if (p.y < 0) {
        p.y = height + 10;
        p.x = width * 0.5 + (Math.random() - 0.5) * (width * 0.6);
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.alpha})`;
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 12;
      ctx.fill();
    }
    ctx.restore();

    // Lightning Sparks (Electric Ki)
    if (Math.random() < 0.25) {
      ctx.save();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      let sx = width / 2 + (Math.random() - 0.5) * (width * 0.4);
      let sy = height * 0.7;
      ctx.moveTo(sx, sy);
      for (let i = 0; i < 4; i++) {
        sx += (Math.random() - 0.5) * 60;
        sy -= Math.random() * 60 + 20;
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // 2. Naruto Ninja Dash & Swirling Rasengan
  renderNarutoTheme(ctx, width, height) {
    // Night Leaf Village Bamboo Forest
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#041324');
    grad.addColorStop(0.6, '#082f49');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Speed Lines (Anime Dash)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      let y = (height / 15) * i + Math.sin(this.time + i) * 10;
      let len = (Math.sin(this.time * 5 + i) * 0.5 + 0.5) * width * 0.4;
      ctx.beginPath();
      ctx.moveTo(width, y);
      ctx.lineTo(width - len, y);
      ctx.stroke();
    }
    ctx.restore();

    // Flying Ninja Leaves Swarm
    ctx.save();
    ctx.fillStyle = '#22c55e';
    for (let l of this.leaves) {
      l.x += l.speedX;
      l.y += l.speedY;
      l.angle += l.spin;
      if (l.x < -30) {
        l.x = width + 30;
        l.y = Math.random() * height;
      }
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size, l.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // Giant Swirling Cyan Rasengan Chakra Vortex (Right Center)
    const rx = width * 0.72;
    const ry = height * 0.55;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(this.time * 6);

    const rasGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
    rasGrad.addColorStop(0, '#ffffff');
    rasGrad.addColorStop(0.2, '#38bdf8');
    rasGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.4)');
    rasGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = rasGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.fill();

    // Spiraling Chakra Strands
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    for (let s = 0; s < 6; s++) {
      ctx.beginPath();
      let rot = (Math.PI * 2 / 6) * s;
      ctx.rotate(rot);
      ctx.moveTo(15, 0);
      ctx.quadraticCurveTo(50, 40, 110, 10);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 3. Luffy Gear Rubber Sprint & Action Vapor
  renderLuffyTheme(ctx, width, height) {
    // High energy tropical sunset & ocean sprint
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#ff4500');
    grad.addColorStop(0.4, '#ff8c00');
    grad.addColorStop(0.7, '#ffd700');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Ocean Surface with foam wakes
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, height * 0.78, width, height * 0.22);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let x = 0; x < width; x += 60) {
      const wave = Math.sin(this.time * 5 + x * 0.05) * 8;
      ctx.fillRect(x, height * 0.78 + wave, 45, 6);
    }

    // Dynamic Anime Action Radial Zoom Lines (Speed!)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    const cx = width * 0.35;
    const cy = height * 0.55;
    for (let a = 0; a < Math.PI * 2; a += 0.2) {
      if (Math.sin(a * 4 + this.time * 6) > 0.3) {
        ctx.beginPath();
        const r1 = 120 + Math.sin(a * 2) * 30;
        const r2 = width * 0.9;
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Gear 2 / Gear 5 Steam Vapor Rings
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 5; i++) {
      let puffX = cx - (i * 50) + Math.sin(this.time * 3 + i) * 15;
      let puffY = cy + Math.cos(this.time * 3 + i) * 25;
      let r = 35 + i * 15;
      ctx.beginPath();
      ctx.arc(puffX, puffY, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 4. Pokémon Island Adventure
  renderPokemonIslandTheme(ctx, width, height) {
    // Cheerful Blue Sky with Sunburst
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.5, '#7dd3fc');
    grad.addColorStop(1, '#a7f3d0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Golden Sun with Rays
    ctx.save();
    const sunX = width * 0.85;
    const sunY = 90;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 65, 0, Math.PI * 2);
    ctx.fill();

    // Rotating Sun Rays
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
    ctx.lineWidth = 6;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i + this.time * 0.5;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(angle) * 75, sunY + Math.sin(angle) * 75);
      ctx.lineTo(sunX + Math.cos(angle) * 110, sunY + Math.sin(angle) * 110);
      ctx.stroke();
    }
    ctx.restore();

    // Fluffy Moving Clouds
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (let c = 0; c < 4; c++) {
      let cx = ((this.time * 35 + c * 350) % (width + 300)) - 150;
      let cy = 80 + c * 45;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.arc(cx + 40, cy - 10, 45, 0, Math.PI * 2);
      ctx.arc(cx + 80, cy, 35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Rolling Green Hills
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 160);
    ctx.quadraticCurveTo(width * 0.35, height - 240, width * 0.7, height - 140);
    ctx.quadraticCurveTo(width * 0.85, height - 80, width, height - 130);
    ctx.lineTo(width, height);
    ctx.fill();

    // Front Meadow Grass
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 90);
    ctx.quadraticCurveTo(width * 0.5, height - 150, width, height - 80);
    ctx.lineTo(width, height);
    ctx.fill();
  }
}

/**
 * Dancing Pokémon Troupe Manager
 * Renders high-quality animated cartoon pocket monsters dancing in sync!
 */
class PokemonTroupeManager {
  constructor() {
    this.intensity = 0; // 0 = Off, 1 = Solo Pikachu, 2 = Duo, 3 = Full Crew, 4 = Rave
    this.maxIntensity = 4;
    this.time = 0;
  }

  toggle() {
    this.intensity = (this.intensity + 1) % (this.maxIntensity + 1);
    return this.intensity;
  }

  render(ctx, width, height) {
    if (this.intensity === 0) return;
    this.time += 0.08;

    const groundY = height * 0.75;
    const bounceBeat = Math.abs(Math.sin(this.time * 3));
    const sideWiggle = Math.sin(this.time * 3);

    // Intensity 1: Pikachu Solo
    if (this.intensity >= 1) {
      const pikaX = this.intensity === 1 ? width * 0.5 : width * 0.35;
      this.drawPikachu(ctx, pikaX, groundY, bounceBeat, sideWiggle);
    }

    // Intensity 2: Charmander
    if (this.intensity >= 2) {
      const charX = width * 0.65;
      this.drawCharmander(ctx, charX, groundY, bounceBeat, -sideWiggle);
    }

    // Intensity 3: Squirtle & Jigglypuff
    if (this.intensity >= 3) {
      const squirtX = width * 0.18;
      const puffX = width * 0.82;
      this.drawSquirtle(ctx, squirtX, groundY, bounceBeat, sideWiggle);
      this.drawJigglypuff(ctx, puffX, groundY - 40, bounceBeat, -sideWiggle);
    }

    // Intensity 4: Disco Sparkles & Spotlight
    if (this.intensity >= 4) {
      this.renderRaveDiscoBeams(ctx, width, height);
    }
  }

  // 🐹 Pikachu (Electric Mouse)
  drawPikachu(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 10, y - bounce * 35);

    // Drop Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 35 + bounce * 35, 55, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (Lightning bolt)
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(35, 5);
    ctx.lineTo(60, -20);
    ctx.lineTo(50, -20);
    ctx.lineTo(75, -50);
    ctx.lineTo(60, -45);
    ctx.lineTo(95, -75);
    ctx.lineTo(80, -35);
    ctx.lineTo(60, -10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Body (Chubby yellow)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, 10, 48, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.ellipse(0, -28, 42, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears (Wiggling!)
    const earWiggle = wiggle * 0.2;
    // Left Ear
    ctx.save();
    ctx.translate(-22, -60);
    ctx.rotate(-0.4 + earWiggle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ear tip black
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, -22, 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right Ear
    ctx.save();
    ctx.translate(22, -60);
    ctx.rotate(0.4 - earWiggle);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, -22, 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Eyes (Big sparkling anime eyes)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-16, -34, 7, 0, Math.PI * 2);
    ctx.arc(16, -34, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-18, -36, 3, 0, Math.PI * 2);
    ctx.arc(14, -36, 3, 0, Math.PI * 2);
    ctx.fill();

    // Red Cheeks (Glowing electric)
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-26, -20, 9, 0, Math.PI * 2);
    ctx.arc(26, -20, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Happy Mouth
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -18, 9, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Dancing Paws
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-22, 8 + wiggle * 8, 9, 0, Math.PI * 2);
    ctx.arc(22, 8 - wiggle * 8, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 🔥 Charmander (Fire Dragon)
  drawCharmander(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 10, y - bounce * 30);

    // Drop Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 35 + bounce * 30, 50, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail with Fire Flame
    ctx.save();
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-25, 20);
    ctx.quadraticCurveTo(-60, 10, -75, -20);
    ctx.quadraticCurveTo(-50, 0, -25, 30);
    ctx.fill();

    // Flame on tail tip (Flickering)
    const flameSize = 16 + Math.sin(this.time * 8) * 4;
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(-75, -22, flameSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-75, -20, flameSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Body (Orange)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, 10, 42, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cream Belly
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(4, 12, 24, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, -26, 38, 34, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blue Eyes
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(-14, -32, 6, 0, Math.PI * 2);
    ctx.arc(14, -32, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wide Grin
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.arc(0, -18, 12, 0, Math.PI);
    ctx.fill();
    // Little fang
    ctx.fillStyle = '#fff';
    ctx.fillRect(-3, -18, 3, 5);

    // Dancing Arms
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(-25, -2 + wiggle * 10, 8, 0, Math.PI * 2);
    ctx.arc(25, -2 - wiggle * 10, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 🐢 Squirtle (Water Turtle with Cool Sunglasses)
  drawSquirtle(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 8, y - bounce * 28);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 35 + bounce * 28, 48, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brown Shell back
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.arc(20, 12, 32, 0, Math.PI * 2);
    ctx.fill();

    // Body (Cyan)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, 10, 38, 34, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pale Yellow Shell Belly
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 12, 26, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, -25, 34, 0, Math.PI * 2);
    ctx.fill();

    // Cool Anime Sunglasses! (Squirtle Squad)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    // Pointy triangle shades
    ctx.moveTo(-32, -32);
    ctx.lineTo(-4, -32);
    ctx.lineTo(-18, -18);
    ctx.closePath();
    ctx.moveTo(4, -32);
    ctx.lineTo(32, -32);
    ctx.lineTo(18, -18);
    ctx.closePath();
    ctx.fill();

    // Glasses bridge
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-5, -30);
    ctx.lineTo(5, -30);
    ctx.stroke();

    // Happy Smirk
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -12, 8, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Floating Bubble Shower
    ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
    for (let b = 0; b < 3; b++) {
      let bx = Math.sin(this.time * 4 + b) * 30;
      let by = -50 - b * 18 - (this.time * 20 % 30);
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 🎤 Jigglypuff (Singing Pink Balloon)
  drawJigglypuff(ctx, x, y, bounce, wiggle) {
    ctx.save();
    const floatY = y + Math.sin(this.time * 3) * 20;
    ctx.translate(x + wiggle * 8, floatY);

    // Body (Round pink sphere)
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();

    // Cat-like Ears
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(-34, -20);
    ctx.lineTo(-24, -55);
    ctx.lineTo(-6, -38);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(34, -20);
    ctx.lineTo(24, -55);
    ctx.lineTo(6, -38);
    ctx.closePath();
    ctx.fill();

    // Inner ear black
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(-30, -24);
    ctx.lineTo(-24, -48);
    ctx.lineTo(-12, -36);
    ctx.closePath();
    ctx.fill();

    // Forehead Swirl Curl
    ctx.strokeStyle = '#db2777';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -32, 14, 0, Math.PI * 1.5);
    ctx.stroke();

    // Big Anime Eyes (Cyan)
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(-15, -6, 12, 0, Math.PI * 2);
    ctx.arc(15, -6, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-17, -8, 5, 0, Math.PI * 2);
    ctx.arc(13, -8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Singing O-mouth
    ctx.fillStyle = '#9d174d';
    ctx.beginPath();
    ctx.arc(0, 14, 7, 0, Math.PI * 2);
    ctx.fill();

    // Little microphone in hand
    ctx.fillStyle = '#64748b';
    ctx.fillRect(25, 6, 8, 22);
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(29, 6, 9, 0, Math.PI * 2);
    ctx.fill();

    // Musical Notes floating out
    ctx.fillStyle = '#ec4899';
    ctx.font = '22px Arial';
    ctx.fillText('♪', 15 + Math.sin(this.time * 4) * 10, -45);
    ctx.fillText('♫', -25 + Math.cos(this.time * 4) * 10, -55);

    ctx.restore();
  }

  // Rave Disco Beams (Intensity 4)
  renderRaveDiscoBeams(ctx, width, height) {
    ctx.save();
    const colors = ['#f43f5e', '#a855f7', '#06b6d4', '#eab308', '#22c55e'];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI / 4) * (i - 2) + Math.sin(this.time * 2 + i) * 0.3;
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 14;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2 + Math.tan(angle) * height, height);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// Global Instances
window.animeEngine = new AnimeBackdropEngine();
window.pokemonEngine = new PokemonTroupeManager();
