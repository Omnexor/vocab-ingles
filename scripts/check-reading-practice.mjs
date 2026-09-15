import assert from 'node:assert/strict';
import { LECTURAS } from '../public/readings.js';
import { CUENTOS } from '../public/stories.js';
import { READING_QUESTIONS, newReadingCheck, validReadingCheck, readingCheckSummary, supportReadingCheck, answerReadingCheck, advanceReadingCheck } from '../public/reading-practice.js';
const texts = [...LECTURAS, ...CUENTOS];
assert.deepEqual(Object.keys(READING_QUESTIONS).sort(), texts.map(t => t.id).sort());
for (const text of texts) {
  const questions = READING_QUESTIONS[text.id];
  assert.equal(questions.length, 3);
  assert.equal(questions[0].kind, 'Idea principal');
  for (const q of questions) {
    assert.ok(q.q && q.why && q.kind);
    assert.equal(q.options.length, 3);
    assert.equal(new Set(q.options).size, 3);
    assert.ok(q.options.every(x => typeof x === 'string' && x.length > 4));
    assert.ok(q.lines.length > 0);
    assert.ok(q.lines.every(n => Number.isInteger(n) && n > 0 && n <= text.frases.length), text.id);
  }
  for (const random of [() => 0, () => .5, () => .999, Math.random]) {
    let s = newReadingCheck(text.id, null, random);
    assert.ok(validReadingCheck(s, text.id));
    assert.equal(new Set(s.order.map(row => row.indexOf(0))).size, 3, 'Balanced answer positions');
    assert.equal(advanceReadingCheck(s), s);
    assert.equal(answerReadingCheck(s, -1), s);
    s = supportReadingCheck(s);
    s = answerReadingCheck(s, s.order[0].indexOf(0));
    assert.equal(supportReadingCheck(s), s, 'Support after answering cannot change classification');
    assert.equal(answerReadingCheck(s, null), s, 'No double answers');
    s = advanceReadingCheck(s);
    s = advanceReadingCheck(answerReadingCheck(s, null));
    s = advanceReadingCheck(answerReadingCheck(s, s.order[2].indexOf(1)));
    assert.ok(validReadingCheck(JSON.parse(JSON.stringify(s)), text.id));
    assert.deepEqual(readingCheckSummary(s), { total: 3, independent: 0, assisted: 1, wrong: 1, unknown: 1 });
    assert.deepEqual(s.first, readingCheckSummary(s));
    assert.equal(advanceReadingCheck(s), s);
    let retry = newReadingCheck(text.id, s.first, random);
    for (let i = 0; i < 3; i++) retry = advanceReadingCheck(answerReadingCheck(retry, retry.order[i].indexOf(0)));
    assert.equal(readingCheckSummary(retry).independent, 3);
    assert.deepEqual(retry.first, s.first, 'Repeating must preserve the first result');
    for (const bad of [null, {}, { ...s, version: -1 }, { ...s, id: 'missing' }, { ...s, position: 9 }, { ...s, responses: [] }, { ...s, order: [[0, 0, 0]] }, { ...s, helped: [0, 0, 0] }, { ...s, first: {} }]) {
      assert.equal(validReadingCheck(bad, text.id), false);
    }
  }
}
assert.equal(newReadingCheck('missing'), null);
console.log(JSON.stringify({ result: 'PASS', texts: texts.length, questions: texts.length * 3, checks: 'coverage, evidence bounds, permutations, support, persistence, first attempt, invalid state' }));
