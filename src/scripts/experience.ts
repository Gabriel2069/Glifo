import gsap from 'gsap';
interface ExperienceOptions {
 isPaused:()=>boolean;
 refresh:(fn:()=>void)=>void;
 rotate:(root:HTMLElement|null,period:number,next:()=>void)=>void;
}
export function initExperience({isPaused,refresh,rotate}:ExperienceOptions){
 const stage=document.querySelector<HTMLElement>('[data-myth-stage]');
 const instrument=stage?.querySelector<HTMLElement>('[data-glyph-instrument]');
 if(stage&&instrument){
  const buttons=Array.from(instrument.querySelectorAll<HTMLButtonElement>('[data-glyph-phase]'));
  const paths=Array.from(instrument.querySelectorAll<SVGPathElement>('.glyph-connections path'));
  const lengths=paths.map(path=>path.getTotalLength());
  let manual=false,current=-1,transition:gsap.core.Timeline|undefined,returnToReading:ReturnType<typeof setTimeout>|undefined;
  const show=(index:number)=>{
   if(current===index)return;current=index;transition?.progress(1).kill();
   instrument.dataset.glyphPhase=String(index);
   buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
   instrument.querySelector('[data-glyph-caption]')!.textContent=['Um ponto ainda não conta a figura.','A relação permite reconhecer um desenho.','Um desenho passa a carregar uma mensagem.'][index];
   const duration=isPaused()?0:.9;
   transition=gsap.timeline({defaults:{duration,ease:'power3.inOut'}})
    .to(instrument.querySelector('.glyph-resolved'),{opacity:index===2?1:0,y:index===2?0:16},0)
    .to(instrument.querySelector('.glyph-fragments'),{opacity:index===1?.6:0,y:index===1?0:12},0)
    .to(instrument.querySelector('.glyph-dots'),{opacity:index===2?.12:1},0)
    .to(instrument.querySelector('.glyph-coordinate-notes'),{opacity:index===0?.65:0},0)
    .to(instrument.querySelector('.glyph-perimeter'),{opacity:index===2?.4:1},0);
   paths.forEach((path,i)=>transition!.to(path,{strokeDasharray:lengths[i],strokeDashoffset:index===0?lengths[i]:0,opacity:index===2?.18:1},i*.07));
  };
  buttons.forEach((button,i)=>button.addEventListener('click',()=>{manual=true;clearTimeout(returnToReading);show(i);returnToReading=setTimeout(()=>{manual=false;show(Number(stage.dataset.phase)||0);},8000);}));
  new MutationObserver(()=>{if(!manual)show(Number(stage.dataset.phase)||0);}).observe(stage,{attributes:true,attributeFilter:['data-phase']});
  refresh(()=>{if(isPaused())transition?.progress(1);});show(Number(stage.dataset.phase)||0);
 }
 const cosmos=document.querySelector<HTMLElement>('[data-project-cosmos]');
 if(cosmos){
  const points=Array.from(cosmos.querySelectorAll<HTMLButtonElement>('[data-cosmos-point]'));
  const panels=Array.from(cosmos.querySelectorAll<HTMLElement>('[data-cosmos-panel]'));
  const rays=Array.from(cosmos.querySelectorAll<SVGPathElement>('[data-cosmos-ray]'));
  let transition:gsap.core.Timeline|undefined,current=-1;
  const settle=()=>{transition?.progress(1).kill();gsap.set(panels,{clearProps:'opacity,transform'});};
  const select=(index:number)=>{
   if(index===current)return;current=index;settle();
   points.forEach((point,i)=>{point.setAttribute('aria-pressed',String(i===index));panels[i].hidden=i!==index;rays[i].classList.toggle('is-active',i===index);});
   if(!isPaused()){
    const ray=rays[index],length=ray.getTotalLength();
    transition=gsap.timeline({onComplete:()=>gsap.set(panels[index],{clearProps:'opacity,transform'})})
     .fromTo(ray,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.8,ease:'power2.inOut'},0)
     .fromTo(panels[index],{opacity:.4,y:14},{opacity:1,y:0,duration:.65,ease:'power3.out'},.1);
   }
  };
  points.forEach((point,i)=>point.addEventListener('click',()=>select(i)));
  refresh(()=>{if(isPaused())settle();});select(0);rotate(cosmos,5400,()=>select((current+1)%points.length));
 }
 const desk=document.querySelector<HTMLElement>('[data-editorial-desk]');
 if(desk){
  const sheets=Array.from(desk.querySelectorAll<HTMLElement>('[data-editorial-sheet]'));
  const buttons=Array.from(desk.querySelectorAll<HTMLButtonElement>('[data-editorial-choice]'));
  const range=desk.querySelector<HTMLInputElement>('[data-editorial-range]')!;
  let current=0,transition:gsap.core.Tween|undefined;
  const settle=()=>{transition?.progress(1).kill();gsap.set(sheets,{clearProps:'opacity,transform'});};
  const select=(index:number)=>{
   if(index===current)return;settle();current=index;range.value=String(index+1);
   sheets.forEach((sheet,i)=>{sheet.hidden=i!==index;buttons[i].setAttribute('aria-pressed',String(i===index));});
   desk.querySelector('[data-editorial-counter]')!.textContent=`0${index+1} / 0${sheets.length}`;
   if(!isPaused())transition=gsap.fromTo(sheets[index],{opacity:.4,y:12},{opacity:1,y:0,duration:.5,ease:'power3.out',onComplete:()=>gsap.set(sheets[index],{clearProps:'opacity,transform'})});
  };
  range.addEventListener('input',()=>select(Number(range.value)-1));
  buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i)));
  refresh(()=>{if(isPaused())settle();});
 }
 document.querySelectorAll<HTMLElement>('[data-type-lab]').forEach(lab=>{
  const trial=lab.querySelector<HTMLTextAreaElement>('[data-type-trial]')!;
  const size=lab.querySelector<HTMLInputElement>('[data-type-size]')!;
  const options=Array.from(lab.querySelectorAll<HTMLButtonElement>('[data-type-family]'));
  options.forEach(button=>button.addEventListener('click',()=>{
   options.forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
   trial.style.fontFamily=`"${button.dataset.typeFamily}", serif`;trial.style.fontWeight=button.dataset.typeWeight!;
   lab.querySelector<HTMLElement>('.identity-lab-heading [data-type-name]')!.textContent=button.dataset.typeName!;
  }));
  size.addEventListener('input',()=>{trial.style.fontSize=`${size.value}px`;lab.querySelector('[data-type-size-value]')!.textContent=`${size.value} px`;});
  lab.querySelector<HTMLButtonElement>('[data-type-reset]')!.addEventListener('click',event=>{trial.value=(event.currentTarget as HTMLButtonElement).dataset.typeOriginal!;trial.focus();});
 });
 document.querySelectorAll<HTMLElement>('[data-color-lab]').forEach(lab=>{
  const composition=lab.querySelector<HTMLElement>('[data-color-composition]')!;
  const buttons=Array.from(lab.querySelectorAll<HTMLButtonElement>('[data-color-trial]'));
  const select=(button:HTMLButtonElement)=>{
   const hex=button.dataset.colorTrial!;
   const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
   const luminance=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
   composition.style.backgroundColor=hex;composition.style.color=luminance>.179?'#090C12':'#FFFFFF';
   buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
   lab.querySelector('[data-color-selection]')!.textContent=`${button.dataset.colorName} / ${hex}`;
  };
  buttons.forEach(button=>button.addEventListener('click',()=>select(button)));select(buttons[0]);
 });
 // Each document tracks its own chapters, including the two boards in Acolher.
 document.querySelectorAll<HTMLElement>('.identity-board').forEach(board=>{
  const links=Array.from(board.querySelectorAll<HTMLAnchorElement>('.identity-local-nav a'));
  const sections=links.map(link=>document.getElementById(link.hash.slice(1))).filter((section):section is HTMLElement=>Boolean(section));
  let scheduled=false;
  const update=()=>{scheduled=false;let active=0;sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<innerHeight*.4)active=i;});links.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});};
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});update();
 });
}
