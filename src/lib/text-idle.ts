// Start text motion only when its full line is readable and page motion has
// stopped. Scroll events include the smooth-scroll easing tail, not just input.
export function animateAfterScrollIdle(element:HTMLElement,play:()=>Animation[],pause=120){
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches||!element.animate||!('IntersectionObserver' in window))return()=>{};
 let timer:ReturnType<typeof setTimeout>|undefined,animations:Animation[]=[];
 let inView=false,complete=false,disposed=false,generation=0;
 function cancel(){
  generation++;
  if(timer)clearTimeout(timer);timer=undefined;
  animations.forEach(animation=>animation.cancel());animations=[];
 }
 function readable(){
  const rect=element.getBoundingClientRect();
  const header=document.querySelector('header')?.getBoundingClientRect().bottom??0;
  return rect.width>0&&rect.height>0&&rect.top>=header+6&&rect.bottom<=innerHeight-24;
 }
 function start(){
  timer=undefined;
  if(disposed||complete||!inView||document.hidden||!readable())return;
  const token=++generation;
  animations=play();
  Promise.allSettled(animations.map(animation=>animation.finished)).then(()=>{
   if(disposed||token!==generation)return;
   complete=true;animations=[];detach();observer.disconnect();
  });
 }
 function schedule(){
  if(disposed||complete)return;
  cancel();
  if(inView&&!document.hidden)timer=setTimeout(start,pause);
 }
 const observer=new IntersectionObserver(entries=>{
  inView=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.6);
  schedule();
 },{threshold:[0,.6,.85,1]});
 const hidden=()=>schedule();
 const changed=()=>{if(preference.matches){cancel();detach();observer.disconnect();}};
 function detach(){
  window.removeEventListener('scroll',schedule);
  window.removeEventListener('wheel',schedule);
  window.removeEventListener('touchmove',schedule);
  window.removeEventListener('resize',schedule);
  document.removeEventListener('visibilitychange',hidden);
  preference.removeEventListener('change',changed);
 }
 observer.observe(element);
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('wheel',schedule,{passive:true});
 window.addEventListener('touchmove',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 document.addEventListener('visibilitychange',hidden);
 preference.addEventListener('change',changed);
 return()=>{disposed=true;cancel();observer.disconnect();detach();};
}
