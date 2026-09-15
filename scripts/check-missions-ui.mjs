import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { MISSIONS, missionQuestion } from '../public/game-missions.js';
import { reviewExercise } from '../public/game-learning.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve('../../games-review'); await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [width, colorScheme] of [[320, 'light'], [390, 'light'], [430, 'dark'], [1280, 'light']]) {
    if (process.env.MISSIONS_WIDTH && Number(process.env.MISSIONS_WIDTH) !== width) continue;
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 720, hasTouch: width < 720, colorScheme, serviceWorkers: 'block', timezoneId: 'Europe/Madrid', reducedMotion: 'reduce' });
    await context.addInitScript(() => { speechSynthesis.speak = () => {}; });
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date('2026-09-14T12:00:00Z'));
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const data = () => page.evaluate(() => JSON.parse(localStorage.getItem('vocab-ingles:v1')));
    const index = async () => { await page.reload(); await page.getByRole('button', { name: 'Juegos', exact: true }).click(); await page.locator('#mission-start').waitFor(); };
    const capture = async name => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width} overflow ${name}`);
      await page.screenshot({ path: resolve(output, `${width}-mission-${name}.png`), animations: 'disabled' });
    };
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Juegos', exact: true }).click();
    await capture('hub');
    const missions = width === 390 ? MISSIONS.filter(m => m.mode !== 'listening') : MISSIONS.slice(0, 1);
    for (const mission of missions) {
      if (mission.id === MISSIONS[0].id) await page.locator('#mission-start').click();
      else {
        await index();
        await page.locator('#mission-hub summary').click();
        await page.locator(`[data-mission="${mission.id}"]`).click();
      }
      let rounds = 0, restoredDraft = false, restoredHelp = false, restoredFeedback = false;
      while (!await page.locator('#mission-done').count()) {
        assert.ok(rounds++ < 25, 'Mission must terminate');
        let run = (await data()).missionSessions[mission.id];
        const step = run.steps[run.i];
        if (step.kind === 'example') { await page.locator('#mission-next').click(); continue; }
        if (!restoredDraft && step.kind === 'baseline') {
          await page.locator('#mission-answer').fill('draft');
          await index(); await page.locator('#mission-start').click();
          assert.equal(await page.locator('#mission-answer').inputValue(), 'draft'); restoredDraft = true;
        }
        const answer = missionQuestion(mission, step).accepted[0];
        const unknown = (step.kind === 'baseline' && step.item !== 0) || (step.kind === 'recall' && step.item === 0);
        if (step.kind === 'recall' && step.item === 1) {
          await page.locator('#mission-help').click();
          if (!restoredHelp) {
            await index(); await page.locator('#mission-start').click();
            assert.ok(await page.locator('.pista-box').isVisible()); restoredHelp = true;
          }
        }
        if (unknown) await page.locator('#mission-skip').click();
        else if (step.kind === 'choice') await page.locator('[data-mission-answer]').filter({ hasText: answer }).first().click();
        else {
          await page.locator('#mission-answer').fill(answer);
          await page.locator('#mission-answer').press('Enter');
        }
        if (!restoredFeedback && step.kind === 'transfer') {
          const before = Object.keys((await data()).missionSessions[mission.id].answers).length;
          await capture('transfer-feedback');
          await index(); await page.locator('#mission-start').click();
          assert.equal(await page.locator('#mission-answer').count(), 0);
          assert.equal(Object.keys((await data()).missionSessions[mission.id].answers).length, before);
          restoredFeedback = true;
        }
        if (step.kind === 'baseline') assert.ok(!(await page.locator('.explain').innerText()).includes('Modelo:'));
        await page.locator('#mission-next').click();
      }
      const saved = await data();
      assert.deepEqual(saved.missionProgress[mission.id].last, { date:'2026-09-14', baseline:1, recall:1, transfer:3, total:3, assisted:1 });
      assert.equal(saved.missionSessions[mission.id].steps.filter(s => s.kind === 'retry').length, 2);
      assert.equal(Object.values(saved.gameReview).filter(c => c.mission === mission.id).length, 3);
      await capture(`result-${mission.id}`);
    }
    // Review the first mission in isolation; other completed mission data stays intact.
    await page.evaluate(id => {
      const key = 'vocab-ingles:v1', s = JSON.parse(localStorage.getItem(key));
      for (const card of Object.values(s.gameReview)) if (card.mission !== id) card.due = '2030-01-01';
      localStorage.setItem(key, JSON.stringify(s));
    }, MISSIONS[0].id);
    for (const [day, stage, due] of [['2026-09-15',1,'2026-09-18'],['2026-09-18',2,'2026-09-25'],['2026-09-25',3,'2026-10-25']]) {
      await page.clock.setFixedTime(new Date(`${day}T12:00:00Z`));
      await index(); await page.locator('#mission-review').click();
      for (let i = 0; i < 3; i++) {
        const prompt = await page.locator('.game-written-review h3').innerText();
        const card = Object.values((await data()).gameReview).map(reviewExercise).find(c => c.prompt === prompt);
        assert.equal(card.mission, MISSIONS[0].id, 'Due reviews precede future practice');
        assert.ok(!MISSIONS[0].items.some(item => item.transfer.prompt === prompt));
        await page.locator('#game-review-answer').fill(card.accepted[0]);
        await page.locator('#game-review-answer').press('Enter');
        if (!i) await capture(`review-stage-${stage}`);
        try { await page.locator('#game-review-next').click({ timeout:5000 }); }
        catch (error) { await capture('review-failure'); console.error(JSON.stringify({width,day,i,errors,state:(await data()).gameReviewSession,view:await page.locator('#juego-activo').innerText()})); throw error; }
      }
      const cards = Object.values((await data()).gameReview).filter(c => c.mission === MISSIONS[0].id);
      assert.ok(cards.every(c => c.stage === stage && c.due === due));
      // Exit before optional early practice of the other missions.
      await page.locator('#back-juegos').click();
      await page.evaluate(() => { const key='vocab-ingles:v1', s=JSON.parse(localStorage.getItem(key)); s.gameReviewSession=null; localStorage.setItem(key,JSON.stringify(s)); });
    }
    // An early assisted answer resets support without creating another successful check.
    await index(); await page.locator('#open-game-review').click();
    const prompt = await page.locator('.game-written-review h3').innerText();
    const card = Object.values((await data()).gameReview).map(reviewExercise).find(c => c.prompt === prompt);
    await page.locator('#game-review-model').click();
    await page.locator('#game-review-answer').fill(card.accepted[0]);
    await index(); await page.locator('#open-game-review').click();
    assert.equal(await page.locator('.game-written-review h3').innerText(), prompt);
    assert.equal(await page.locator('#game-review-answer').inputValue(), card.accepted[0]);
    assert.ok(await page.locator('#game-review-model-text').isVisible());
    await page.locator('#game-review-answer').press('Enter');
    assert.equal((await data()).gameReview[card.key].stage, 0);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result:'PASS', width, missions:missions.length, checks:'initial/recognition/recall/context, adaptive retries, reload draft/help/feedback, first-attempt metrics, three delayed checks, maintenance, review help persistence', screenshots:output }));
    await context.close();
  }
} finally { await browser.close(); }
