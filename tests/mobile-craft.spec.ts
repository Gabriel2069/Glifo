import {test,expect} from '@playwright/test';

test('phone shelves reveal the next card, track position, and keep direct document access',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 for(const id of ['document-shelf']){
  const track=page.locator('#'+id),navigation=page.locator(`[data-shelf-navigation="${id}"]`);
  await expect(navigation).toBeVisible();await expect(navigation.locator('[data-shelf-prev]')).toBeDisabled();
  await navigation.locator('[data-shelf-next]').click();
  await expect(navigation.locator('[data-shelf-count]')).toContainText('02 /');
  await expect(navigation.locator('[data-shelf-prev]')).toBeEnabled();
  expect(await track.evaluate(e=>e.scrollLeft)).toBeGreaterThan(100);
 }
 await page.locator('#document-shelf a').nth(1).click();
 const document=page.locator('[data-identity-document]');await expect(document).toBeVisible();
 await expect(document.locator('iframe')).toHaveAttribute('src',/christiano-tadeu.*documento/);
 await page.getByRole('button',{name:'Fechar documento da marca'}).click();
 await expect(page.locator('#document-shelf a').nth(1)).toBeFocused();
});

test('phone project selection keeps its tab visible and swipes do not follow the cover link',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const tabs=page.locator('[data-project-tab]');
 await tabs.last().click();
 expect(await tabs.last().evaluate(el=>{const r=el.getBoundingClientRect(),p=el.parentElement!.getBoundingClientRect();return r.left>=p.left-1&&r.right<=p.right+1;})).toBe(true);
 const panel=page.locator('.collection-panel:not([hidden])>a');await panel.scrollIntoViewIfNeeded();
 const url=page.url();
 await panel.dispatchEvent('pointerdown',{pointerType:'touch',pointerId:7,clientX:300,clientY:400});
 await panel.dispatchEvent('pointerup',{pointerType:'touch',pointerId:7,clientX:120,clientY:405});
 await page.locator('.collection-panel:not([hidden])>a').dispatchEvent('click');
 await expect(tabs.first()).toHaveAttribute('aria-selected','true');expect(page.url()).toBe(url);
});

test('phone layouts fit 320px and short-screen menu actions remain reachable',async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['/','/trabalhos/','/identidades/acolher/','/identidades/christiano-tadeu/','/links/']){
  await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 await page.goto('/');await page.getByRole('button',{name:'Menu',exact:true}).click();
 const menu=page.getByRole('dialog',{name:'Explorar a Glifo'});const contact=menu.locator('.navigation-contact');await contact.scrollIntoViewIfNeeded();
 await expect(contact).toBeInViewport();await expect(menu.getByRole('button',{name:'Fechar menu'})).toBeInViewport();
 await menu.getByRole('button',{name:'Fechar menu'}).click();await expect(menu).not.toBeVisible();
});

test('desktop retains complete grids and hides phone shelf controls',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');
 await expect(page.locator('.mobile-shelf-navigation').first()).not.toBeVisible();
 for(const id of ['document-shelf'])expect(await page.locator('#'+id).evaluate(e=>getComputedStyle(e).display)).toBe('grid');
});
