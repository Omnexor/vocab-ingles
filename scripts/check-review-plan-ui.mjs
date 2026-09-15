import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { MISSIONS, missionCard } from '../public/game-missions.js';
import { reviewExercise } from '../public/game-learning.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const day='2026-09-15', output=resolve('../../games-review');
const future=missionCard(MISSIONS[0],MISSIONS[0].items[0]);
const audio=missionCard(MISSIONS.find(m=>m.mode==='listening'),MISSIONS.find(m=>m.mode==='listening').items[0]);
const queue=Object.fromEntries(Array.from({length:12},(_,i)=>[`word-${i}`,{key:`word-${i}`,game:'escribe',prompt:`Pregunta ${i+1}`,accepted:['cat'],explanation:'cat — gato',stage:0,due:day}]));
queue[future.key]={...future,due:'2026-09-16',stage:1};
queue[audio.key]={...audio,due:day,stage:0};
queue.broken={...future,key:'broken',due:'2026-99-99'};
const browser=await chromium.launch();
try {
  for(const [width,colorScheme] of [[320,'light'],[390,'light'],[430,'dark'],[1280,'light']]) {
    const context=await browser.newContext({viewport:{width,height:844},isMobile:width<720,hasTouch:width<720,colorScheme,reducedMotion:'reduce',serviceWorkers:'block'});
    await context.addInitScript(({queue})=>{
      const key='vocab-ingles:v1';
      if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({gameReview:queue,gameReviewSession:{date:'2026-09-15',gameId:null,items:[null],i:0}}));
      speechSynthesis.getVoices=()=>[];
      speechSynthesis.speak=u=>queueMicrotask(()=>u.onend?.());
      speechSynthesis.cancel=()=>{};
    },{queue});
    const page=await context.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.clock.setFixedTime(new Date(`${day}T12:00:00Z`));
    const data=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('vocab-ingles:v1')));
    const index=async()=>{await page.reload();await page.getByRole('button',{name:'Juegos',exact:true}).click();};
    const capture=async name=>{assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:resolve(output,`${width}-review-plan-${name}.png`),animations:'disabled'});};
    await page.goto('http://localhost:3000');await page.getByRole('button',{name:'Juegos',exact:true}).click();
    assert.ok((await page.locator('#game-review-plan').innerText()).includes('13 objetivos para hoy'));
    assert.ok(!(await page.locator('#game-review-plan').innerText()).includes('cat — gato'));
    await capture('overview');
    // A mission-specific filter must not take cards from other missions/games.
    await page.locator('#game-review-plan summary').click();
    await page.locator('.review-plan-groups article').filter({hasText:'Prepara tu viaje'}).getByRole('button').click();
    assert.equal((await data()).gameReviewSession.items.length,1);
    assert.equal((await data()).gameReviewSession.missionId,'travel-words');
    await page.locator('#game-review-answer').fill('ticket');await page.locator('#game-review-answer').press('Enter');await page.locator('#game-review-next').click();
    assert.equal((await data()).gameReview[future.key].stage,1,'Early group practice cannot advance retention');
    await page.locator('#review-continue').click();
    assert.equal((await data()).gameReviewSession.items.length,10);
    // All due cards, in two rounds. Lento must NOT reveal the written model.
    let answered=0, checkedAudio=false;
    while(await page.locator('#game-review-answer').count()) {
      assert.ok(answered++<14);
      const run=(await data()).gameReviewSession, card=run.items[run.i];
      if(card.audio) {
        await page.locator('#task-slow').click();await page.getByText('Audio reproducido. Puedes responder.',{exact:true}).waitFor();
        assert.ok(await page.locator('#game-review-model-text').isHidden());
        assert.equal(await page.locator('#game-review-model-text').innerText(),'');
        assert.ok(!(await page.locator('#game-box').innerText()).includes(card.audio));
        await index();await page.locator('#open-game-review').click();
        assert.ok(await page.locator('#game-review-model-text').isHidden(),'Slow support stays separate after reload');
        await capture('slow-no-model');checkedAudio=true;
        await page.locator('#game-review-model').click();
        assert.ok(await page.locator('#game-review-model-text').isVisible());
      }
      await page.locator('#game-review-answer').fill(card.accepted[0]);await page.locator('#game-review-answer').press('Enter');await page.locator('#game-review-next').click();
      if(await page.locator('#review-continue').count()) await page.locator('#review-continue').click();
    }
    assert.equal(answered,13);assert.ok(checkedAudio);
    await page.locator('#review-done').click();
    assert.ok((await page.locator('#game-review-plan').innerText()).includes('Por hoy, al día'));
    assert.ok((await page.locator('.review-day-summary').innerText()).includes('12/13 sin ayuda'));
    assert.equal((await data()).gameReview[audio.key].stage,0);
    assert.equal((await data()).gameReview[future.key].due,'2026-09-16');
    await page.locator('#game-review-plan summary').click();await capture('finished');
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({result:'PASS',width,colorScheme,checks:'plan, future group filter, malformed session recovery, 10+3 rounds, no answer leak on slow audio/reload, explicit model, honest day summary',screenshots:output}));
    await context.close();
  }
}finally{await browser.close();}
