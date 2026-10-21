import {test,expect} from '@playwright/test';

test('glyph exploration keeps manual choice until following the narrative again',async({page})=>{
 await page.goto('/');const instrument=page.locator('[data-glyph-instrument]');
 await instrument.getByRole('button',{name:'03 · Leitura'}).click();
 await expect(instrument).toHaveAttribute('data-glyph-phase','2');
 await page.locator('[data-myth-stage]').evaluate(stage=>stage.setAttribute('data-phase','1'));
 await expect(instrument).toHaveAttribute('data-glyph-phase','2');
 await instrument.getByRole('button',{name:/Voltar a acompanhar/}).click();
 await expect(instrument).toHaveAttribute('data-glyph-phase','1');
 await page.getByRole('button',{name:'Pausar animações'}).click();
 expect(await instrument.locator('.glyph-fragments').evaluate(e=>Number(getComputedStyle(e).opacity))).toBeCloseTo(.6);
});

test('constellation selects real projects, pauses automatic changes and keeps direct paths',async({page})=>{
 await page.goto('/trabalhos/');const cosmos=page.locator('[data-project-cosmos]');
 await cosmos.getByRole('button',{name:/NexOS Digital/}).click();
 await expect(cosmos).toHaveAttribute('data-auto-state','paused');
 await expect(cosmos.locator('[data-cosmos-panel]:not([hidden])')).toHaveCount(1);
 await expect(cosmos.locator('[data-cosmos-panel]:not([hidden]) a').first()).toHaveAttribute('href','/trabalhos/nexos/');
 await cosmos.getByRole('button',{name:/Delfas Corpore/}).focus();await page.keyboard.press('Enter');
 await expect(cosmos.getByRole('button',{name:/Delfas Corpore/})).toHaveAttribute('aria-pressed','true');
 await expect(cosmos.locator('[data-cosmos-panel]:not([hidden])')).toHaveAttribute('id','cosmos-project-delfas-corpore');
});

test('TdV collection scrub settles rapid changes, preserves all sheets and enlarges the selected one',async({page})=>{
 await page.goto('/trabalhos/tdv-editorial/');const desk=page.locator('[data-editorial-desk]');
 await expect(desk.locator('[data-editorial-choice]')).toHaveCount(7);
 const range=desk.getByRole('slider',{name:'Prancha da coleção TdV'});await range.fill('6');await range.fill('7');
 await expect(desk.locator('[data-editorial-sheet]:not([hidden]) h3')).toHaveText('A coleção e seus diagramas');
 await range.focus();await page.keyboard.press('ArrowLeft');
 await expect(desk.locator('[data-editorial-sheet]:not([hidden]) h3')).toHaveText('Orbis Ardex');
 await desk.locator('[data-editorial-sheet]:not([hidden]) button').click();
 await expect(page.locator('[data-board-full-image]')).toHaveAttribute('src','/identities/tdv/collection-6.webp');
 await page.keyboard.press('Escape');await expect(desk.locator('[data-editorial-sheet]:not([hidden]) button')).toBeFocused();
 await expect(page.locator('.case-material-grid figure')).toHaveCount(7);
});

test('paired boards keep font and palette experiments independent and retain readable contrast',async({page})=>{
 await page.goto('/identidades/acolher/');const a=page.locator('.identity-acolher'),c=page.locator('.identity-comissao');
 await a.locator('[data-type-trial]').fill('Uma frase para observar.');
 await a.locator('[data-type-family="Raleway"]').click();
 expect(await a.locator('[data-type-trial]').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Raleway');
 await a.locator('[data-type-size]').fill('60');await expect(a.locator('[data-type-size-value]')).toHaveText('60 px');
 await expect(c.locator('[data-type-trial]')).not.toHaveValue('Uma frase para observar.');
 await a.getByRole('button',{name:'Usar Vermelho como fundo'}).click();
 await expect(a.locator('[data-color-selection]')).toHaveText('Vermelho / #EF3220');
 expect(await a.locator('[data-color-composition]').evaluate(e=>getComputedStyle(e).color)).toBe('rgb(9, 12, 18)');
 await a.getByRole('button',{name:'Restaurar frase'}).click();await expect(a.locator('[data-type-trial]')).toHaveValue('Acolher é estar junto.');
});

test('new scenes and case covers stay within narrow layouts and respect reduced motion',async({page})=>{
 await page.setViewportSize({width:320,height:780});await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['/','/trabalhos/tdv-editorial/','/identidades/christiano-tadeu/']){
  await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  if(route==='/'){await page.locator('[data-glyph-phase="2"]').click();expect(await page.locator('.glyph-resolved').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');}
  if(route.includes('tdv')){await page.locator('[data-editorial-choice="6"]').click();expect(await page.locator('[data-editorial-sheet]:not([hidden])').evaluate(e=>getComputedStyle(e).transform)).toBe('none');}
 }
});
