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
    this.intensity = 0; // 0 = Off, 1 = Kanto Titans, 2 = Kaiju & Dinosaurs, 3 = Early Route & Baby, 4 = MEGA ALL-POKEMON STAMPEDE!
    this.maxIntensity = 4;
    this.time = 0;

    // Optional spotlight single summons
    this.activeSummon = null; // e.g. 'kangaskhan', 'blastoise', 'charizard', etc.
    this.summonTimer = null;
  }

  toggle() {
    this.activeSummon = null;
    this.intensity = (this.intensity + 1) % (this.maxIntensity + 1);
    return this.intensity;
  }

  summon(name) {
    this.activeSummon = name;
    if (this.summonTimer) clearTimeout(this.summonTimer);
    // Persist or stay on for 12 seconds
    this.summonTimer = setTimeout(() => {
      this.activeSummon = null;
    }, 12000);
  }

  getSquadName() {
    const names = [
      'OFF',
      '🔥 Kanto Heavyweights (Charizard, Blastoise, Venusaur, Pikachu)',
      '🦖 Kaiju Giants (Kangaskhan & Baby, Nidoking, Aerodactyl)',
      '🐣 Early Route & Babies (Togepi, Zigzagoon, Starly)',
      '🌟 ULTIMATE 10-POKÉMON DANCE STAMPEDE! 🌟'
    ];
    return names[this.intensity] || 'Pokémon Dance Party';
  }

  render(ctx, width, height) {
    this.time += 0.08;
    const groundY = height * 0.76;
    const bounceBeat = Math.abs(Math.sin(this.time * 3.5));
    const sideWiggle = Math.sin(this.time * 3.5);

    // If a specific Pokémon was summoned by keypress, highlight them center-stage!
    if (this.activeSummon) {
      this.renderSpecificPokemon(ctx, this.activeSummon, width * 0.5, groundY, bounceBeat, sideWiggle);
    }

    if (this.intensity === 0) return;

    // SQUAD 1: Kanto Heavyweights (Pikachu, Charizard, Blastoise, Venusaur)
    if (this.intensity === 1 || this.intensity === 4) {
      const pScale = this.intensity === 4 ? 0.75 : 1.0;
      this.drawPikachu(ctx, width * 0.12, groundY, bounceBeat, sideWiggle, pScale);
      this.drawCharizard(ctx, width * 0.38, groundY, bounceBeat, sideWiggle);
      this.drawBlastoise(ctx, width * 0.62, groundY, bounceBeat, -sideWiggle);
      this.drawVenusaur(ctx, width * 0.86, groundY, bounceBeat, sideWiggle);
    }

    // SQUAD 2: Kaiju Giants (Kangaskhan & Baby, Nidoking, Aerodactyl)
    if (this.intensity === 2 || this.intensity === 4) {
      const kangaX = this.intensity === 4 ? width * 0.25 : width * 0.3;
      const nidoX = this.intensity === 4 ? width * 0.75 : width * 0.7;
      const aeroX = width * 0.5;

      this.drawKangaskhan(ctx, kangaX, groundY, bounceBeat, -sideWiggle);
      this.drawNidoking(ctx, nidoX, groundY, bounceBeat, sideWiggle);
      this.drawAerodactyl(ctx, aeroX, height * 0.28, bounceBeat, sideWiggle);
    }

    // SQUAD 3: Early Route & Cute Babies (Togepi, Zigzagoon, Starly)
    if (this.intensity === 3 || this.intensity === 4) {
      const togepiX = this.intensity === 4 ? width * 0.48 : width * 0.28;
      const zigX = this.intensity === 4 ? width * 0.92 : width * 0.52;
      const starX = this.intensity === 4 ? width * 0.08 : width * 0.78;

      this.drawTogepi(ctx, togepiX, groundY - 10, bounceBeat, sideWiggle);
      this.drawZigzagoon(ctx, zigX, groundY, bounceBeat, sideWiggle);
      this.drawStarly(ctx, starX, height * 0.45, bounceBeat, sideWiggle);
    }

    // Intensity 4: Disco Sparkles & Multi-Color Spotlight Rave
    if (this.intensity === 4) {
      this.renderRaveDiscoBeams(ctx, width, height);
    }
  }

  renderSpecificPokemon(ctx, name, x, y, bounce, wiggle) {
    switch (name.toLowerCase()) {
      case 'charizard':
        this.drawCharizard(ctx, x, y, bounce, wiggle);
        break;
      case 'blastoise':
        this.drawBlastoise(ctx, x, y, bounce, wiggle);
        break;
      case 'venusaur':
        this.drawVenusaur(ctx, x, y, bounce, wiggle);
        break;
      case 'kangaskhan':
        this.drawKangaskhan(ctx, x, y, bounce, wiggle);
        break;
      case 'nidoking':
        this.drawNidoking(ctx, x, y, bounce, wiggle);
        break;
      case 'aerodactyl':
        this.drawAerodactyl(ctx, x, y - 160, bounce, wiggle);
        break;
      case 'zigzagoon':
        this.drawZigzagoon(ctx, x, y, bounce, wiggle);
        break;
      case 'starly':
        this.drawStarly(ctx, x, y - 120, bounce, wiggle);
        break;
      case 'togepi':
        this.drawTogepi(ctx, x, y - 10, bounce, wiggle);
        break;
      default:
        this.drawPikachu(ctx, x, y, bounce, wiggle);
        break;
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

  // ========================================================
  // 🧸 KAWAII CHIBI POKÉMON ROSTER (100% CUTE & TODDLER-SAFE!)
  // ========================================================

  // Helper: Draw Big Sparkling Kawaii Anime Eyes
  drawCuteAnimeEyes(ctx, leftX, rightX, y, radius = 7) {
    ctx.save();
    // Dark round pupils
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(leftX, y, radius, 0, Math.PI * 2);
    ctx.arc(rightX, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Large top-left white sparkle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(leftX - radius * 0.3, y - radius * 0.3, radius * 0.42, 0, Math.PI * 2);
    ctx.arc(rightX - radius * 0.3, y - radius * 0.3, radius * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // Secondary bottom-right twinkle
    ctx.beginPath();
    ctx.arc(leftX + radius * 0.35, y + radius * 0.35, radius * 0.22, 0, Math.PI * 2);
    ctx.arc(rightX + radius * 0.35, y + radius * 0.35, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Helper: Rosy Pink Blush Cheeks
  drawRosyCheeks(ctx, leftX, rightX, y, radiusX = 9, radiusY = 5) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 99, 132, 0.65)';
    ctx.beginPath();
    ctx.ellipse(leftX, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.ellipse(rightX, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Helper: Cute Happy Open Smile
  drawHappySmile(ctx, x, y, width = 12) {
    ctx.save();
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.arc(x, y, width, 0.1, Math.PI - 0.1);
    ctx.fill();
    // Cute little pink tongue
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(x, y + width * 0.45, width * 0.55, 0, Math.PI);
    ctx.fill();
    ctx.restore();
  }

  // 1. 🔥 CHIBI CHARIZARD (Chubby Orange Baby Dragon Plushie)
  drawCharizard(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 8, y - bounce * 32);

    // Soft Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35 + bounce * 32, 55, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Soft Wings
    const wingFlap = Math.sin(this.time * 6) * 0.22;
    // Left Wing
    ctx.save();
    ctx.translate(-24, -28);
    ctx.rotate(-0.3 + wingFlap);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, -15, 18, 30, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.ellipse(0, -15, 12, 22, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.translate(24, -28);
    ctx.rotate(0.3 - wingFlap);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, -15, 18, 30, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.ellipse(0, -15, 12, 22, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Tail with Happy Flame
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-15, 15);
    ctx.quadraticCurveTo(-55, 20, -65, -5);
    ctx.quadraticCurveTo(-45, 0, -10, 25);
    ctx.fill();

    // Friendly Tail Fire Sparkle
    const flameSize = 14 + Math.sin(this.time * 8) * 3;
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(-65, -5, flameSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(-65, -4, flameSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Chubby Orange Body
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, 10, 42, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sweet Cream Belly
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 14, 24, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big Chubby Head
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, -28, 38, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Little Rounded Horns
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(-18, -52, 6, 12, -0.3, 0, Math.PI * 2);
    ctx.ellipse(18, -52, 6, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Big Sparkling Kawaii Eyes
    this.drawCuteAnimeEyes(ctx, -14, 14, -30, 8);

    // Rosy Blush Cheeks & Happy Smile
    this.drawRosyCheeks(ctx, -24, 24, -22, 9, 6);
    this.drawHappySmile(ctx, 0, -20, 10);

    // Cute Stubby Waving Paws
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(-26, 0 + wiggle * 6, 9, 0, Math.PI * 2);
    ctx.arc(26, 0 - wiggle * 6, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 2. 🐢 CHIBI BLASTOISE (Chubby Baby Blue Turtle with Bubble Cannons)
  drawBlastoise(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 8, y - bounce * 28);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35 + bounce * 28, 55, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Bubble Nozzles
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(-28, -44, 8, 0, Math.PI * 2);
    ctx.arc(28, -44, 8, 0, Math.PI * 2);
    ctx.fill();

    // Floating Rainbow Water Bubbles from Cannons
    ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
    for (let b = 0; b < 3; b++) {
      let by = -55 - b * 16 - (this.time * 25 % 30);
      ctx.beginPath();
      ctx.arc(-28 + Math.sin(this.time * 5 + b) * 8, by, 6, 0, Math.PI * 2);
      ctx.arc(28 - Math.sin(this.time * 5 + b) * 8, by, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Round Brown Shell Back
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.ellipse(0, 5, 48, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Chubby Blue Body
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, 10, 42, 36, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft Cream Belly
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 12, 26, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big Round Head
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, -25, 34, 0, Math.PI * 2);
    ctx.fill();

    // Big Kawaii Anime Eyes
    this.drawCuteAnimeEyes(ctx, -14, 14, -28, 8);

    // Rosy Cheeks & Cheerful Smile
    this.drawRosyCheeks(ctx, -22, 22, -18, 8, 5);
    this.drawHappySmile(ctx, 0, -18, 9);

    // Little Paws Waving
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-28, 6 + wiggle * 6, 9, 0, Math.PI * 2);
    ctx.arc(28, 6 - wiggle * 6, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 3. 🌺 CHIBI VENUSAUR (Cute Turquoise Baby Dino with Giant Daisy)
  drawVenusaur(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 6, y - bounce * 25);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35 + bounce * 25, 60, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Giant Pink Tropical Flower on Back
    ctx.fillStyle = '#f43f5e';
    for (let p = 0; p < 5; p++) {
      const angle = (Math.PI * 2 / 5) * p + Math.sin(this.time * 2) * 0.1;
      const px = Math.cos(angle) * 32;
      const py = -42 + Math.sin(angle) * 18;
      ctx.beginPath();
      ctx.arc(px, py, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    // Smiling Flower Center
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -42, 16, 0, Math.PI * 2);
    ctx.fill();
    // Little flower smile
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -40, 6, 0, Math.PI);
    ctx.stroke();

    // Playful Dancing Green Vine Whips
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-20, -35);
    ctx.quadraticCurveTo(-45, -60, -55 + Math.sin(this.time * 5) * 15, -75);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, -35);
    ctx.quadraticCurveTo(45, -60, 55 - Math.sin(this.time * 5) * 15, -75);
    ctx.stroke();

    // Chubby Turquoise Dino Body
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.ellipse(0, 10, 48, 34, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft Cute Spots
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath();
    ctx.arc(-18, 8, 6, 0, Math.PI * 2);
    ctx.arc(22, 12, 7, 0, Math.PI * 2);
    ctx.fill();

    // Chubby Head
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.ellipse(0, -10, 36, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big Sparkling Kawaii Eyes (Warm Hazel/Golden - NO SCARY RED!)
    this.drawCuteAnimeEyes(ctx, -14, 14, -14, 8);

    // Rosy Cheeks & Sweet Smile
    this.drawRosyCheeks(ctx, -22, 22, -6, 8, 5);
    this.drawHappySmile(ctx, 0, -4, 9);

    ctx.restore();
  }

  // 4. 🦘 CHIBI KANGASKHAN (Sweet Mama & Giggling Baby in Pouch)
  drawKangaskhan(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 8, y - bounce * 28);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35 + bounce * 28, 55, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Round Tail behind
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.moveTo(25, 15);
    ctx.quadraticCurveTo(65, 25, 75, 5);
    ctx.quadraticCurveTo(55, 5, 20, 5);
    ctx.fill();

    // Chubby Warm Brown Body
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(0, 8, 44, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft Round Head
    ctx.beginPath();
    ctx.ellipse(0, -28, 34, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Soft Ear Flaps
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.ellipse(-26, -38, 7, 14, -0.3, 0, Math.PI * 2);
    ctx.ellipse(26, -38, 7, 14, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Big Loving Anime Eyes with Eyelashes
    this.drawCuteAnimeEyes(ctx, -13, 13, -28, 7.5);

    // Rosy Cheeks & Gentle Smile
    this.drawRosyCheeks(ctx, -20, 20, -20, 8, 5);
    this.drawHappySmile(ctx, 0, -18, 8);

    // Belly Pouch
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.arc(0, 16, 28, 0, Math.PI);
    ctx.fill();

    // 🐣 GIGGLING BABY KANGASKHAN (Pop out and wave!)
    const babyBounce = Math.sin(this.time * 6) * 4;
    ctx.save();
    ctx.translate(0, 8 + babyBounce);

    // Baby Head (Lilac/Purple Chibi)
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    // Baby Sparkling Eyes & Blush
    this.drawCuteAnimeEyes(ctx, -5, 5, -2, 3.5);
    this.drawRosyCheeks(ctx, -9, 9, 3, 4, 2.5);
    this.drawHappySmile(ctx, 0, 3, 4);

    // Baby Waving Paws
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(-14, -4 + Math.sin(this.time * 8) * 3, 4, 0, Math.PI * 2);
    ctx.arc(14, -4 - Math.sin(this.time * 8) * 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // 5. 👑 CHIBI NIDOKING (Sweet Purple Baby Dino-Rhino Plushie)
  drawNidoking(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 8, y - bounce * 30);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35 + bounce * 30, 55, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chubby Purple Body
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.ellipse(0, 8, 44, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cream Belly
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 12, 24, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Round Head
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.ellipse(0, -28, 36, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smooth Little Rounded Unicorn/Rhino Horn (Friendly!)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-6, -45);
    ctx.lineTo(0, -68);
    ctx.lineTo(6, -45);
    ctx.closePath();
    ctx.fill();

    // Cute Soft Ear Tufts with Mint Green Inside
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.ellipse(-24, -40, 8, 14, -0.3, 0, Math.PI * 2);
    ctx.ellipse(24, -40, 8, 14, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.ellipse(-24, -40, 5, 9, -0.3, 0, Math.PI * 2);
    ctx.ellipse(24, -40, 5, 9, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Big Kawaii Anime Eyes
    this.drawCuteAnimeEyes(ctx, -13, 13, -28, 7.5);

    // Rosy Pink Cheeks & Big Cheerful Smile
    this.drawRosyCheeks(ctx, -22, 22, -18, 8, 5);
    this.drawHappySmile(ctx, 0, -18, 9);

    // Cute Dancing Paws
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(-26, 0 + wiggle * 6, 9, 0, Math.PI * 2);
    ctx.arc(26, 0 - wiggle * 6, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 6. 🦖 CHIBI AERODACTYL (Cute Flying Cartoon Bird-Dragon)
  drawAerodactyl(ctx, x, y, bounce, wiggle) {
    ctx.save();
    const flightY = y + Math.sin(this.time * 4) * 18;
    ctx.translate(x + Math.sin(this.time * 2) * 25, flightY);

    // Soft Lavender Flapping Wings
    const wingFlap = Math.sin(this.time * 6) * 0.25;

    // Left Wing
    ctx.save();
    ctx.rotate(-0.2 + wingFlap);
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.ellipse(-40, -10, 32, 16, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.rotate(0.2 - wingFlap);
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.ellipse(40, -10, 32, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Chubby Soft Grey Body
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Round Head
    ctx.beginPath();
    ctx.arc(0, -26, 22, 0, Math.PI * 2);
    ctx.fill();

    // Cute Soft Crest Behind Head
    ctx.beginPath();
    ctx.ellipse(0, -42, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big Sparkling Emerald Green Eyes (NO TEETH!)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(-9, -28, 7, 0, Math.PI * 2);
    ctx.arc(9, -28, 7, 0, Math.PI * 2);
    ctx.fill();

    // Eye Twinkles
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-11, -30, 3, 0, Math.PI * 2);
    ctx.arc(7, -30, 3, 0, Math.PI * 2);
    ctx.fill();

    // Rosy Cheeks & Cute Rounded Beak Smile
    this.drawRosyCheeks(ctx, -16, 16, -20, 6, 4);
    this.drawHappySmile(ctx, 0, -20, 6);

    ctx.restore();
  }

  // 7. 🦝 CHIBI ZIGZAGOON (Fluffy Puppy-Raccoon Plushie)
  drawZigzagoon(ctx, x, y, bounce, wiggle) {
    ctx.save();
    const zigOffset = Math.sin(this.time * 6) * 18;
    ctx.translate(x + zigOffset, y - bounce * 25);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 30 + bounce * 25, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chubby Fur Body
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.ellipse(0, 8, 38, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Zig-Zag Cream Belly
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 10, 24, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bushy Happy Tail
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.arc(-35, 4, 12, 0, Math.PI * 2);
    ctx.fill();

    // Cute Round Head
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.arc(18, -6, 22, 0, Math.PI * 2);
    ctx.fill();

    // Cute Pointy Ears
    ctx.beginPath();
    ctx.ellipse(10, -24, 6, 10, -0.3, 0, Math.PI * 2);
    ctx.ellipse(26, -24, 6, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Huge Shiny Puppy Eyes
    this.drawCuteAnimeEyes(ctx, 12, 26, -8, 6.5);

    // Black Button Nose & Rosy Cheeks
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(36, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    this.drawRosyCheeks(ctx, 8, 32, -1, 6, 4);
    this.drawHappySmile(ctx, 22, -1, 5);

    ctx.restore();
  }

  // 8. 🐦 CHIBI STARLY (Adorable Round Puff Bird)
  drawStarly(ctx, x, y, bounce, wiggle) {
    ctx.save();
    const flyY = y + Math.sin(this.time * 5) * 16;
    ctx.translate(x + wiggle * 8, flyY);

    // Soft Fluttering Wings
    const wingAngle = Math.sin(this.time * 10) * 0.35;
    ctx.fillStyle = '#64748b';
    ctx.save();
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.ellipse(-24, -4, 18, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.ellipse(24, -4, 18, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Chubby Round Bird Body (Cute Sphere!)
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    // Soft White Chest Puff
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 6, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big Kawaii Anime Eyes
    this.drawCuteAnimeEyes(ctx, -10, 10, -6, 6);

    // Rosy Cheeks
    this.drawRosyCheeks(ctx, -16, 16, 2, 5, 3.5);

    // Cute Little Orange Beak with tiny black tip
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI);
    ctx.fill();

    // ICONIC BOUNCY BLACK HAIR TUFT / CREST!
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.quadraticCurveTo(12, -34, 4, -40);
    ctx.stroke();

    ctx.restore();
  }

  // 9. 🐣 CHIBI TOGEPI (Smiling Eggshell Baby)
  drawTogepi(ctx, x, y, bounce, wiggle) {
    ctx.save();
    ctx.translate(x + wiggle * 8, y - bounce * 26);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 32 + bounce * 26, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Eggshell Body
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 8, 30, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Red & Blue Cheerful Geometric Shell Patches
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-15, 6);
    ctx.lineTo(-5, 18);
    ctx.lineTo(-18, 22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(8, 4);
    ctx.lineTo(18, 14);
    ctx.lineTo(5, 20);
    ctx.closePath();
    ctx.fill();

    // Five Soft Head Spikes
    ctx.fillStyle = '#fef3c7';
    for (let s = -2; s <= 2; s++) {
      ctx.beginPath();
      const sx = s * 11;
      const sy = -14 - Math.abs(s) * 2;
      ctx.moveTo(sx - 6, sy);
      ctx.lineTo(sx, sy - 14);
      ctx.lineTo(sx + 6, sy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Big Kawaii Anime Eyes
    this.drawCuteAnimeEyes(ctx, -8, 8, -6, 5);

    // Rosy Cheeks & Joyful Baby Smile
    this.drawRosyCheeks(ctx, -15, 15, 0, 5, 3.5);
    this.drawHappySmile(ctx, 0, 1, 5);

    // Tiny Stubby Waving Arms
    ctx.fillStyle = '#fef3c7';
    const armWave = Math.sin(this.time * 8) * 6;
    ctx.beginPath();
    ctx.arc(-26, -2 + armWave, 6, 0, Math.PI * 2);
    ctx.arc(26, -2 - armWave, 6, 0, Math.PI * 2);
    ctx.fill();

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
