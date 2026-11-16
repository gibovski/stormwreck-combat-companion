import {chromium} from '/var/lib/bazworker/workspace/stormwreck-combat-companion/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const dir='/var/lib/bazworker/workspace/stormwreck-combat-companion/docs/ui-review/combat-redesign/after';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch();let records=[];
for(const width of [320,375,390,1440]){
const page=await browser.newPage({viewport:{width,height:width===1440?1000:844},reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:4173/stormwreck-combat-companion/');
await page.getByRole('button',{name:'Setup',exact:true}).click();
await page.getByRole('button',{name:'+ Add Zombie',exact:true}).click();await page.getByRole('button',{name:'+ Add Skeleton',exact:true}).click();
await page.getByRole('button',{name:'Battle',exact:true}).click();await page.getByLabel('Zombie 1 initiative').fill('18');await page.getByLabel('Skeleton 1 initiative').fill('10');
await page.getByRole('button',{name:'Start battle →'}).click();await page.evaluate(()=>scrollTo(0,0));
await page.screenshot({path:`${dir}/battle-${width}.png`,fullPage:true});
const geometry=await page.evaluate(()=>({viewport:innerHeight,document:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,activeTop:document.querySelector('.actor.active').getBoundingClientRect().top,nextTop:[...document.querySelectorAll('button')].find(x=>x.textContent==='Next turn →')?.getBoundingClientRect().top,damageTop:document.querySelector('.quick-hp').getBoundingClientRect().top}));
await page.getByLabel('Zombie 1 HP amount',{exact:true}).fill('7');await page.getByRole('button',{name:'Damage Zombie 1',exact:true}).click();
if(!await page.locator('.actor').first().locator('.vitals').innerText().then(t=>t.includes('15')))throw Error('damage failed');
await page.getByLabel('Zombie 1 HP amount',{exact:true}).fill('7');await page.getByRole('button',{name:'Heal Zombie 1',exact:true}).click();
await page.locator('.actor').first().locator('summary').click();await page.locator('.actor').first().locator('.actor-details select').selectOption('Prone');
await page.getByRole('button',{name:'Undo last change'}).click();
if(await page.locator('.actor').first().locator('.tags').innerText()!=='')throw Error('undo failed');
await page.getByRole('button',{name:'Next turn →'}).click();await page.getByRole('button',{name:'Next turn →'}).click();await page.reload();
if(!await page.locator('.turn-context').innerText().then(t=>t.includes('ROUND 2')&&t.includes('Zombie 1')))throw Error('round/recovery failed');
await page.screenshot({path:`${dir}/recovery-${width}.png`,fullPage:true});
await page.getByRole('button',{name:'Setup',exact:true}).click();await page.getByRole('button',{name:'Enter cleric',exact:true}).click();
await page.getByLabel('Armor class',{exact:true}).fill('16');await page.getByLabel('Max HP',{exact:true}).fill('10');await page.getByRole('button',{name:'Save combatant'}).click();await page.getByRole('button',{name:'Battle',exact:true}).click();
await page.getByLabel('Cleric HP amount',{exact:true}).fill('10');await page.getByRole('button',{name:'Damage Cleric',exact:true}).click();await page.getByLabel('Cleric HP amount',{exact:true}).fill('4');await page.getByRole('button',{name:'Heal Cleric',exact:true}).click();
if(!await page.locator('.actor').filter({has:page.getByRole('heading',{name:'Cleric',exact:true})}).locator('.vitals').innerText().then(t=>t.includes('4')))throw Error('heal from 0 failed');
records.push({width,geometry,result:'PASS',tested:['setup','initiative','start','inline damage 7','heal 7','local condition','undo condition','next','round 2','reload','add cleric','damage to 0','heal from 0']});await page.close();}
fs.writeFileSync(`${dir}/interaction-results.json`,JSON.stringify({timestamp:new Date().toISOString(),records},null,2));await browser.close();
