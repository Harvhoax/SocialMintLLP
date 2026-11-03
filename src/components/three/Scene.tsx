'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, Sparkles } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function Reel({ radius = 1, ...props }: { radius?: number; position: [number, number, number]; rotation?: [number, number, number] }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(); shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; const hole = new THREE.Path(); hole.absarc(Math.cos(a) * radius * .57, Math.sin(a) * radius * .57, radius * .205, 0, Math.PI * 2, true); shape.holes.push(hole); }
    const hole = new THREE.Path(); hole.absarc(0, 0, radius * .07, 0, Math.PI * 2, true); shape.holes.push(hole);
    return new THREE.ExtrudeGeometry(shape, { depth: .12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .045, bevelThickness: .04, curveSegments: 48 });
  }, [radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group {...props}><mesh geometry={geometry}><meshPhysicalMaterial color="#79efa2" metalness={.72} roughness={.2} clearcoat={1} clearcoatRoughness={.16}/></mesh><mesh position={[0,0,-.13]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[radius * .72,radius * .72,.18,64]}/><meshStandardMaterial color="#083521" metalness={.8} roughness={.3}/></mesh><mesh geometry={geometry} position={[0,0,-.32]}><meshPhysicalMaterial color="#60db92" metalness={.85} roughness={.24}/></mesh><mesh position={[0,0,.18]}><torusGeometry args={[radius *.96,.018,8,96]}/><meshStandardMaterial color="#c1f8ce" metalness={.95} roughness={.2}/></mesh></group>;
}
function CameraSculpture() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({x:0,y:0});
  useEffect(() => { const move = (e: PointerEvent) => { pointer.current = {x:(e.clientX / innerWidth - .5),y:(e.clientY / innerHeight - .5)}; }; window.addEventListener('pointermove',move); return () => window.removeEventListener('pointermove',move); },[]);
  const leaf = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-.58,-.6); s.bezierCurveTo(-.77,.08,-.12,.72,.64,.71); s.bezierCurveTo(.67,.01,.15,-.68,-.44,-.56); s.bezierCurveTo(-.15,-.06,.08,.19,.34,.37); s.bezierCurveTo(-.18,.1,-.43,-.17,-.58,-.6); return new THREE.ExtrudeGeometry(s,{depth:.08,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,curveSegments:40}); },[]);
  useEffect(()=>()=>leaf.dispose(),[leaf]);
  useFrame(({clock},delta) => { if(!group.current) return; const t=clock.getElapsedTime(); const scroll=Math.min(window.scrollY/window.innerHeight,1.6); group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,-.4+pointer.current.x*.16+scroll*.9,4,delta); group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,.12+pointer.current.y*.1+scroll*.18,4,delta); group.current.rotation.z=-.12+Math.sin(t*.28)*.025; group.current.position.y=Math.sin(t*.65)*.055-scroll*.2; });
  return <group ref={group} rotation={[.12,-.4,-.12]} scale={1.08}>
    <Reel radius={1.08} position={[.69,1.04,0]} rotation={[0,0,.17]}/><Reel radius={.78} position={[-1.2,.72,0]} rotation={[0,0,-.2]}/>
    <RoundedBox args={[3.5,1.85,.67]} radius={.25} smoothness={6} position={[-.15,-1,0]}><meshPhysicalMaterial color="#51c282" metalness={.88} roughness={.26} clearcoat={1}/></RoundedBox>
    <RoundedBox args={[3.2,1.59,.04]} radius={.2} position={[-.15,-1,.36]}><meshPhysicalMaterial color="#102e23" metalness={.7} roughness={.24} clearcoat={1}/></RoundedBox>
    <mesh geometry={leaf} position={[-.12,-1,.43]} scale={.97}><meshPhysicalMaterial color="#97f4b1" metalness={.58} roughness={.22} clearcoat={1}/></mesh>
    <mesh position={[2,-.98,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.83,.49,.78,4]}/><meshPhysicalMaterial color="#74e09d" metalness={.8} roughness={.22} clearcoat={1}/></mesh>
    <mesh position={[-.18,-2.05,0]} rotation={[0,0,Math.PI/2]}><capsuleGeometry args={[.065,2.2,4,16]}/><meshStandardMaterial color="#193c2c" metalness={.8} roughness={.35}/></mesh>
  </group>;
}
export default function Scene() {
  const [active,setActive] = useState(true);
  useEffect(()=>{ const update=()=>setActive(!document.hidden && window.scrollY < window.innerHeight*1.8); window.addEventListener('scroll',update,{passive:true}); document.addEventListener('visibilitychange',update); return ()=>{ window.removeEventListener('scroll',update); document.removeEventListener('visibilitychange',update); }; },[]);
  return <Canvas dpr={[1,1.5]} camera={{position:[0,0,8.9],fov:39}} gl={{alpha:true,antialias:true,powerPreference:'high-performance'}} frameloop={active?'always':'demand'} aria-label="A sculptural mint film camera, inspired by the SocialMint logo">
    <ambientLight intensity={.55}/><directionalLight position={[3,6,5]} intensity={3} color="#e5ffe9"/><pointLight position={[-4,1,3]} intensity={12} color="#b6e9bf"/><pointLight position={[4,-3,-1]} intensity={8} color="#c1b79e"/>
    <Environment resolution={128}><Lightformer form="rect" intensity={4} color="#ecfff0" scale={[8,3,1]} position={[-3,5,3]} rotation={[0,0,-.6]}/><Lightformer form="rect" intensity={2} color="#b2f5c8" scale={[3,8,1]} position={[5,0,2]} rotation={[0,-Math.PI/3,0]}/><Lightformer form="ring" intensity={2} color="#ffffff" scale={6} position={[0,2,4]}/></Environment>
    <CameraSculpture/><Sparkles count={38} scale={[10,8,5]} size={1.3} speed={.15} opacity={.35} color="#b1efc3"/>
  </Canvas>;
}
