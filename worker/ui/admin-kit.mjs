// Private interface primitives. Records and persistence remain owned by admin-client.
const paths={close:'M6 6l12 12M18 6 6 18',plus:'M12 4v16M4 12h16',arrow:'M5 12h14m-6-6 6 6-6 6',clock:'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',check:'m5 12 4 4L19 6',note:'M5 3h14v18H5ZM8 8h8M8 12h8M8 16h5'};
export function glyph(name){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');for(const [key,value]of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.5','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(key,value);const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]||paths.arrow);svg.append(path);svg.classList.add('control-icon');return svg;}
export function tone(stage=''){return /Conclu|Contratado|ATENDE/.test(stage)?'good':/Aguardando|Proposta|revisão/.test(stage)?'amber':/Arquivado|Encerrado/.test(stage)?'quiet':/andamento|conversa/.test(stage)?'blue':'purple';}

export function editorGuard(dialog,body){
 let dirty=false,returnTo=null;
 const requestClose=()=>{if(dirty&&!confirm('Descartar as alterações que ainda não foram salvas neste formulário?'))return false;dirty=false;dialog.close();return true;};
 dialog.addEventListener('input',()=>{if(body.querySelector('form')){dirty=true;dialog.dataset.edited='true';}});
 dialog.addEventListener('change',()=>{if(body.querySelector('form')){dirty=true;dialog.dataset.edited='true';}});
 dialog.addEventListener('cancel',event=>{event.preventDefault();requestClose();});
 dialog.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){const form=body.querySelector('form');if(form){event.preventDefault();form.requestSubmit();}}});
 dialog.addEventListener('close',()=>{dirty=false;delete dialog.dataset.edited;queueMicrotask(()=>{if(!document.querySelector('dialog[open]')&&returnTo?.isConnected)returnTo.focus({preventScroll:true});});});
 return {requestClose,opened(){dirty=false;delete dialog.dataset.edited;if(!dialog.open)returnTo=document.activeElement;},pending:()=>dirty};
}

export function mobileNavigation({drawer,sidebar,toggle,close,changed}){
 const marker=document.createComment('workspace navigation');sidebar.before(marker);const media=matchMedia('(max-width:700px)');
 function settle(){if(sidebar.parentElement===drawer)marker.after(sidebar);document.body.classList.remove('nav-expanded');toggle.setAttribute('aria-expanded','false');changed();}
 function hide(){if(drawer.open)drawer.close();settle();}
 toggle.addEventListener('click',()=>{if(!media.matches)return;if(drawer.open)return hide();drawer.append(sidebar);document.body.classList.add('nav-expanded');toggle.setAttribute('aria-expanded','true');drawer.showModal();changed();close.focus();});
 close.addEventListener('click',hide);drawer.addEventListener('close',()=>{settle();if(!document.querySelector('dialog[open]'))toggle.focus({preventScroll:true});});
 drawer.addEventListener('cancel',event=>{event.preventDefault();hide();});
 drawer.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();hide();}});
 drawer.addEventListener('click',event=>{if(event.target===drawer){const r=drawer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)hide();}});
 media.addEventListener('change',()=>{if(!media.matches)hide();});
 return {close:hide};
}

export function formSections(form){
 const headings=[...form.querySelectorAll('h3')];if(headings.length<2)return;
 const outline=document.createElement('details');outline.className='editor-outline';const summary=document.createElement('summary');summary.textContent='Ir para uma seção';outline.append(summary);
 for(const h of headings){const b=document.createElement('button');b.type='button';b.textContent=h.textContent;b.addEventListener('click',()=>{outline.open=false;h.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});const next=h.nextElementSibling?.querySelector('input,textarea,select');next?.focus({preventScroll:true});});outline.append(b);}form.prepend(outline);
 const progress=document.createElement('p');progress.className='editor-progress';progress.setAttribute('role','status');outline.after(progress);
 const update=()=>{const inputs=[...form.querySelectorAll('[required]')].filter(i=>!i.disabled),done=inputs.filter(i=>String(i.value).trim()).length;progress.textContent=done+' de '+inputs.length+' campos obrigatórios preenchidos';};form.addEventListener('input',update);form.addEventListener('change',update);update();
}
