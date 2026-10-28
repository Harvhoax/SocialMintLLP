'use client';
// Adapted from React Bits' Magnet interaction (MIT + Commons Clause).
// https://github.com/DavidHDev/react-bits/blob/main/src/content/Animations/Magnet/Magnet.jsx
import { useRef, type ReactNode } from 'react';
export default function Magnet({ children, className = '' }: {children: ReactNode; className?:string}) {
  const ref=useRef<HTMLSpanElement>(null);
  return <span ref={ref} className={`magnet ${className}`} onPointerMove={e=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.18}px)`;}} onPointerLeave={()=>{if(ref.current)ref.current.style.transform='translate(0,0)';}}>{children}</span>;
}
