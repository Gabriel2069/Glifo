import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
interface EditorialOptions {isPaused:()=>boolean;refresh:(callback:()=>void)=>void;}
/** One owner for each new scenic wrapper. Text/marks keep their existing owners. */
export function initEditorial({isPaused,refresh}:EditorialOptions){
 const animations:gsap.core.Animation[]=[];
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 if(!reduce.matches){
  // A full-width exhibit opens from a narrow horizontal aperture. No scroll capture.
  const exhibit=document.querySelector<HTMLElement>('.editorial-home .collection-panels');
  if(exhibit){
   exhibit.classList.add('scene-aperture');
   animations.push(gsap.fromTo(exhibit,{clipPath:'inset(9% 5% 9% 5%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.25,ease:'power3.inOut',scrollTrigger:{trigger:exhibit,start:'top 88%',once:true},clearProps:'clipPath'}));
  }
  // The case's cover is a landscape in its own right; art remains contained.
  const cover=document.querySelector<HTMLElement>('.case-study .case-opening>.case-project-visual');
  if(cover){
   cover.classList.add('scene-aperture');
   animations.push(gsap.fromTo(cover,{clipPath:'inset(0% 6% 0% 6%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:cover,start:'top 92%',end:'top 20%',scrub:.7}}));
  }
  // The silver clearing arrives as a surface, its paragraphs stay whole.
  const passage=document.querySelector<HTMLElement>('.editorial-passage .signal-passage');
  if(passage)animations.push(gsap.fromTo(passage,{y:35},{y:0,ease:'none',scrollTrigger:{trigger:passage,start:'top bottom',end:'top 55%',scrub:.7}}));
  document.querySelectorAll<HTMLElement>('.identity-directory-art').forEach(plate=>{
   animations.push(gsap.fromTo(plate,{clipPath:'inset(5% 3% 5% 3%)',opacity:.5},{clipPath:'inset(0% 0% 0% 0%)',opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:plate,start:'top 94%',once:true},clearProps:'clipPath,opacity'}));
  });
 }
 refresh(()=>{if(isPaused()){animations.forEach(animation=>{animation.progress(1);animation.scrollTrigger?.disable(false);});}});
 ScrollTrigger.refresh();
}
