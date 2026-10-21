import {test,expect} from '@playwright/test';
test('project discovery keeps playing over copy and switches at the new pace',async({page})=>{
 await page.goto('/');const section=page.locator('.work-collection');await section.locator('.section-description').scrollIntoViewIfNeeded();await section.locator('.section-description').hover();await expect(section).toHaveAttribute('data-auto-state','running');await expect(section.locator('[data-project-tab][aria-selected="true"]')).toHaveAttribute('id','project-tab-delfas-corpore',{timeout:8500});await section.getByRole('tab',{name:/Tadeon Nexus/}).click();await expect(section).toHaveAttribute('data-auto-state','paused');await expect(section.locator('.collection-panel:not([hidden])')).toHaveCount(1);await page.emulateMedia({reducedMotion:'reduce'});expect(await section.locator('.collection-panel:not([hidden]) .project-art').evaluate(e=>getComputedStyle(e).transform)).toBe('none');
});
test('system preference disables document entrance motion and remains on navigation',async({page})=>{
 await page.goto('/');await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/trabalhos/christiano-tadeu/');await page.getByRole('link',{name:/Ver a identidade visual/}).click();await expect(page.locator('html')).toHaveClass(/motion-paused/);expect(await page.locator('[data-identity-document]').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
});

test('automatic discovery rests briefly then resumes with the selected control still focused',async({page})=>{
 await page.goto('/');const section=page.locator('#processo');await section.scrollIntoViewIfNeeded();
 const tab=section.getByRole('tab',{name:/Forma/});await tab.click();await expect(tab).toBeFocused();
 await expect(section).toHaveAttribute('data-auto-state','paused');await expect(section.locator('button[data-auto-toggle]')).toHaveCount(0);
 await expect(section).toHaveAttribute('data-auto-state','running',{timeout:8000});
 await expect(section.getByRole('tab',{name:/Presença/})).toHaveAttribute('aria-selected','true',{timeout:9000});await expect(tab).toBeFocused();
 await page.getByRole('button',{name:'Menu',exact:true}).click();await expect(section).toHaveAttribute('data-auto-state','paused');
 await page.keyboard.press('Escape');await expect(section).toHaveAttribute('data-auto-state','running');
});

test('legacy manual pause is ignored and changes to the system setting work both ways',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('glifo:motion','paused'));
 await page.goto('/');await expect(page.locator('html')).not.toHaveClass(/motion-paused/);
 await expect(page.locator('[data-motion]')).toHaveCount(0);await expect(page.getByRole('button',{name:/Pausar|Retomar alternância|Ativar animações/})).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('html')).toHaveClass(/motion-paused/);await expect(page.locator('.hero [data-griff]')).toHaveAttribute('data-auto-state','paused');
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('html')).not.toHaveClass(/motion-paused/);await expect(page.locator('.hero [data-griff]')).toHaveAttribute('data-auto-state','running');
});

test('all process stages remain readable when scripts are unavailable',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});
 try{const page=await context.newPage();await page.goto('/');for(const panel of await page.locator('#processo .process-panel').all())await expect(panel).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}finally{await context.close();}
});
