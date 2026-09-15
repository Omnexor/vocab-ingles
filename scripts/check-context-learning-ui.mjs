import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { FRASES } from '../public/phrases.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve(process.env.LEARNING_OUTPUT || '../../learning-review');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const key = 'vocab-ingles:v1';
const swVersion = Number((await readFile(new URL('../public/sw.js', import.meta.url), 'utf8')).match(/const VERSION = (\d+)/)[1]);
try {
  for (const [width, height, colorScheme] of [[320, 740, 'light'], [390, 844, 'light'], [430, 932, 'dark'], [1280, 900, 'light']]) {
    if (process.env.CONTEXT_WIDTH && Number(process.env.CONTEXT_WIDTH) !== width) continue;
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 720, hasTouch: width < 720,
      reducedMotion: width === 390 ? 'no-preference' : 'reduce', colorScheme, serviceWorkers: width === 390 ? 'allow' : 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const data = () => page.evaluate(k => JSON.parse(localStorage.getItem(k)), key);
    const learning = async tab => {
      await page.reload();
      await page.getByRole('button', { name: 'Aprender', exact: true }).click();
      await page.locator('#learning-next button').waitFor();
      await page.locator(`#modo-${tab}`).click();
    };
    const capture = async name => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width} ${name}: overflow`);
      await page.screenshot({ path: resolve(output, `${width}-context-${name}.png`), animations: 'disabled' });
    };
    await page.goto('http://localhost:3000');
    if (width === 390) {
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(async version => {
        const cache = await caches.open(`vocab-v${version}`);
        return (await Promise.all(['index.html', 'app.js', 'phrases.js', 'readings.js', 'stories.js', 'lessons.js'].map(p => cache.match(`./${p}`)))).every(Boolean);
      }, swVersion);
    }
    await learning('frases');
    assert.equal(await page.locator('#frases-lista [data-frase]').count(), FRASES.length);
    await capture('phrases');
    const phrase = page.locator('[data-frase="piece-of-cake"]');
    const toggle = phrase.locator('[data-phrase-toggle]');
    await toggle.focus();
    await page.keyboard.press('Enter');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.ok(await phrase.locator('.frase-detalle').isVisible());
    assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Space');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    await phrase.locator('[data-phrase-practice]').click();
    assert.equal(await phrase.locator('.frase-en').count(), 0, 'The reference is concealed before retrieval');
    assert.equal(await page.locator('#phrase-compare').isEnabled(), false);
    await page.locator('#phrase-response').fill('It was really easy.');
    assert.equal((await data()).phraseDrafts['piece-of-cake'], 'It was really easy.');
    await capture('try');
    await learning('frases');
    await phrase.locator('[data-phrase-practice]').click();
    assert.equal(await page.locator('#phrase-response').inputValue(), 'It was really easy.');
    await page.locator('#phrase-compare').click();
    assert.ok(await page.locator('#phrase-model').isVisible());
    assert.match(await page.locator('#phrase-model').innerText(), /otras respuestas válidas/);
    assert.deepEqual((await data()).lessons, {}, 'Self-comparison does not grant grammar mastery');
    await page.locator('#phrase-response').fill('An alternative wording.');
    await capture('compare');
    await page.locator('#phrase-retry').click();
    assert.equal(await page.locator('#phrase-response').inputValue(), '');
    assert.equal(await page.locator('#phrase-model').count(), 0);
    await page.locator('#phrase-skip').click();
    assert.ok(await page.locator('#phrase-model').isVisible());
    await phrase.locator('[data-phrase-exit]').click();
    await page.locator('#phrase-search').fill('SUERTE');
    assert.ok(await page.locator('[data-frase="break-a-leg"]').isVisible());
    await page.locator('#phrase-search').fill('zzznomatch');
    await page.locator('#phrase-clear').click();
    assert.equal(await page.locator('#frases-lista [data-frase]').count(), FRASES.length);
    await page.locator('[data-catfrase="situaciones"]').click();
    assert.equal(await page.locator('#frases-lista [data-frase]').count(), FRASES.filter(f => f.cat === 'situaciones').length);

    await learning('lecturas');
    await capture('library');
    await page.locator('#reading-status').selectOption('active');
    assert.ok(await page.locator('#reading-clear').isVisible());
    await page.locator('#reading-clear').click();
    await page.locator('#reading-level').selectOption('basico');
    assert.ok((await page.locator('#lecturas-lista .lesson-tag').allTextContents()).every(s => s === 'Básico'));
    const reading = page.locator('#lecturas-lista [data-lectura]').first();
    const id = await reading.getAttribute('data-lectura');
    await reading.click();
    await page.locator('.lect-frase[data-n="8"]').scrollIntoViewIfNeeded();
    await page.waitForFunction(k => Object.values(JSON.parse(localStorage.getItem(k)).readingSessions || {}).some(s => s.index >= 6), key);
    const savedIndex = (await data()).readingSessions[id].index;
    assert.equal((await data()).lecturas[id], undefined, 'Scroll is not reading completion');
    await capture('reader-bookmark');
    await page.locator('#back-lecturas').click();
    assert.equal(await page.locator('#reading-level').inputValue(), 'basico');
    assert.match(await page.locator('#reading-next').innerText(), /Continuar lectura/);
    await learning('lecturas');
    await page.locator('#reading-next button').click();
    await page.waitForFunction(index => document.querySelector('#reader-position')?.textContent.startsWith(`Frase ${index + 1} de`), savedIndex);
    assert.equal(await page.locator('.lect-es:visible').count(), 0);
    await page.locator('#reader-restart').click();
    await page.waitForFunction(() => document.querySelector('#reader-position').textContent.startsWith('Frase 1 de'));
    await page.locator('#reading-note').fill('Una historia sobre ayudar a otra persona.');
    assert.equal((await data()).readingNotes[id], 'Una historia sobre ayudar a otra persona.');
    await capture('reflection');
    await page.locator('#lect-hecha').click();
    await page.locator('#lecciones-index').waitFor();
    assert.ok((await data()).lecturas[id]);
    assert.equal((await data()).readingSessions[id], undefined, 'Completing a reading clears only its bookmark');
    await page.locator('#reading-status').selectOption('read');
    assert.equal(await page.locator('#lecturas-lista [data-lectura]').count(), 1);
    await page.locator(`#lecturas-lista [data-lectura="${id}"]`).click();
    assert.equal(await page.locator('#reading-note').inputValue(), 'Una historia sobre ayudar a otra persona.');
    if (width === 390) {
      await page.locator('.lect-frase[data-n="8"]').scrollIntoViewIfNeeded();
      await page.waitForFunction(k => Object.values(JSON.parse(localStorage.getItem(k)).readingSessions || {}).some(s => s.index >= 6), key);
      const offlineIndex = (await data()).readingSessions[id].index;
      await context.setOffline(true);
      await learning('lecturas');
      await page.locator('#reading-next button').click();
      await page.waitForFunction(index => document.querySelector('#reader-position')?.textContent.startsWith(`Frase ${index + 1} de`), offlineIndex);
      assert.equal(await page.locator('#reading-note').inputValue(), 'Una historia sobre ayudar a otra persona.');
      await page.locator('#back-lecturas').click();
      await page.locator('#modo-frases').click();
      await phrase.locator('[data-phrase-practice]').click();
      await page.locator('#phrase-response').fill('An offline phrase draft.');
      await learning('frases');
      await phrase.locator('[data-phrase-practice]').click();
      assert.equal(await page.locator('#phrase-response').inputValue(), 'An offline phrase draft.');
      await page.locator('#phrase-compare').click();
      assert.ok(await page.locator('#phrase-model').isVisible());
      await page.evaluate(() => {
        window.originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = () => { throw new DOMException('Simulated full storage', 'QuotaExceededError'); };
      });
      await page.locator('#phrase-response').fill('This attempt cannot be saved.');
      assert.match(await page.locator('#phrase-save-status').innerText(), /No se ha podido guardar/);
      await page.evaluate(() => { Storage.prototype.setItem = window.originalSetItem; });
      console.log(JSON.stringify({ result: 'PASS', checks: `offline phrase draft, reading bookmark, saved reflection, storage failure message, SW v${swVersion}` }));
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result: 'PASS', width, colorScheme, checks: 'phrase keyboard, retrieval, saved draft, self-comparison, retry, search, reading filters, bookmarks, restart, saved summary, explicit completion' }));
    await context.close();
  }
} finally { await browser.close(); }
