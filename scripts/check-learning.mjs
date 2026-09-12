import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LESSONS } from '../public/lessons.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve(process.env.LEARNING_OUTPUT || '../../learning-review');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [width, height, colorScheme] of [[320, 740, 'light'], [390, 844, 'light'], [430, 932, 'dark'], [1280, 900, 'light']]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 720,
      hasTouch: width < 720, colorScheme, reducedMotion: 'reduce', serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const capture = async name => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: horizontal overflow`);
      await page.screenshot({ path: resolve(output, `${width}-${name}.png`), animations: 'disabled' });
    };
    const reopen = async () => {
      await page.reload();
      await page.getByRole('button', { name: 'Aprender', exact: true }).click();
      await page.locator('#learning-next button').click();
    };
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Aprender', exact: true }).click();
    await page.locator('#learning-next button').waitFor();
    await capture('route');
    await page.locator('#learning-next button').click();
    await capture('lesson');
    await page.locator('#start-quiz').click();
    await page.locator('#quiz-box .quiz-q').waitFor();
    await page.waitForFunction(() => document.activeElement?.matches('#quiz-box .quiz-q'));
    assert.equal(await page.locator('#lesson-theory').isVisible(), false);
    const lesson = LESSONS[0];
    const question = await page.locator('#quiz-box .quiz-q').innerText();
    await page.locator('#lesson-theory-toggle').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#lesson-theory').isVisible(), true);
    assert.equal(await page.locator('#quiz-box').isVisible(), false);
    await page.keyboard.press('1');
    await page.keyboard.press('0');
    await page.locator('#lesson-theory-toggle').click();
    assert.equal(await page.locator('#quiz-box .quiz-q').innerText(), question);
    assert.equal(await page.locator('#quiz-box .explain').count(), 0);
    await capture('question');
    for (const [i, item] of lesson.quiz.entries()) {
      if (i === 2) {
        await reopen();
        await page.locator('#resume-quiz').click();
        assert.equal(await page.locator('#quiz-box .quiz-q').innerText(), item.q);
        assert.equal(await page.locator('#quiz-box .explain').count(), 0);
      }
      if (i === 2) await page.locator('#quiz-box #nose').click();
      else await page.locator(`#quiz-box [data-opt="${i < 2 ? (item.answer + 1) % item.options.length : item.answer}"]`).click();
      if (i === 0) {
        assert.match(await page.locator('#quiz-box .explain').innerText(), /Respuesta correcta:/);
        await capture('feedback');
        await reopen();
        assert.match(await page.locator('.lesson-resume h3').innerText(), /ejercicio 1 de 9/);
        page.once('dialog', dialog => dialog.dismiss());
        await page.locator('#start-quiz').click();
        assert.equal(await page.locator('#resume-quiz').isVisible(), true, 'Cancelling restart preserves the draft');
        await capture('resume');
        await page.locator('#resume-quiz').click();
        assert.equal(await page.locator('#quiz-box .quiz-q').innerText(), item.q);
        assert.equal(await page.locator('#quiz-box [data-opt]:not([disabled])').count(), 0);
        assert.match(await page.locator('#quiz-box .explain').innerText(), /Respuesta correcta:/);
      }
      if (i === lesson.quiz.length - 1) {
        await reopen();
        await page.locator('#resume-quiz').click();
        assert.equal(await page.locator('#next-q').innerText(), 'Ver resultado');
      }
      await page.locator('#next-q').click();
    }
    assert.match(await page.locator('#review-mistakes').innerText(), /3 ejercicios/);
    await capture('result');
    await page.locator('#finish-lesson').click();
    await reopen();
    assert.equal(await page.locator('#resume-quiz').count(), 0, 'A finished test is not resumable');
    assert.match(await page.locator('#saved-mistakes').innerText(), /Reforzar 3 ejercicios/);
    await capture('saved-errors');
    await page.locator('#saved-mistakes').click();
    for (const [i, item] of lesson.quiz.slice(0, 3).entries()) {
      if (i === 1) {
        await page.locator('#back-lecciones').click();
        await reopen();
        await page.locator('#resume-quiz').click();
        assert.match(await page.locator('#quiz-box .quiz-progress-meta').innerText(), /Repaso de errores/);
      }
      assert.equal(await page.locator('#quiz-box .quiz-q').innerText(), item.q);
      await page.locator(`#quiz-box [data-opt="${item.answer}"]`).click();
      await page.locator('#next-q').click();
    }
    assert.match(await page.locator('.lesson-result-title').innerText(), /Repaso de errores terminado/);
    assert.equal(await page.locator('#next-lesson').count(), 0);
    await capture('review-result');
    await page.locator('#finish-lesson').click();
    const lessonCard = page.locator(`#lecciones-lista [data-lesson="${lesson.id}"]`);
    assert.match(await lessonCard.innerText(), /Mejor intento · 67%/);
    assert.match(await page.locator('#learning-next button').innerText(), /Retomar lección/);
    await page.locator('#learning-next button').click();
    assert.equal(await page.locator('#saved-mistakes').count(), 0, 'Successful review clears the pending errors');
    await page.locator('#start-quiz').click();
    for (const item of lesson.quiz) {
      await page.locator(`#quiz-box [data-opt="${item.answer}"]`).click();
      await page.locator('#next-q').click();
    }
    assert.equal(await page.locator('.lesson-result-title').innerText(), 'Lección superada');
    await page.locator('#next-lesson').click();
    assert.equal(await page.locator('#leccion-detalle .view-head h2').innerText(), LESSONS[1].title);
    await page.locator('#back-lecciones').click();
    assert.match(await lessonCard.innerText(), /Superada · 100%/);
    assert.equal(await page.locator('#learning-next button').getAttribute('data-lesson'), LESSONS[1].id);
    await page.locator('#learning-next button').click();
    await page.locator('#start-quiz').click();
    for (const item of LESSONS[1].quiz) {
      await page.locator('#quiz-box #nose').click();
      await page.locator('#next-q').click();
    }
    await page.locator('#finish-lesson').click();
    assert.match(await page.locator(`#lecciones-lista [data-lesson="${LESSONS[1].id}"]`).innerText(), /Mejor intento · 0%/);
    await page.reload();
    await page.getByRole('button', { name: 'Aprender', exact: true }).click();
    assert.match(await lessonCard.innerText(), /Superada · 100%/);
    assert.equal(await page.locator('#learning-next button').getAttribute('data-lesson'), LESSONS[1].id);
    assert.deepEqual(errors, []);
    await page.locator('#learning-next button').click();
    await page.locator('#start-quiz').click();
    await page.locator('#quiz-box [data-opt]').first().click();
    await page.locator('#back-lecciones').click();
    await page.locator('#learning-next button').click();
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#start-quiz').click();
    assert.equal(await page.locator('#quiz-box .explain').count(), 0, 'Confirmed restart starts unanswered');
    assert.equal(await page.locator('#quiz-box .quiz-q').innerText(), LESSONS[1].quiz[0].q);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ width, colorScheme, result: 'PASS', checks: 'resume, restart, saved errors, theory, keyboard, review scoring, full test, next lesson', screenshots: output }));
    await context.close();
  }
} finally { await browser.close(); }
