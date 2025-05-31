// Astro-specific Lenis integration
// This script will be loaded by the Astro site to initialize Lenis

import Lenis from '@studio-freight/lenis';

// Initialize Lenis when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Set up the RAF loop for Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  // Start the animation loop
  requestAnimationFrame(raf);
  
  // Optional: Add GSAP integration
  if (window.gsap) {
    lenis.on('scroll', () => {
      // You can trigger GSAP animations based on scroll position here
    });
  }
});
