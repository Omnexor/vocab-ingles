import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LESSONS } from '../public/lessons.js';
import { productionItems } from '../public/grammar-practice.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve(process.env.LEARNING_OUTPUT || '../../learning-review');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const key = 'vocab-ingles:v1';
const lesson = LESSONS.find(l => l.id === 'verbo-be');
try {
  for (const [width, height, colorScheme] of [[320, 740, 'light'], [390, 844, 'light'], [430, 932, 'dark'], [1280, 900, 'light']]) {
    if (process.env.GRAMMAR_WIDTH && Number(process.env.GRAMMAR_WIDTH) !== width) continue;
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 720,
      hasTouch: width < 720, colorScheme, reducedMotion: 'reduce', serviceWorkers: 'block', timezoneId: 'Europe/Madrid' });
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date('2026-09-12T12:00:00Z'));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const data = () => page.evaluate(k => JSON.parse(localStorage.getItem(k)), key);
    const draft = async () => (await data()).lessonSessions[lesson.id];
    const progress = async () => (await data()).lessons[lesson.id];
    const capture = async name => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: horizontal overflow at ${width}`);
      await page.screenshot({ path: resolve(output, `${width}-grammar-${name}.png`), animations: 'disabled' });
    };
    const index = async () => {
      await page.reload();
      await page.getByRole('button', { name: 'Aprender', exact: true }).click();
      await page.locator('#learning-lane').waitFor();
    };
    const reopen = async () => {
      await index();
      await page.locator(`#lecciones-lista [data-lesson="${lesson.id}"]`).click();
    };
    const answer = async (kind = 'correct') => {
      const session = await draft();
      const item = session.items[session.i];
      if (kind === 'nose') await page.locator('#nose').click();
      else if (item.type === 'write') {
        await page.locator('#written-response').fill(kind === 'correct' ? item.accepted[0] : 'wrong answer');
        await page.locator('#written-response').press('Enter');
      } else await page.locator(`[data-opt="${kind === 'correct' ? item.answer : (item.answer + 1) % item.options.length}"]`).click();
      try { await page.locator('#next-q').waitFor({ timeout: 5000 }); }
      catch (error) {
        await capture('failure');
        console.error(JSON.stringify({ width, session: await draft(), ui: await page.locator('#quiz-box').innerText(), focus: await page.evaluate(() => document.activeElement?.outerHTML), errors }));
        throw error;
      }
    };
    const finish = async () => {
      while (await page.locator('#quiz-box .quiz-q').count()) {
        if (!await page.locator('#next-q').count()) await answer();
        await page.locator('#next-q').click();
      }
      await page.locator('.lesson-result-title').waitFor();
    };
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Aprender', exact: true }).click();
    assert.equal(await page.locator('#learning-next button').getAttribute('data-lesson'), lesson.id);
    assert.equal(await page.locator('#lecciones-lista .lesson-card').count(), 75);
    await capture('route');
    await page.locator('#learning-lane').selectOption('pronunciation');
    assert.equal(await page.locator('#lecciones-lista .lesson-card').count(), 8);
    await page.locator('#learning-next button').click();
    assert.equal(await page.locator('#start-production').count(), 0);
    await index();
    await page.locator('#learning-next button').click();
    await capture('overview');
    await page.locator('#lesson-note').fill('I am a designer.');
    assert.equal((await data()).lessonNotes[lesson.id], 'I am a designer.');
    await page.locator('#order-practice > summary').click();
    await page.locator('#order-words button').first().click();
    assert.ok((await page.locator('#order-output').innerText()).length > 0);
    await page.locator('#order-reset').click();
    assert.equal(await page.locator('#order-output').innerText(), '');
    await reopen();
    assert.equal(await page.locator('#lesson-note').inputValue(), 'I am a designer.');
    await page.locator('#start-quiz').click();
    await page.waitForFunction(() => document.activeElement?.matches('#quiz-box .quiz-q'));
    const snapshot = await draft();
    await page.locator('#lesson-theory-toggle').focus();
    await page.keyboard.press('Enter');
    assert.ok(await page.locator('#lesson-theory').isVisible());
    await page.keyboard.press('1');
    await page.keyboard.press('0');
    assert.equal((await draft()).answers.length, 0);
    await page.locator('#lesson-theory-toggle').click();
    await answer('wrong');
    assert.match(await page.locator('.explain').innerText(), /Respuesta esperada/);
    await capture('feedback');
    await reopen();
    page.once('dialog', dialog => dialog.dismiss());
    await page.locator('#start-quiz').click();
    assert.ok(await page.locator('#resume-quiz').isVisible());
    await page.locator('#resume-quiz').click();
    assert.deepEqual((await draft()).items, snapshot.items, 'Reload preserves shuffled order and mappings');
    assert.equal(await page.locator('[data-opt]:not([disabled])').count(), 0);
    await page.locator('#next-q').click();
    await answer('nose');
    await page.locator('#next-q').click();
    await answer('wrong');
    await page.locator('#next-q').click();
    await finish();
    const firstScore = Math.round((lesson.quiz.length - 3) / lesson.quiz.length * 100);
    assert.equal((await progress()).best, firstScore);
    assert.equal((await data()).lessonMistakes[lesson.id].items.length, 3);
    assert.equal(await draft(), undefined);
    await reopen();
    await page.locator('#saved-mistakes').click();
    await answer();
    await page.locator('#next-q').click();
    await reopen();
    await page.locator('#resume-quiz').click();
    await finish();
    assert.equal((await progress()).best, firstScore, 'Subset review does not inflate the test score');
    assert.equal((await data()).lessonMistakes[lesson.id], undefined);
    await page.locator('#retry-quiz').click();
    await finish();
    assert.equal((await progress()).best, 100);
    assert.ok((await progress()).testPassedAt);
    assert.equal((await progress()).nextReview, undefined);
    assert.ok(await page.locator('#result-production').isVisible());
    await page.locator('#result-production').click();
    const writtenItem = (await draft()).items[0];
    await page.locator('#written-response').fill('unfinished');
    await reopen();
    await page.locator('#resume-quiz').click();
    assert.equal(await page.locator('#written-response').inputValue(), 'unfinished');
    assert.equal((await draft()).items[0].id, writtenItem.id);
    await capture('written');
    await answer('wrong');
    await page.locator('#next-q').click();
    await finish();
    assert.equal((await progress()).productionPassedAt, undefined);
    assert.equal((await progress()).best, 100);
    await page.locator('#review-mistakes').click();
    await finish();
    assert.equal((await progress()).productionPassedAt, undefined, 'Written subset review cannot complete application');
    await page.locator('#result-production').click();
    await finish();
    assert.equal((await progress()).nextReview, '2026-09-14');
    assert.equal((await progress()).retentionPasses, 0);
    await capture('scheduled');
    await reopen();
    assert.equal(await page.locator('#start-retention').count(), 0, 'No early retention button');
    await page.clock.setFixedTime(new Date('2026-09-14T12:00:00Z'));
    await index();
    assert.equal(await page.locator('#learning-next button').getAttribute('data-lesson'), lesson.id, 'Due review takes priority');
    await page.locator('#learning-next button').click();
    await page.locator('#start-retention').click();
    const firstReview = (await draft()).items.map(i => i.id).sort();
    assert.ok(!firstReview.includes(writtenItem.id), 'Different prompts after delay');
    await page.locator('#lesson-theory-toggle').click();
    await page.locator('#lesson-theory-toggle').click();
    await finish();
    assert.equal((await progress()).retentionPasses, 0, 'Looking up theory does not demonstrate retention');
    await reopen();
    await page.locator('#start-retention').click();
    await finish();
    assert.equal((await progress()).retentionPasses, 1);
    assert.equal((await progress()).nextReview, '2026-09-21');
    await page.clock.setFixedTime(new Date('2026-09-21T12:00:00Z'));
    await reopen();
    await page.locator('#start-retention').click();
    assert.ok((await draft()).items.every(i => !firstReview.includes(i.id)));
    await finish();
    assert.equal((await progress()).retentionPasses, 2);
    assert.equal((await progress()).nextReview, '2026-10-21');
    await capture('consolidated');

    // Migrate an old score and a version-1 attempt without deleting either.
    await page.evaluate(({ key, lesson }) => {
      const s = JSON.parse(localStorage.getItem(key));
      s.lessons[lesson.id] = { best: 90, done: true, last: '2025-01-01' };
      s.lessonSessions[lesson.id] = { version: 1, items: lesson.quiz, answers: [lesson.quiz[0].answer], i: 0, ia: false, review: false, updatedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(s));
    }, { key, lesson });
    await reopen();
    assert.match(await page.locator('.lesson-learning-state').innerText(), /Nota anterior conservada/);
    await page.locator('#resume-quiz').click();
    assert.ok(await page.locator('.explain').isVisible());
    await finish();
    assert.equal((await progress()).best, 90);
    assert.equal((await progress()).testPassedAt, undefined);
    assert.equal((await data()).lessonNotes[lesson.id], 'I am a designer.');
    await reopen();
    await page.locator('#start-quiz').click();
    await answer();
    await reopen();
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#start-quiz').click();
    assert.equal((await draft()).answers.length, 0, 'Confirmed restart resets only the draft');
    assert.equal((await progress()).best, 90);
    // A full recognition test must not discard a pending written exercise.
    await page.evaluate(({ key, id, pending }) => {
      const s = JSON.parse(localStorage.getItem(key));
      s.lessonMistakes[id] = { items: [pending], ia: false };
      localStorage.setItem(key, JSON.stringify(s));
    }, { key, id: lesson.id, pending: productionItems(lesson)[0] });
    await reopen();
    await page.locator('#resume-quiz').click();
    await finish();
    assert.equal((await data()).lessonMistakes[lesson.id].items[0].type, 'write');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result: 'PASS', width, colorScheme, checks: 'routes, mobile layout, saved notes, ordering, shuffled resume, keyboard, errors, written drafts, legacy migration, delayed retention, theory, restart' }));
    await context.close();
  }
} finally { await browser.close(); }
