'use client';
// Adapted from Clément Grellier's gradientslider (MIT); see THIRD_PARTY_NOTICES.md.
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight} from 'lucide-react';
import {services} from '@/data/services';
import {StaggerText,MorphText,LetterSwap} from './ui/TextEffects';
import {siteTheme,blend as blendColor,rgb} from '@/data/theme';
const photos=['/services/reels.svg','/services/posts.svg','/services/handling.svg','/services/shooting.svg','/services/optimization.svg','/services/thumbnails.svg'];
export default function ServiceCarousel({onContact}:{onContact:()=>void}){
 const stage=useRef<HTMLDivElement>(null),cards=useRef<(HTMLDivElement|null)[]>([]),background=useRef<HTMLCanvasElement>(null),controller=useRef<(step:number,absolute?:boolean)=>void>(()=>{});
 const [active,setActive]=useState(0);
 useEffect(()=>{
  const element=stage.current;
  if(!element)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count=services.length;
  // The reference's perspective, 28px gap, rotation and depth, with gentler input.
  const palettes=services.map((_,i)=>[
   blendColor(siteTheme.surface,siteTheme.brand,[.17,.11,.14,.12,.19,.1][i]),
   blendColor(siteTheme.surface,siteTheme.accent,[.08,.15,.1,.14,.06,.18][i]),
  ]);
  let colors=palettes[0].map(color=>[...color]);
  let step=388,cardWidth=360,width=1,height=1,position=0,velocity=0;
  let destination:number|null=null,frame=0,lastFrame=0,lastBackground=0;
  let dragging=false,lastX=0,lastPointer=0,releaseVelocity=0;
  let wheelActive=false,wheelDirection=0,wheelTimer:ReturnType<typeof setTimeout>|undefined;
  let lastPosition=NaN,lastEntry=-1;
  let visible=false,selected=-1,entryStart:number|null=null,dirty=true;
  const mod=(n:number,m:number)=>((n%m)+m)%m;
  const canvas=background.current,ctx=canvas?.getContext('2d',{alpha:false});

  function render(time:number,dt:number){
   const track=step*count;
   let index=Math.max(0,selected),nearest=Infinity;
   const entry=reduced?1:Math.min(1,Math.max(0,(time-(entryStart??time))/850));
   const enter=1-Math.pow(1-entry,3);
   const changed=dirty||!Number.isFinite(lastPosition)||Math.abs(position-lastPosition)>.001||enter!==lastEntry;
   if(changed)cards.current.forEach((card,i)=>{
    if(!card)return;
    const x=mod(i*step-position+track/2,track)-track/2;
    const norm=Math.max(-1,Math.min(1,x/(width*.5))),focus=1-Math.abs(norm);
    const depth=reduced?0:focus*140;
    const scale=reduced?1:.92+focus*.1*enter;
    card.style.transform=`translate3d(${x-cardWidth/2}px,calc(-50% + ${(1-enter)*40}px),${depth}px) rotateY(${reduced?0:-norm*28}deg) scale(${scale})`;
    card.style.zIndex=String(1000+Math.round(depth));
    card.style.visibility=Math.abs(x)>width*.5+step?'hidden':'visible';
    if(Math.abs(x)<nearest){nearest=Math.abs(x);index=i;}
   });
   if(changed){lastPosition=position;lastEntry=enter;}
   if(index!==selected){selected=index;setActive(index);dirty=true;}
   if(!canvas||!ctx)return;
   const moving=dragging||destination!==null||Math.abs(velocity)>1;
   if(!dirty&&time-lastBackground<(moving?16:33))return;
   const blend=reduced?1:1-Math.exp(-Math.max(dt,time-lastBackground)/380);
   colors=colors.map((color,k)=>color.map((v,j)=>v+(palettes[index][k][j]-v)*blend));
   lastBackground=time;dirty=false;
   ctx.fillStyle=siteTheme.surface;ctx.fillRect(0,0,canvas.width,canvas.height);
   const t=reduced?0:time*.00016;
   colors.forEach((color,k)=>{
    const x=canvas.width*(.5+Math.cos(t*(k?-.9:1)+k*1.2)*.24);
    const y=canvas.height*(.5+Math.sin(t*(k?-.7:.8)+k*.7)*.16);
    const gradient=ctx.createRadialGradient(x,y,0,x,y,Math.max(canvas.width,canvas.height)*(k?.65:.75));
    gradient.addColorStop(0,`rgba(${color.map(Math.round).join(',')},${k?.7:.85})`);
    gradient.addColorStop(1,`rgba(${rgb(siteTheme.surface).join(',')},0)`);
    ctx.fillStyle=gradient;ctx.fillRect(0,0,canvas.width,canvas.height);
   });
  }
  function tick(time:number){
   frame=0;
   if(!visible||document.hidden)return;
   const dt=Math.min(50,lastFrame?time-lastFrame:16.67);lastFrame=time;
   if(destination!==null){
    position+=reduced?destination-position:(destination-position)*(1-Math.exp(-dt/(wheelActive?85:150)));
    if(Math.abs(destination-position)<.1){position=destination;destination=null;}
   }else if(!dragging){
    position+=velocity*dt/1000;velocity*=Math.pow(.9,dt/16.67);
    if(Math.abs(velocity)<.5)velocity=0;
   }
   if(destination===null)position=mod(position,step*count);
   render(time,dt);
   if(!reduced)frame=requestAnimationFrame(tick);
  }
  function wake(){if(visible&&!document.hidden&&!frame){lastFrame=0;frame=requestAnimationFrame(tick);}}
  const resize=()=>{
   const old=step;cardWidth=cards.current[0]?.offsetWidth||360;step=cardWidth+28;
   position=position/old*step;if(destination!==null)destination=destination/old*step;
   width=element.clientWidth;height=element.clientHeight;
   // Soft gradients need no full-resolution canvas; cards remain native and sharp.
   if(canvas){canvas.width=Math.max(1,Math.round(width*.65));canvas.height=Math.max(1,Math.round(height*.65));}
   dirty=true;render(performance.now(),16.67);wake();
  };
  controller.current=(direction,absolute=false)=>{
   if(wheelTimer)clearTimeout(wheelTimer);wheelActive=false;wheelDirection=0;
   velocity=0;const base=Math.round((destination??position)/step);
   const delta=absolute?mod(direction-mod(base,count)+count/2,count)-count/2:direction;
   destination=(base+delta)*step;wake();
  };
  const down=(e:PointerEvent)=>{
   if(e.button!==0||!e.isPrimary)return;
   if(wheelTimer)clearTimeout(wheelTimer);wheelActive=false;wheelDirection=0;
   dragging=true;velocity=releaseVelocity=0;destination=null;
   lastX=e.clientX;lastPointer=performance.now();element.setPointerCapture(e.pointerId);
   element.classList.add('is-dragging');wake();
  };
  const drag=(e:PointerEvent)=>{
   if(!dragging)return;
   const time=performance.now(),dx=(e.clientX-lastX)*.9;
   position-=dx;releaseVelocity=Math.max(-2200,Math.min(2200,-dx/Math.max(8,time-lastPointer)*1000));
   lastX=e.clientX;lastPointer=time;
   if(reduced){dirty=true;render(time,16.67);}
  };
  const release=(e:PointerEvent)=>{
   if(!dragging)return;
   dragging=false;element.classList.remove('is-dragging');
   if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);
   const momentum=e.type==='pointerup'&&performance.now()-lastPointer<90?Math.max(-step*.3,Math.min(step*.3,releaseVelocity*.08)):0;
   destination=Math.round((position+momentum)/step)*step;velocity=0;
   wake();
  };
  const wheel=(e:WheelEvent)=>{
   if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)&&!e.shiftKey)return;
   e.preventDefault();e.stopPropagation();
   const raw=(e.deltaX||e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?width:1);
   const delta=Math.max(-step*.8,Math.min(step*.8,raw*.65));
   if(!delta)return;
   // Every wheel event contributes. Reversing cancels the old target immediately.
   const direction=Math.sign(delta);
   if(!wheelActive||direction!==wheelDirection)destination=position;
   wheelDirection=direction;wheelActive=true;velocity=0;
   destination=(destination??position)+delta;
   if(wheelTimer)clearTimeout(wheelTimer);
   wheelTimer=setTimeout(()=>{
    wheelActive=false;wheelDirection=0;
    destination=Math.round((destination??position)/step)*step;
    wake();
   },180);
   wake();
  };
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;velocity=0;}else wake();};
  const ro=new ResizeObserver(resize);ro.observe(element);
  const io=new IntersectionObserver(([e])=>{
   visible=e.isIntersecting;
   if(visible){if(entryStart===null)entryStart=performance.now();dirty=true;wake();}
   else{cancelAnimationFrame(frame);frame=0;velocity=0;}
  },{threshold:.05});io.observe(element);
  resize();
  element.addEventListener('pointerdown',down);element.addEventListener('pointermove',drag);
  element.addEventListener('pointerup',release);element.addEventListener('pointercancel',release);
  element.addEventListener('lostpointercapture',release);element.addEventListener('wheel',wheel,{passive:false});
  document.addEventListener('visibilitychange',visibility);
  return()=>{
   cancelAnimationFrame(frame);if(wheelTimer)clearTimeout(wheelTimer);ro.disconnect();io.disconnect();controller.current=()=>{};
   element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',drag);
   element.removeEventListener('pointerup',release);element.removeEventListener('pointercancel',release);
   element.removeEventListener('lostpointercapture',release);element.removeEventListener('wheel',wheel);
   document.removeEventListener('visibilitychange',visibility);
  };
 },[]);
 const service=services[active];
 return <section className="deliverables" id="services" aria-labelledby="deliverables-title"><div className="deliverables-heading"><span>What we do</span><h2 id="deliverables-title"><StaggerText text="A fresh angle."/><br/><em><StaggerText text="For every story."/></em></h2><p>Explore what we can create together.</p></div><div className="gradient-carousel" ref={stage} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Our six services. Use left and right arrow keys to browse." onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();controller.current(e.key==='ArrowRight'?1:-1);}}}><canvas ref={background} className="carousel-gradient" aria-hidden="true"/><div className="gradient-cards" aria-hidden="true">{services.map((s,i)=><div className="gradient-card" key={s.short} ref={el=>{cards.current[i]=el;}}><img src={photos[i]} alt="" draggable={false} decoding="async" loading="lazy" width={800} height={1000}/><div className="gradient-card-label"><span>0{i+1}</span><strong>{s.short}</strong></div></div>)}</div><div className="carousel-hint">Drag to explore</div></div><div className="carousel-toolbar"><button aria-label="Previous service" onClick={()=>controller.current(-1)}><ArrowLeft/></button><div className="carousel-dots">{services.map((s,i)=><button key={s.short} onClick={()=>controller.current(i,true)} aria-label={`Show ${s.short}`} aria-pressed={active===i}><span/></button>)}</div><button aria-label="Next service" onClick={()=>controller.current(1)}><ArrowRight/></button></div><div className="deliverable-details" aria-live="polite" aria-atomic="true"><div><span className="deliverable-index">0{active+1} / 06</span><h3><MorphText text={service.title}/></h3></div><div><p>{service.text}</p><ul>{service.tags.map(t=><li key={t}>{t}</li>)}</ul><button className="deliverable-cta" onClick={onContact}><LetterSwap text="Start a project"/> <ArrowUpRight size={20}/></button></div></div></section>;
}
