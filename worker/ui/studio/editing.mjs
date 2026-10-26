import {uid} from '../../studio-schema.mjs';

// Preserve group relationships, never identifiers. The clipboard stays private to this tab.
export function copyNodes(nodes,offset=20){
 const groups=new Map();return nodes.map(n=>{
  if(n.groupId&&!groups.has(n.groupId))groups.set(n.groupId,uid());
  return {...structuredClone(n),id:uid(),x:Math.min(16000,Math.max(-16000,n.x+offset)),y:Math.min(16000,Math.max(-16000,n.y+offset)),groupId:groups.get(n.groupId)||'',locked:false};
 });
}
export function duplicateBoard(source,name=source.name+' / cópia'){
 const b=structuredClone(source);b.id=uid();b.name=name.slice(0,140);b.nodes=copyNodes(source.nodes,0);return b;
}
export function alignNodes(nodes,board,axis,edge){
 const position=axis==='x'?'x':'y',size=axis==='x'?'w':'h',span=axis==='x'?board.width:board.height;
 const start=Math.min(...nodes.map(n=>n[position])),end=Math.max(...nodes.map(n=>n[position]+n[size]));
 const delta=edge==='start'?board.safe-start:edge==='end'?span-board.safe-end:(span-start-end)/2;
 for(const n of nodes)n[position]=Math.min(16000,Math.max(-16000,n[position]+delta));
}
export function distributeNodes(nodes,axis){
 if(nodes.length<3)return;const size=axis==='x'?'w':'h',list=[...nodes].sort((a,b)=>a[axis]-b[axis]);
 const start=list[0][axis],end=list.at(-1)[axis]+list.at(-1)[size],gap=(end-start-list.reduce((sum,n)=>sum+n[size],0))/(list.length-1);
 let next=start;for(const n of list){n[axis]=next;next+=n[size]+gap;}
}
