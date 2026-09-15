import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve(process.env.LEARNING_OUTPUT || '../../learning-review');
await mkdir(output, { recursive: true });
const key = 'vocab-ingles:v1', id = 'primer-dia';
const version = Number((await readFile(new URL('../public/sw.js', import.meta.url), 'utf8')).match(/const VERSION = (\d+)/)[1]);
const browser = await chromium.launch();
try {
  for (const [width, height, colorScheme] of [[320, 740, 'light'], [390, 844, 'light'], [430, 932, 'dark'], [1280, 900, 'light']]) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme, reducedMotion: width === 390 ? 'no-preference' : 'reduce', isMobile: width < 720, hasTouch: width < 720, serviceWorkers: width === 390 ? 'allow' : 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const data = () => page.evaluate(k => JSON.parse(localStorage.getItem(k)), key);
    const open = async () => {
      await page.getByRole('button', { name: 'Aprender', exact: true }).click();
      await page.locator('#learning-next button').waitFor();
      await page.locator('#modo-lecturas').click();
      await page.locator(`#lecturas-lista [data-lectura="${id}"]`).click();
    };
    const capture = async name => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width} ${name}: overflow`);
      await page.screenshot({ path: resolve(output, `${width}-comprehension-${name}.png`), animations: 'disabled' });
    };
    await page.goto('http://localhost:3000');
    await open();
    await page.locator('#reading-note').fill('Un primer día difícil con una conversación más fácil.');
    await page.locator('#start-reading-check').click();
    await capture('question');
    assert.equal(await page.locator('#reader-text').isVisible(), false);
    assert.equal(await page.locator('.reading-check-feedback').count(), 0);
    for (const button of await page.locator('[data-reading-choice]').all()) assert.ok((await button.boundingBox()).height >= 48);
    const bookmark = (await data()).readingSessions[id].index;
    await page.locator('#reading-check-exit').click();
    assert.equal((await data()).readingChecks[id].helped[0], true, 'Returning to the text before answering counts as support');
    await page.locator('#back-lecturas').click();
    await page.locator('#reading-status').selectOption('check-active');
    assert.equal(await page.locator('#lecturas-lista .reading-entry').count(), 1);
    await capture('pending-library');
    await page.locator('#reading-next [data-reading-practice]').click();
    await page.locator('#reading-check-title').waitFor();
    await page.locator('#reading-check-source > summary').click();
    await page.waitForFunction(([key, id]) => JSON.parse(localStorage.getItem(key)).readingChecks[id].helped[0], [key, id]);
    await page.locator('#reading-check-source > summary').click();
    let state = (await data()).readingChecks[id];
    await page.locator(`[data-reading-choice="${state.order[0].indexOf(0)}"]`).click();
    assert.match(await page.locator('#reading-feedback-title').innerText(), /con apoyo/);
    assert.equal(await page.locator('[data-reading-choice]:enabled').count(), 0);
    assert.ok(await page.locator('.reading-check-feedback blockquote').count() > 0);
    await capture('feedback');
    state = (await data()).readingChecks[id];
    if (width === 390) {
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(async version => {
        const cache = await caches.open(`vocab-v${version}`);
        return (await Promise.all(['index.html', 'app.js', 'reading-practice.js', 'readings.js', 'stories.js', 'lessons.js'].map(p => cache.match(`./${p}`)))).every(Boolean);
      }, version);
      await context.setOffline(true);
    }
    assert.equal((await data()).readingSessions[id].index, bookmark, 'Practice scrolling preserves bookmark');
    await page.reload(); await open();
    assert.equal(await page.locator('#reading-note').inputValue(), 'Un primer día difícil con una conversación más fácil.');
    await page.locator('#start-reading-check').click();
    assert.deepEqual((await data()).readingChecks[id], state, 'Reload preserves order and feedback');
    await page.locator('#reading-check-next').click();
    await page.locator('#reading-check-unknown').click();
    assert.match(await page.locator('#reading-feedback-title').innerText(), /encontrar/);
    await page.locator('#reading-check-next').click();
    state = (await data()).readingChecks[id];
    await page.locator(`[data-reading-choice="${state.order[2].indexOf(1)}"]`).click();
    assert.match(await page.locator('#reading-feedback-title').innerText(), /pistas/);
    await page.locator('#reading-check-next').click();
    const first = (await data()).readingChecks[id].first;
    assert.deepEqual(first, { total: 3, independent: 0, assisted: 1, wrong: 1, unknown: 1 });
    assert.equal((await data()).lecturas[id], undefined, 'Completion does not mark the text as read');
    assert.deepEqual((await data()).lessons, {});
    await capture('result');
    assert.deepEqual(await page.locator('[data-review-question]').evaluateAll(items => items.map(item => Number(item.dataset.reviewQuestion))), [2, 1, 0]);
    const review = page.locator('[data-review-question="2"]');
    await review.locator('summary').focus(); await page.keyboard.press('Enter');
    assert.match(await review.locator('.reading-review-content').innerText(), /Tu respuesta/);
    assert.match(await review.locator('.reading-review-content').innerText(), /Respuesta correcta/);
    await review.scrollIntoViewIfNeeded(); await capture('review');
    const complete = (await data()).readingChecks[id];
    const line = Number(await review.locator('[data-reading-line]').getAttribute('data-reading-line'));
    await review.locator('[data-reading-line]').click();
    await page.waitForFunction(n => document.activeElement?.dataset.n === String(n), line);
    assert.ok(await page.locator(`[data-n="${line}"]`).isVisible());
    assert.ok(await page.locator('#reader-check-return').isVisible());
    await capture('reread');
    await page.locator('#reader-check-return').click();
    assert.deepEqual((await data()).readingChecks[id], complete, 'Targeted rereading cannot change the result');
    await page.locator('#reading-check-exit').click();
    await page.locator('#back-lecturas').click();
    await page.locator('#reading-status').selectOption('reinforce');
    assert.equal(await page.locator('#lecturas-lista .reading-entry').count(), 1);
    assert.match(await page.locator('.reading-entry-practice').innerText(), /2 respuestas para reforzar/);
    await capture('reinforce-library');
    await page.locator('#lecturas-lista [data-reading-practice]').click();
    await page.locator('#reading-check-retry').click();
    for (let i = 0; i < 3; i++) {
      state = (await data()).readingChecks[id];
      const answer = page.locator(`[data-reading-choice="${state.order[i].indexOf(0)}"]`);
      await answer.focus(); await page.keyboard.press('Enter');
      await page.locator('#reading-check-next').click();
    }
    assert.deepEqual((await data()).readingChecks[id].first, first);
    assert.equal(await page.locator('.reading-check-stats').first().locator('dd').first().innerText(), '3');
    await page.locator('#reading-check-exit').click();
    assert.ok(await page.locator('#reader-text').isVisible());
    assert.equal(await page.locator('#start-reading-check').innerText(), 'Ver comprobación');
    await page.locator('#back-lecturas').click();
    await page.locator('#reading-status').selectOption('reinforce');
    assert.equal(await page.locator('#lecturas-lista .reading-entry').count(), 0, 'This attempt no longer has wrong or unknown answers');
    await page.locator('#reading-clear').click();
    assert.match(await page.locator(`.reading-entry:has([data-lectura="${id}"]) .reading-entry-practice`).innerText(), /3 aciertos sin consultar/);
    // Malformed imported state must restart safely, without deleting the notes.
    await page.addInitScript(([key, id]) => {
      const s = JSON.parse(localStorage.getItem(key)); s.readingChecks = { [id]: { version: 1, position: 2, responses: null } }; localStorage.setItem(key, JSON.stringify(s));
    }, [key, id]);
    await page.reload(); await open(); await page.locator('#start-reading-check').click();
    assert.equal((await data()).readingChecks[id].position, 0);
    if (width === 390) {
      await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
      await page.locator('#reading-check-unknown').click();
      assert.match(await page.locator('#reading-check-save').innerText(), /No se ha podido guardar/);
    }
    assert.deepEqual(errors, [], `${width}: browser errors`);
    console.log(JSON.stringify({ result: 'PASS', width, colorScheme, offline: width === 390 }));
    await context.close();
  }
} finally { await browser.close(); }
