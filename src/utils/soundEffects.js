/* =======================================================================
   Pleasant White-Noise SoundEffects (vintage tremolo edition)
   — Keeps original method names & external API intact.
   — Uses Pizzicato.js for synthesis/effects.
   ======================================================================= */

class SoundEffects {
  constructor() {
    this.context       = null;
    this.enabled       = true;
    this.volume        = 0.20;
    this.ambientNoise  = null;
    this.noiseFilter   = null;
    this.init();
  }

  async init() {
    if (typeof window !== 'undefined' && window.Pizzicato) {
      this.context = Pizzicato.context;
      console.log('🎵 Sound effects ready (vintage tremolo)');
    } else {
      console.warn('Pizzicato missing – sounds disabled');
      this.enabled = false;
    }
  }

  /* ------------------------------------------------------------------ helpers */

  /**
   * Create a white-noise source, low-pass it, and (optionally) add a mellow
   * tremolo for a “tube-amp” vintage wobble.
   */
  _makeNoise({ cutoff = 1200, tremolo = true } = {}) {
    const noise = new Pizzicato.Sound({ source: 'noise', options: { type: 'white' } });

    // soften the hiss
    const lp = new Pizzicato.Effects.LowPassFilter({ frequency: cutoff, peak: 1 });
    noise.addEffect(lp);

    // vintage tremolo (slow amplitude modulation)
    if (tremolo) {
      const wobble = new Pizzicato.Effects.Tremolo({
        speed : 4.5,   // Hz
        depth : 0.65,  // 0-1
        mix   : 1.0
      });
      noise.addEffect(wobble);
    }

    noise.volume = 0;
    return noise;
  }

  /** Envelope: ramp up → hold → ramp down → stop. */
  _burst({ cutoff = 1200, peak = 0.2, attack = 60, hold = 120, release = 90 }) {
    if (!this.enabled || !window.Pizzicato) return;
    const n = this._makeNoise({ cutoff });
    let v = 0;

    n.play();

    // attack
    const up = setInterval(() => {
      v += this.volume / attack;
      n.volume = Math.min(v, peak);
      if (v >= peak) {
        clearInterval(up);

        // hold
        setTimeout(() => {
          // release
          const down = setInterval(() => {
            v -= this.volume / release;
            n.volume = Math.max(v, 0);
            if (v <= 0) {
              clearInterval(down);
              n.stop();
            }
          }, 10);
        }, hold);
      }
    }, 10);
  }

  /* ---------------------------------------------------------------- ambient */

  startAmbientNoise() {
    if (!this.enabled || !window.Pizzicato || this.ambientNoise) return;

    this.ambientNoise = this._makeNoise({ cutoff: 400 });
    this.noiseFilter  = this.ambientNoise.effects[0];

    this.ambientNoise.play();
    let v = 0;
    const fadeIn = setInterval(() => {
      v += this.volume / 50;
      this.ambientNoise.volume = Math.min(v, this.volume * 0.6);
      if (v >= this.volume * 0.6) clearInterval(fadeIn);
    }, 50);

    console.log('🌊 Ambient white noise started');
    return this.ambientNoise;
  }

  stopAmbientNoise() {
    if (!this.ambientNoise) return;
    let v = this.ambientNoise.volume;
    const fadeOut = setInterval(() => {
      v -= this.volume / 50;
      this.ambientNoise.volume = Math.max(v, 0);
      if (v <= 0) {
        clearInterval(fadeOut);
        this.ambientNoise.stop();
        this.ambientNoise = this.noiseFilter = null;
      }
    }, 30);
  }

  modulateNoise(mouseX, mouseY, w, h) {
    if (!this.ambientNoise || !this.noiseFilter) return;
    this.noiseFilter.frequency = 200 + (mouseX / w) * 1000;
    this.ambientNoise.volume   = this.volume * 0.15 * (0.5 + (mouseY / h) * 0.5);
  }

  /* ---------------------------------------------------------------- bursts */

  playSuccess()     { this._burst({ cutoff:  900, peak: 0.30, attack: 40, hold: 180, release: 70 }); }
  playCardReveal()  { this._burst({ cutoff: 1100, peak: 0.20, attack: 50, hold: 100, release: 40 }); }
  playHover()       { this._burst({ cutoff: 1400, peak: 0.10, attack: 20, hold:  30, release: 20 }); }
  playClick()       { this._burst({ cutoff:  800, peak: 0.15, attack: 25, hold:  60, release: 30 }); }
  playConfetti()    { this._burst({ cutoff: 1600, peak: 0.25, attack: 60, hold: 400, release: 80 }); }
  playWhoosh()      { this._burst({ cutoff:  700, peak: 0.20, attack: 35, hold: 100, release: 50 }); }
  playWarning()     { this._burst({ cutoff:  500, peak: 0.18, attack: 40, hold: 120, release: 60 }); }
  playCompliance()  { this._burst({ cutoff: 1300, peak: 0.20, attack: 30, hold: 150, release: 70 }); }
  playNavigation()  { this._burst({ cutoff: 1000, peak: 0.15, attack: 20, hold:  80, release: 40 }); }
  playExpand()      { this._burst({ cutoff: 1200, peak: 0.18, attack: 25, hold: 100, release: 55 }); }
  playCollapse()    { this._burst({ cutoff:  600, peak: 0.12, attack: 15, hold:  60, release: 30 }); }

  /* ---------------------------------------------------------------- misc */

  toggle()          { return (this.enabled = !this.enabled); }
  setVolume(v)      { this.volume = Math.max(0, Math.min(1, v)); }
  getAmbientNoise() { return this.ambientNoise; }
}

/* singleton export */
const soundEffects = new SoundEffects();
export default soundEffects;