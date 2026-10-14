import {test,expect} from '@playwright/test';
test('navigation panel traps focus, closes with Escape and returns to its trigger',async({page})=>{
 await page.goto('/');const trigger=page.getByRole('button',{name:'Menu',exact:true});await trigger.click();
 const panel=page.getByRole('dialog',{name:'Explorar a Glifo'});await expect(panel).toBeVisible();await expect(trigger).toHaveAttribute('aria-expanded','true');
 await expect(panel.getByRole('button',{name:'Fechar menu'})).toBeFocused();
 for(let i=0;i<14;i++){await page.keyboard.press('Tab');expect(await panel.evaluate(e=>e.contains(document.activeElement))).toBe(true);}
 await page.keyboard.press('Escape');await expect(panel).not.toBeVisible();await expect(trigger).toBeFocused();await expect(page.locator('body')).not.toHaveClass(/menu-open/);
 await trigger.click();await panel.getByRole('link',{name:/Serviços O que construímos/}).click();await expect(panel).not.toBeVisible();await expect(page).toHaveURL(/#servicos$/);
});
test('desktop navigation indicates the route and the panel preserves reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/trabalhos/');await expect(page.locator('.desktop-nav a[href="/trabalhos/"]')).toHaveAttribute('aria-current','page');
 await page.getByRole('button',{name:'Menu',exact:true}).click();const menu=page.locator('#mobile-menu');expect(await menu.evaluate(e=>getComputedStyle(e).animationName)).toBe('none');await menu.getByRole('button',{name:'Fechar menu'}).click();await expect(menu).not.toBeVisible();
});
test('all presentation arrows use vectors and the previous invitation is restored',async({page})=>{
 await page.goto('/trabalhos/');await expect(page.locator('.work-index-end h2')).toHaveText('Há outros sinais a desenhar. O seu pode ser o próximo');
 expect(await page.locator('body').innerText()).not.toMatch(/[↗↑↓←→]/);await expect(page.locator('.work-index-end .vector-icon')).toHaveCount(1);
});
test('bio entry is outside navigation, has noindex and real contact and site paths',async({page})=>{
 await page.goto('/links/');await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,follow');
 await expect(page.locator('.site-header')).toHaveCount(0);await expect(page.locator('.bio-links a')).toHaveCount(5);await expect(page.locator('.bio-links a').first()).toHaveAttribute('href','https://wa.me/5562983010176');
 await page.getByRole('link',{name:/Explorar os trabalhos/}).click();await expect(page).toHaveURL(/\/trabalhos\/$/);await expect(page.locator('.site-header a[href="/links/"]')).toHaveCount(0);
});
test('navigation and bio keep content within 320px without scripts',async({browser})=>{
 const context=await browser.newContext({viewport:{width:320,height:780},javaScriptEnabled:false});const page=await context.newPage();
 for(const path of ['/links/','/trabalhos/']){await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
 await context.close();
});
