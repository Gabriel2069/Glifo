import { test, expect } from '@playwright/test';
test('services and prepared messages point to the confirmed WhatsApp',async({page})=>{
 await page.goto('/');await expect(page.locator('#servicos article')).toHaveCount(5);const service=page.locator('#servicos article').first().getByRole('link',{name:/Conversar sobre este serviço/});await expect(service).toHaveAttribute('href',/^https:\/\/wa.me\/5562983010176\?text=/);
 await page.getByRole('button',{name:/Preparar minha ideia/}).click();await page.getByLabel('Seu nome').fill('Visitante');await page.getByLabel('O que você tem em mente?').fill('Quero organizar a identidade do meu projeto.');await page.getByRole('button',{name:/Preparar mensagem/}).click();await expect(page.locator('[data-send-idea]')).toHaveAttribute('href',/^https:\/\/wa.me\/5562983010176\?text=/);
});
test('new identities and paired project preserve distinct systems',async({page})=>{
 for(const slug of ['delfas-corpore','comissao','acolher']){await page.goto(`/identidades/${slug}/`);await expect(page.locator('.identity-vision').first()).toBeVisible();await expect(page.locator('.identity-color')).not.toHaveCount(0);await expect(page.locator('.identity-material-grid figure')).not.toHaveCount(0);}
 await page.goto('/trabalhos/acolher-comissao/');await expect(page.locator('.case-material-grid figure')).toHaveCount(6);await expect(page.getByRole('link',{name:/Ver a identidade da Comissão/})).toHaveAttribute('href','/identidades/comissao/');
});
test('documents have visible home entries and cases share the reading sequence',async({page})=>{
 await page.goto('/');await expect(page.locator('#identidades .brand-document-card')).toHaveCount(6);await page.locator('#identidades a[href="/identidades/tdv/"]').click();await expect(page.getByRole('dialog',{name:'Documento de identidade da marca'})).toBeVisible();await page.getByRole('button',{name:'Fechar documento da marca'}).click();
 for(const slug of ['glifo','tdv-editorial','christiano-tadeu','delfas-corpore']){await page.goto(`/trabalhos/${slug}/`);await expect(page.locator('.case-entry')).toBeVisible();expect(await page.locator('.case-project-visual').evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('.case-entry')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);await expect(page.locator('#materiais')).toBeVisible();}
});
test('TdV presents all supplied cover sheets and supports enlargement',async({page})=>{
 await page.goto('/trabalhos/tdv-editorial/');await expect(page.locator('.case-material-grid figure')).toHaveCount(7);await page.locator('.case-material-grid figure').first().scrollIntoViewIfNeeded();expect(await page.locator('.case-material-image').first().evaluate(el=>{const frame=el.getBoundingClientRect(),image=el.querySelector('img')!.getBoundingClientRect();return image.bottom<=frame.bottom&&image.right<=frame.right;})).toBe(true);await page.getByRole('button',{name:'Ampliar: Orbis Ardex',exact:true}).click();await expect(page.getByRole('dialog',{name:'Imagem da identidade ampliada'})).toBeVisible();await expect(page.locator('[data-board-full-image]')).toHaveAttribute('src','/identities/tdv/collection-6.webp');await page.keyboard.press('Escape');
});
test('timed selection advances without moving focus and rests after manual use',async({page})=>{
 await page.goto('/');const scene=page.locator('.hero [data-griff]');await scene.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await expect(scene).toHaveAttribute('data-auto-state','running');await expect(scene.getByRole('button',{name:'Emblema',exact:true})).toHaveAttribute('aria-pressed','true',{timeout:11000});
 await scene.getByRole('button',{name:'Constelação',exact:true}).click();await expect(scene.locator('[data-auto-toggle]')).toHaveCount(0);await expect(scene).toHaveAttribute('data-auto-state','paused');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('.hero [data-griff]')).toHaveAttribute('data-auto-state','paused');
});
test('brand document opens over the portfolio and closes after image viewer',async({page})=>{
 await page.goto('/trabalhos/christiano-tadeu/');const opener=page.getByRole('link',{name:/Ver a identidade visual/});await opener.click();
 const dialog=page.getByRole('dialog',{name:'Documento de identidade da marca',exact:true});await expect(dialog).toBeVisible();await expect(page).toHaveURL(/\/trabalhos\/christiano-tadeu\/$/);
 const frame=page.frameLocator('[data-identity-document-frame]');await expect(frame.locator('.identity-vision')).toBeVisible();await expect(frame.locator('.site-header')).not.toBeVisible();
 await frame.getByRole('button',{name:'Ampliar: Assinatura sobre claro',exact:true}).click();await frame.getByRole('dialog',{name:'Imagem da identidade ampliada'}).waitFor();await frame.locator('[data-board-full-image]').focus();await page.keyboard.press('Escape');
 await expect(frame.getByRole('dialog',{name:'Imagem da identidade ampliada'})).not.toBeVisible();await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(opener).toBeFocused();
});
test('narrative reveals whole paragraphs with distinct heading typography',async({page})=>{
 await page.goto('/');await expect(page.locator('.myth-prose')).toHaveCount(3);await expect(page.locator('.myth-prose p')).toHaveCount(6);await expect(page.locator('.reading-word')).toHaveCount(0);
 await page.locator('.myth-chapter').first().scrollIntoViewIfNeeded();
 const typography=await page.locator('.myth-chapter').first().evaluate(el=>({heading:getComputedStyle(el.querySelector('h3')!).fontFamily,body:getComputedStyle(el.querySelector('p.reading-prose')!).fontFamily}));expect(typography.heading).not.toBe(typography.body);
 await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(()=>page.locator('[data-reading-prose]').evaluateAll(nodes=>nodes.every(n=>Number(getComputedStyle(n).opacity)>.99)),{message:'Reduced-motion media change settles every reading paragraph'}).toBe(true);
});
test('identity directory opens each board and its real materials',async({page})=>{
 for(const slug of ['glifo','christiano-tadeu','tdv']){
  await page.goto('/identidades/');await page.goto(`/identidades/${slug}/`);
  await expect(page.locator('.identity-cover h1')).toBeVisible();await page.locator('.identity-cover-art img').evaluate((img:HTMLImageElement)=>img.decode());
  expect(await page.locator('.identity-cover-art img').evaluate((img:HTMLImageElement)=>img.naturalWidth>0)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
test('board viewer supports zoom, arrows and returns focus',async({page})=>{
 await page.goto('/identidades/christiano-tadeu/');const opener=page.getByRole('button',{name:'Ampliar: Assinatura sobre claro',exact:true});await opener.click();
 const dialog=page.getByRole('dialog',{name:'Imagem da identidade ampliada'});await expect(dialog).toBeVisible();
 const zoom=dialog.getByRole('slider',{name:'Ampliação da imagem'});await zoom.focus();await zoom.press('End');await expect(zoom).toHaveValue('250');
 await dialog.getByRole('button',{name:'Próxima imagem'}).click();await expect(zoom).toHaveValue('100');await expect(page.locator('[data-board-image-count]')).toHaveText('2 / 11');
 await page.keyboard.press('ArrowLeft');await expect(page.locator('[data-board-image-count]')).toHaveText('1 / 11');await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(opener).toBeFocused();
});
test('identity remains readable without scripts and with reduced motion',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:850},reducedMotion:'reduce'});const page=await context.newPage();
 for(const slug of ['glifo','christiano-tadeu','tdv']){await page.goto(`/identidades/${slug}/`);await expect(page.locator('#materiais')).toBeVisible();await expect(page.locator('.identity-color')).not.toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await context.close();
});
test('atlas focus updates the preview and opens its chapter',async({page})=>{
 await page.goto('/trabalhos/glifo/');await page.locator('[data-atlas="linguagem"]').focus();await expect(page.locator('[data-atlas-title]')).toHaveText('Linguagem');const link=page.getByRole('link',{name:'Conhecer este capítulo'});await expect(link).toHaveAttribute('href','/trabalhos/glifo/#linguagem');await link.click();await expect(page).toHaveURL(/glifo\/#linguagem$/);
});
test('portfolio links open the authorial case',async({page})=>{
 await page.goto('/trabalhos/');await page.locator('.index-work[href="/trabalhos/glifo/"]').click();await expect(page).toHaveURL(/\/trabalhos\/glifo\//);await expect(page.locator('#identidade')).toBeVisible();
});
test('process works with keyboard and retains one selected panel',async({page})=>{
 await page.goto('/');const tab=page.getByRole('tab',{name:/Forma/});await tab.click();await expect(tab).toHaveAttribute('aria-selected','true');await tab.press('ArrowRight');await expect(page.getByRole('tab',{name:/Presença/})).toHaveAttribute('aria-selected','true');await expect(page.locator('.process-panel:not([hidden])')).toHaveCount(1);
});
test('draft can be prepared and edited without sending',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:/Preparar minha ideia/}).click();await page.getByLabel('Seu nome').fill('Visitante');await page.getByLabel('O que você tem em mente?').fill('Quero organizar a apresentação do meu projeto.');await page.getByRole('button',{name:/Preparar mensagem/}).click();await expect(page.getByLabel('Mensagem preparada')).toHaveValue(/Visitante/);await page.getByRole('button',{name:'Editar ideia'}).click();await expect(page.getByLabel('Seu nome')).toHaveValue('Visitante');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('system motion preference applies across navigation',async({page})=>{
 await page.goto('/');await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/trabalhos/');await expect(page.locator('html')).toHaveClass(/motion-paused/);
});
test('reduced motion and narrow layout preserve the content',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:850});await page.goto('/');await expect(page.locator('h1')).toBeVisible();await expect(page.locator('html')).toHaveClass(/motion-paused/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('observatory changes representation with keyboard and interrupted input',async({page})=>{
 await page.goto('/');const scene=page.locator('.hero [data-griff]');const emblem=scene.getByRole('button',{name:'Emblema',exact:true});await emblem.focus();await emblem.press('Enter');await expect(emblem).toHaveAttribute('aria-pressed','true');await scene.getByRole('button',{name:'Constelação',exact:true}).click();await emblem.click();await expect(scene.locator('[data-scene-state]')).toHaveText('A FIGURA');await expect(scene.getByRole('button',{name:'Constelação',exact:true})).toHaveAttribute('aria-pressed','false');
});
test('detail exploration works without pointer and with motion paused',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/trabalhos/glifo/');const slider=page.getByRole('slider',{name:'Ampliação do grifo'});await slider.focus();await slider.press('End');await expect(slider).toHaveValue('180');await expect(page.locator('[data-detail-value]')).toHaveText('1.8×');
});
test('archive supports buttons and keyboard without leaving the page',async({page})=>{
 await page.goto('/trabalhos/glifo/');await page.getByRole('button',{name:'Próximo estudo'}).click();await expect(page.locator('[data-archive-count]')).toHaveText('02 / 04');const track=page.locator('[data-archive-track]');await track.focus();await track.press('End');await expect(page.locator('[data-archive-count]')).toHaveText('04 / 04');await expect(page.getByRole('button',{name:'Próximo estudo'})).toBeDisabled();await track.press('Home');await expect(page.locator('[data-archive-count]')).toHaveText('01 / 04');await expect(page).toHaveURL(/\/trabalhos\/glifo\/$/);
});
test('archive can be dragged without triggering its chapter links',async({page})=>{
 await page.goto('/trabalhos/glifo/');const track=page.locator('[data-archive-track]');await track.scrollIntoViewIfNeeded();const box=await track.boundingBox();if(!box)throw Error('Missing archive');const x=Math.min(box.width-30,box.width*.8),y=box.y+170;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-240,y,{steps:12});await page.mouse.up();await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeGreaterThan(100);await expect(page).toHaveURL(/\/trabalhos\/glifo\/$/);
});
test('myth and archive remain readable when scripts are disabled',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('/');await expect(page.locator('.myth-chapter')).toHaveCount(3);await expect(page.getByRole('heading',{name:'A mensagem toma forma'})).toBeVisible();await page.goto('/trabalhos/glifo/');await expect(page.locator('.archive-sheet')).toHaveCount(4);await expect(page.locator('.archive-sheet').first().getByRole('link')).toHaveAttribute('href','/trabalhos/glifo/#identidade');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});
test('system reduced motion restores whole prose and remains effective in the atelier',async({page})=>{
 await page.goto('/');await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('body')).toHaveClass(/motion-paused/);
 const prose=page.locator('[data-reading-prose]');expect(await prose.count()).toBeGreaterThan(0);expect(await prose.evaluateAll(paragraphs=>paragraphs.every(p=>Number(getComputedStyle(p).opacity)>.99))).toBe(true);
 await page.goto('/trabalhos/glifo/');await expect(page.locator('body')).toHaveClass(/motion-paused/);
 const slider=page.getByRole('slider',{name:'Ampliação do grifo'});await slider.focus();await slider.press('End');await page.getByRole('button',{name:'Recentrar'}).click();await expect(slider).toHaveValue('100');
});
test('project collection switches with keyboard and opens the selected case',async({page})=>{
 await page.goto('/');const tab=page.getByRole('tab',{name:/Tadeon Nexus/});await tab.focus();await tab.press('ArrowDown');await expect(page.getByRole('tab',{name:/Tessitura do Vazio/})).toHaveAttribute('aria-selected','true');await expect(page.locator('.collection-panel:not([hidden])')).toHaveCount(1);await page.locator('#project-panel-tdv-editorial').getByRole('link',{name:/Explorar o projeto/}).click();await expect(page).toHaveURL(/tdv-editorial\/$/);await expect(page.locator('h1')).toHaveText('Tessitura do Vazio');
});
test('portfolio filtering keeps the correct case links',async({page})=>{
 await page.goto('/trabalhos/');await expect(page.locator('.index-work')).toHaveCount(7);await page.getByRole('button',{name:'Editorial',exact:true}).click();await expect(page.locator('.index-work:not([hidden])')).toHaveCount(2);await expect(page.locator('[data-project-filter-count]')).toHaveText('2 trabalhos');await page.locator('.index-work:not([hidden])').first().click();await expect(page).toHaveURL(/tdv-editorial\/$/);
});
test('all new case routes have local imagery and explicit project context',async({page})=>{
 for(const slug of ['tadeon','tdv-editorial','nexos','delfas-corpore','christiano-tadeu']){await page.goto('/trabalhos/'+slug+'/');await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.case-project-details')).toBeVisible();expect(await page.locator('.case-project-visual .project-art img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);}
 await expect(page.getByRole('link',{name:'Visitar o site completo'})).toHaveAttribute('href','https://caminhoes.christianotadeu.workers.dev');
});
