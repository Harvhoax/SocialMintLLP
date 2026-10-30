export type Glyph = {id:number;char:string};

// Longest common subsequence preserves the identity of shared letters, including
// repeated letters. Those letters can glide to their next measured position.
export function reconcileGlyphs(previous:Glyph[],text:string):Glyph[]{
 const next=Array.from(text),rows=previous.length+1,columns=next.length+1;
 const lengths=Array.from({length:rows},()=>new Uint16Array(columns));
 for(let a=previous.length-1;a>=0;a--)for(let b=next.length-1;b>=0;b--){
  lengths[a][b]=previous[a].char===next[b]?1+lengths[a+1][b+1]:Math.max(lengths[a+1][b],lengths[a][b+1]);
 }
 const shared=new Map<number,number>();let a=0,b=0;
 while(a<previous.length&&b<next.length){
  if(previous[a].char===next[b]){shared.set(b,previous[a].id);a++;b++;}
  else if(lengths[a+1][b]>=lengths[a][b+1])a++;else b++;
 }
 let serial=Math.max(-1,...previous.map(glyph=>glyph.id))+1;
 return next.map((char,index)=>({char,id:shared.get(index)??serial++}));
}
