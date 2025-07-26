# CS362 Interactive Report

This project is an experimental Astro site that visualizes the compliance work for Group 92 in CS362. It blends GSAP powered animations with procedural sound effects created in `soundEffects.js`. The site renders a single page made up of several components such as a hero banner, compliance tables, Q&A sections and a dataset driven EdDiscussion viewer. Everything can be built to static HTML and served on GitHub Pages.


## Running the project

```bash
npm install
npm run dev         # start local dev server at http://localhost:4321
npm run build        # build the static site to ./dist
npm run preview      # serve the built site locally
npm test             # run a small sanity check for soundEffects.js
```

## Repository structure

```
src/
  components/        Astro components and styles
  data/              EdDiscussion questions used by the viewer
  layouts/           Main layout wrapper
  pages/             Entry point `index.astro`
  utils/             `soundEffects.js` procedural audio engine
public/              static assets
```

More architecture notes and a component diagram are in [`docs/architecture.md`](docs/architecture.md).

## Highlight: `soundEffects.js`

One of the more unusual parts of this codebase is [`soundEffects.js`](src/utils/soundEffects.js). It creates a minimal audio engine using [Pizzicato.js] to generate white‑noise based effects. These sounds are triggered by GSAP animations across the site and can even be modulated by a separate web based vocoder. The module exposes helpers such as `startAmbientNoise`, `stopAmbientNoise` and `modulateNoise` which are tested in [`tests/soundEffects.test.js`](tests/soundEffects.test.js).

```javascript
// Example: start subtle background noise and respond to mouse movement
window.soundEffects.startAmbientNoise();
document.addEventListener('mousemove', (e) => {
  window.soundEffects.modulateNoise(
    e.clientX, e.clientY,
    window.innerWidth, window.innerHeight
  );
});
```

## Next Steps

- Swap `@studio-freight/lenis` for the renamed [`lenis`](https://www.npmjs.com/package/lenis)
  package to avoid deprecation warnings.
- Integrate ambient noise with an external vocoder following
  [`VOCODER_INTEGRATION.md`](VOCODER_INTEGRATION.md).



