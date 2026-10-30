'use client';
// Circular positioning and wave shader adapted from Luis Bizarro / Codrops (MIT).
// Original: github.com/bizarro/infinite-circular-webgl-gallery
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,Volume2,VolumeX,Maximize,X} from 'lucide-react';
import {reels} from '@/data/reels';
import {siteTheme,rgb} from '@/data/theme';

type Controls={step:(n:number)=>void;select:(i:number)=>void;play:()=>void;mute:()=>void;quality:()=>void};
export default function CircularFilms(){
 const stage=useRef<HTMLDivElement>(null),canvasHost=useRef<HTMLDivElement>(null),videoRef=useRef<HTMLVideoElement>(null),labels=useRef<(HTMLButtonElement|null)[]>([]),api=useRef<Controls|null>(null),dialog=useRef<HTMLDialogElement>(null),fullVideo=useRef<HTMLVideoElement>(null);
 const [active,setActive]=useState(0),[playing,setPlaying]=useState(false),[muted,setMuted]=useState(true),[hd,setHd]=useState(false),[ready,setReady]=useState(false),[fallback,setFallback]=useState(false),[expanded,setExpanded]=useState(false);
 const film=reels[active];
 useEffect(()=>{
  const element=stage.current,host=canvasHost.current,video=videoRef.current;if(!element||!host||!video)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches){setFallback(true);return;}
  let cancelled=false,dispose=()=>{};
  const initialize=()=>{import('three').then(T=>{
   if(cancelled)return;
   let renderer:InstanceType<typeof T.WebGLRenderer>;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch{setFallback(true);return;}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(siteTheme.background,0);host.appendChild(renderer.domElement);
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,1,.1,100);camera.position.z=20;
   const geometry=new T.PlaneGeometry(1,1,28,36),loader=new T.TextureLoader();
   const videoTexture=new T.VideoTexture(video);videoTexture.colorSpace=T.SRGBColorSpace;videoTexture.minFilter=T.LinearFilter;videoTexture.magFilter=T.LinearFilter;videoTexture.generateMipmaps=false;
   const textures=reels.map(r=>{const t=loader.load(`/reels/${r.slug}.jpg`);t.colorSpace=T.SRGBColorSpace;t.generateMipmaps=false;t.minFilter=T.LinearFilter;return t;});
   const vertex=`varying vec2 vUv;uniform float uTime;uniform float uSpeed;void main(){vUv=uv;vec3 p=position;p.z=(sin(p.x*4.+uTime)*1.5+cos(p.y*2.+uTime)*1.5)*(.1+uSpeed*.5);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
   const fragment=`
    varying vec2 vUv;
    uniform sampler2D tMap;
    uniform vec2 uImageSizes;
    uniform vec2 uPlaneSizes;
    uniform vec2 uFrameSize;
    uniform float uVideo;
    uniform vec3 uBackdrop;
    uniform vec3 uBorderColor;
    uniform vec3 uBorderAccent;
    void main(){
     float planeAspect=uPlaneSizes.x/uPlaneSizes.y;
     float imageAspect=uImageSizes.x/uImageSizes.y;
     vec2 ratio=vec2(min(planeAspect/imageAspect,1.),min(imageAspect/planeAspect,1.));
     vec2 uv=(vUv-.5)*ratio+.5;
     if(uVideo>.5){
      vec2 fit=vec2(max(planeAspect/imageAspect,1.),max(imageAspect/planeAspect,1.));
      uv=(vUv-.5)*fit+.5;
     }
     vec3 color=uBackdrop;
     if(uv.x>=0.&&uv.x<=1.&&uv.y>=0.&&uv.y<=1.)color=texture2D(tMap,uv).rgb;
     // Pixel-sized rounded rim follows the same animated plane as its film.
     float radius=min(14.,min(uFrameSize.x,uFrameSize.y)*.045);
     vec2 q=abs((vUv-.5)*uFrameSize)-(uFrameSize*.5-vec2(radius));
     float distance=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
     float aa=max(fwidth(distance),.6);
     float alpha=1.-smoothstep(-aa,aa,distance);
     float rim=smoothstep(-2.8-aa,-1.3+aa,distance);
     vec3 border=mix(uBorderColor,uBorderAccent,smoothstep(.35,1.,vUv.x*(1.-vUv.y))*.32);
     color=mix(color,border*.72,rim);
     gl_FragColor=vec4(color,alpha);
     #include <colorspace_fragment>
    }
   `;
   const panels=reels.map((r,i)=>{const uniforms={tMap:{value:textures[i] as InstanceType<typeof T.Texture>},uImageSizes:{value:new T.Vector2(r.landscape?1280:480,r.landscape?720:854)},uPlaneSizes:{value:new T.Vector2(1,1)},uTime:{value:i*17},uSpeed:{value:0},uVideo:{value:0},uBackdrop:{value:new T.Vector3(...rgb(siteTheme.background).map(v=>v/255))},uFrameSize:{value:new T.Vector2(300,420)},uBorderColor:{value:new T.Color(siteTheme.brand)},uBorderAccent:{value:new T.Color(siteTheme.accent)}};const material=new T.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,side:T.DoubleSide,transparent:true});const mesh=new T.Mesh(geometry,material);scene.add(mesh);return mesh;});
   const bits=new T.Group();scene.add(bits);const bitGeometry=new T.PlaneGeometry(1,1),bitMaterial=new T.MeshBasicMaterial({color:siteTheme.accent,transparent:true,opacity:.035,depthWrite:false});for(let i=0;i<30;i++){const m=new T.Mesh(bitGeometry,bitMaterial);m.position.set(Math.sin(i*37)*18,Math.cos(i*19)*10,-3);m.scale.set(1+Math.sin(i)*.3,.55,1);bits.add(m);}
   let width=1,height=1,vw=1,vh=1,pw=1,ph=1,step=1,current=0,target=0,last=0,selected=0,loaded=-1,highQuality=false,manuallyPaused=false,dragging=false,startX=0,startTarget=0,dragDistance=0,visible=false,playbackVisible=false,contextFailed=false,frame=0,lastDraw=0,attemptAfter=0,snapTimer:ReturnType<typeof setTimeout>|undefined;
   const connection=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
   const autoAllowed=!connection?.saveData&&!['slow-2g','2g'].includes(connection?.effectiveType||'');
   const mod=(n:number,m:number)=>((n%m)+m)%m;
   const resetPanels=()=>panels.forEach((p,i)=>{p.material.uniforms.tMap.value=textures[i];p.material.uniforms.uVideo.value=0;});
   const unload=()=>{video.pause();video.muted=true;setMuted(true);resetPanels();if(video.hasAttribute('src')){video.removeAttribute('src');video.load();}loaded=-1;};
   const loadPreview=(force=false)=>{if(!playbackVisible||document.hidden||dialog.current?.open||dragging||Math.abs(target-current)>.025||manuallyPaused||(!autoAllowed&&!force)||(!force&&performance.now()<attemptAfter))return;attemptAfter=performance.now()+1000;if(loaded!==selected){unload();loaded=selected;const reel=reels[selected];video.src=`/reels/${reel.slug}${highQuality?'':'-preview'}.mp4`;video.load();}void video.play().catch(()=>{});};
   const onPlaying=()=>{if(loaded<0)return;setPlaying(true);const u=panels[loaded].material.uniforms;u.tMap.value=videoTexture;u.uVideo.value=1;u.uImageSizes.value.set(video.videoWidth||480,video.videoHeight||854);};
   const onPause=()=>setPlaying(false);video.addEventListener('playing',onPlaying);video.addEventListener('pause',onPause);
   const move=(amount:number)=>{target=(Math.round(target/step)+amount)*step;manuallyPaused=false;video.pause();};
   api.current={step:move,select:i=>{const delta=mod(i-mod(Math.round(target/step),reels.length)+reels.length/2,reels.length)-reels.length/2;move(delta);},play:()=>{if(video.paused){manuallyPaused=false;loadPreview(true);}else{manuallyPaused=true;video.pause();}},mute:()=>{video.muted=!video.muted;setMuted(video.muted);},quality:()=>{highQuality=!highQuality;setHd(highQuality);manuallyPaused=false;unload();loadPreview(true);}};
   const resize=()=>{const prevStep=step;width=element.clientWidth;height=element.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();vh=2*Math.tan(Math.PI/8)*20;vw=vh*camera.aspect;ph=vh*.60;if(width<700)ph=Math.min(ph,vw*.544*900/700);pw=ph*700/900;step=pw*1.08+vh*.015;current=current/prevStep*step;target=target/prevStep*step;panels.forEach(p=>{p.scale.set(pw,ph,1);p.material.uniforms.uPlaneSizes.value.set(pw,ph);});};
   const snap=()=>{target=Math.round(target/step)*step;};
   const down=(e:PointerEvent)=>{if((e.target as HTMLElement).closest('.circular-caption'))return;dragging=true;dragDistance=0;startX=e.clientX;startTarget=target;video.pause();element.setPointerCapture(e.pointerId);};
   const drag=(e:PointerEvent)=>{if(!dragging)return;dragDistance=Math.abs(e.clientX-startX);target=startTarget+(startX-e.clientX)*vw/width*.8;};
   const up=(e:PointerEvent)=>{if(!dragging)return;dragging=false;if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);manuallyPaused=false;snap();};
   const wheel=(e:WheelEvent)=>{const horizontal=Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey;if(!horizontal)return;e.preventDefault();e.stopPropagation();target+=(e.deltaX||e.deltaY)*vw/width*.4;video.pause();manuallyPaused=false;if(snapTimer)clearTimeout(snapTimer);snapTimer=setTimeout(snap,220);};
   const pageVisibility=()=>{if(document.hidden){unload();fullVideo.current?.pause();}};document.addEventListener('visibilitychange',pageVisibility);
   const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting&&e.intersectionRatio>.05;playbackVisible=e.isIntersecting&&e.intersectionRatio>=.65;if(!playbackVisible)unload();},{threshold:[0,.05,.35,.65,.85,1]});io.observe(element);const ro=new ResizeObserver(resize);ro.observe(element);
   element.addEventListener('pointerdown',down);element.addEventListener('pointermove',drag);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',up);element.addEventListener('wheel',wheel,{passive:false});resize();
   const point=new T.Vector3();
   const draw=(now:number)=>{frame=requestAnimationFrame(draw);if(!visible||document.hidden||contextFailed)return;if(dialog.current?.open){video.pause();return;}if(now-lastDraw<1000/30&&Math.abs(target-current)<.01)return;const dt=Math.min((now-lastDraw)/16.667||1,3);lastDraw=now;current+=(target-current)*(1-Math.pow(.96,dt));const speed=current-last;let closest=0,distance=Infinity;const track=step*reels.length;
    panels.forEach((panel,i)=>{const x=mod(i*step-current+track/2,track)-track/2;const focus=Math.exp(-Math.pow(x/(step*.78),2));const scale=.48+.92*focus;const scaledWidth=pw*scale,scaledHeight=ph*scale;panel.scale.set(scaledWidth,scaledHeight,1);panel.material.uniforms.uPlaneSizes.value.set(scaledWidth,scaledHeight);panel.material.uniforms.uFrameSize.value.set(scaledWidth/vw*width,scaledHeight/vh*height);panel.position.x=x;panel.position.y=1.15-(1-focus)*.6;panel.position.z=focus*.2;panel.rotation.z=-x/(step*reels.length*2)*Math.PI;panel.visible=Math.abs(x)<vw*.5+pw;panel.material.uniforms.uTime.value+=.04*dt;panel.material.uniforms.uSpeed.value=Math.min(Math.abs(speed),1);if(Math.abs(x)<distance){distance=Math.abs(x);closest=i;}
     const label=labels.current[i];if(label){panel.updateMatrixWorld();point.set(0,-.5-.22/scaledHeight,0).applyMatrix4(panel.matrixWorld).project(camera);label.style.width=`${Math.max(100,scaledWidth/vw*width-12)}px`;label.style.fontSize=`${Math.max(17,Math.min(30,scaledWidth/vw*width*.075))}px`;label.style.left=`${(point.x*.5+.5)*width}px`;label.style.top=`${(-point.y*.5+.5)*height}px`;label.style.transform=`translateX(-50%) rotate(${-panel.rotation.z*180/Math.PI}deg)`;label.style.visibility=panel.visible?'visible':'hidden';}
    });
    labels.current.forEach((label,i)=>{if(label)label.tabIndex=i===closest?0:-1;});if(closest!==selected){selected=closest;setActive(closest);highQuality=false;setHd(false);manuallyPaused=false;unload();}
    if(playbackVisible&&Math.abs(target-current)<.025&&!dragging&&video.paused&&!manuallyPaused)loadPreview();
    bits.position.x=-mod(current*.12,4);renderer.render(scene,camera);last=current;
   };frame=requestAnimationFrame(draw);setReady(true);
   const onContextLost=(e:Event)=>{e.preventDefault();contextFailed=true;unload();setFallback(true);};renderer.domElement.addEventListener('webglcontextlost',onContextLost);
   dispose=()=>{cancelAnimationFrame(frame);if(snapTimer)clearTimeout(snapTimer);io.disconnect();ro.disconnect();unload();video.removeEventListener('playing',onPlaying);video.removeEventListener('pause',onPause);document.removeEventListener('visibilitychange',pageVisibility);element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',drag);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',up);element.removeEventListener('wheel',wheel);renderer.domElement.removeEventListener('webglcontextlost',onContextLost);panels.forEach(p=>p.material.dispose());textures.forEach(t=>t.dispose());geometry.dispose();bitGeometry.dispose();bitMaterial.dispose();videoTexture.dispose();renderer.dispose();renderer.domElement.remove();api.current=null;};
  });};const startObserver=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){startObserver.disconnect();initialize();}},{rootMargin:'400px'});startObserver.observe(element);return()=>{cancelled=true;startObserver.disconnect();dispose();};
 },[]);
 useEffect(()=>{const player=fullVideo.current;if(expanded){videoRef.current?.pause();dialog.current?.showModal();if(player){player.muted=true;void player.play().catch(()=>{});}}else{player?.pause();dialog.current?.close();}return()=>{player?.pause();};},[expanded]);
 return <section className={`circular-films ${fallback?'circular-fallback':''}`} id="work" aria-labelledby="circular-heading"><div className="circular-topline"><h2 id="circular-heading">SocialMint <span>/ Selected films</span></h2><span>Drag or swipe to explore</span></div><div className="circular-stage" ref={stage} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Infinite circular film gallery. Use left and right arrow keys." onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();api.current?.step(e.key==='ArrowRight'?1:-1);}}}><div className="circular-canvas" ref={canvasHost} aria-hidden="true"/>{!ready&&!fallback&&<div className="circular-initial"><img src={`/reels/${reels[0].slug}.jpg`} alt=""/></div>}<div className="circular-labels">{reels.map((r,i)=><button ref={el=>{labels.current[i]=el;}} key={r.slug} className="circular-caption" aria-label={`Select ${r.title}`} onClick={()=>{if(fallback){setActive(i);setExpanded(true);}else api.current?.select(i);}}><img className="circular-fallback-image" src={`/reels/${r.slug}.jpg`} alt="" loading="lazy"/><span>{String(i+1).padStart(2,'0')}</span><strong>{r.title}</strong></button>)}</div></div><video ref={videoRef} muted loop playsInline preload="none" className="circular-texture-video" aria-hidden="true"/><div className="circular-bottom"><div className="circular-current" aria-live="polite"><span>{String(active+1).padStart(2,'0')} / {reels.length}</span><p>{film.category} · {film.duration}</p></div><div className="circular-controls"><button onClick={()=>fallback?setActive(v=>(v-1+reels.length)%reels.length):api.current?.step(-1)} aria-label="Previous film"><ArrowLeft size={21}/></button><button onClick={()=>fallback?setExpanded(true):api.current?.play()} aria-label={playing?'Pause centered film':'Play centered film'}>{playing?<Pause size={20}/>:<Play size={20}/>}</button><button disabled={fallback} onClick={()=>api.current?.mute()} aria-label={muted?'Unmute centered film':'Mute centered film'}>{muted?<VolumeX size={20}/>:<Volume2 size={20}/>}</button><button className={hd?'quality-active':''} onClick={()=>fallback?setHd(v=>!v):api.current?.quality()} aria-label={hd?'Use SD preview':'Load HD film'}>{hd?'HD':'SD'}</button><button onClick={()=>setExpanded(true)} aria-label={`Open ${film.title} in full view`}><Maximize size={19}/></button><button onClick={()=>fallback?setActive(v=>(v+1)%reels.length):api.current?.step(1)} aria-label="Next film"><ArrowRight size={21}/></button></div></div><dialog className="circular-player-dialog" ref={dialog} onCancel={e=>{e.preventDefault();setExpanded(false);}} onClick={e=>{if(e.target===dialog.current)setExpanded(false);}}><button className="circular-player-close" onClick={()=>setExpanded(false)} aria-label="Close film"><X/></button><h3>{film.title}</h3>{expanded&&<video ref={fullVideo} src={`/reels/${film.slug}${hd?'':'-preview'}.mp4`} poster={`/reels/${film.slug}.jpg`} muted playsInline controls autoPlay/>}</dialog></section>;
}
