// Run against the local server. PLAYWRIGHT_MODULE can point to an existing installation.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve(process.env.MOBILE_OUTPUT || '../../mobile-review');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const [width, height, colorScheme] of [[320, 740, 'light'], [360, 800, 'light'], [390, 844, 'light'], [430, 932, 'dark'], [1280, 900, 'light']]) {
    const context = await browser.newContext({
      viewport: { width, height }, isMobile: width < 720, hasTouch: width < 720,
      deviceScaleFactor: 1, colorScheme, reducedMotion: width === 360 ? 'no-preference' : 'reduce', serviceWorkers: 'block',
    });
    const page = await context.newPage();
    const errors = [];
    const httpErrors = [];
    let generationRequests = 0;
    page.on('request', request => { if (request.url().endsWith('/api/generate')) generationRequests++; });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`);
    });
    const capture = name => page.screenshot({ path: resolve(output, `${width}-${name}.png`), animations: 'disabled' });
    const noOverflow = async () => assert.ok(await page.evaluate(() =>
      document.documentElement.scrollWidth <= innerWidth), `${width}: horizontal overflow`);
    await page.goto(process.env.MOBILE_URL || 'http://localhost:3000');
    await page.locator('#listen-all').waitFor();
    await noOverflow();
    await capture('home');
    const practice = page.locator('#toggle-tapar');
    const firstCard = page.locator('#hoy-cards .card[data-id]').first();
    const firstWord = await firstCard.locator('.word').innerText();
    const requestsBeforePractice = generationRequests;
    await practice.click();
    assert.equal(await practice.getAttribute('aria-pressed'), 'true');
    assert.equal(await practice.evaluate(element => element === document.activeElement), true);
    assert.equal(await firstCard.locator('.card-answer').isVisible(), false);
    assert.equal(await firstCard.locator('.card-pron').isVisible(), false);
    const reveal = firstCard.locator('[data-reveal]');
    await reveal.focus();
    await page.keyboard.press('Enter');
    assert.equal(await firstCard.locator('.card-answer').isVisible(), true);
    assert.equal(await reveal.getAttribute('aria-expanded'), 'true');
    assert.equal(await reveal.evaluate(element => element === document.activeElement), true);
    await page.keyboard.press('Space');
    assert.equal(await firstCard.locator('.card-answer').isVisible(), false);
    const revealSize = await reveal.boundingBox();
    assert.ok(revealSize.width >= 44 && revealSize.height >= 44);
    await capture('practice');
    await firstCard.locator('.word').click();
    assert.equal(await firstCard.locator('.card-answer').isVisible(), true);
    await practice.click();
    assert.equal(await practice.getAttribute('aria-pressed'), 'false');
    assert.equal(await firstCard.locator('.card-answer').isVisible(), true);
    assert.equal(await reveal.isVisible(), false);
    assert.equal(await firstCard.locator('.word').innerText(), firstWord);
    assert.equal(generationRequests, requestsBeforePractice, 'Practice must not fetch another batch');
    await page.locator('#plan-toggle').click();
    assert.equal(await page.locator('#plan-config').isVisible(), true);
    await noOverflow();
    await page.locator('#plan-toggle').click();
    assert.equal(await page.locator('#plan-config').isVisible(), false);
    await practice.click();
    await page.reload();
    await page.locator('#listen-all').waitFor();
    assert.equal(await practice.getAttribute('aria-pressed'), 'true', 'Practice preference survives reload');
    assert.equal(await firstCard.locator('.card-answer').isVisible(), false);
    const previousCards = await page.locator('#hoy-cards .card[data-id]').count();
    await page.locator('#more-words').click();
    await page.waitForFunction(count => document.querySelectorAll('#hoy-cards .card[data-id]').length > count, previousCards);
    const addedCard = page.locator('#hoy-cards .card[data-id]').last();
    assert.equal(await addedCard.locator('.card-answer').isVisible(), false);
    assert.equal(await addedCard.locator('[data-reveal]').isVisible(), true);
    await practice.click();
    await page.getByRole('button', { name: 'Aprender', exact: true }).click();
    await page.locator('#modo-lecturas').click();
    await noOverflow();
    await capture('readings');
    const firstReading = page.locator('#lecturas-lista [data-lectura]').first();
    await firstReading.click();
    await page.waitForFunction(() => scrollY < 1);
    await page.waitForFunction(() => document.querySelector('#reader-position')?.textContent === 'Frase 1 de 20');
    await noOverflow();
    await capture('reader');
    const translations = page.locator('.lect-es');
    assert.equal(await page.locator('.lect-es:visible').count(), 0);
    await page.locator('[data-translate]').first().click();
    assert.equal(await translations.first().isVisible(), true);
    assert.equal(await page.locator('[data-translate]').first().getAttribute('aria-expanded'), 'true');
    await capture('translated');
    await page.locator('#lect-todo').click();
    assert.equal(await page.locator('.lect-es:visible').count(), await translations.count());
    assert.equal(await page.locator('#lect-todo').getAttribute('aria-pressed'), 'true');
    await page.locator('[data-translate]').first().click();
    assert.equal(await page.locator('#lect-todo').getAttribute('aria-pressed'), 'false');
    await page.locator('#lect-todo').click();
    await page.locator('#lect-todo').click();
    assert.equal(await page.locator('.lect-es:visible').count(), 0);
    const smallControls = await page.locator('.reader-toolbar button, .reader-sentence-actions button').evaluateAll(elements =>
      elements.filter(element => { const rect = element.getBoundingClientRect(); return rect.width < 44 || rect.height < 44; }).map(element => element.outerHTML));
    assert.deepEqual(smallControls, [], 'Reader controls must be at least 44 by 44');
    await page.locator('.lect-frase').first().locator('.rword').first().click();
    assert.equal(await page.locator('#lect-pop').isVisible(), true);
    await noOverflow();
    await capture('dictionary');
    await page.locator('#pop-x').click();
    assert.equal(await page.locator('#lect-pop').isVisible(), false);
    await page.locator('.lect-frase').nth(9).scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#reader-position').textContent !== 'Frase 1 de 20');
    const toolbar = await page.locator('.reader-toolbar').boundingBox();
    assert.ok(toolbar.y >= 0 && toolbar.y <= 1, 'Toolbar remains at top while reading');
    await capture('scrolled');
    await page.locator('#back-lecturas').click();
    assert.equal(await firstReading.isVisible(), true);
    assert.match(await firstReading.innerText(), /Pendiente/);
    await firstReading.click();
    assert.equal(await page.locator('.lect-es:visible').count(), 0);
    await page.locator('#lect-hecha').click();
    assert.equal(await page.locator('#lectura-detalle').isVisible(), false);
    assert.doesNotMatch(await firstReading.innerText(), /Pendiente/);
    assert.deepEqual(errors, [], 'No JavaScript runtime errors');
    console.log(JSON.stringify({ width, height, colorScheme, result: 'PASS', httpErrors, screenshots: output }));
    await context.close();
  }
} finally {
  await browser.close();
}
