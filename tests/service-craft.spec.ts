import {test,expect} from '@playwright/test';

test('services reveal one complete offer, keep keyboard focus and link to real work',async({page})=>{
 await page.goto('/');const section=page.locator('#servicos'),summaries=section.locator('summary');
 await expect(summaries).toHaveCount(5);await summaries.nth(1).click();
 await expect(summaries.nth(1)).toHaveAttribute('aria-expanded','true');await expect(summaries.nth(0)).toHaveAttribute('aria-expanded','false');
 const chosen=section.locator('details.is-current');await expect(chosen.getByRole('link',{name:'Explorar o projeto'})).toHaveAttribute('href','/trabalhos/christiano-tadeu/');
 await expect(chosen.locator('.service-example-art>img')).toHaveAttribute('src','/projects/christiano-home.webp');
 await expect(chosen.getByRole('link',{name:'Conversar sobre este serviço'})).toHaveAttribute('href',/^https:\/\/wa.me\/5562983010176\?text=/);
 await summaries.nth(1).focus();await page.keyboard.press('ArrowDown');await expect(summaries.nth(2)).toBeFocused();await page.keyboard.press('Enter');await expect(summaries.nth(2)).toHaveAttribute('aria-expanded','true');
 await summaries.nth(4).click();await summaries.nth(0).click();await page.emulateMedia({reducedMotion:'reduce'});
 await expect(section.locator('details[open]')).toHaveCount(1);await expect(summaries.first()).toHaveAttribute('aria-expanded','true');
 expect(await section.locator('.service-detail').evaluateAll(es=>es.every(e=>e.style.height===''))).toBe(true);
 await summaries.first().click();await expect(section.locator('details[open]')).toHaveCount(0);
});

test('the service list remains operable without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();
 try{await page.goto('/');const details=page.locator('#servicos details');await details.nth(3).locator('summary').click();await expect(details.nth(3)).toHaveAttribute('open','');await expect(details.nth(3).getByRole('link',{name:'Explorar o projeto'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}finally{await context.close();}
});

test('project cards share proportions and an action baseline, including after filtering',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:900});await page.goto('/trabalhos/');await page.evaluate(()=>document.fonts.ready);
 const cards=page.locator('.project-card');await expect(cards).toHaveCount(7);
 expect(await cards.evaluateAll(es=>es.every(e=>{const cover=e.querySelector('.project-card-cover')!.getBoundingClientRect();return Math.abs(cover.width/cover.height-4/3)<.01}))).toBe(true);
 expect(await cards.evaluateAll(es=>{const r=es.slice(0,2).map(e=>e.getBoundingClientRect());return Math.abs(r[0].width-r[1].width)<1&&Math.abs(r[0].height-r[1].height)<1})).toBe(true);
 await expect(cards.locator('.project-card-entry')).toHaveCount(7);
 await page.getByRole('button',{name:/^Editorial/}).click();await expect(page.locator('.project-card:not([hidden])')).toHaveCount(2);
 expect(await page.locator('.project-card:not([hidden])').evaluateAll(es=>es.every(e=>{const c=e.querySelector('.project-card-cover')!.getBoundingClientRect();return Math.abs(c.width/c.height-4/3)<.01}))).toBe(true);
});

test('services and project cards fit small viewports and retain complete imagery',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  for(const summary of await page.locator('#servicos summary').all()){
   await summary.click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   const example=page.locator('#servicos details.is-current .service-example');
   if(await example.count())await expect(example).toBeVisible();
  }
  await page.goto('/trabalhos/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  for(const image of await page.locator('.project-card .project-art img').all())expect(await image.evaluate(e=>getComputedStyle(e).objectFit)).toBe('contain');
 }
});
