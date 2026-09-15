import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { MISSIONS, missionQuestion } from '../public/game-missions.js';
import { reviewExercise } from '../public/game-learning.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const output = resolve('../../games-review'); await mkdir(output, { recursive:true });
const browser = await chromium.launch();
try {
  for (const [width, colorScheme] of [[320,'light'],[390,'light'],[430,'dark'],[1280,'light']]) {
    if (process.env.LISTENING_WIDTH && Number(process.env.LISTENING_WIDTH) !== width) continue;
    const context = await browser.newContext({ viewport:{width,height:844}, isMobile:width<720, hasTouch:width<720, reducedMotion:'reduce', colorScheme, serviceWorkers:'block', timezoneId:'Europe/Madrid' });
    await context.addInitScript(() => {
      window.__audio = []; window.__mode = 'auto';
      // Chromium only accepts native SpeechSynthesisVoice instances on .voice.
      // Exercise the language-default path here; voice selection is unit-tested.
      speechSynthesis.getVoices = () => [];
      speechSynthesis.speak = utterance => {
        window.__audio.push({text:utterance.text,rate:utterance.rate});
        window.__lateAudio = utterance.onend;
        if (window.__mode === 'auto') queueMicrotask(() => utterance.onend?.());
        if (window.__mode === 'error') queueMicrotask(() => utterance.onerror?.());
      };
      speechSynthesis.cancel = () => {};
    });
    const page = await context.newPage(); const errors=[]; page.on('pageerror', e=>errors.push(e.message));
    await page.clock.setFixedTime(new Date('2026-09-14T12:00:00Z'));
    const data = () => page.evaluate(() => JSON.parse(localStorage.getItem('vocab-ingles:v1')));
    const index = async () => { await page.reload(); await page.getByRole('button',{name:'Juegos',exact:true}).click(); };
    const open = async id => { await index(); await page.locator('#mission-hub summary').click(); await page.locator(`[data-mission="${id}"]`).click(); };
    const capture = async name => { assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)); await page.screenshot({path:resolve(output,`${width}-listening-${name}.png`),animations:'disabled'}); };
    await page.goto('http://localhost:3000');
    for (const mission of MISSIONS.filter(m => m.mode === 'listening')) {
      await open(mission.id);
      let turns=0;
      while (!await page.locator('#mission-done').count()) {
        assert.ok(turns++<25);
        const run=(await data()).missionSessions[mission.id], step=run.steps[run.i];
        if (step.kind==='example') { await page.locator('#mission-next').click(); continue; }
        const question=missionQuestion(mission,step);
        assert.ok(!(await page.locator('#mission-box').innerText()).includes(question.audio), 'Transcript hidden before listening');
        if (step.kind==='baseline' && step.item===0) {
          await page.locator('#mission-answer').fill(question.accepted[0]);
          await page.locator('#mission-answer').press('Enter');
          assert.equal(Object.keys((await data()).missionSessions[mission.id].answers).length,0, 'Unheard answer cannot score');
          await capture(`${mission.id}-question`);
          await page.evaluate(()=>window.__mode='hold');
          await page.locator('#task-listen').click();
          await page.locator('#back-juegos').click();
          await page.evaluate(()=>window.__lateAudio?.());
          assert.notEqual((await data()).missionSessions[mission.id].listenedTo,question.audio, 'Late audio cannot unlock after leaving');
          await open(mission.id);
        }
        const supported=step.kind==='recall' && step.item===1;
        await page.locator(supported?'#task-slow':'#task-listen').click();
        await page.waitForFunction(({id,audio}) => JSON.parse(localStorage.getItem('vocab-ingles:v1')).missionSessions[id].listenedTo===audio,{id:mission.id,audio:question.audio});
        assert.equal((await data()).missionSessions[mission.id].help, supported, 'Normal playback does not add assistance');
        assert.ok(!(await page.locator('#mission-box').innerText()).includes(question.audio));
        if (supported) {
          await open(mission.id);
          assert.equal((await data()).missionSessions[mission.id].help,true,'Slow support persists after reload');
        }
        if (step.kind==='baseline' && step.item!==0) await page.locator('#mission-skip').click();
        else if (step.kind==='choice') await page.locator('[data-mission-answer]').filter({hasText:new RegExp(`^${question.accepted[0]}$`)}).click();
        else { await page.locator('#mission-answer').fill(question.accepted.at(-1)); await page.locator('#mission-answer').press('Enter'); }
        if (step.kind==='transfer') { assert.ok((await page.locator('.explain').innerText()).includes(question.audio)); if (!step.item) await capture(`${mission.id}-feedback`); }
        await page.locator('#mission-next').click();
      }
      assert.deepEqual((await data()).missionProgress[mission.id].last,{date:'2026-09-14',baseline:1,recall:2,transfer:3,total:3,assisted:1});
      await capture(`${mission.id}-result`);
    }
    // Due listening reviews use new recordings and preserve the same hearing gate.
    await page.clock.setFixedTime(new Date('2026-09-15T12:00:00Z'));
    await index(); await page.locator('#mission-review').click();
    for (let i=0;i<6;i++) {
      const prompt=await page.locator('.game-written-review h3').innerText();
      const card=Object.values((await data()).gameReview).map(reviewExercise).find(c=>c.prompt===prompt);
      assert.ok(card.audio);
      if (!i) {
        await page.locator('#game-review-answer').fill(card.accepted[0]);
        await page.locator('#game-review-answer').press('Enter');
        assert.equal((await data()).gameReview[card.key].stage,0);
        await page.evaluate(()=>window.__mode='error');
        await page.locator('#task-listen').click();
        await page.getByText('El audio no ha respondido.',{exact:false}).waitFor();
        await page.locator('#task-transcript').click();
        await index(); await page.locator('#mission-review').click();
        assert.ok((await page.locator('.pista-box').innerText()).includes(card.audio));
        await capture('fallback-resumed');
      } else {
        await page.evaluate(()=>window.__mode='auto');
        await page.locator('#task-listen').click();
        await page.getByText('Audio reproducido. Puedes responder.',{exact:true}).waitFor();
      }
      await page.locator('#game-review-answer').fill(card.accepted[0]);
      await page.locator('#game-review-answer').press('Enter');
      assert.equal((await data()).gameReview[card.key].stage,i?1:0);
      await page.locator('#game-review-next').click();
    }
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({result:'PASS',width,colorScheme,checks:'2 listening missions, changing facts, hearing gate, slow support, hidden transcripts, resume, cancellation, synthetic failure, delayed audio reviews',screenshots:output}));
    await context.close();
  }
} finally { await browser.close(); }
