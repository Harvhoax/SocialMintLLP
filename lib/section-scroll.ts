import type Lenis from 'lenis';
import type {VirtualScrollData} from 'lenis';

// Native input always reaches Lenis. A small, interruptible alignment may run
// only after the user's wheel movement and the smoothing animation have ended.
export function createSectionScroll(engine: Lenis) {
  let stops:number[]=[], direction=0, aligning=false, disposed=false;
  let timer:ReturnType<typeof setTimeout>|undefined, measureFrame=0;
  const top=(element:Element)=>element.getBoundingClientRect().top+window.scrollY;
  const clear=()=>{if(timer)clearTimeout(timer);timer=undefined;};
  function measure(){
    measureFrame=0;
    const height=innerHeight,limit=Math.max(0,document.documentElement.scrollHeight-height);
    const inset=(document.querySelector('header')?.getBoundingClientRect().bottom??84)+16;
    const values=[0,limit];
    const add=(value:number)=>values.push(Math.round(Math.max(0,Math.min(limit,value))));
    document.querySelectorAll<HTMLElement>('main > section, footer').forEach(section=>{
      const start=top(section),end=Math.max(start,start+section.offsetHeight-height);
      add(start);add(end);
      if(section.id==='services'){
        const gallery=section.querySelector('.gradient-carousel');
        if(gallery)add(Math.max(start,Math.min(end,top(gallery)-inset)));
      }
      if(section.id==='partners')section.querySelectorAll('.shader-partner-copy').forEach(profile=>{
        add(Math.max(start,Math.min(end,top(profile)+profile.getBoundingClientRect().height*.5-height*.52)));
      });
    });
    stops=[];
    values.sort((a,b)=>a-b).forEach(value=>{if(!stops.length||value-stops[stops.length-1]>70)stops.push(value);});
  }
  function scheduleMeasure(){if(!measureFrame)measureFrame=requestAnimationFrame(measure);}
  function settle(){
    timer=undefined;
    if(disposed||engine.isStopped||engine.isLocked||document.hidden||document.querySelector('dialog[open]'))return;
    if(engine.isScrolling||Math.abs(engine.velocity)>.15){timer=setTimeout(settle,100);return;}
    const current=engine.scroll;
    // Never pull against the last gesture, or travel to a distant section.
    const destination=stops.find(value=>Math.abs(value-current)>2&&Math.abs(value-current)<=40&&(value-current)*direction>0);
    if(destination===undefined)return;
    aligning=true;
    engine.scrollTo(destination,{duration:.32,easing:t=>1-Math.pow(1-t,3),lock:false,onComplete:()=>{aligning=false;}});
  }
  function cancelAlignment(){
    clear();
    if(aligning){aligning=false;engine.scrollTo(engine.scroll,{immediate:true});}
  }
  function onInput({deltaX,deltaY,event}:VirtualScrollData){
    cancelAlignment();
    // Finger scrolling remains native; no wheel events are prevented or dropped.
    if(event.type!=='wheel'||event.ctrlKey||Math.abs(deltaX)>Math.abs(deltaY)||event.shiftKey||!deltaY)return;
    direction=Math.sign(deltaY);
    timer=setTimeout(settle,420);
  }
  const observer=new ResizeObserver(scheduleMeasure);
  document.querySelectorAll('main > section,footer,header').forEach(element=>observer.observe(element));
  engine.on('virtual-scroll',onInput);
  window.addEventListener('resize',scheduleMeasure);
  window.addEventListener('pointerdown',cancelAlignment,{passive:true});
  window.addEventListener('keydown',cancelAlignment);
  document.fonts.ready.then(()=>{if(!disposed)scheduleMeasure();});
  measure();
  return {destroy(){
    disposed=true;clear();observer.disconnect();cancelAnimationFrame(measureFrame);
    engine.off('virtual-scroll',onInput);
    window.removeEventListener('resize',scheduleMeasure);
    window.removeEventListener('pointerdown',cancelAlignment);
    window.removeEventListener('keydown',cancelAlignment);
  }};
}
