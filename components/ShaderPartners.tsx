'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Linkedin} from 'lucide-react';
import {partners} from '@/data/partners';
import {StaggerText,LetterSwap} from './ui/TextEffects';

export default function ShaderPartners({onContact}:{onContact:()=>void}){
 const root=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState(0);
 useEffect(()=>{
  const element=root.current;if(!element)return;
  let frame=0;
  const update=()=>{
   frame=0;
   const panels=Array.from(element.querySelectorAll<HTMLElement>('.shader-partner-copy'));
   const readingLine=innerHeight*.52;
   let nearest=0,distance=Infinity;
   panels.forEach((panel,index)=>{const bounds=panel.getBoundingClientRect();const d=Math.abs(bounds.top+bounds.height*.5-readingLine);if(d<distance){distance=d;nearest=index;}});
   setActive(nearest);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const observer=new ResizeObserver(schedule);observer.observe(element);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
 },[]);
 return <section className="partners section shader-partners calm-partners" id="partners"><div className="section-heading"><h2><StaggerText text="Three minds."/><br/><em><StaggerText text="One vision."/></em></h2><p>Meet the people<br/>behind your next chapter.</p></div><div className="shader-partner-layout" ref={root}><div className="shader-portrait calm-portrait" aria-hidden="true">{partners.map((p,i)=><img key={p.name} src={p.photo} alt="" className={active===i?'portrait-active':''} loading="eager"/>)}<span className="portrait-name">{partners[active].name}</span></div><div className="shader-partner-stories">{partners.map((p,i)=><article className="shader-partner-copy" key={p.name}><div className="partner-mobile-photo"><img src={p.photo} alt={p.name} loading="lazy"/></div><span className="partner-index">0{i+1} / {p.role}</span><h3>{p.name}</h3><p>{p.bio}</p><p className="partner-specialty">{p.specialty}</p>{p.background?<p className="partner-background">{p.background}</p>:null}<div className="partner-profile-links">{p.portfolio?<a href={p.portfolio} target="_blank" rel="noopener noreferrer" className="partner-big-link" aria-label={`Explore ${p.name}'s portfolio`}><LetterSwap text="Explore portfolio"/> <ArrowUpRight/></a>:<button onClick={onContact} className="partner-big-link">Let’s collaborate <ArrowUpRight/></button>}<a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="partner-linkedin" aria-label={`Open ${p.name}'s LinkedIn profile`}><Linkedin size={20}/>LinkedIn<ArrowUpRight size={17}/></a></div></article>)}</div></div></section>;
}
