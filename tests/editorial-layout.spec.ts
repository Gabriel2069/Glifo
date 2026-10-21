import {test,expect} from '@playwright/test';

test('the front door brings real projects before the brand story and keeps the atelier in its case',async({page})=>{
 await page.goto('/');
 expect(await page.locator('.work-collection').evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('.invocation')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
 await expect(page.locator('.featured,.atlas-section,.archive-section,.detail')).toHaveCount(0);
 await expect(page.locator('.collection-tabs')).toHaveAttribute('aria-orientation','horizontal');
 for(const tab of await page.locator('[data-project-tab]').all()){
  await tab.click();const panel=page.locator('.collection-panel:visible');
  await expect(panel).toHaveCount(1);await expect(panel.locator('a').first()).toHaveAttribute('href',/^\/trabalhos\//);
 }
 await page.goto('/trabalhos/glifo/');
 await expect(page.locator('.atlas-section,.archive-section,.detail')).toHaveCount(3);
});

test('editorial destinations retain complete covers at narrow and wide widths',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/trabalhos/','/trabalhos/christiano-tadeu/','/trabalhos/delfas-corpore/','/trabalhos/acolher-comissao/','/identidades/']){
   await page.goto(route);await page.evaluate(()=>document.fonts.ready);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} at ${width}px`).toBe(true);
   for(const image of await page.locator('.case-opening .project-art img,.identity-directory-art img').all()){
    expect(await image.evaluate(img=>{const r=img.getBoundingClientRect(),p=img.parentElement!.getBoundingClientRect();return getComputedStyle(img).objectFit==='contain'&&r.left>=p.left-1&&r.right<=p.right+1&&r.top>=p.top-1&&r.bottom<=p.bottom+1})).toBe(true);
   }
  }
 }
});

test('editorial pages provide visual evidence of the complete composition',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const width=info.project.name==='mobile'?390:1440;
 await page.setViewportSize({width,height:900});
 for(const [label,route] of [['home','/'],['works','/trabalhos/'],['case','/trabalhos/christiano-tadeu/'],['identities','/identidades/']]){
  await page.goto(route);await page.evaluate(()=>document.fonts.ready);
  const screenshot=await page.screenshot({fullPage:true});await info.attach(`${label}-${width}`,{body:screenshot,contentType:'image/png'});
  if(process.env.GLIFO_VISUAL_PROOF==='true'){
   // Modest visual proofs of public pages only, no private data.
   const bytes=await page.screenshot({type:'jpeg',quality:55,fullPage:false});
   const tag=`EDITORIAL_${label.toUpperCase()}_${width}`;
   console.log(`GLIFO_PROOF_${tag}_BEGIN`);
   const data=bytes.toString('base64');for(let i=0;i<data.length;i+=10000)console.log('GLIFO_PROOF_DATA:'+data.slice(i,i+10000));
   console.log(`GLIFO_PROOF_${tag}_END`);
   if(label==='home'){
    await page.locator('.collection-panels').scrollIntoViewIfNeeded();
    const shot=await page.screenshot({type:'jpeg',quality:55});
    console.log(`GLIFO_PROOF_EXHIBIT_${width}_BEGIN`);const b64=shot.toString('base64');for(let i=0;i<b64.length;i+=10000)console.log('GLIFO_PROOF_DATA:'+b64.slice(i,i+10000));console.log(`GLIFO_PROOF_EXHIBIT_${width}_END`);
   }
  }
 }
});

test('the observatory controls remain separate from the entry links',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:900});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  expect(await page.locator('.hero-entry').evaluate(entry=>{
   const a=entry.getBoundingClientRect();
   return Array.from(document.querySelectorAll('.hero .scene-controls,.hero .lens-angle')).every(control=>{const b=control.getBoundingClientRect();return a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom});
  }),`entry controls at ${width}px`).toBe(true);
 }
});


test('the animated headline keeps two typographic lines after masks are inserted',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
 await expect(page.locator('#hero-title .reveal-word')).toHaveCount(5);
 expect(await page.locator('#hero-title').evaluate(title=>title.getBoundingClientRect().height)).toBeLessThan(450);
 expect(await page.locator('.hero-title-tail .reveal-word-mask').evaluateAll(words=>Math.max(...words.map(w=>w.getBoundingClientRect().top))-Math.min(...words.map(w=>w.getBoundingClientRect().top)))).toBeLessThan(2);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect.poll(()=>page.locator('#hero-title .reveal-word').evaluateAll(words=>words.every(w=>Number(getComputedStyle(w).opacity)===1))).toBe(true);
});
