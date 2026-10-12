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
};
motionButton?.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('glifo:motion',paused?'paused':'playing');}catch{}updateMotion();drawSky(performance.now());});
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
 document.querySelectorAll<HTMLElement>('.section-heading h2,.myth-copy h2,.detail-copy h2,.author-grid h2').forEach(el=>{
  gsap.fromTo(el,{y:24},{y:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
 });
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
 identidade:{title:'Identidade',copy:'O nome e a figura. O grifo reúne a intenção em uma assinatura reconhecível.'},
 linguagem:{title:'Linguagem',copy:'Cor, tipografia e relações. Uma atmosfera celestial com espaço para a leitura.'},
 presenca:{title:'Presença',copy:'A ideia em uso. A identidade continua nos materiais e na experiência deste site.'},
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
form?.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const name=String(data.get('name')||'').trim();const idea=String(data.get('idea')||'').trim();const message=document.querySelector<HTMLTextAreaElement>('[data-idea-message]');if(message)message.value=`Olá, Tadeu! Sou ${name}.\n\nQuero conversar sobre uma ideia:\n${idea}`;const result=document.querySelector<HTMLElement>('.idea-result');if(result)result.hidden=false;form.hidden=true;});
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
 gsap.fromTo('.myth-emblem',{y:30,rotation:-7},{y:-20,rotation:3,ease:'none',scrollTrigger:{trigger:'.myth',start:'top bottom',end:'bottom top',scrub:1}});
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
