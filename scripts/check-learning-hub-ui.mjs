import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LESSONS } from '../public/lessons.js';
import { isPronunciation } from '../public/learning-engine.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve(process.env.LEARNING_OUTPUT || '../../learning-review');
await mkdir(output, { recursive: true });
const key = 'vocab-ingles:v1';
const browser = await chromium.launch();
try {
  for (const [width, height, colorScheme] of [[320, 740, 'light'], [390, 844, 'light'], [430, 932, 'dark'], [1280, 900, 'light']]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 720,
      hasTouch: width < 720, colorScheme, reducedMotion: 'reduce', serviceWorkers: 'block', timezoneId: 'Europe/Madrid' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.clock.setFixedTime(new Date('2026-09-15T12:00:00Z'));
    const screenshot = async name => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: overflow at ${width}`);
      await page.screenshot({ path: resolve(output, `${width}-learn-${name}.png`), animations: 'disabled' });
    };
    const index = async () => {
      await page.reload();
      await page.getByRole('button', { name: 'Aprender', exact: true }).click();
      await page.locator('#learning-next button').waitFor();
    };
    const data = () => page.evaluate(k => JSON.parse(localStorage.getItem(k)), key);
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Aprender', exact: true }).click();
    await page.locator('#learning-next button').waitFor();
    assert.equal(await page.locator('#lecciones-lista .lesson-card').count(), 75);
    await screenshot('home');
    for (const selector of ['#learning-search', '#learning-lane', '[data-learning-filter]', '#learning-next .btn']) {
      assert.ok((await page.locator(selector).evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height))).every(h => h >= 44), `${selector}: touch target`);
    }

    // Keyboard navigation uses one tab stop and associates each tab with its panel.
    await page.locator('#modo-gramatica').focus();
    await page.keyboard.press('ArrowRight');
    assert.ok(await page.locator('#panel-frases').isVisible());
    await page.keyboard.press('End');
    assert.ok(await page.locator('#panel-lecturas').isVisible());
    await page.keyboard.press('Home');
    assert.ok(await page.locator('#panel-gramatica').isVisible());
    assert.equal(await page.locator('.learning-tabs [tabindex="0"]').count(), 1);

    // Accent-insensitive search, empty results, then return to the complete route.
    await page.locator('#learning-search').fill('ARTICULOS');
    assert.equal(await page.locator('#lecciones-lista .lesson-card').count(), 1);
    await screenshot('search');
    await page.locator('#learning-search').fill('zzzznoexiste');
    assert.ok(await page.locator('.learning-empty').isVisible());
    assert.match(await page.locator('#learning-results').innerText(), /0 lecciones/);
    await page.locator('#learning-clear').click();
    assert.equal(await page.locator('#lecciones-lista .lesson-card').count(), 75);
    await page.locator('[data-learning-filter="review"]').click();
    assert.match(await page.locator('.learning-empty').innerText(), /Sin repasos pendientes/);
    await screenshot('empty-review');
    await page.locator('#learning-clear').click();

    // Search context and scroll survive a lesson visit, including focus restoration.
    await page.locator('#learning-search').fill('pasado');
    const lessonCard = page.locator('#lecciones-lista [data-lesson="pasado-simple"]');
    await lessonCard.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await lessonCard.click();
    await page.locator('#read-lesson-theory').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'lesson-theory');
    await page.locator('#back-lecciones').click();
    await page.waitForFunction(() => document.activeElement?.dataset.lesson === 'pasado-simple');
    assert.equal(await page.locator('#learning-search').inputValue(), 'pasado');
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - before) < 5, 'Catalog scroll restored');

    await page.locator('#learning-lane').selectOption('pronunciation');
    assert.equal(await page.locator('#learning-search').inputValue(), '');
    assert.equal(await page.locator('#lecciones-lista .lesson-card').count(), 8);
    await page.locator('#learning-next button').click();
    assert.equal(await page.locator('#start-production').count(), 0);
    await screenshot('pronunciation');
    await index();

    // A real partial attempt is resumed directly, with its answered item intact.
    await page.locator('#learning-next button').click();
    await screenshot('overview');
    await page.locator('#start-quiz').click();
    await page.locator('#nose').click();
    await page.locator('#next-q').waitFor();
    const saved = (await data()).lessonSessions['verbo-be'];
    await page.locator('#back-lecciones').click();
    await page.locator('#learning-next button').click();
    await page.locator('#next-q').waitFor();
    assert.deepEqual((await data()).lessonSessions['verbo-be'].answers, saved.answers);
    assert.deepEqual((await data()).lessonSessions['verbo-be'].items, saved.items);
    await screenshot('resumed');

    // Recognition does not count as completed application; CTA goes to writing.
    await page.evaluate(k => {
      const s = JSON.parse(localStorage.getItem(k));
      s.lessonSessions = {}; s.lessonMistakes = {};
      s.lessons = { 'verbo-be': { best: 100, last: '2026-09-15', testPassedAt: '2026-09-15' } };
      localStorage.setItem(k, JSON.stringify(s));
    }, key);
    await index();
    assert.match(await page.locator('#learning-route-progress').innerText(), /^0 de 75/);
    await screenshot('needs-writing');
    await page.locator('#learning-next button').click();
    await page.locator('#written-response').waitFor();
    assert.equal((await data()).lessonSessions['verbo-be'].mode, 'production');

    // Prioritize the oldest due lesson, even when it appears later in the route.
    await page.evaluate(k => {
      const s = JSON.parse(localStorage.getItem(k)); s.lessonSessions = {};
      s.lessons = Object.fromEntries([['verbo-be', '2026-09-14'], ['orden-frase', '2026-09-12']].map(([id, nextReview]) =>
        [id, { testPassedAt: '2026-09-01', productionPassedAt: '2026-09-01', nextReview, retentionPasses: 0 }]));
      localStorage.setItem(k, JSON.stringify(s));
    }, key);
    await index();
    assert.equal(await page.locator('#learning-next button').getAttribute('data-lesson'), 'orden-frase');
    await page.locator('[data-learning-filter="review"]').click();
    assert.equal(await page.locator('#lecciones-lista .lesson-card').count(), 2);
    await screenshot('due');
    await page.locator('#learning-next button').click();
    await page.locator('#written-response').waitFor();
    assert.equal((await data()).lessonSessions['orden-frase'].mode, 'retention');

    // A pending mistake opens its own practice, without restarting the full test.
    await page.evaluate(({ key, item }) => {
      const s = JSON.parse(localStorage.getItem(key)); s.lessonSessions = {}; s.lessons = {};
      s.lessonMistakes = { 'verbo-be': { ia: false, items: [item] } };
      localStorage.setItem(key, JSON.stringify(s));
    }, { key, item: LESSONS.find(l => l.id === 'verbo-be').quiz[0] });
    await index();
    assert.match(await page.locator('#learning-next button').innerText(), /Reforzar/);
    await page.locator('#learning-next button').click();
    await page.locator('#quiz-box .quiz-q').waitFor();
    assert.equal((await data()).lessonSessions['verbo-be'].mode, 'errors');
    assert.equal((await data()).lessonSessions['verbo-be'].items.length, 1);

    // Finishing the initial route leaves future reviews scheduled and offers reading.
    await page.evaluate(({ key, ids }) => {
      const s = JSON.parse(localStorage.getItem(key)); s.lessonSessions = {}; s.lessonMistakes = {};
      s.lessons = Object.fromEntries(ids.map(id => [id, { testPassedAt: '2026-09-15', productionPassedAt: '2026-09-15', nextReview: '2026-09-17', retentionPasses: 0 }]));
      localStorage.setItem(key, JSON.stringify(s));
    }, { key, ids: LESSONS.filter(l => !isPronunciation(l.id)).map(l => l.id) });
    await index();
    assert.match(await page.locator('#learning-route-progress').innerText(), /^75 de 75/);
    assert.match(await page.locator('#lecciones-sub').innerText(), /Comprende/);
    await page.locator('#learning-read-next').click();
    assert.ok(await page.locator('#panel-lecturas').isVisible());
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result: 'PASS', width, colorScheme, checks: 'search, filters, keyboard tabs, scroll restoration, pronunciation, direct resume, writing and due-review actions, completed-route handoff' }));
    await context.close();
  }
} finally { await browser.close(); }
