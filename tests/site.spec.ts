import { test, expect } from '@playwright/test';
test('atlas focus updates the preview and opens its chapter',async({page})=>{
 await page.goto('/');await page.locator('[data-atlas="linguagem"]').focus();await expect(page.locator('[data-atlas-title]')).toHaveText('Linguagem');const link=page.getByRole('link',{name:'Conhecer este capítulo'});await expect(link).toHaveAttribute('href','/trabalhos/glifo/#linguagem');await link.click();await expect(page).toHaveURL(/glifo\/#linguagem$/);
});
test('portfolio links open the authorial case',async({page})=>{
 await page.goto('/trabalhos/');await page.locator('.index-work').click();await expect(page).toHaveURL(/\/trabalhos\/glifo\//);await expect(page.locator('#identidade')).toBeVisible();
});
test('process works with keyboard and retains one selected panel',async({page})=>{
 await page.goto('/');const tab=page.getByRole('tab',{name:/Forma/});await tab.click();await expect(tab).toHaveAttribute('aria-selected','true');await tab.press('ArrowRight');await expect(page.getByRole('tab',{name:/Presença/})).toHaveAttribute('aria-selected','true');await expect(page.getByRole('tabpanel')).toHaveCount(1);
});
test('draft can be prepared and edited without sending',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/Preparar minha ideia/}).click();await page.getByLabel('Seu nome').fill('Visitante');await page.getByLabel('O que você tem em mente?').fill('Quero organizar a apresentação do meu projeto.');await page.getByRole('button',{name:/Preparar mensagem/}).click();await expect(page.getByLabel('Mensagem preparada')).toHaveValue(/Visitante/);await page.getByRole('button',{name:'Editar ideia'}).click();await expect(page.getByLabel('Seu nome')).toHaveValue('Visitante');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('motion preference persists through navigation',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Pausar animações'}).click();await page.goto('/trabalhos/');await expect(page.getByRole('button',{name:'Ativar animações'})).toHaveAttribute('aria-pressed','true');
});
test('reduced motion and narrow layout preserve the content',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:850});await page.goto('/');await expect(page.locator('h1')).toBeVisible();await expect(page.getByRole('button',{name:'Ativar animações'})).toHaveAttribute('aria-pressed','true');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('observatory changes representation with keyboard and interrupted input',async({page})=>{
 await page.goto('/');const scene=page.locator('.hero [data-griff]');const emblem=scene.getByRole('button',{name:'Emblema',exact:true});await emblem.focus();await emblem.press('Enter');await expect(emblem).toHaveAttribute('aria-pressed','true');await scene.getByRole('button',{name:'Constelação',exact:true}).click();await emblem.click();await expect(scene.locator('[data-scene-state]')).toHaveText('A FIGURA');await expect(scene.getByRole('button',{name:'Constelação',exact:true})).toHaveAttribute('aria-pressed','false');
});
test('detail exploration works without pointer and with motion paused',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');const slider=page.getByRole('slider',{name:'Ampliação do grifo'});await slider.focus();await slider.press('End');await expect(slider).toHaveValue('180');await expect(page.locator('[data-detail-value]')).toHaveText('1.8×');
});
