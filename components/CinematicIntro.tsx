'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import {siteTheme,rgb} from '@/data/theme';
import {VaporText,LetterSwap} from './ui/TextEffects';

const frames=['on-set','brand-product','city-story','edit-suite','studio-light','hospitality','camera-detail','architecture','social-creator','celebration','founder-story','brand-film'];
export default function CinematicIntro({onExplore,onStart,introReady=true}:{onExplore:()=>void;onStart:()=>void;introReady?:boolean}){
 const root=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null),first=useRef<HTMLDivElement>(null),second=useRef<HTMLDivElement>(null),bar=useRef<HTMLDivElement>(null);
 const [ready,setReady]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');let dispose=()=>{};let cancelled=false;
  if(preference.matches){setReduced(true);return;}
  import('three').then(T=>{
   if(cancelled||!host.current)return;
   let renderer:InstanceType<typeof T.WebGLRenderer>;
   try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{setReduced(true);return;}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));host.current.appendChild(renderer.domElement);
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(42,1,.1,100);camera.position.z=12;
   const ring=new T.Group();scene.add(ring);
   const loader=new T.TextureLoader();const textures=frames.map(f=>{const t=loader.load(`/hero/${f}.jpg`);t.colorSpace=T.SRGBColorSpace;return t;});
   const geometry=new T.PlaneGeometry(2.1,2.9,24,16);
   const panels=Array.from({length:12},(_,i)=>{const m=new T.MeshBasicMaterial({map:textures[i],side:T.DoubleSide});const mesh=new T.Mesh(geometry,m);ring.add(mesh);return mesh;});
   const uniforms={uA:{value:textures[0]},uB:{value:textures[4]},uOpacity:{value:0},uProgress:{value:0},uAspect:{value:1},uBrand:{value:new T.Vector3(...rgb(siteTheme.brand).map(v=>v/255))},uAccent:{value:new T.Vector3(...rgb(siteTheme.accent).map(v=>v/255))}};
   const shader=new T.ShaderMaterial({uniforms,transparent:true,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`precision highp float;varying vec2 vUv;uniform sampler2D uA;uniform sampler2D uB;uniform float uProgress;uniform float uOpacity;uniform float uAspect;uniform vec3 uBrand;uniform vec3 uAccent;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec2 uv=vUv;float noise=hash(floor(uv*180.));float wave=sin(uv.y*12.+uProgress*5.)*.12+sin(uv.x*8.)*.08;float boundary=uProgress*1.7-.35;float mask=smoothstep(boundary-.07,boundary+.07,uv.x+wave+noise*.09);float warp=sin(uv.y*14.+uProgress*8.)*.08*sin(uProgress*3.14159);vec2 crop=vec2(1.,min(1.,1./uAspect));vec2 a=(uv-.5)*crop+.5;vec4 ca=texture2D(uA,a+vec2(warp,0.));vec4 cb=texture2D(uB,a-vec2(warp,0.));vec3 color=mix(cb.rgb,ca.rgb,mask);float edge=1.-smoothstep(.0,.045,abs(uv.x+wave+noise*.09-boundary));color=mix(color,mix(uBrand,uAccent,uProgress),edge*.38);gl_FragColor=vec4(color,uOpacity);}`});
   const screen=new T.Mesh(new T.PlaneGeometry(1,1),shader);screen.position.z=2;screen.visible=false;scene.add(screen);
   let width=1,height=1,active=true,frame=0,target=0,current=0;
   const resize=()=>{if(!host.current)return;width=host.current.clientWidth;height=host.current.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();uniforms.uAspect.value=width/height;};
   const update=()=>{if(!root.current)return;const r=root.current.getBoundingClientRect();target=Math.max(0,Math.min(1,-r.top/(root.current.offsetHeight-innerHeight)));};
   const observer=new IntersectionObserver(([e])=>{active=e.isIntersecting;});observer.observe(root.current!);
   const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host.current);window.addEventListener('scroll',update,{passive:true});resize();update();
   const animate=()=>{frame=requestAnimationFrame(animate);if(!active||document.hidden)return;current+=(target-current)*.09;const p=current;const unfolding=T.MathUtils.smoothstep(p,.31,.61);ring.rotation.y=p*Math.PI*2.2;ring.rotation.z=(1-unfolding)*-.13;ring.rotation.x=(1-unfolding)*.12;ring.position.y=-.55;ring.scale.setScalar(1+unfolding*1.8);camera.position.z=width<700?17:12;
    panels.forEach((mesh,i)=>{const angle=i/12*Math.PI*2;mesh.position.set(Math.sin(angle)*4.25,Math.sin(angle*2+p*3)*.18,Math.cos(angle)*4.25);mesh.rotation.y=angle;mesh.rotation.z=unfolding*(i%2?-.25:.25);});
    ring.visible=p<.65;screen.visible=p>.57;const coverage=T.MathUtils.smoothstep(p,.57,.68);const distance=camera.position.z-2;const h=2*Math.tan(42*Math.PI/360)*distance;screen.scale.set(h*camera.aspect*(.65+.35*coverage),h*(.65+.35*coverage),1);uniforms.uOpacity.value=coverage;uniforms.uProgress.value=T.MathUtils.clamp((p-.68)/.28,0,1);
    if(first.current){first.current.style.visibility=p>.4?'hidden':'visible';first.current.style.opacity=String(1-T.MathUtils.smoothstep(p,.18,.4));first.current.style.transform=`translateY(${-p*180}px)`;}if(second.current){second.current.style.opacity=String(T.MathUtils.smoothstep(p,.58,.72));}if(bar.current)bar.current.style.transform=`scaleX(${p})`;renderer.render(scene,camera);
   };animate();setReady(true);
   dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();window.removeEventListener('scroll',update);geometry.dispose();panels.forEach(p=>p.material.dispose());textures.forEach(t=>t.dispose());screen.geometry.dispose();shader.dispose();renderer.dispose();renderer.domElement.remove();};
  });return()=>{cancelled=true;dispose();};
 },[]);
 return <section ref={root} className={`cinema ${reduced?'cinema-static':''}`} id="home"><div className="cinema-sticky"><div ref={host} className="cinema-canvas" aria-hidden="true"/>{!ready&&<div className="cinema-fallback">{frames.slice(0,4).map((f,i)=><img key={f} src={`/hero/${f}.jpg`} alt="Filmmaking and creative production" style={{transform:`rotate(${(i-1.5)*8}deg)`}}/>)}</div>}<div className="cinema-meta"><span>INDEPENDENT SOCIAL & CREATIVE STUDIO</span><span>INDIA · AVAILABLE WORLDWIDE</span></div><div className="cinema-opening" ref={first}><h1>Make<br/><em><VaporText text="a scene." delay={0} enabled={introReady}/></em></h1><p>We turn attention into growth.<br/>Strategy, stories, and social with a point of view.</p><button onClick={onStart} className="cinema-start"><LetterSwap text="Start something"/> <ArrowUpRight size={18}/></button></div><div className="cinema-second" ref={second}><h2>Same world.<br/><em>Different lens.</em></h2><p>We find the story worth stopping for.<br/>Then make every frame count.</p><button onClick={onExplore}><LetterSwap text="View our work"/> <ArrowUpRight size={18}/></button></div><div className="cinema-bottom"><span>SCROLL TO CHANGE THE PERSPECTIVE <ArrowDown size={13}/></span></div><div className="cinema-progress" ref={bar}/></div></section>;
}
