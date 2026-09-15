import assert from 'node:assert/strict';
import { createGameAudio } from '../public/game-audio.js';
let current, timeout, completed = 0, failed = 0;
const host = { SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
  speechSynthesis: { cancel() {}, getVoices: () => [{ lang:'es-ES' }, { lang:'en-GB' }], speak: u => { current = u; } },
  setTimeout: fn => { timeout = fn; return 1; }, clearTimeout() {},
};
const audio = createGameAudio(host);
const callbacks = { onComplete: () => completed++, onError: () => failed++ };
audio.play('Fifteen pounds.', callbacks);
assert.equal(current.voice.lang, 'en-GB'); assert.equal(current.rate, 1);
const lateEnd = current.onend;
audio.stop(); lateEnd(); assert.equal(completed, 0);
audio.play('Fifty pounds.', { ...callbacks, slow:true }); assert.equal(current.rate, 0.7);
current.onend(); assert.equal(completed, 1);
audio.play('Another announcement.', callbacks); timeout(); assert.equal(failed, 1);
assert.equal(current.onend, null);
createGameAudio({}).play('No voice.', callbacks); assert.equal(failed, 2);
host.speechSynthesis.speak = () => { throw Error('Unavailable'); };
audio.play('Error.', callbacks); assert.equal(failed, 3);
console.log('PASS: voice selection, slow support, completion, late callback isolation, timeout, absent API, synthesis error');
