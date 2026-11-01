import type {Needs,ScoredPlayer} from './types';
export function selectWindow(players:ScoredPlayer[],budget:number,needs:Needs,baseline=false){
 const pool=[...new Map(players.filter(p=>p.minutes>=450&&p.estimatedFee>=0).map(p=>[p.id,p])).values()];
 let best:ScoredPlayer[]=[];let bestValue=-1;let bestCost=Infinity;
 function consider(chosen:ScoredPlayer[],cost:number){const value=chosen.reduce((s,p)=>s+100+p.score,0);if(value>bestValue||(value===bestValue&&cost<bestCost)){best=[...chosen];bestValue=value;bestCost=cost;}}
 if(baseline){const chosen:ScoredPlayer[]=[];const counts={ST:0,CM:0,CB:0,RW:0};let cost=0;for(const p of [...pool].sort((a,b)=>(100+b.score)/Math.max(b.estimatedFee,1)-(100+a.score)/Math.max(a.estimatedFee,1)||a.id.localeCompare(b.id))){if(counts[p.position]<needs[p.position]&&cost+p.estimatedFee<=budget){chosen.push(p);counts[p.position]++;cost+=p.estimatedFee;}}consider(chosen,cost);}else{
 const counts={ST:0,CM:0,CB:0,RW:0};function search(i:number,chosen:ScoredPlayer[],cost:number){if(i===pool.length){consider(chosen,cost);return;}search(i+1,chosen,cost);const p=pool[i];if(counts[p.position]<needs[p.position]&&cost+p.estimatedFee<=budget){counts[p.position]++;chosen.push(p);search(i+1,chosen,cost+p.estimatedFee);chosen.pop();counts[p.position]--;}}search(0,[],0);
 }return {players:best,cost:bestCost,remaining:budget-bestCost,objective:bestValue,unfilled:Object.fromEntries(Object.entries(needs).map(([pos,n])=>[pos,n-best.filter(p=>p.position===pos).length]))};
}
