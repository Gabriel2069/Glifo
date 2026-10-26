import {el,put,button,field,modal,safeAction} from './ui.mjs';

export const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

// Reuse the admin's single command trigger; never register a competing global shortcut.
export function commands(a,tools){
 if(!a.root?.isConnected||document.querySelector('dialog[open]'))return;
 const content=el('div',undefined,'st-command'),results=el('div',undefined,'st-command-results'),count=el('p','','st-muted');
 let entries=[{name:'Iniciar estudo',meta:'Criar',run:()=>a.newStudy()}];
 if(a.study){
  entries.push(...tools.map(([id,name])=>({name,meta:'Ambiente',run:()=>a.go(id)})));
  entries.push(...a.study.directions.map(d=>({name:d.name,meta:'Direção criativa',run:()=>{a.mutate(()=>a.study.activeDirectionId=d.id,true);a.render();}})));
  entries.push(...a.direction.boards.map(b=>({name:b.name,meta:'Prancha · '+({artboard:'Composição',moodboard:'Referências',application:'Aplicação'})[b.kind],run:()=>{a.boardId=b.id;a.study.lastBoardId=b.id;a.go({artboard:'artboards',moodboard:'moodboard',application:'applications'}[b.kind]);}})));
  entries.push({name:'Exportar prancha atual em PNG',meta:'Exportação direta',run:()=>a.quickExport()}, {name:'Guardar versão nomeada',meta:'Histórico',run:()=>a.versions()}, {name:'Todos os estudos',meta:'Voltar',run:()=>a.showHome()});
 }
 entries.push(...a.studies.map(s=>({name:s.name,meta:'Estudo · '+s.status+' · '+(a.bridge.getState().projects.find(p=>p.id===s.projectId)?.name||'Livre'),run:()=>a.open(s.id)})));
 const search=field('Buscar no Studio','',draw,{type:'search'}),input=search.querySelector('input');input.placeholder='Ferramenta, estudo, direção ou prancha…';input.autocomplete='off';
 function draw(term=''){
  results.replaceChildren();const words=normalize(term).split(/\s+/).filter(Boolean),matches=entries.filter(e=>words.every(w=>normalize(e.name+' '+e.meta).includes(w))).slice(0,35);
  for(const item of matches)results.append(put(button('',safeAction(async()=>{dialog.close();await item.run();}),'st-command-result'),el('strong',item.name),el('small',item.meta)));
  if(!matches.length)results.append(el('p','Nenhum resultado. Tente outro nome.','st-empty'));
  count.textContent=matches.length+' resultados · ↑ ↓ para percorrer · Enter para abrir';
 }
 put(content,search,results,count);const dialog=modal('Acesso rápido',content);dialog.classList.add('st-command-dialog');draw();input.focus();
 input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='Enter'){e.preventDefault();const first=results.querySelector('button');if(e.key==='Enter')first?.click();else first?.focus();}});
 results.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const buttons=[...results.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(e.key==='ArrowUp'&&i===0)return input.focus();const index=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[index]?.focus();});
}
