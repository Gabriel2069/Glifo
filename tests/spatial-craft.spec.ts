import {test,expect} from '@playwright/test';
test('observatory keeps an intact mark, bounded depth and manual control',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 const lens=page.locator('[data-celestial-lens]'),range=page.getByRole('slider',{name:'Ângulo do observatório'});
 await expect(lens).toHaveClass(/spatial-ready/);await expect(range).toBeVisible();
 await range.focus();await range.press('ArrowRight');await expect(page.locator('[data-lens-value]')).toHaveText('1°');
 await page.getByRole('button',{name:'Emblema',exact:true}).click();await expect(page.getByRole('button',{name:'Emblema',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.hero .griff-ghost')).toHaveAttribute('src','/brand/symbol.png');
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 if(process.env.GLIFO_VISUAL_PROOF==='true'){
  if(testInfo.project.name==='mobile')await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Pausar animações',exact:true}).click();await page.evaluate(()=>scrollTo(0,0));
  const name=testInfo.project.name==='mobile'?'PUBLIC_PHONE':'PUBLIC_DESKTOP';
  const data=(await page.screenshot({type:'jpeg',quality:38,fullPage:false,animations:'disabled'})).toString('base64');
  console.log('GLIFO_PROOF_'+name+'_BEGIN');for(let i=0;i<data.length;i+=10000)console.log('GLIFO_PROOF_DATA:'+data.slice(i,i+10000));console.log('GLIFO_PROOF_'+name+'_END');
 }
 expect(errors).toEqual([]);
});
test('reduced motion preserves content and removes perspective controls',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.getByRole('slider',{name:'Ângulo do observatório'})).toBeDisabled();
 await expect(page.locator('[data-lens-assembly]')).toHaveCSS('transform','none');
 await expect(page.getByRole('heading',{name:'O sentido de um traço.'})).toBeVisible();
 await page.goto('/trabalhos/');await page.locator('[data-project-cosmos]').scrollIntoViewIfNeeded();
 const points=page.locator('[data-cosmos-point]');await points.nth(2).click();
 await expect(points.nth(2)).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('[data-cosmos-panel]:visible')).toHaveCount(1);
});
