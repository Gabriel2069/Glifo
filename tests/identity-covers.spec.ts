import {test,expect} from '@playwright/test';
test('identity covers remain contained at every supported width',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});await page.goto('/identidades/');await page.locator('.identity-index img').evaluateAll(es=>Promise.all(es.map(e=>(e as HTMLImageElement).decode())));expect(await page.locator('.identity-index img').evaluateAll(es=>es.every(img=>{const a=img.getBoundingClientRect(),b=img.parentElement!.getBoundingClientRect();return a.width>0&&a.height>0&&a.left>=b.left-1&&a.top>=b.top-1&&a.right<=b.right+1&&a.bottom<=b.bottom+1}))).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('paired project and identity document carry the confirmed period',async({page})=>{
 await page.goto('/trabalhos/acolher-comissao/');await expect(page.locator('.page-intro')).toContainText('2025–2026');await page.goto('/identidades/acolher/');await expect(page.locator('.paired-identity-header')).toContainText('2025–2026');await expect(page.locator('.identity-acolher .identity-document-colophon')).toContainText('2025–2026');await expect(page.locator('.identity-comissao .identity-document-colophon')).toContainText('2025–2026');
});
