# 🎛️ Vocoder Integration Guide

This site now includes a persistent ambient white noise system that can be controlled by the [Web-based Vocoder](https://github.com/Web-based-vocoder/web-based-vocoder.github.io).

## 🌊 Ambient Noise System

### Features
- **Persistent Low White Noise**: Almost inaudible ambient sound layer
- **Mouse-Controlled Modulation**: Filter frequency and volume respond to mouse position
- **User-Interaction Activated**: Starts only after first click/mousemove/keypress
- **Vocoder Ready**: Exposed APIs for external control

### Current Behavior
- **X-axis (mouseX)**: Controls filter frequency (200-1200 Hz)
- **Y-axis (mouseY)**: Controls volume and base frequency (80-120 Hz)
- **Very Low Volume**: 0.05 * 0.15 = 0.0075 maximum volume (barely audible)

## 🎤 Vocoder Integration

### Available APIs
The ambient noise system is globally accessible via `window.soundEffects`:

```javascript
// Get the ambient noise source for vocoder processing
const ambientNoise = window.soundEffects.getAmbientNoise();

// Direct control methods
window.soundEffects.startAmbientNoise();
window.soundEffects.stopAmbientNoise();
window.soundEffects.modulateNoise(mouseX, mouseY, windowWidth, windowHeight);

// Access the raw Pizzicato sound object
const pizzicatoSound = window.soundEffects.ambientNoise;
```

### Integration Steps

1. **Load the vocoder script after the page loads**:
```javascript
// Wait for ambient system to initialize
window.addEventListener('load', () => {
  // Load your vocoder script here
  const script = document.createElement('script');
  script.src = 'path/to/vocoder.js';
  document.body.appendChild(script);
});
```

2. **Connect to the ambient noise source**:
```javascript
// In your vocoder code
const ambientSource = window.soundEffects.getAmbientNoise();
if (ambientSource && ambientSource.sourceNode) {
  // Connect to vocoder processing chain
  ambientSource.sourceNode.connect(yourVocoderNode);
}
```

3. **Override mouse modulation** (optional):
```javascript
// Disable default mouse modulation if you want full vocoder control
document.removeEventListener('mousemove', /* existing handler */);

// Add your own modulation logic
document.addEventListener('mousemove', (e) => {
  // Your custom vocoder modulation here
  yourVocoderControls.updateFromMouse(e.clientX, e.clientY);
});
```

## 🎛️ Technical Details

### Audio Chain
```
Sawtooth Wave (80-120Hz) 
  → LowPass Filter (200-1200Hz)
  → Compressor (threshold: -50dB)
  → Output (0.0075 max volume)
```

### Filter Configuration
- **Type**: Pizzicato LowPassFilter
- **Frequency Range**: 200-1200 Hz (X-axis controlled)
- **Peak**: 1

### Compressor Settings
- **Threshold**: -50dB
- **Knee**: 40dB
- **Attack**: 0.003s
- **Release**: 0.25s
- **Ratio**: 12:1

## 🎵 Usage Examples

### Example 1: Basic Vocoder Connection
```javascript
// Get the ambient noise
const ambient = window.soundEffects.getAmbientNoise();

// Create your vocoder effect
const vocoder = new YourVocoderClass();

// Connect ambient as carrier signal
vocoder.setCarrier(ambient.sourceNode);

// Connect microphone as modulator
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const microphone = audioContext.createMediaStreamSource(stream);
    vocoder.setModulator(microphone);
  });
```

### Example 2: Mouse-Controlled Vocoder Parameters
```javascript
document.addEventListener('mousemove', (e) => {
  const normalizedX = e.clientX / window.innerWidth;
  const normalizedY = e.clientY / window.innerHeight;
  
  // Map to vocoder parameters
  const formantShift = normalizedX * 2 - 1; // -1 to 1
  const bandpass = normalizedY * 4000 + 200; // 200-4200 Hz
  
  yourVocoder.setFormantShift(formantShift);
  yourVocoder.setBandpassFreq(bandpass);
});
```

## 🔧 Customization

### Adjusting Ambient Volume
```javascript
// Make it more audible for vocoder work
window.soundEffects.setVolume(0.2); // Increase base volume
```

### Custom Noise Types
```javascript
// Access the raw Pizzicato sound to change wave type
const ambient = window.soundEffects.ambientNoise;
ambient.type = 'triangle'; // or 'square', 'sine'
```

## 🚨 Browser Compatibility

- Requires user interaction to start (Web Audio API policy)
- Works in Chrome, Firefox, Safari, Edge
- Pizzicato.js provides Web Audio API abstraction
- Mouse tracking updates at ~60fps (throttled to prevent audio artifacts)

## 🎯 Next Steps

1. Load the vocoder GitHub project
2. Connect to `window.soundEffects.getAmbientNoise()`
3. Replace or enhance the mouse modulation
4. Add visual feedback for vocoder parameters
5. Consider adding MIDI control support

---

**Ready for vocoder magic!** 🎤✨