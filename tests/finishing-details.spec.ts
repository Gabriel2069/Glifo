import {test,expect} from '@playwright/test';

test('the idea form rejects whitespace and moves focus through preparation and editing',async({page})=>{
 await page.goto('/');const opener=page.getByRole('button',{name:/Preparar minha ideia/});await opener.click();
 const name=page.getByLabel('Seu nome'),idea=page.getByLabel('O que você tem em mente?');
 await name.fill('   ');await idea.fill('                ');await page.getByRole('button',{name:'Preparar mensagem'}).click();
 await expect(page.locator('[data-idea-form]')).toBeVisible();await expect(name).toBeFocused();
 await name.fill('  Visitante  ');await page.getByRole('button',{name:'Preparar mensagem'}).click();await expect(idea).toBeFocused();
 await idea.fill('  Quero criar uma identidade para meu projeto.  ');await page.getByRole('button',{name:'Preparar mensagem'}).click();
 const message=page.getByLabel('Mensagem preparada');await expect(message).toBeFocused();await expect(message).toHaveValue('Olá, Tadeu! Sou Visitante.\n\nQuero conversar sobre uma ideia:\nQuero criar uma identidade para meu projeto.');
 const href=await page.locator('[data-send-idea]').getAttribute('href');expect(new URL(href!).searchParams.get('text')).toBe(await message.inputValue());
 await page.getByRole('button',{name:'Editar ideia'}).click();await expect(idea).toBeFocused();await expect(idea).toHaveValue('  Quero criar uma identidade para meu projeto.  ');
 await page.keyboard.press('Escape');await expect(opener).toBeFocused();
});

test('a long document title stays above its iframe and the vector close control stays reachable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:680});await page.goto('/trabalhos/acolher-comissao/');
 const opener=page.getByRole('link',{name:/Ver as duas identidades/});await opener.click();const dialog=page.getByRole('dialog',{name:'Documento de identidade da marca',exact:true});await expect(dialog).toBeVisible();
 const close=dialog.getByRole('button',{name:'Fechar documento da marca'});await expect(close).toBeFocused();await expect(close.locator('svg')).toHaveCount(1);
 expect(await dialog.evaluate(el=>{const toolbar=el.querySelector('.identity-document-toolbar')!.getBoundingClientRect(),title=el.querySelector('strong')!.getBoundingClientRect(),frame=el.querySelector('iframe')!.getBoundingClientRect(),button=el.querySelector('button')!.getBoundingClientRect();return title.top>=toolbar.top&&title.bottom<=toolbar.bottom&&frame.top>=toolbar.bottom-1&&button.width>=44&&button.right<=toolbar.right;})).toBe(true);
 await close.click();await expect(opener).toBeFocused();
});
