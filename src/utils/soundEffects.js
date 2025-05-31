// Sound effects utility using Pizzicato.js
// Creates various procedural sound effects for UI interactions

class SoundEffects {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.volume = 0.3;
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

  // Success/completion sound - bright, uplifting
  playSuccess() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 523.25, // C5
        volume: this.volume * 0.8
      }
    });

    // Create a bright chord progression
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    let index = 0;

    const playNote = () => {
      if (index < frequencies.length) {
        wave.frequency = frequencies[index];
        wave.play();
        
        setTimeout(() => {
          wave.stop();
          index++;
          if (index < frequencies.length) {
            setTimeout(playNote, 50);
          }
        }, 150);
      }
    };

    playNote();
  }

  // Card reveal sound - soft, gentle
  playCardReveal() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 440, // A4
        volume: this.volume * 0.5
      }
    });

    // Gentle frequency sweep upward
    wave.play();
    
    let currentFreq = 440;
    const targetFreq = 880;
    const steps = 20;
    const stepSize = (targetFreq - currentFreq) / steps;
    let step = 0;

    const sweep = setInterval(() => {
      currentFreq += stepSize;
      wave.frequency = currentFreq;
      step++;
      
      if (step >= steps) {
        clearInterval(sweep);
        setTimeout(() => wave.stop(), 100);
      }
    }, 25);
  }

  // Button hover sound - subtle, quick
  playHover() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'triangle',
        frequency: 800,
        volume: this.volume * 0.3
      }
    });

    wave.play();
    setTimeout(() => wave.stop(), 80);
  }

  // Click/interaction sound - crisp, short
  playClick() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'square',
        frequency: 1000,
        volume: this.volume * 0.4
      }
    });

    // Quick decay
    wave.play();
    let currentVol = this.volume * 0.4;
    
    const fade = setInterval(() => {
      currentVol *= 0.7;
      wave.volume = currentVol;
      
      if (currentVol < 0.01) {
        clearInterval(fade);
        wave.stop();
      }
    }, 20);
  }

  // Confetti explosion sound - celebratory
  playConfetti() {
    if (!this.enabled || !window.Pizzicato) return;

    // Create multiple oscillators for a rich sound
    const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const sounds = [];

    frequencies.forEach((freq, index) => {
      const wave = new Pizzicato.Sound({
        source: 'wave',
        options: {
          type: 'sine',
          frequency: freq,
          volume: this.volume * 0.6 / frequencies.length
        }
      });

      // Add some reverb for richness
      const reverb = new Pizzicato.Effects.Reverb({
        time: 0.8,
        decay: 0.8,
        reverse: false,
        mix: 0.5
      });

      wave.addEffect(reverb);
      sounds.push(wave);

      // Stagger the notes slightly
      setTimeout(() => {
        wave.play();
        
        // Gradually fade out
        let volume = this.volume * 0.6 / frequencies.length;
        const fadeOut = setInterval(() => {
          volume *= 0.95;
          wave.volume = volume;
          
          if (volume < 0.01) {
            clearInterval(fadeOut);
            wave.stop();
          }
        }, 50);
      }, index * 50);
    });
  }

  // Whoosh sound for smooth transitions
  playWhoosh() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sawtooth',
        frequency: 100,
        volume: this.volume * 0.4
      }
    });

    // Add low-pass filter for smooth whoosh
    const filter = new Pizzicato.Effects.LowPassFilter({
      frequency: 800,
      peak: 10
    });

    wave.addEffect(filter);
    wave.play();

    // Frequency sweep
    let currentFreq = 100;
    const sweep = setInterval(() => {
      currentFreq += 10;
      wave.frequency = currentFreq;
      
      if (currentFreq > 400) {
        clearInterval(sweep);
        
        // Fade out
        let volume = this.volume * 0.4;
        const fade = setInterval(() => {
          volume *= 0.9;
          wave.volume = volume;
          
          if (volume < 0.01) {
            clearInterval(fade);
            wave.stop();
          }
        }, 30);
      }
    }, 15);
  }

  // Error or warning sound - lower, attention-getting
  playWarning() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'square',
        frequency: 220, // A3
        volume: this.volume * 0.6
      }
    });

    // Two-tone warning
    wave.play();
    
    setTimeout(() => {
      wave.frequency = 185; // F#3
    }, 200);
    
    setTimeout(() => {
      wave.frequency = 220; // Back to A3
    }, 400);
    
    setTimeout(() => {
      wave.stop();
    }, 600);
  }
}

// Create singleton instance
const soundEffects = new SoundEffects();

// Export for use in components
export default soundEffects;