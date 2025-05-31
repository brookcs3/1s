// Sound effects utility using Pizzicato.js
// Creates various procedural sound effects for UI interactions

class SoundEffects {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.volume = 0.1; // Very low volume
    this.init();
  }

  async init() {
    try {
      // Check if Pizzicato is available
      if (typeof window !== 'undefined' && window.Pizzicato) {
        this.context = Pizzicato.context;
        console.log('🎵 Sound effects initialized');
      }
    } catch (error) {
      console.warn('Sound effects not available:', error);
      this.enabled = false;
    }
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Success/completion sound - simple single note
  playSuccess() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 523.25, // C5
        volume: this.volume
      }
    });

    wave.play();
    setTimeout(() => wave.stop(), 200);
  }

  // Card reveal sound - simple pop
  playCardReveal() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 800,
        volume: this.volume * 0.8
      }
    });

    wave.play();
    setTimeout(() => wave.stop(), 100);
  }

  // Button hover sound - minimal click
  playHover() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 1000,
        volume: this.volume * 0.5
      }
    });

    wave.play();
    setTimeout(() => wave.stop(), 50);
  }

  // Click/interaction sound - simple click
  playClick() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 1200,
        volume: this.volume * 0.6
      }
    });

    wave.play();
    setTimeout(() => wave.stop(), 80);
  }

  // Confetti explosion sound - simple single note
  playConfetti() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 659, // E5
        volume: this.volume
      }
    });

    wave.play();
    setTimeout(() => wave.stop(), 300);
  }

  // Whoosh sound - simple pop
  playWhoosh() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 600,
        volume: this.volume * 0.7
      }
    });

    wave.play();
    setTimeout(() => wave.stop(), 120);
  }

  // Warning sound - simple note
  playWarning() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 400,
        volume: this.volume
      }
    });

    wave.play();
    setTimeout(() => wave.stop(), 150);
  }
}

// Create singleton instance
const soundEffects = new SoundEffects();

// Export for use in components
export default soundEffects;