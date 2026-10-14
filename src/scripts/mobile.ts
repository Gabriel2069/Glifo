// Native horizontal shelves keep reading and touch scrolling under browser control.
export const phoneLayout=matchMedia('(max-width:760px)');
export function keepSelectedTabVisible(tab:HTMLElement){
 if(!phoneLayout.matches)return;
 const track=tab.parentElement;if(!track)return;
 const item=tab.getBoundingClientRect(),bounds=track.getBoundingClientRect();
 if(item.left<bounds.left||item.right>bounds.right){
  track.scrollTo({left:track.scrollLeft+item.left-bounds.left-(bounds.width-item.width)/2,behavior:'instant'});
 }
}
export function initMobileShelves(isPaused:()=>boolean){
 document.querySelectorAll<HTMLElement>('[data-mobile-shelf]').forEach(track=>{
  const nav=document.querySelector<HTMLElement>(`[data-shelf-navigation="${track.id}"]`);
  if(!nav)return;
  const previous=nav.querySelector<HTMLButtonElement>('[data-shelf-prev]')!;
  const next=nav.querySelector<HTMLButtonElement>('[data-shelf-next]')!;
  const count=nav.querySelector<HTMLElement>('[data-shelf-count]')!;
  const items=Array.from(track.children) as HTMLElement[];
  let frame=0;
  const selected=()=>{
   const origin=track.getBoundingClientRect().left+parseFloat(getComputedStyle(track).paddingLeft);
   return items.reduce((best,item,i)=>Math.abs(item.getBoundingClientRect().left-origin)<Math.abs(items[best].getBoundingClientRect().left-origin)?i:best,0);
  };
  const update=()=>{
   frame=0;const index=selected();
   count.textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
   previous.disabled=track.scrollLeft<=2;
   next.disabled=track.scrollWidth-track.clientWidth-track.scrollLeft<=2;
  };
  const move=(delta:number)=>{
   const index=Math.max(0,Math.min(items.length-1,selected()+delta));
   const bounds=track.getBoundingClientRect(),padding=parseFloat(getComputedStyle(track).paddingLeft);
   track.scrollTo({left:track.scrollLeft+items[index].getBoundingClientRect().left-bounds.left-padding,behavior:isPaused()?'instant':'smooth'});
  };
  previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});
  track.addEventListener('keydown',event=>{
   if(event.target!==track||!phoneLayout.matches)return;
   if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}
  });
  const resize=()=>{track.tabIndex=phoneLayout.matches?0:-1;nav.hidden=!phoneLayout.matches;update();};
  new ResizeObserver(resize).observe(track);phoneLayout.addEventListener('change',resize);resize();
 });
}
