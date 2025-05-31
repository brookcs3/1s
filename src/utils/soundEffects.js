// Sound effects utility using Pizzicato.js
// Creates various procedural sound effects for UI interactions

class SoundEffects {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.volume = 0.2; // Increased for vocoder use
    this.ambientNoise = null;
    this.noiseFilter = null;
    this.noiseGain = null;
    this.activeSounds = []; // Track active UI sounds to prevent overlapping
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

  // Clean up finished sounds from active array
  _cleanupSound(sound) {
    try {
      sound.stop();
    } catch (error) {
      console.warn('Error stopping sound:', error);
    }
    
    const index = this.activeSounds.indexOf(sound);
    if (index > -1) {
      this.activeSounds.splice(index, 1);
    }
  }

  // Stop all active UI sounds (not ambient)
  stopAllActiveSounds() {
    this.activeSounds.forEach(sound => {
      try {
        sound.stop();
      } catch (error) {
        console.warn('Error stopping active sound:', error);
      }
    });
    this.activeSounds = [];
  }

  // Start persistent ambient white noise
  startAmbientNoise() {
    if (!this.enabled || !window.Pizzicato) return;

    // CRITICAL: Stop any existing ambient noise first
    if (this.ambientNoise) {
      console.log('🛑 Stopping existing ambient noise to prevent multiplying');
      this.stopAmbientNoise();
      // Wait a moment for cleanup
      setTimeout(() => this._createAmbientNoise(), 100);
      return;
    }

    this._createAmbientNoise();
  }

  _createAmbientNoise() {
    try {
      // Create white noise using single oscillator
      this.ambientNoise = new window.Pizzicato.Sound({
        source: 'wave',
        options: {
          type: 'sawtooth',
          frequency: 80,
          volume: 0
        }
      });

      // Add filter for shaping the noise
      this.noiseFilter = new window.Pizzicato.Effects.LowPassFilter({
        frequency: 400,
        peak: 1
      });

      // Add gain control for modulation
      this.noiseGain = new window.Pizzicato.Effects.Compressor({
        threshold: -50,
        knee: 40,
        attack: 0.003,
        release: 0.25,
        ratio: 12
      });

      this.ambientNoise.addEffect(this.noiseFilter);
      this.ambientNoise.addEffect(this.noiseGain);

      // Start playing and fade in
      this.ambientNoise.play();
      this.ambientNoise.volume = 0;
      
      let currentVol = 0;
      const fadeIn = setInterval(() => {
        if (!this.ambientNoise) {
          clearInterval(fadeIn);
          return;
        }
        currentVol += this.volume / 100;
        this.ambientNoise.volume = Math.min(currentVol, this.volume * 0.6);
        if (currentVol >= this.volume * 0.6) {
          clearInterval(fadeIn);
        }
      }, 50);

      console.log('🌊 Ambient white noise started (single source)');
      return this.ambientNoise;
    } catch (error) {
      console.warn('Could not start ambient noise:', error);
      this.ambientNoise = null;
      this.noiseFilter = null;
      this.noiseGain = null;
    }
  }

  // Stop ambient noise with proper cleanup
  stopAmbientNoise() {
    if (!this.ambientNoise) return;

    try {
      console.log('🔇 Stopping ambient noise...');
      
      // Immediate stop for safety
      this.ambientNoise.stop();
      
      // Clean up references
      this.ambientNoise = null;
      this.noiseFilter = null;
      this.noiseGain = null;
      
      console.log('✅ Ambient noise stopped and cleaned up');
    } catch (error) {
      console.warn('Error stopping ambient noise:', error);
      // Force cleanup even if stop() fails
      this.ambientNoise = null;
      this.noiseFilter = null;
      this.noiseGain = null;
    }
  }

  // Modulate noise based on mouse position (for vocoder integration)
  modulateNoise(mouseX, mouseY, windowWidth, windowHeight) {
    if (!this.ambientNoise || !this.noiseFilter) return;

    try {
      // Map mouse position to filter frequency (200-1200 Hz)
      const normalizedX = mouseX / windowWidth;
      const normalizedY = mouseY / windowHeight;
      
      const filterFreq = 200 + (normalizedX * 1000);
      const volume = this.volume * 0.15 * (0.5 + normalizedY * 0.5);
      
      // Smooth modulation to prevent audio artifacts
      this.noiseFilter.frequency = filterFreq;
      this.ambientNoise.volume = volume;
      
      // Add some frequency modulation based on Y position
      const baseFreq = 80 + (normalizedY * 40); // 80-120 Hz range
      this.ambientNoise.frequency = baseFreq;
      
    } catch (error) {
      console.warn('Could not modulate noise:', error);
    }
  }

  // Get ambient noise object for external vocoder integration
  getAmbientNoise() {
    return this.ambientNoise;
  }

  // Success/completion sound - gentle white noise burst
  playSuccess() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sawtooth',
        frequency: 200,
        volume: 0
      }
    });

    // Gentle fade in and out
    wave.play();
    wave.volume = 0;
    
    // Slow attack
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 20;
      wave.volume = Math.min(currentVol, this.volume * 0.3);
      if (currentVol >= this.volume * 0.3) {
        clearInterval(fadeIn);
        
        // Hold briefly, then fade out
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 30;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 20);
        }, 200);
      }
    }, 30);
  }

  // Card reveal sound - soft filtered noise
  playCardReveal() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'triangle',
        frequency: 150,
        volume: 0
      }
    });

    // Very gentle fade in
    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 30;
      wave.volume = Math.min(currentVol, this.volume * 0.2);
      if (currentVol >= this.volume * 0.2) {
        clearInterval(fadeIn);
        
        // Quick fade out
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 15;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 15);
        }, 80);
      }
    }, 25);
  }

  // Button hover sound - barely audible whisper
  playHover() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'triangle',
        frequency: 100,
        volume: 0
      }
    });

    wave.play();
    wave.volume = this.volume * 0.1;
    setTimeout(() => {
      wave.volume = 0;
      setTimeout(() => wave.stop(), 50);
    }, 30);
  }

  // Click/interaction sound - gentle breath
  playClick() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sawtooth',
        frequency: 80,
        volume: 0
      }
    });

    // Track this sound
    this.activeSounds.push(wave);

    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      if (!wave || !this.activeSounds.includes(wave)) {
        clearInterval(fadeIn);
        return;
      }
      
      currentVol += this.volume / 40;
      wave.volume = Math.min(currentVol, this.volume * 0.15);
      if (currentVol >= this.volume * 0.15) {
        clearInterval(fadeIn);
        
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            if (!wave || !this.activeSounds.includes(wave)) {
              clearInterval(fadeOut);
              return;
            }
            
            currentVol -= this.volume / 20;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              this._cleanupSound(wave);
            }
          }, 10);
        }, 60);
      }
    }, 20);
  }

  // Confetti explosion sound - gentle wash
  playConfetti() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'triangle',
        frequency: 120,
        volume: 0
      }
    });

    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 50;
      wave.volume = Math.min(currentVol, this.volume * 0.25);
      if (currentVol >= this.volume * 0.25) {
        clearInterval(fadeIn);
        
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 80;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 15);
        }, 400);
      }
    }, 40);
  }

  // Whoosh sound - soft wind
  playWhoosh() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sawtooth',
        frequency: 60,
        volume: 0
      }
    });

    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 35;
      wave.volume = Math.min(currentVol, this.volume * 0.2);
      if (currentVol >= this.volume * 0.2) {
        clearInterval(fadeIn);
        
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 25;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 12);
        }, 100);
      }
    }, 25);
  }

  // Warning sound - subtle hum
  playWarning() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'triangle',
        frequency: 90,
        volume: 0
      }
    });

    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 25;
      wave.volume = Math.min(currentVol, this.volume * 0.18);
      if (currentVol >= this.volume * 0.18) {
        clearInterval(fadeIn);
        
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 30;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 18);
        }, 120);
      }
    }, 35);
  }

  // Compliance sound - gentle success tone
  playCompliance() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'triangle',
        frequency: 180,
        volume: 0
      }
    });

    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 30;
      wave.volume = Math.min(currentVol, this.volume * 0.2);
      if (currentVol >= this.volume * 0.2) {
        clearInterval(fadeIn);
        
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 40;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 20);
        }, 150);
      }
    }, 25);
  }

  // Navigation sound - soft transition
  playNavigation() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sawtooth',
        frequency: 110,
        volume: 0
      }
    });

    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 20;
      wave.volume = Math.min(currentVol, this.volume * 0.15);
      if (currentVol >= this.volume * 0.15) {
        clearInterval(fadeIn);
        
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 25;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 15);
        }, 80);
      }
    }, 20);
  }

  // Expand sound - opening transition
  playExpand() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'triangle',
        frequency: 140,
        volume: 0
      }
    });

    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 25;
      wave.volume = Math.min(currentVol, this.volume * 0.18);
      if (currentVol >= this.volume * 0.18) {
        clearInterval(fadeIn);
        
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 35;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 18);
        }, 100);
      }
    }, 22);
  }

  // Collapse sound - closing transition
  playCollapse() {
    if (!this.enabled || !window.Pizzicato) return;

    const wave = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sawtooth',
        frequency: 70,
        volume: 0
      }
    });

    wave.play();
    let currentVol = 0;
    const fadeIn = setInterval(() => {
      currentVol += this.volume / 15;
      wave.volume = Math.min(currentVol, this.volume * 0.12);
      if (currentVol >= this.volume * 0.12) {
        clearInterval(fadeIn);
        
        setTimeout(() => {
          const fadeOut = setInterval(() => {
            currentVol -= this.volume / 20;
            wave.volume = Math.max(currentVol, 0);
            if (currentVol <= 0) {
              clearInterval(fadeOut);
              wave.stop();
            }
          }, 12);
        }, 60);
      }
    }, 18);
  }
}

// Create singleton instance
const soundEffects = new SoundEffects();

// Export for use in components
export default soundEffects;
