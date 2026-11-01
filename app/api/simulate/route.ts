import {players} from '@/lib/data';
import {scorePlayers} from '@/lib/scoring';
import {selectWindow} from '@/lib/optimizer';
import {positions, type Needs} from '@/lib/types';
export async function POST(request:Request){try{const {budget,priority,needs}=await request.json() as {budget:number;priority: import('@/lib/types').Priority;needs:Needs};if(typeof budget!=='number'||!Number.isFinite(budget)||budget<0||budget>500||!['balanced','win-now','development'].includes(priority)||!needs||positions.some(p=>!Number.isInteger(needs[p])||needs[p]<0||needs[p]>2))return Response.json({error:'Enter a budget of €0–500m and 0–2 needs per position.'},{status:400});const scored=scorePlayers(players,priority);return Response.json({optimal:selectWindow(scored,budget,needs as Needs),baseline:selectWindow(scored,budget,needs as Needs,true)});}catch{return Response.json({error:'Invalid request body.'},{status:400});}}
