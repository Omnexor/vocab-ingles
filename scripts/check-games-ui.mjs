import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { IRREGULARES } from '../public/irregulars.js';
import { EJERCICIOS_MODALES } from '../public/modals.js';
import { FRASES } from '../public/phrases.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve('../../games-review'); await mkdir(output, { recursive: true });
const words = [['cat','gato'],['dog','perro'],['house','casa'],['book','libro'],['car','coche'],['chair','silla'],['table','mesa'],['bird','pájaro'],['tree','árbol'],['bag','bolsa'],['shoe','zapato'],['cup','taza']].map(([en, es], i) => ({ en, es, id: `fixture-${i}`, pron: en, example: `I see their ${en}.`, exampleEs: `Veo su ${es}.`, cat: 'sustantivos', box: 1, due: '2030-01-01' }));
const browser = await chromium.launch();
try {
  for (const [width, colorScheme] of [[320,'light'],[390,'light'],[430,'dark'],[1280,'light']]) {
    if (process.env.GAMES_WIDTH && Number(process.env.GAMES_WIDTH) !== width) continue;
    const context = await browser.newContext({ viewport: { width, height: width < 720 ? 844 : 900 }, isMobile: width < 720, hasTouch: width < 720, colorScheme, serviceWorkers: 'block', timezoneId: 'Europe/Madrid' });
    await context.addInitScript(({ words }) => {
      if (!localStorage.getItem('vocab-ingles:v1')) localStorage.setItem('vocab-ingles:v1', JSON.stringify({ words, games: { rapida: 77, parejas: 1234 }, settings: { daily: 5 }, daily: { date:'2026-09-13', ids:words.slice(0,5).map(w => w.id), done:5 } }));
      window.__spoken = [];
      window.speechSynthesis.speak = utterance => { window.__spoken.push(utterance.text); };
      window.SpeechRecognition = undefined; window.webkitSpeechRecognition = undefined;
    }, { words });
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date('2026-09-13T12:00:00Z'));
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const data = () => page.evaluate(() => JSON.parse(localStorage.getItem('vocab-ingles:v1')));
    const queue = async () => Object.values((await data()).gameReview || {});
    const capture = async name => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width} overflow: ${name}`);
      await page.screenshot({ path: resolve(output, `${width}-${name}.png`), animations: 'disabled' });
    };
    const index = async () => {
      await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('vocab-ingles:v1')); s.daily.date = new Date().toISOString().slice(0, 10); localStorage.setItem('vocab-ingles:v1', JSON.stringify(s)); });
      await page.reload(); await page.getByRole('button', { name: 'Juegos', exact: true }).click(); await page.locator('#game-mode').waitFor();
    };
    const open = async id => { await index(); await page.locator(`#juegos-lista [data-juego="${id}"]`).click(); };
    const result = async () => {
      try { await page.locator('#rejugar').waitFor({ timeout:5000 }); }
      catch (error) { await capture('failure'); console.error(await page.locator('#game-box').innerText(), errors); throw error; }
      assert.deepEqual(errors, []);
    };
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Juegos', exact: true }).click();
    await capture('games');
    await open('rapida');
    assert.equal(await page.locator('#reloj').count(), 0);
    for (let i = 0; i < 10; i++) {
      const es = await page.locator('#game-box .word').innerText();
      const word = words.find(w => w.es.toLowerCase() === es.toLowerCase()); assert.ok(word, `Unknown visible word: ${es}; ${JSON.stringify((await data()).words.map(w => w.es))}`);
      if (i === 0) await page.locator('#nose').click();
      else {
        if (i === 1) await page.locator('#pista').click();
        await page.locator('#op-rapida').getByRole('button', { name: word.en, exact: true }).click();
      }
      if (!i) { await capture('rapid-feedback'); assert.equal(await page.locator('#op-rapida button:not([disabled])').count(), 0); }
      await page.locator('#next-rapid').click();
    }
    await result();
    assert.equal((await data()).games.rapida, 77, 'Untimed practice does not overwrite timed records');
    assert.equal((await data()).gameLearning.rapida.independent, 8);
    assert.equal((await data()).gameLearning.rapida.assisted, 1);
    assert.equal((await queue()).length, 2);
    await capture('result');
    await page.locator('#game-guided-mission').click();
    assert.ok(await page.locator('#mission-answer').isVisible(), 'Free game links into a related guided mission');
    await index();
    await page.locator('#open-game-review').click();
    for (let i = 0; i < 2; i++) {
      const prompt = await page.locator('.game-written-review h3').innerText();
      const card = (await queue()).find(c => c.prompt === prompt);
      if (!i) await page.locator('#game-review-model').click();
      await page.locator('#game-review-answer').fill(card.accepted[0]);
      await page.locator('#game-review-answer').press('Enter');
      await page.locator('#game-review-next').click();
    }
    assert.equal((await queue()).length, 2, 'Same-day practice and models do not clear delayed checks');
    await page.clock.setFixedTime(new Date('2026-09-14T12:00:00Z'));
    await index(); await page.locator('#open-game-review').click();
    for (let i = 0; i < 2; i++) {
      const prompt = await page.locator('.game-written-review h3').innerText();
      const card = (await queue()).find(c => c.prompt === prompt);
      await page.locator('#game-review-answer').fill(card.accepted[0]);
      await page.locator('#game-review-answer').press('Enter');
      if (!i) await capture('written-review');
      await page.locator('#game-review-next').click();
    }
    assert.equal((await queue()).length, 2, 'One correct day does not clear retention checks');
    assert.ok((await queue()).every(c => c.stage === 1 && c.due === '2026-09-17'));
    await open('parejas');
    assert.equal(await page.locator('#reloj').count(), 0);
    const texts = await page.locator('#tiles button').allTextContents();
    const selected = words.filter(w => texts.includes(w.en));
    await page.locator('#tiles').getByRole('button', { name: selected[0].en, exact: true }).click();
    await page.locator('#tiles').getByRole('button', { name: selected[1].es, exact: true }).click();
    assert.equal(await page.locator('#tiles button:not([disabled])').count(), 0);
    await capture('pairs-correction'); await page.locator('#pair-continue').click();
    for (const w of selected) {
      await page.locator('#tiles').getByRole('button', { name: w.en, exact: true }).click();
      await page.locator('#tiles').getByRole('button', { name: w.es, exact: true }).click();
    }
    await result();
    assert.equal((await data()).games.parejas, 1234);
    assert.equal((await data()).gameLearning.parejas.assisted, 2);
    for (const id of ['hueco','escribe','escucha','ordena','dictado','irregulares','modales','frases','falsos']) {
      await open(id);
      const length = ['ordena','dictado'].includes(id) ? 8 : 10;
      for (let i = 0; i < length; i++) {
        if (id === 'escribe' && i === 0) {
          await page.locator('#comprobar').click(); assert.equal(await page.locator('#next-escribe').count(), 0);
          const es = await page.locator('#game-box .word').innerText();
          await page.locator('#game-box [data-speak]').click();
          await page.locator('#resp-escribe').fill(words.find(w => w.es === es).en);
          await page.locator('#comprobar').click();
        } else if (id === 'dictado' && i < 2) {
          const expected = await page.evaluate(() => window.__spoken.at(-1));
          assert.ok(expected.startsWith('I see their '));
          await page.locator('#resp-dictado').fill(i === 0 ? expected.replace('their', 'there') : expected.replace('see ', ''));
          await page.locator('#comprobar-dictado').click();
          assert.equal(await page.locator('.explain.ko .dic-ok').count(), 3);
          if (!i) await capture('dictation');
        } else if (id === 'modales' && i > 0) {
          const phrase = await page.locator('#game-box .quiz-q').innerText();
          const item = EJERCICIOS_MODALES.find(e => e.frase === phrase); assert.ok(item);
          await page.locator('#op-modales').getByRole('button', { name: item.opciones[item.correcta], exact: true }).click();
        } else if (id === 'irregulares' && i > 0) {
          const base = await page.locator('.irr-col').first().locator('.irr-forma').innerText();
          const verb = IRREGULARES.find(v => v.base === base);
          const tense = (await page.locator('#game-box .quiz-count').innerText()).includes('pasado') ? 'pasado' : 'participio';
          await page.locator('#resp-irr').fill(verb[tense].split('/')[0]);
          await page.locator('#comprobar-irr').click();
        } else if (id === 'frases' && i > 0) {
          const situation = await page.locator('#game-box .quiz-q').innerText();
          const f = FRASES.find(f => f.situacion === situation);
          await page.locator('#op-frases').getByRole('button', { name: f.en, exact: true }).click();
        } else await page.locator(id === 'escribe' ? '#paso' : '#nose').click();
        if (!i) await capture(`game-${id}`);
        const next = { hueco:'hueco', escribe:'escribe', escucha:'escucha', ordena:'ordena', dictado:'dictado', irregulares:'irr', modales:'modales', frases:'frases', falsos:'falsos' }[id];
        await page.locator(`#next-${next}`).click();
      }
      await result();
      assert.ok((await queue()).some(c => c.game === id), `${id}: persisted error`);
    }
    assert.equal((await data()).gameLearning.escribe.assisted, 1, 'Audio is support in written recall');
    await open('hablar'); assert.ok(await page.locator('#game-box .empty').isVisible());
    // A selected pair makes the last game playable; these are only synthetic test words.
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('vocab-ingles:v1'));
      s.confusiones = { 'cat|dog': 2 };
      localStorage.setItem('vocab-ingles:v1', JSON.stringify(s));
    });
    await open('confusas');
    for (let i = 0; i < 2; i++) { await page.locator('#nose').click(); await page.locator('#next-confusas').click(); }
    await result();
    await index();
    const before = (await queue()).length;
    await index(); assert.equal((await queue()).length, before, 'Errors survive reload');
    await page.locator('#game-mode').selectOption('challenge');
    await page.locator('#juegos-lista [data-juego="rapida"]').click();
    assert.ok(await page.locator('#reloj').isVisible());
    await page.locator('#nose').click();
    await page.clock.runFor(61000);
    assert.ok(await page.locator('#rapid-feedback .explain').isVisible(), 'Expiry must not interrupt feedback');
    await page.locator('#next-rapid').click(); await result();
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result:'PASS', width, colorScheme, checks:'12 playable games + unavailable microphone, hints, no clock, delayed review, all error sources, reload, dictation, timer expiry', screenshots:output }));
    await context.close();
  }
} finally { await browser.close(); }
