import { strict as assert } from 'assert';
import soundEffects from '../src/utils/soundEffects.js';

assert.equal(typeof soundEffects.startAmbientNoise, 'function');
assert.equal(typeof soundEffects.stopAmbientNoise, 'function');
assert.equal(typeof soundEffects.modulateNoise, 'function');

console.log('soundEffects API OK');
