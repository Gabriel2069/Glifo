import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let rememberedPause = false;
try { rememberedPause = localStorage.getItem('glifo:motion') === 'paused'; } catch { /* Storage can be unavailable in a private preview. */ }
let paused = reduced.matches || rememberedPause;
let heroVisible = true;
const motionButton = document.querySelector<HTMLButtonElement>('[data-motion]');
const loops: gsap.core.Tween[] = [];
const entrances: gsap.core.Animation[] = [];
const rotationRefresh: Array<()=>void> = [];
const updateMotion = () => {
 document.body.classList.toggle('motion-paused', paused);
 if(paused)entrances.forEach(animation=>animation.progress(1));
 motionButton?.setAttribute('aria-pressed', String(paused));
 motionButton?.setAttribute('aria-label', paused ? 'Ativar animações' : 'Pausar animações');
 for (const t of loops) paused || document.hidden || !heroVisible ? t.pause() : t.resume();
 for (const trigger of ScrollTrigger.getAll()) {
  if (paused) { trigger.animation?.progress(1); trigger.disable(false); }
  else trigger.enable(false);
 }
 rotationRefresh.forEach(refresh=>refresh());
};
motionButton?.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('glifo:motion',paused?'paused':'playing');}catch{}updateMotion();drawSky(performance.now());requestAnimationFrame(()=>{ScrollTrigger.refresh();updateReading();});});
reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;updateMotion();drawSky(performance.now());}});
updateMotion();

const menuButton=document.querySelector<HTMLButtonElement>('.menu-toggle');
const menu=document.querySelector<HTMLElement>('#mobile-menu');
function closeMenu(){if(menu)menu.hidden=true;menuButton?.setAttribute('aria-expanded','false');}
menuButton?.addEventListener('click',()=>{if(!menu)return;menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && menu && !menu.hidden){closeMenu();menuButton?.focus();}});
document.addEventListener('click',e=>{const target=e.target as Node;if(menu&&!menu.hidden&&!menu.contains(target)&&!menuButton?.contains(target))closeMenu();});
const sentinel=document.querySelector('.header-sentinel');
if(sentinel)new IntersectionObserver(([entry])=>document.querySelector('.site-header')?.classList.toggle('is-scrolled',!entry.isIntersecting)).observe(sentinel);

const media=gsap.matchMedia();
media.add('(prefers-reduced-motion: no-preference)',()=>{
 const hero=document.querySelector('.hero');
 if(hero){
  gsap.fromTo('.hero-description',{opacity:.65},{opacity:1,duration:1.2,ease:'power2.out'});
  const path=document.querySelector<SVGPathElement>('.hero .griff-lines path');
  if(path){const length=path.getTotalLength();gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.7,ease:'power2.inOut',delay:.1,clearProps:'strokeDasharray,strokeDashoffset'});}
  loops.push(gsap.to('.hero-nebula',{scale:1.06,duration:24,repeat:-1,yoyo:true,ease:'sine.inOut'}));
 }
 updateMotion();
 return ()=>{for(const tween of loops)tween.kill();loops.length=0;};
});

// Canvas owns the star field only. Animation runs while the hero is visible.
const canvas=document.querySelector<HTMLCanvasElement>('[data-sky]');
const ctx=canvas?.getContext('2d');
let width=0,height=0,frame=0,visible=true;
const stars=Array.from({length:110},(_,i)=>({x:((i*73.31)%100)/100,y:((i*47.71)%100)/100,size:i%15===0?1.6:.55+(i%4)*.17,phase:i*.37}));
const skyPointer={x:0,y:0,targetX:0,targetY:0};
const hero=document.querySelector<HTMLElement>('.hero');
hero?.addEventListener('pointermove',e=>{if(paused||reduced.matches||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();skyPointer.targetX=((e.clientX-r.left)/r.width-.5)*12;skyPointer.targetY=((e.clientY-r.top)/r.height-.5)*12;});
hero?.addEventListener('pointerleave',()=>{skyPointer.targetX=0;skyPointer.targetY=0;});
function drawSky(time:number){
 if(!canvas||!ctx)return;
 ctx.clearRect(0,0,width,height);
 skyPointer.x+=(skyPointer.targetX-skyPointer.x)*.06;skyPointer.y+=(skyPointer.targetY-skyPointer.y)*.06;
 stars.forEach((s,i)=>{const pulse=paused ? .55 : .5+Math.sin(time*.0004+s.phase)*.22;const depth=(i%3+1)/3;const x=s.x*width+(paused?0:skyPointer.x*depth),y=s.y*height+(paused?0:skyPointer.y*depth);ctx.fillStyle=`rgba(220,230,250,${pulse})`;ctx.beginPath();ctx.arc(x,y,s.size,0,Math.PI*2);ctx.fill();});
}
function tick(time:number){frame=0;drawSky(time);if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
function restartSky(){if(frame)cancelAnimationFrame(frame);frame=0;drawSky(performance.now());if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
if(canvas&&ctx){
 const resize=new ResizeObserver(()=>{width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);restartSky();});resize.observe(canvas);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;heroVisible=visible;updateMotion();restartSky();},{threshold:.05}).observe(canvas);
 motionButton?.addEventListener('click',restartSky);reduced.addEventListener('change',restartSky);
}
document.addEventListener('visibilitychange',()=>{updateMotion();restartSky();});

document.querySelectorAll<HTMLElement>('[data-griff]').forEach(el=>{
 el.addEventListener('pointermove',e=>{if(paused||reduced.matches||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();gsap.to(el.querySelector('.griff-svg'),{x:((e.clientX-r.left)/r.width-.5)*10,y:((e.clientY-r.top)/r.height-.5)*10,duration:.8,overwrite:true,ease:'power2.out'});});
 el.addEventListener('pointerleave',()=>gsap.to(el.querySelector('.griff-svg'),{x:0,y:0,duration:.8,overwrite:true}));
});

document.querySelectorAll<HTMLElement>('.featured-frame').forEach(el=>{
 el.addEventListener('pointermove',e=>{if(paused||reduced.matches||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();el.style.setProperty('--light-x',`${((e.clientX-r.left)/r.width)*100}%`);el.style.setProperty('--light-y',`${((e.clientY-r.top)/r.height)*100}%`);});
});

const atlasDetails:Record<string,{title:string;copy:string}>={
 identidade:{title:'Identidade',copy:'A asa atravessa o nome; a cauda devolve o olhar ao início. Logotipo e emblema conservam esse parentesco.'},
 linguagem:{title:'Linguagem',copy:'A luz aparece sobre o azul profundo. A letra conduz a leitura, enquanto pontos e órbitas sugerem relações entre as partes.'},
 presenca:{title:'Presença',copy:'O sinal deixa o desenho e ocupa uma página. Neste site, sua construção pode ser lida, percorrida e examinada.'},
};
document.querySelectorAll<HTMLElement>('[data-atlas]').forEach(point=>{
 const reveal=()=>{const key=point.dataset.atlas!,detail=atlasDetails[key];if(!detail)return;const title=document.querySelector('[data-atlas-title]');const copy=document.querySelector('[data-atlas-copy]');const link=document.querySelector<HTMLAnchorElement>('[data-atlas-link]');if(title)title.textContent=detail.title;if(copy)copy.textContent=detail.copy;if(link)link.href=`/trabalhos/glifo/#${key}`;document.querySelectorAll('[data-atlas]').forEach(p=>p.classList.toggle('is-active',p===point));};
 point.addEventListener('pointerenter',reveal);point.addEventListener('focus',reveal);
});

const tabs=Array.from(document.querySelectorAll<HTMLButtonElement>('.process-tabs [role=tab]'));
function selectTab(index:number,focus=false){tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;const panel=document.getElementById(tab.getAttribute('aria-controls')!);if(panel){panel.hidden=!active;if(active&&!paused&&!reduced.matches)gsap.fromTo(panel,{y:9},{y:0,duration:.4});}if(active&&focus)tab.focus();});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(i));tab.addEventListener('keydown',e=>{let index=i;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();selectTab(index,true);});});

const dialog=document.querySelector<HTMLDialogElement>('.idea-dialog');
document.querySelectorAll('[data-open-idea]').forEach(b=>b.addEventListener('click',()=>dialog?.showModal()));
document.querySelector('[data-close-dialog]')?.addEventListener('click',()=>dialog?.close());
const form=document.querySelector<HTMLFormElement>('[data-idea-form]');
form?.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const name=String(data.get('name')||'').trim();const idea=String(data.get('idea')||'').trim();const message=document.querySelector<HTMLTextAreaElement>('[data-idea-message]');if(message)message.value=`Olá, Tadeu! Sou ${name}.\n\nQuero conversar sobre uma ideia:\n${idea}`;const send=document.querySelector<HTMLAnchorElement>('[data-send-idea]');if(send&&message)send.href=form.dataset.whatsapp+'?text='+encodeURIComponent(message.value);const result=document.querySelector<HTMLElement>('.idea-result');if(result)result.hidden=false;form.hidden=true;});
document.querySelector('[data-edit-idea]')?.addEventListener('click',()=>{if(!form)return;form.hidden=false;const result=document.querySelector<HTMLElement>('.idea-result');if(result)result.hidden=true;form.querySelector<HTMLTextAreaElement>('textarea')?.focus();});
dialog?.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
let feedbackTimer:ReturnType<typeof setTimeout>;
function notify(text:string){const el=document.querySelector<HTMLElement>('[data-feedback]');if(!el)return;el.textContent=text;el.classList.add('visible');clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>el.classList.remove('visible'),2500);}
document.querySelector('[data-copy-idea]')?.addEventListener('click',async()=>{const input=document.querySelector<HTMLTextAreaElement>('[data-idea-message]');if(!input)return;let ok=false;try{await navigator.clipboard.writeText(input.value);ok=true;}catch{input.select();ok=document.execCommand('copy');}notify(ok?'Mensagem copiada.':'Selecione a mensagem para copiar.');});

// The observatory has two readable states. Transitions can be interrupted safely.
document.querySelectorAll<HTMLElement>('[data-griff]').forEach(scene=>{
 const buttons=Array.from(scene.querySelectorAll<HTMLButtonElement>('[data-scene-mode]'));
 const mark=scene.querySelector('.griff-ghost');
 const lines=scene.querySelector('.griff-lines');
 const nodes=scene.querySelector('.griff-nodes');
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const emblem=button.dataset.sceneMode==='mark';
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const caption=scene.querySelector('[data-scene-state]');if(caption)caption.textContent=emblem?'A FIGURA':'OS SINAIS';
  const duration=paused||reduced.matches?0:1.15;
  gsap.to(mark,{opacity:emblem?.92:.055,duration,ease:'power2.inOut',overwrite:true});
  gsap.to(lines,{opacity:emblem?.07:.72,duration,ease:'power2.inOut',overwrite:true});
  gsap.to(nodes,{opacity:emblem?.15:1,duration,ease:'power2.inOut',overwrite:true});
 }));
});

// Scroll is native. A single scheduled read updates the reading instrument.
let readingFrame=0;
const progress=document.querySelector<HTMLElement>('[data-reading-progress]');
const rail=Array.from(document.querySelectorAll<HTMLAnchorElement>('.chapter-rail a'));
const chapters=rail.map(a=>document.querySelector<HTMLElement>(a.hash));
function updateReading(){
 readingFrame=0;
 const distance=document.documentElement.scrollHeight-innerHeight;
 if(progress)progress.style.transform=`scaleX(${distance>0?Math.min(1,scrollY/distance):0})`;
 let active=-1;chapters.forEach((section,i)=>{if(section&&section.getBoundingClientRect().top<innerHeight*.5)active=i;});
 rail.forEach((a,i)=>{a.classList.toggle('is-current',i===active);if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
}
window.addEventListener('scroll',()=>{if(!readingFrame)readingFrame=requestAnimationFrame(updateReading);},{passive:true});
window.addEventListener('resize',updateReading);updateReading();

const zoom=document.querySelector<HTMLInputElement>('[data-detail-zoom]');
zoom?.addEventListener('input',()=>{
 const scale=Number(zoom.value)/100;const output=document.querySelector('[data-detail-value]');if(output)output.textContent=`${scale.toFixed(1)}×`;
 gsap.to('.detail-frame img',{scale,duration:paused||reduced.matches?0:.55,ease:'power2.out',overwrite:true});
});

// Scenography is scoped, bounded and disabled by the common motion control.
media.add('(prefers-reduced-motion: no-preference)',()=>{
 const opening=gsap.timeline();entrances.push(opening);
 opening.fromTo('.hero .griff-nodes > g',{opacity:.15,scale:.6,svgOrigin:'250 250'},{opacity:1,scale:1,duration:1.8,stagger:.025,ease:'power2.out'},0);
 opening.fromTo('.hero .celestial-dial',{rotation:-18,opacity:.1},{rotation:0,opacity:.48,duration:2.5,ease:'power3.out'},0);
 const dial=document.querySelector('.hero .orbit-b');
 if(dial)loops.push(gsap.to(dial,{rotation:360,duration:180,repeat:-1,ease:'none'}));
 gsap.to('.hero .griff-scene',{y:65,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
 gsap.to('.hero-copy',{y:-35,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
 const myth=document.querySelector<SVGPathElement>('.myth-constellation');
 if(myth){const length=myth.getTotalLength();gsap.fromTo(myth,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.myth',start:'top 80%',end:'center 50%',scrub:1}});}

 const atlasPath=document.querySelector<SVGPathElement>('.atlas-map path');
 if(atlasPath){const length=atlasPath.getTotalLength();gsap.fromTo(atlasPath,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:2,ease:'power2.inOut',scrollTrigger:{trigger:'.atlas-map',start:'top 80%',once:true}});}
 gsap.fromTo('.frame-orbit',{rotation:-35},{rotation:10,ease:'none',scrollTrigger:{trigger:'.featured-frame',start:'top bottom',end:'bottom top',scrub:1.5}});
 gsap.fromTo('.contact-star',{rotation:-45,scale:.65},{rotation:30,scale:1.15,ease:'none',scrollTrigger:{trigger:'.contact-section',start:'top bottom',end:'bottom bottom',scrub:1}});
 updateMotion();
 if(paused)opening.progress(1);
});

// Preview content changes synchronously; motion carries the new visual state.
document.querySelectorAll<HTMLElement>('[data-atlas]').forEach(point=>{
 const show=()=>{
  const art=document.querySelector<HTMLElement>('[data-atlas-art]');if(!art)return;
  if(art.dataset.atlasArt===point.dataset.atlas)return;
  art.dataset.atlasArt=point.dataset.atlas;
  if(!paused&&!reduced.matches)gsap.fromTo(art,{y:12,opacity:.3},{y:0,opacity:1,duration:.6,ease:'power2.out',overwrite:true});
 };
 point.addEventListener('pointerenter',show);point.addEventListener('focus',show);
});

// Preserve headings as one accessible phrase, while words move inside masks.
function wordSpans(element:HTMLElement, masked=false){
 const existing=element.querySelectorAll<HTMLElement>(masked?'.reveal-word':'.reading-word');if(existing.length)return existing;
 const label=element.textContent?.replace(/\s+/g,' ').trim()||'';
 if(masked)element.setAttribute('aria-label',label);
 const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
 const texts:Text[]=[];while(walker.nextNode())texts.push(walker.currentNode as Text);
 texts.forEach(node=>{
  const fragment=document.createDocumentFragment();
  (node.textContent||'').split(/(\s+)/).forEach(part=>{
   if(!part.trim()){fragment.append(document.createTextNode(part));return;}
   const word=document.createElement('span');word.className=masked?'reveal-word':'reading-word';word.textContent=part;if(masked)word.setAttribute('aria-hidden','true');
   if(masked){const mask=document.createElement('span');mask.className='reveal-word-mask';mask.append(word);fragment.append(mask);}else fragment.append(word);
  });node.replaceWith(fragment);
 });
 return element.querySelectorAll<HTMLElement>(masked?'.reveal-word':'.reading-word');
}
media.add('(prefers-reduced-motion: no-preference)',()=>{
 document.querySelectorAll<HTMLElement>('h1,h2').forEach(heading=>{
  if(heading.querySelector('img'))return;
  const words=wordSpans(heading,true);
  const tween=gsap.fromTo(words,{yPercent:115,rotation:3,opacity:0},{yPercent:0,rotation:0,opacity:1,duration:1.1,stagger:.075,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 93%',once:true}});
  entrances.push(tween);
 });
 document.querySelectorAll<HTMLElement>('[data-reading-prose]').forEach(prose=>{
  const tween=gsap.fromTo(prose,{opacity:.72,y:12},{opacity:1,y:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:prose,start:'top 94%',once:true}});
  entrances.push(tween);
 });
 document.querySelectorAll<HTMLElement>('.featured-frame,.sheet-art,.detail-frame,.case-image,.case-signatures>div').forEach(frame=>{
  gsap.fromTo(frame,{clipPath:'inset(12% 4% 12% 4%)',opacity:.35},{clipPath:'inset(0% 0% 0% 0%)',opacity:1,duration:1.5,ease:'power3.inOut',scrollTrigger:{trigger:frame,start:'top 94%',once:true}});
 });
 document.querySelectorAll<HTMLElement>('.section-description,.project-caption,.process-tabs,.author-grid>div,.services>div,.case-text>div').forEach(element=>{
  gsap.fromTo(element,{y:30,opacity:0},{y:0,opacity:1,duration:.9,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 94%',once:true}});
 });
 const theatre=document.querySelector('.myth-theatre');
 if(theatre){
  gsap.fromTo('.myth-landscape',{scale:1.13,yPercent:3},{scale:1,yPercent:-3,ease:'none',scrollTrigger:{trigger:theatre,start:'top bottom',end:'bottom top',scrub:1.2}});
  gsap.to('.myth-stage-rune',{rotation:90,y:55,ease:'none',scrollTrigger:{trigger:theatre,start:'top top',end:'bottom bottom',scrub:1}});
 }
 updateMotion();
});
const mythChapters=Array.from(document.querySelectorAll<HTMLElement>('[data-myth-chapter]'));
if(mythChapters.length){
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){const note=(entry.target as HTMLElement).dataset.mythNote;const label=document.querySelector('[data-myth-index]');if(label&&note)label.textContent=note;const stage=document.querySelector<HTMLElement>('[data-myth-stage]');if(stage)stage.dataset.phase=String(mythChapters.indexOf(entry.target as HTMLElement));}});
 },{rootMargin:'-25% 0px -35% 0px',threshold:0});mythChapters.forEach(chapter=>observer.observe(chapter));
}

// Horizontal folios: native touch scrolling, mouse drag with bounded momentum,
// arrow buttons and keyboard equivalents. Never capture the page's wheel.
const track=document.querySelector<HTMLElement>('[data-archive-track]');
if(track){
 const sheets=Array.from(track.querySelectorAll<HTMLElement>('[data-sheet]'));
 const prev=document.querySelector<HTMLButtonElement>('[data-archive-prev]');
 const next=document.querySelector<HTMLButtonElement>('[data-archive-next]');
 let active=0,dragging=false,pending=false,suppressClick=false,startX=0,startScroll=0,lastX=0,lastTime=0,velocity=0;
 let momentum:gsap.core.Tween|undefined;
 function archiveState(){
  const box=track!.getBoundingClientRect();const center=box.left+box.width/2;
  let best=Infinity;sheets.forEach((sheet,i)=>{const r=sheet.getBoundingClientRect();const d=Math.abs(r.left+r.width/2-center);if(d<best){best=d;active=i;}});
  if(prev)prev.disabled=active===0;if(next)next.disabled=active===sheets.length-1;
  const count=document.querySelector('[data-archive-count]');if(count)count.textContent=`0${active+1} / 0${sheets.length}`;
  const meter=document.querySelector<HTMLElement>('[data-archive-meter]');if(meter)meter.style.transform=`translateX(${active*100}%)`;
 }
 function go(index:number){
  momentum?.kill();track!.classList.remove('is-dragging');
  const sheet=sheets[Math.max(0,Math.min(sheets.length-1,index))];const r=sheet.getBoundingClientRect(),box=track!.getBoundingClientRect();
  track!.scrollTo({left:track!.scrollLeft+r.left-box.left-(box.width-r.width)/2,behavior:paused||reduced.matches?'instant':'smooth'});
 }
 prev?.addEventListener('click',()=>go(active-1));next?.addEventListener('click',()=>go(active+1));
 track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'){event.preventDefault();go(active+1);}if(event.key==='ArrowLeft'){event.preventDefault();go(active-1);}if(event.key==='Home'){event.preventDefault();go(0);}if(event.key==='End'){event.preventDefault();go(sheets.length-1);}});
 track.addEventListener('dragstart',event=>event.preventDefault());
 track.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;momentum?.kill();pending=true;dragging=false;suppressClick=false;startX=lastX=event.clientX;startScroll=track!.scrollLeft;lastTime=performance.now();velocity=0;});
 track.addEventListener('pointermove',event=>{
  if(!pending)return;const delta=event.clientX-startX;
  if(!dragging&&Math.abs(delta)>6){dragging=true;track!.setPointerCapture(event.pointerId);track!.classList.add('is-dragging');}
  if(!dragging)return;event.preventDefault();const now=performance.now();velocity=(event.clientX-lastX)/Math.max(8,now-lastTime);lastX=event.clientX;lastTime=now;track!.scrollLeft=startScroll-delta;
 });
 const end=(event:PointerEvent)=>{
  if(!pending)return;pending=false;
  if(track!.hasPointerCapture(event.pointerId))track!.releasePointerCapture(event.pointerId);
  if(!dragging)return;dragging=false;suppressClick=true;setTimeout(()=>{suppressClick=false;},180);
  const max=track!.scrollWidth-track!.clientWidth;const target=Math.max(0,Math.min(max,track!.scrollLeft-velocity*170));
  if(paused||reduced.matches){track!.scrollLeft=target;track!.classList.remove('is-dragging');archiveState();return;}
  momentum=gsap.to(track,{scrollLeft:target,duration:.7,ease:'power3.out',onComplete:()=>{track!.classList.remove('is-dragging');archiveState();go(active);}});
  entrances.push(momentum);
 };
 window.addEventListener('pointerup',end);track.addEventListener('pointercancel',event=>{pending=false;dragging=false;if(track!.hasPointerCapture(event.pointerId))track!.releasePointerCapture(event.pointerId);track!.classList.remove('is-dragging');});
 track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();}},true);
 let archiveFrame=0;track.addEventListener('scroll',()=>{if(!archiveFrame)archiveFrame=requestAnimationFrame(()=>{archiveFrame=0;archiveState();});},{passive:true});
 window.addEventListener('resize',archiveState);archiveState();
}

const detailPan=document.querySelector<HTMLElement>('[data-detail-pan]');
if(detailPan){
 let originX=0,originY=0,baseX=0,baseY=0,panX=0,panY=0,pressed=false;
 const image=detailPan.querySelector('img');
 detailPan.addEventListener('pointerdown',event=>{
  if((event.target as HTMLElement).closest('button,label,input')||event.pointerType!=='mouse'||event.button!==0)return;
  pressed=true;originX=event.clientX;originY=event.clientY;baseX=panX;baseY=panY;detailPan.setPointerCapture(event.pointerId);detailPan.classList.add('is-dragging');
 });
 detailPan.addEventListener('pointermove',event=>{if(!pressed)return;panX=Math.max(-110,Math.min(110,baseX+event.clientX-originX));panY=Math.max(-90,Math.min(90,baseY+event.clientY-originY));gsap.to(image,{x:panX,y:panY,duration:paused||reduced.matches?0:.35,ease:'power2.out',overwrite:'auto'});});
 const endPan=()=>{pressed=false;detailPan.classList.remove('is-dragging');};detailPan.addEventListener('pointerup',endPan);detailPan.addEventListener('pointercancel',endPan);
 document.querySelector('[data-detail-reset]')?.addEventListener('click',()=>{panX=panY=0;if(zoom){zoom.value='100';zoom.dispatchEvent(new Event('input'));}gsap.to(image,{x:0,y:0,duration:paused||reduced.matches?0:.6,ease:'power2.out',overwrite:'auto'});});
}

// Project selection has a single panel and equivalent pointer/keyboard paths.
const projectTabs=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-project-tab]'));
function selectProject(index:number,focus=false){
 projectTabs.forEach((tab,i)=>{
  const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
  const panel=document.getElementById(tab.getAttribute('aria-controls')!);
  if(panel){panel.hidden=!active;if(active&&!paused&&!reduced.matches){gsap.fromTo(panel,{opacity:.25,y:16},{opacity:1,y:0,duration:.7,ease:'power2.out',overwrite:true});}}
  if(active&&focus)tab.focus();
 });
}
projectTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectProject(i));tab.addEventListener('keydown',e=>{let index=i;if(e.key==='ArrowDown'||e.key==='ArrowRight')index=(i+1)%projectTabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')index=(i-1+projectTabs.length)%projectTabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=projectTabs.length-1;else return;e.preventDefault();selectProject(index,true);});});
// Filters change the semantic set immediately; FLIP preserves the visual positions.
const workCards=Array.from(document.querySelectorAll<HTMLElement>('[data-project-categories]'));
let filterTimeline:gsap.core.Timeline|undefined;
const settleWorkFilter=()=>{filterTimeline?.kill();gsap.killTweensOf(workCards);gsap.set(workCards,{clearProps:'transform,opacity'});};
rotationRefresh.push(()=>{if(paused||reduced.matches)settleWorkFilter();});
document.querySelectorAll<HTMLButtonElement>('[data-project-filter]').forEach(button=>{
 button.addEventListener('click',()=>{
  if(button.getAttribute('aria-pressed')==='true')return;
  settleWorkFilter();
  const before=new Map(workCards.filter(card=>!card.hidden).map(card=>[card,card.getBoundingClientRect()]));
  const filter=button.dataset.projectFilter;let count=0;
  document.querySelectorAll('[data-project-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  workCards.forEach(project=>{project.hidden=filter!=='Todos'&&!project.dataset.projectCategories?.split(',').includes(filter!);if(!project.hidden)count++;});
  const visible=workCards.filter(card=>!card.hidden);
  const after=visible.map(card=>({card,rect:card.getBoundingClientRect(),old:before.get(card)}));
  const status=document.querySelector('[data-project-filter-count]');if(status)status.textContent=`${count} ${count===1?'trabalho':'trabalhos'}`;
  if(!paused&&!reduced.matches){
   filterTimeline=gsap.timeline({onComplete:()=>gsap.set(visible,{clearProps:'transform,opacity'})});
   after.forEach(({card,rect,old},index)=>{
    if(old)filterTimeline!.fromTo(card,{x:old.left-rect.left,y:old.top-rect.top},{x:0,y:0,duration:.65,ease:'power3.out'},0);
    else filterTimeline!.fromTo(card,{y:22,opacity:0},{y:0,opacity:1,duration:.55,ease:'power2.out'},Math.min(index*.045,.18));
   });
  }
  ScrollTrigger.refresh();
 });
});
// The light belongs to the frame, so the supplied artwork keeps its geometry.
document.querySelectorAll<HTMLElement>('.project-art').forEach(frame=>{
 frame.addEventListener('pointermove',event=>{
  if(paused||reduced.matches||event.pointerType!=='mouse')return;
  const bounds=frame.getBoundingClientRect();
  frame.style.setProperty('--cover-x',`${((event.clientX-bounds.left)/bounds.width)*100}%`);
  frame.style.setProperty('--cover-y',`${((event.clientY-bounds.top)/bounds.height)*100}%`);
 });
 frame.addEventListener('pointerleave',()=>{frame.style.removeProperty('--cover-x');frame.style.removeProperty('--cover-y');});
});
media.add('(prefers-reduced-motion: no-preference)',()=>{
 document.querySelectorAll<HTMLElement>('.index-work .project-art,.index-work .work-card-copy,.work-intro-aside').forEach(element=>{
  const entrance=gsap.fromTo(element,{y:20,opacity:.35},{y:0,opacity:1,duration:.85,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 95%',once:true}});
  entrances.push(entrance);
 });
 updateMotion();
});
const projectOrientation=matchMedia('(max-width:760px)');
const setProjectOrientation=()=>document.querySelector('.collection-tabs')?.setAttribute('aria-orientation',projectOrientation.matches?'horizontal':'vertical');
projectOrientation.addEventListener('change',setProjectOrientation);setProjectOrientation();

// The identity keeps a direct route; ordinary clicks open the document over the site.
const identityDocument=document.querySelector<HTMLDialogElement>('[data-identity-document]');
const documentFrame=identityDocument?.querySelector<HTMLIFrameElement>('[data-identity-document-frame]');
let documentOpener:HTMLAnchorElement|undefined;
const portable=()=>{try{return Boolean((window as Window & {glifoPortable?:boolean}).glifoPortable||(window.parent as Window & {glifoPortable?:boolean}).glifoPortable);}catch{return false;}};
if(identityDocument&&documentFrame){
 document.addEventListener('click',event=>{
  const mouse=event as MouseEvent;if(mouse.defaultPrevented||mouse.button!==0||mouse.metaKey||mouse.ctrlKey||mouse.shiftKey||mouse.altKey||portable())return;
  const anchor=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!anchor)return;
  const url=new URL(anchor.href,location.href);if(url.origin!==location.origin||!/^\/identidades\/[^/]+\/$/.test(url.pathname))return;
  if(document.documentElement.dataset.identityDocument){anchor.href=url.pathname+'?documento=1'+url.hash;return;}
  event.preventDefault();documentOpener=anchor;closeMenu();
  const title=identityDocument.querySelector('[data-identity-document-title]');if(title)title.textContent=({'glifo':'Glifo','christiano-tadeu':'Christiano Tadeu','tdv':'Tessitura do Vazio','delfas-corpore':'Delfas Corpore','comissao':'Comissão Grão de Mostarda','acolher':'Projeto Acolher'} as Record<string,string>)[url.pathname.split('/')[2]]||'Identidade de marca';
  identityDocument.querySelector<HTMLAnchorElement>('[data-identity-document-route]')!.href=url.pathname;
  documentFrame.src=url.pathname+'?documento=1'+url.hash;identityDocument.showModal();
 });
 identityDocument.querySelector('[data-identity-document-close]')?.addEventListener('click',()=>identityDocument.close());
 identityDocument.addEventListener('close',()=>{documentFrame.src='about:blank';documentOpener?.focus();});
 documentFrame.addEventListener('load',()=>{
  // Escape closes a zoomed piece first; otherwise it closes the parent document.
  documentFrame.contentDocument?.addEventListener('keydown',event=>{if(event.key==='Escape'&&!documentFrame.contentDocument?.querySelector('dialog[open]')){event.preventDefault();identityDocument.close();}});
  documentFrame.contentDocument?.addEventListener('click',event=>{
   const anchor=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!anchor||anchor.target==='_blank'||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   const url=new URL(anchor.href);if(url.origin===location.origin&&(url.pathname==='/'||url.pathname.startsWith('/trabalhos/'))){event.preventDefault();location.assign(url.pathname+url.hash);}
  });
 });
}
// Timed discovery shares the existing selection handlers and never moves focus.
function rotateWhenVisible(root:HTMLElement|null,period:number,next:()=>void){
 if(!root)return;
 let visible=false,hover=false,manual=false,timer:ReturnType<typeof setTimeout>|undefined;
 const controls=document.createElement('div');controls.className='auto-cycle';
 controls.innerHTML='<span data-auto-status>Alternância automática</span><span class="auto-cycle-track" aria-hidden="true"><span></span></span><button type="button" data-auto-toggle aria-pressed="false">Pausar alternância</button>';
 root.append(controls);root.style.setProperty('--auto-period',`${period/1000}s`);
 const toggle=controls.querySelector<HTMLButtonElement>('button')!;
 const refresh=()=>{
  clearTimeout(timer);timer=undefined;
  const focus=root.contains(document.activeElement)&&document.activeElement!==toggle;
  const blocked=paused||reduced.matches||document.hidden||Boolean(document.querySelector('dialog[open]'));
  const running=visible&&!hover&&!focus&&!manual&&!blocked;
  root.dataset.autoState=running?'running':'paused';
  toggle.setAttribute('aria-pressed',String(manual));toggle.textContent=manual?'Retomar alternância':'Pausar alternância';
  controls.querySelector('[data-auto-status]')!.textContent=manual?'Alternância pausada':blocked?'Alternância em pausa':'Alterna automaticamente';
  root.querySelectorAll<HTMLElement>('[aria-live]').forEach(el=>el.setAttribute('aria-live',running?'off':'polite'));
  if(running)timer=setTimeout(()=>{next();const bar=controls.querySelector<HTMLElement>('.auto-cycle-track span')!;bar.style.animation='none';void bar.offsetWidth;bar.style.animation='';refresh();},period);
 };
 toggle.addEventListener('click',()=>{manual=!manual;refresh();});
 root.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hover=true;refresh();}});
 root.addEventListener('pointerleave',()=>{hover=false;refresh();});
 root.addEventListener('focusin',refresh);root.addEventListener('focusout',()=>queueMicrotask(refresh));
 const stopOnUse=(event:Event)=>{if(event.isTrusted&&!(event.target as Element).closest('[data-auto-toggle]')){manual=true;refresh();}};
 root.addEventListener('pointerdown',stopOnUse);root.addEventListener('keydown',stopOnUse);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;refresh();},{threshold:.12}).observe(root);
 document.addEventListener('visibilitychange',refresh);
 new MutationObserver(refresh).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 rotationRefresh.push(refresh);refresh();
}
const scene=document.querySelector<HTMLElement>('.hero [data-griff]');
rotateWhenVisible(scene,8000,()=>{const buttons=Array.from(scene!.querySelectorAll<HTMLButtonElement>('[data-scene-mode]'));const index=buttons.findIndex(b=>b.getAttribute('aria-pressed')==='true');buttons[(index+1)%buttons.length]?.click();});
rotateWhenVisible(document.querySelector('.work-collection'),12000,()=>{const current=projectTabs.findIndex(t=>t.getAttribute('aria-selected')==='true');selectProject((current+1)%projectTabs.length);});
rotateWhenVisible(document.querySelector('#processo'),14000,()=>{const current=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');selectTab((current+1)%tabs.length);});
const atlas=document.querySelector<HTMLElement>('.atlas-section');
rotateWhenVisible(atlas,10000,()=>{const points=Array.from(atlas!.querySelectorAll<HTMLElement>('[data-atlas]'));const current=points.findIndex(p=>p.classList.contains('is-active'));points[(current+1)%points.length]?.dispatchEvent(new Event('pointerenter'));});
rotateWhenVisible(document.querySelector('.archive-section'),16000,()=>{const last=document.querySelector<HTMLButtonElement>('[data-archive-next]');if(last?.disabled)track?.dispatchEvent(new KeyboardEvent('keydown',{key:'Home'}));else last?.click();});

const identityImages=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-board-image]'));
const boardDialog=document.querySelector<HTMLDialogElement>('[data-board-lightbox]');
if(boardDialog&&identityImages.length){
 let current=0;let opener:HTMLButtonElement|undefined;
 const image=boardDialog.querySelector<HTMLImageElement>('[data-board-full-image]')!;
 const zoomControl=boardDialog.querySelector<HTMLInputElement>('[data-board-zoom]');
 const resetZoom=()=>{if(zoomControl)zoomControl.value='100';image.style.width='100%';image.parentElement?.classList.remove('is-zoomed');image.parentElement?.scrollTo(0,0);};
 const show=(index:number)=>{current=(index+identityImages.length)%identityImages.length;const item=identityImages[current];resetZoom();image.src=item.dataset.boardImage!;image.alt=item.querySelector('img')?.alt||'Imagem da identidade';const caption=boardDialog.querySelector('[data-board-full-caption]');if(caption)caption.textContent=item.dataset.boardCaption||'';const count=boardDialog.querySelector('[data-board-image-count]');if(count)count.textContent=`${current+1} / ${identityImages.length}`;};
 identityImages.forEach((button,index)=>button.addEventListener('click',()=>{opener=button;show(index);boardDialog.showModal();}));
 boardDialog.querySelector('[data-board-prev]')?.addEventListener('click',()=>show(current-1));
 boardDialog.querySelector('[data-board-next]')?.addEventListener('click',()=>show(current+1));
 boardDialog.querySelector('[data-board-close]')?.addEventListener('click',()=>boardDialog.close());
 boardDialog.addEventListener('close',()=>opener?.focus());
 boardDialog.addEventListener('keydown',event=>{if(event.target===zoomControl)return;if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}});
 zoomControl?.addEventListener('input',()=>{const value=Number(zoomControl.value);image.parentElement?.classList.toggle('is-zoomed',value>100);image.style.width=`${value}%`;});
}
document.querySelectorAll<HTMLButtonElement>('[data-copy-color]').forEach(button=>button.addEventListener('click',async()=>{
 const value=button.dataset.copyColor!;let copied=false;
 try{await navigator.clipboard.writeText(value);copied=true;}catch{
  const input=document.createElement('textarea');input.value=value;input.style.position='fixed';input.style.left='-9999px';document.body.append(input);input.select();copied=document.execCommand('copy');input.remove();button.focus();
 }
 notify(copied?`${value} copiado.`:`Código da cor: ${value}`);
}));
