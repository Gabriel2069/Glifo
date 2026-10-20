import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
interface SpatialOptions{isPaused:()=>boolean;refresh:(callback:()=>void)=>void;}
export function initSpatial({isPaused,refresh}:SpatialOptions){
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 // The assembly is a new transform owner; the mark and its constellation keep theirs.
 document.querySelectorAll<HTMLElement>('[data-celestial-lens]').forEach(root=>{
  const plane=root.querySelector<HTMLElement>('[data-lens-assembly]')!,range=root.querySelector<HTMLInputElement>('[data-lens-angle]')!,value=root.querySelector<HTMLOutputElement>('[data-lens-value]')!;
  if(!plane||!range)return;root.classList.add('spatial-ready');
  let visible=false,manual=false;
  const x=gsap.quickTo(plane,'--lens-x',{duration:.8,ease:'power3.out'}),y=gsap.quickTo(plane,'--lens-y',{duration:.8,ease:'power3.out'});
  const settle=()=>{x.tween.pause();y.tween.pause();gsap.set(plane,{'--lens-x':0,'--lens-y':0});};
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible)settle();else if(manual&&!isPaused()){x(Number(range.value));y(0);}}).observe(root);
  root.addEventListener('pointermove',event=>{
   if(isPaused()||document.hidden||!visible||!fine.matches||manual||event.pointerType!=='mouse'||(event.target as Element).closest('button,input'))return;
   const r=root.getBoundingClientRect();x(((event.clientX-r.left)/r.width-.5)*12);y(((event.clientY-r.top)/r.height-.5)*-10);
  });
  root.addEventListener('pointerleave',()=>{if(!manual){x(0);y(0);}});
  range.addEventListener('input',()=>{
   manual=Number(range.value)!==0;value.textContent=range.value+'°';
   if(isPaused())return;x(Number(range.value));y(0);
  });
  const synchronize=()=>{range.disabled=isPaused();if(isPaused()){manual=false;range.value='0';value.textContent='0°';settle();}};
  refresh(synchronize);synchronize();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
 });
 // One finite lighting entrance per chapter; text itself is never split or dimmed.
 const accents=document.querySelectorAll<HTMLElement>('.myth-theatre,.project-cosmos,.archive-section,.contact-section');
 const lights:gsap.core.Tween[]=[];
 accents.forEach(section=>{
  const light=document.createElement('span');light.className='chapter-light';light.setAttribute('aria-hidden','true');section.prepend(light);
  if(!isPaused()){
   lights.push(gsap.fromTo(light,{opacity:0,scale:.82},{opacity:1,scale:1,duration:1.5,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 85%',once:true}}));
  }
 });
 refresh(()=>{if(isPaused())lights.forEach(t=>{t.progress(1);t.scrollTrigger?.disable(false);});});
 const cosmos=document.querySelector<HTMLElement>('[data-project-cosmos]');
 if(cosmos){
  const chart=cosmos.querySelector<HTMLElement>('.cosmos-chart'),points=Array.from(cosmos.querySelectorAll<HTMLButtonElement>('[data-cosmos-point]'));
  const move=()=>{const i=points.findIndex(p=>p.getAttribute('aria-pressed')==='true');const positions=[[18,32],[47,19],[78,34],[24,74],[55,68],[83,77]],p=positions[Math.max(0,i)];if(chart)gsap.to(chart,{'--relation-x':p[0]+'%','--relation-y':p[1]+'%',duration:isPaused()?0:1,overwrite:true,ease:'power3.inOut'});};
  const observer=new MutationObserver(move);points.forEach(p=>observer.observe(p,{attributes:true,attributeFilter:['aria-pressed']}));move();
 }
 // Native pointer feedback is on a separate child from existing image and orbit owners.
 document.querySelectorAll<HTMLElement>('.project-art').forEach(art=>{
  const shimmer=document.createElement('span');shimmer.className='material-light';shimmer.setAttribute('aria-hidden','true');art.append(shimmer);
  let tick=0,px=50,py=50;
  const draw=()=>{tick=0;shimmer.style.setProperty('--material-x',px+'%');shimmer.style.setProperty('--material-y',py+'%');};
  art.addEventListener('pointermove',event=>{if(isPaused()||!fine.matches||event.pointerType!=='mouse')return;const r=art.getBoundingClientRect();px=(event.clientX-r.left)/r.width*100;py=(event.clientY-r.top)/r.height*100;if(!tick)tick=requestAnimationFrame(draw);});
  art.addEventListener('pointerleave',()=>{if(tick)cancelAnimationFrame(tick);tick=0;});
 });
 ScrollTrigger.refresh();
}
