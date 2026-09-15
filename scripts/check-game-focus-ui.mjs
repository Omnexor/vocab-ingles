import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
  await page.goto('http://localhost:3000');
  await page.getByRole('button',{name:'Juegos',exact:true}).click();
  await page.evaluate(() => {
    window.__focusFrames=[];
    window.requestAnimationFrame = callback => window.__focusFrames.push(callback);
  });
  await page.locator('#mission-start').click();
  await page.locator('#mission-answer').fill('ticket');
  await page.evaluate(() => window.__focusFrames.splice(0).forEach(callback=>callback(performance.now())));
  assert.equal(await page.evaluate(()=>document.activeElement.id),'mission-answer','Deferred navigation focus must not steal typing focus');
  await page.locator('#mission-answer').press('Enter');
  assert.ok(await page.locator('#mission-next').isVisible());
  await page.locator('#back-juegos').click();
  await page.getByRole('button',{name:'Palabras',exact:true}).click();
  await page.locator('#buscador').fill('cat');
  await page.evaluate(() => window.__focusFrames.splice(0).forEach(callback=>callback(performance.now())));
  assert.equal(await page.evaluate(()=>document.activeElement.id),'buscador','Old screens cannot steal focus after navigation');
  console.log('PASS: late animation-frame focus, typed mission Enter, navigation cancellation, search focus preserved');
} finally { await browser.close(); }
