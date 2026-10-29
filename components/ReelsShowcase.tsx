'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Play,Pause,Volume2,VolumeX,Maximize} from 'lucide-react';
import {projects} from '@/data/projects';

const reels=[
 {slug:'socialcox',title:'Socialcox Edit',category:'Social content',duration:'0:30'},
 {slug:'supercar-fest',title:'Supercar Fest',category:'Automotive',duration:'0:24'},
 {slug:'dubai-real-estate',title:'Dubai Real Estate',category:'Real estate',duration:'0:35'},
];

function ReelCard({reel,index}:{reel:typeof reels[number];index:number}){
 const ref=useRef<HTMLVideoElement>(null);
 const inView=useRef(false),manuallyPaused=useRef(false);
 const [playing,setPlaying]=useState(false),[muted,setMuted]=useState(true),[failed,setFailed]=useState(false);
 const src=`/reels/${reel.slug}.mp4`;
 useEffect(()=>{
  const video=ref.current;if(!video)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const saveData=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData;
  const load=()=>{if(!video.getAttribute('src')){video.src=src;video.load();}};
  const sync=()=>{if(inView.current&&!document.hidden&&!manuallyPaused.current&&!preference.matches&&!saveData){load();void video.play().catch(()=>{});}else video.pause();};
  const observer=new IntersectionObserver(([entry])=>{
   inView.current=entry.isIntersecting&&entry.intersectionRatio>=.4;
   if(!inView.current){video.muted=true;setMuted(true);}sync();
  },{threshold:[0,.4,.6]});observer.observe(video);
  const preload=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){load();preload.disconnect();}},{rootMargin:'250px'});preload.observe(video);
  const otherAudio=(event:Event)=>{if((event as CustomEvent).detail!==video){video.muted=true;setMuted(true);}};
  document.addEventListener('visibilitychange',sync);window.addEventListener('socialmint-reel-audio',otherAudio);preference.addEventListener('change',sync);
  return()=>{observer.disconnect();preload.disconnect();document.removeEventListener('visibilitychange',sync);window.removeEventListener('socialmint-reel-audio',otherAudio);preference.removeEventListener('change',sync);video.pause();};
 },[src]);
 const togglePlay=()=>{const video=ref.current;if(!video)return;if(!video.getAttribute('src')){video.src=src;video.load();}if(video.paused){manuallyPaused.current=false;void video.play().catch(()=>{});}else{manuallyPaused.current=true;video.pause();}};
 const toggleSound=()=>{const video=ref.current;if(!video)return;video.muted=!video.muted;setMuted(video.muted);if(!video.muted)window.dispatchEvent(new CustomEvent('socialmint-reel-audio',{detail:video}));};
 return <article className={`reel-card reel-card-${index}`} aria-label={`${reel.title} sample reel`}>
  <div className="reel-screen">
   <video ref={ref} poster={`/reels/${reel.slug}.jpg`} width={720} height={1280} muted={muted} loop playsInline preload="none" controls aria-label={`${reel.title}. Muted by default.`} onPlay={()=>setPlaying(true)} onPause={()=>{setPlaying(false);if(inView.current&&!document.hidden)manuallyPaused.current=true;}} onVolumeChange={()=>{if(ref.current)setMuted(ref.current.muted);}} onError={()=>setFailed(true)}>
    Your browser does not support inline video. <a href={src}>Open {reel.title}</a>.
   </video>
   <div className="reel-badge"><span className={playing?'reel-live-dot':''}/>{playing?'In motion':'Ready to play'}</div>
   <button className="reel-sound" onClick={toggleSound} aria-label={`${muted?'Unmute':'Mute'} ${reel.title}`} aria-pressed={!muted}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}<span>{muted?'Sound off':'Sound on'}</span></button>
   {failed&&<div className="reel-error"><a href={src}>Open video <ArrowUpRight size={18}/></a></div>}
  </div>
  <div className="reel-caption"><div><span className="reel-category">{reel.category} <span> / {reel.duration}</span></span><h3>{reel.title}</h3></div><div className="reel-actions"><button onClick={togglePlay} aria-label={`${playing?'Pause':'Play'} ${reel.title}`}>{playing?<Pause size={19}/>:<Play size={19}/>}</button><button onClick={()=>{const video=ref.current;if(!video)return;if(video.requestFullscreen)void video.requestFullscreen().catch(()=>{});else (video as HTMLVideoElement & {webkitEnterFullscreen?:()=>void}).webkitEnterFullscreen?.();}} aria-label={`Watch ${reel.title} fullscreen`}><Maximize size={18}/></button></div></div>
 </article>;
}

export default function ReelsShowcase(){
 return <section className="reels-section section" id="work" aria-labelledby="reels-heading"><div className="reels-heading"><div><span className="reels-eyebrow">Selected reels</span><h2 id="reels-heading">Made to<br/><em>move you.</em></h2></div><p>Stories, spaces, and a little adrenaline.<br/>A few frames from our world.</p></div><div className="reels-gallery">{reels.map((reel,index)=><ReelCard key={reel.slug} reel={reel} index={index}/>)}</div><div className="reels-collections"><p>There’s more to the story.</p><div>{projects.map((p,index)=><a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer">View collection 0{index+1}<ArrowUpRight size={18}/></a>)}</div></div></section>;
}
