import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
interface CraftOptions {isPaused:()=>boolean;refresh:(fn:()=>void)=>void;}
export function initCraft({isPaused,refresh}:CraftOptions){
 const root=document.querySelector<HTMLElement>('[data-services]');
 if(root){
  const details=Array.from(root.querySelectorAll<HTMLDetailsElement>('[data-service]'));
  const triggers=details.map(item=>item.querySelector<HTMLElement>('summary')!);
  const moving=new Map<HTMLDetailsElement,{tween:gsap.core.Tween;open:boolean}>();
  root.closest('.services-studio')?.classList.add('services-ready');
  let refreshFrame=0;
  const reflow=()=>{if(!refreshFrame)refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;ScrollTrigger.refresh();});};
  const complete=(item:HTMLDetailsElement,open:boolean)=>{
   item.open=open;const content=item.querySelector<HTMLElement>('.service-detail')!;
   gsap.set(content,{clearProps:'height,overflow'});content.inert=!open;moving.delete(item);reflow();
  };
  const setOpen=(item:HTMLDetailsElement,open:boolean)=>{
   const content=item.querySelector<HTMLElement>('.service-detail')!,trigger=item.querySelector('summary')!;
   const height=item.open?content.getBoundingClientRect().height:0;
   moving.get(item)?.tween.kill();moving.delete(item);
   trigger.setAttribute('aria-expanded',String(open));item.classList.toggle('is-current',open);content.inert=!open;
   if(isPaused()){complete(item,open);return;}
   if(!item.open&&!open){complete(item,false);return;}
   item.open=true;gsap.set(content,{height:'auto',overflow:'hidden'});
   const target=open?content.getBoundingClientRect().height:0;
   const tween=gsap.fromTo(content,{height},{height:target,duration:open?.44:.32,ease:'power3.out',overwrite:true,onComplete:()=>complete(item,open)});
   moving.set(item,{tween,open});
  };
  details.forEach((item,i)=>{
   item.classList.toggle('is-current',item.open);triggers[i].setAttribute('aria-expanded',String(item.open));item.querySelector<HTMLElement>('.service-detail')!.inert=!item.open;
   triggers[i].addEventListener('click',event=>{
    event.preventDefault();const open=triggers[i].getAttribute('aria-expanded')!=='true';
    details.forEach(other=>{if(other!==item&&(other.open||moving.has(other)))setOpen(other,false);});setOpen(item,open);
   });
   triggers[i].addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    const keys:Record<string,number>={ArrowDown:(i+1)%triggers.length,ArrowUp:(i-1+triggers.length)%triggers.length,Home:0,End:triggers.length-1};
    if(event.key in keys){event.preventDefault();triggers[keys[event.key]].focus();}
   });
  });
  const settle=()=>{for(const [item,state]of Array.from(moving)){state.tween.kill();complete(item,state.open);}};
  refresh(()=>{if(isPaused())settle();});addEventListener('resize',settle);
 }
 // A single measured light follows the pointer/focus and returns to the route.
 // CSS owns its transition; no per-frame pointer loop or competing GSAP transform.
 document.querySelectorAll<HTMLElement>('[data-nav-surface]').forEach(nav=>{
  const light=document.createElement('span');light.className='navigation-glide';light.setAttribute('aria-hidden','true');nav.prepend(light);
  let hovered:HTMLElement|null=null,frame=0;
  const paint=()=>{
   frame=0;const focused=nav.contains(document.activeElement)?(document.activeElement as HTMLElement).closest<HTMLElement>('[data-navigation-link]'):null;
   const target=focused||hovered||nav.querySelector<HTMLElement>('[aria-current]');
   if(!target||!nav.getClientRects().length){light.style.opacity='0';return;}
   const n=nav.getBoundingClientRect(),r=target.getBoundingClientRect();
   light.style.setProperty('--nav-x',`${r.left-n.left+nav.scrollLeft}px`);light.style.setProperty('--nav-y',`${r.top-n.top+nav.scrollTop}px`);light.style.width=r.width+'px';light.style.height=r.height+'px';light.style.opacity='1';
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  nav.addEventListener('pointerover',event=>{hovered=(event.target as Element).closest<HTMLElement>('[data-navigation-link]');schedule();});
  nav.addEventListener('pointerleave',()=>{hovered=null;schedule();});nav.addEventListener('focusin',schedule);nav.addEventListener('focusout',schedule);
  new ResizeObserver(schedule).observe(nav);new MutationObserver(schedule).observe(nav,{subtree:true,attributes:true,attributeFilter:['aria-current']});
  const dialog=nav.closest('dialog');if(dialog)new MutationObserver(schedule).observe(dialog,{attributes:true,attributeFilter:['open']});schedule();
 });
}
