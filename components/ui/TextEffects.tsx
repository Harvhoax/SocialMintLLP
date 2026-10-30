'use client';
// Original SocialMint effects, inspired by the requested animation directions.
import {useEffect,useLayoutEffect,useRef,useState,type CSSProperties,type RefObject} from 'react';
import {reconcileGlyphs,type Glyph} from '@/lib/text-motion';
import {animateAfterScrollIdle} from '@/lib/text-idle';

function useEntrance(ref:RefObject<HTMLSpanElement|null>,selector:string,variant:'stagger'|'vapor'|'ghost',delay=0,enabled=true){
 useEffect(()=>{
  const element=ref.current;if(!element||!enabled)return;
  const cleanup=animateAfterScrollIdle(element,()=>{
   const pieces=Array.from(element.querySelectorAll<HTMLElement>(selector));
   if(variant==='ghost')element.setAttribute('data-writing','true');
   const stagger=variant==='vapor'?32:variant==='ghost'?52:60;
   const duration=variant==='vapor'?1000:variant==='ghost'?200:650;
   const budget=variant==='ghost'?1200:440;
   const animations=pieces.map((piece,index)=>{
    const frames=variant==='vapor'
     ?[{opacity:0,filter:'blur(7px)',transform:`translate3d(${(index%3-1)*6}px,12px,0) scale(1.04)`},{opacity:1,filter:'blur(0px)',transform:'translate3d(0,0,0) scale(1)'}]
     :variant==='ghost'
      ?[{opacity:.22},{opacity:1}]
      :[{opacity:0,transform:'translate3d(0,.65em,0)'},{opacity:1,transform:'translate3d(0,0,0)'}];
    return piece.animate(frames,{duration,delay:delay+Math.min(index*stagger,budget),easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
   });
   Promise.allSettled(animations.map(animation=>animation.finished)).then(()=>element.removeAttribute('data-writing'));
   return animations;
  });
  return()=>{cleanup();element.removeAttribute('data-writing');};
 },[ref,selector,variant,delay,enabled]);
}

export function StaggerText({text,className=''}:{text:string;className?:string}){
 const ref=useRef<HTMLSpanElement>(null);useEntrance(ref,'.motion-piece','stagger');
 return <span ref={ref} className={`motion-stagger ${className}`}><span className="motion-sr">{text}</span><span aria-hidden="true">{text.split(/(\s+)/).map((word,i)=>/^\s+$/.test(word)?word:<span className="motion-word" key={i}><span className="motion-piece">{word}</span></span>)}</span></span>;
}

export function VaporText({text,delay=0,enabled=true}:{text:string;delay?:number;enabled?:boolean}){
 const ref=useRef<HTMLSpanElement>(null);useEntrance(ref,'.motion-letter','vapor',delay,enabled);
 return <span ref={ref} className="motion-vapor"><span className="motion-sr">{text}</span><span className="motion-word" aria-hidden="true">{Array.from(text).map((char,i)=><span className="motion-letter" key={i}>{char===' '?'\u00a0':char}</span>)}</span></span>;
}

export function GhostText({prefix,text}:{prefix:string;text:string}){
 const ref=useRef<HTMLSpanElement>(null);useEntrance(ref,'.ghost-letter','ghost');
 return <span ref={ref} className="motion-ghost"><span className="motion-sr">{prefix}{text}</span><span aria-hidden="true">{prefix}<span className="ghost-completion">{Array.from(text).map((char,i)=><span className="ghost-letter" key={i}>{char}</span>)}</span><span className="ghost-caret"/></span></span>;
}

export function LetterSwap({text}:{text:string}){
 return <span className="motion-swap"><span className="motion-sr">{text}</span><span aria-hidden="true">{Array.from(text).map((char,i)=><span className="swap-letter" style={{'--letter-delay':`${Math.min(i*18,180)}ms`} as CSSProperties} key={i}><span className="swap-front">{char===' '?'\u00a0':char}</span><span className="swap-back">{char===' '?'\u00a0':char}</span></span>)}</span></span>;
}

export function MorphText({text}:{text:string}){
 const [glyphs,setGlyphs]=useState<Glyph[]>(()=>Array.from(text).map((char,id)=>({char,id})));
 const root=useRef<HTMLSpanElement>(null);
 const nodes=useRef(new Map<number,HTMLSpanElement>()),oldBoxes=useRef(new Map<number,{left:number;top:number}>());
 const animations=useRef<Animation[]>([]),lastText=useRef(text);
 useLayoutEffect(()=>{
  if(text===lastText.current)return;
  const container=root.current?.getBoundingClientRect();
  oldBoxes.current=new Map(Array.from(nodes.current,([id,node])=>{const box=node.getBoundingClientRect();return [id,{left:box.left-(container?.left??0),top:box.top-(container?.top??0)}];}));
  animations.current.forEach(animation=>animation.cancel());animations.current=[];
  lastText.current=text;setGlyphs(previous=>reconcileGlyphs(previous,text));
 },[text]);
 useLayoutEffect(()=>{
  if(!oldBoxes.current.size)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){oldBoxes.current.clear();return;}
  const element=root.current;if(!element)return;
  const previousBoxes=new Map(oldBoxes.current);oldBoxes.current.clear();
  return animateAfterScrollIdle(element,()=>{
  const container=element.getBoundingClientRect();
  animations.current=[];
  for(const [id,node]of nodes.current){
   if(!node.animate)continue;
   const previous=previousBoxes.get(id),next=node.getBoundingClientRect();
   const from=previous?{transform:`translate(${previous.left-(next.left-container.left)}px,${previous.top-(next.top-container.top)}px)`,opacity:1}:{transform:'translate(0,.3em)',opacity:0};
   animations.current.push(node.animate([from,{transform:'translate(0,0)',opacity:1}],{duration:previous?520:400,easing:'cubic-bezier(.22,1,.36,1)'}));
  }
  return animations.current;
  });
 },[glyphs]);
 const words:Glyph[][]=[[]];
 glyphs.forEach(glyph=>{if(/\s/.test(glyph.char)){words.push([glyph],[]);}else words[words.length-1].push(glyph);});
 return <span ref={root} className="motion-morph"><span className="motion-sr">{text}</span><span aria-hidden="true">{words.filter(word=>word.length).map(word=><span className={/\s/.test(word[0].char)?'morph-space':'morph-word'} key={word.map(g=>g.id).join('-')}>{word.map(glyph=><span className="morph-letter" ref={node=>{if(node)nodes.current.set(glyph.id,node);else nodes.current.delete(glyph.id);}} key={glyph.id}>{glyph.char}</span>)}</span>)}</span></span>;
}
