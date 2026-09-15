import assert from 'node:assert/strict';
import { LESSONS } from '../public/lessons.js';
import { PATH, orderedLessons, isPronunciation, prerequisites, prepareQuiz, isCorrect, recordLearning, learningState, dayAfter } from '../public/learning-engine.js';
import { practiceIds, productionItems } from '../public/grammar-practice.js';

assert.equal(new Set(PATH.flatMap(g => g.ids)).size, LESSONS.length);
assert.deepEqual(new Set(orderedLessons(LESSONS).map(l => l.id)), new Set(LESSONS.map(l => l.id)));
assert.equal(orderedLessons(LESSONS)[0].id, 'verbo-be');
assert.deepEqual(new Set(practiceIds), new Set(LESSONS.filter(l => !isPronunciation(l.id)).map(l => l.id)));
const visited = new Set();
for (const lesson of orderedLessons(LESSONS)) {
  for (const id of prerequisites(lesson.id)) assert.ok(visited.has(id), `${lesson.id}: prerequisite must precede lesson`);
  visited.add(lesson.id);
}
let seed = 42;
const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32);
let questions = 0;
let written = 0;
for (const lesson of LESSONS) {
  const before = JSON.stringify(lesson.quiz);
  for (let run = 0; run < 20; run++) {
    const items = prepareQuiz(lesson.quiz, random);
    assert.equal(items.length, lesson.quiz.length);
    const positions = [0, 0, 0];
    for (const item of items) {
      const original = lesson.quiz.find(q => q.q === item.q && JSON.stringify([...q.options].sort()) === JSON.stringify([...item.options].sort()));
      assert.equal(item.options[item.answer], original.options[original.answer]);
      assert.deepEqual([...item.options].sort(), [...original.options].sort());
      assert.ok(isCorrect(item, item.answer));
      assert.ok(!isCorrect(item, '__no_lo_se__'));
      positions[item.answer]++;
    }
    assert.ok(Math.max(...positions) <= Math.ceil(items.length / 3), `${lesson.id}: unbalanced positions`);
    assert.ok(Math.max(...positions) / items.length < .8, `${lesson.id}: guessing one position must fail`);
  }
  assert.equal(JSON.stringify(lesson.quiz), before, 'Do not mutate source or saved snapshots');
  questions += lesson.quiz.length;
  const ids = new Set();
  const prompts = new Set();
  for (let stage = 0; stage < 3; stage++) {
    const items = productionItems(lesson, stage);
    assert.equal(items.length, isPronunciation(lesson.id) ? 0 : 2);
    for (const item of items) {
      written++;
      assert.ok(item.q.includes('___'));
      assert.ok(!ids.has(item.id)); ids.add(item.id);
      assert.ok(!prompts.has(item.q)); prompts.add(item.q);
      assert.ok(item.why && !item.why.includes('undefined'));
      for (const answer of item.accepted) {
        assert.ok(isCorrect(item, answer), `${item.id}: canonical answer`);
        assert.ok(isCorrect(item, ` ${answer.toUpperCase()}. `), `${item.id}: formatting`);
      }
      assert.ok(!isCorrect(item, 'una respuesta incorrecta'));
      assert.ok(!isCorrect(item, '__no_lo_se__'));
      assert.ok(!isCorrect(item, ''));
    }
  }
}
assert.equal(written, 450);
const sentence = { type: 'write', accepted: ['They do not play chess'] };
assert.ok(isCorrect(sentence, '  They don’t play chess!  '));
assert.ok(!isCorrect(sentence, 'They play chess'));
assert.ok(isCorrect({ type: 'write', accepted: ['She is always early'] }, "She's always early"));
assert.ok(isCorrect({ type: 'write', accepted: ['He has finished'] }, "He's finished"));
assert.ok(isCorrect({ type: 'write', accepted: ['I would have helped'] }, "I'd have helped"));
assert.ok(!isCorrect({ type: 'write', strict: true, accepted: ["I'm"] }, 'I am'));
assert.ok(!isCorrect({ type: 'write', accepted: ["parents'"] }, "parent's"), 'Possessive distinctions are meaningful');
const legacy = { best: 100, done: true, last: '2025-01-01' };
assert.equal(learningState(legacy, '2026-09-12'), 'Nota anterior conservada');
assert.equal(legacy.testPassedAt, undefined);
const record = (p, mode, percent, day = '2026-09-12', options = {}) => recordLearning(p, { mode, percent, day, ...options });
let p = record(legacy, 'test', 100);
assert.equal(p.nextReview, undefined);
p = record(p, 'production', 50);
assert.equal(p.nextReview, undefined);
p = record(p, 'production', 100);
assert.equal(p.nextReview, '2026-09-14');
assert.equal(learningState(p, '2026-09-12'), 'En consolidación');
assert.equal(record(p, 'retention', 100, '2026-09-13').retentionPasses, 0, 'Early practice is not retention');
assert.equal(record(p, 'retention', 100, '2026-09-14', { eligible: false }).retentionPasses, 0, 'Consulting theory is training');
p = record(p, 'retention', 100, '2026-09-14');
assert.equal(p.retentionPasses, 1);
assert.equal(p.nextReview, '2026-09-21');
assert.equal(record(p, 'retention', 100, '2026-09-14').retentionPasses, 1, 'No duplicate same-day credit');
p = record(p, 'retention', 100, '2026-09-21');
assert.equal(p.retentionPasses, 2);
assert.equal(p.nextReview, '2026-10-21');
assert.equal(learningState(p, '2026-09-22'), 'Consolidada en la práctica');
for (const mode of ['errors', 'ai']) assert.deepEqual(record(p, mode, 0), p);
assert.deepEqual(record(p, 'test', 0, '2026-09-22', { eligible: false }), p);
const failed = record(p, 'retention', 50, '2026-10-21');
assert.equal(failed.retentionPasses, 0);
assert.equal(failed.nextReview, '2026-10-22');
assert.equal(failed.best, 100);
assert.equal(record(p, 'test', 0, '2026-09-22').retentionPasses, 0);
assert.equal(record(p, 'production', 0, '2026-09-22').nextReview, '2026-09-23');
assert.equal(record({ nextReview: '2026-09-12' }, 'retention', 100).retentionPasses, undefined, 'Both prerequisites required');
assert.equal(dayAfter('2026-12-31', 2), '2027-01-02');
assert.equal(dayAfter('2028-02-28', 2), '2028-03-01');
assert.equal(dayAfter('2026-03-28', 2), '2026-03-30');
console.log(JSON.stringify({ result: 'PASS', lessons: LESSONS.length, balancedQuestions: questions, written, checks: '20 shuffles per lesson, coverage, variants, prerequisites, legacy scores, spaced retrieval, failure, date boundaries' }));
