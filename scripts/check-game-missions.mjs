import assert from 'node:assert/strict';
import { MISSIONS, newMission, validMissionRun, missionQuestion, answerMission, advanceMission, missionSummary, missionCard, recommendMission } from '../public/game-missions.js';
import { spelling, reviewExercise, reviewCorrect } from '../public/game-learning.js';
const day = '2026-09-14';
for (const mission of MISSIONS) {
  assert.equal(mission.items.length, 3);
  assert.equal(new Set(mission.items.map(i => i.id)).size, 3);
  for (const item of mission.items) {
    assert.equal(new Set(item.options).size, 3);
    assert.ok(item.options.includes(item.answer));
    const contexts = [item.baseline, item.transfer, ...item.variants];
    assert.equal(new Set(contexts.map(q => q.prompt)).size, 4);
    for (const question of [...contexts, item.recall]) {
      assert.ok(reviewCorrect(question, question.accepted[0]));
      assert.ok(!spelling(question.prompt).includes(spelling(question.accepted[0])), `Answer leaked in ${mission.id}/${item.id}: ${question.prompt}`);
      assert.ok(!reviewCorrect(question, ''));
    }
    assert.notEqual(reviewExercise(missionCard(mission, item)).prompt, item.transfer.prompt);
    assert.notEqual(reviewExercise({ ...missionCard(mission, item), stage: 1 }).prompt, reviewExercise(missionCard(mission, item)).prompt);
  }
  let run = newMission(mission, day);
  assert.ok(validMissionRun(run, mission));
  assert.equal(advanceMission(run), run, 'Cannot skip unattempted questions');
  let iterations = 0;
  while (run.i < run.steps.length) {
    assert.ok(iterations++ < 30);
    const step = run.steps[run.i];
    if (step.kind !== 'example') {
      const correct = step.kind !== 'baseline' && !(step.kind === 'recall' && step.item === 0);
      run.help = step.kind === 'recall' && step.item === 1;
      run.listenedTo = missionQuestion(mission, step).audio;
      run = answerMission(run, mission, correct ? missionQuestion(mission, step).accepted[0] : 'unknown', day);
      assert.equal(answerMission(run, mission, 'second answer', day), run, 'Cannot overwrite first attempt');
    }
    run = advanceMission(run);
    assert.ok(validMissionRun(JSON.parse(JSON.stringify(run)), mission), 'Resume serialized state');
  }
  assert.equal(run.steps.filter(s => s.kind === 'retry').length, 2);
  assert.deepEqual(missionSummary(run), { date: day, baseline: 0, recall: 1, transfer: 3, total: 3, assisted: 1 });
  run = newMission(mission, day);
  for (let i = 0; i < 3; i++) { run.listenedTo = mission.items[i].baseline.audio; run = advanceMission(answerMission(run, mission, mission.items[i].baseline.accepted[0], day)); }
  assert.equal(run.steps[run.i].kind, 'example');
  run = advanceMission(run);
  assert.equal(run.steps[run.i].kind, 'example', 'Known baseline skips recognition, not later retrieval');
}
assert.equal(reviewCorrect(MISSIONS[3].items[0].recall, 'Id like'), false, 'Contractions retain meaningful apostrophes');
const listening = MISSIONS.find(m => m.mode === 'listening');
const unheard = newMission(listening, day);
assert.equal(answerMission(unheard, listening, listening.items[0].baseline.accepted[0], day), unheard);
assert.equal(recommendMission(MISSIONS, {}, {}, day).mission.id, MISSIONS[0].id);
assert.equal(recommendMission(MISSIONS, {}, { [MISSIONS[2].id]: { last: { date:'2026-09-13', transfer:1 } } }, day).mission.id, MISSIONS[2].id);
assert.equal(recommendMission(MISSIONS, { [MISSIONS[1].id]:newMission(MISSIONS[1],day) }, {}, day).resumed, true);
console.log(`PASS: ${MISSIONS.length} missions, ${MISSIONS.length * 3} targets, audio variants, hearing gate, adaptive recommendations/retries, first-attempt metrics, resumable state`);
