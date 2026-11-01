import {players} from '@/lib/data';
import {scorePlayers} from '@/lib/scoring';
import type {Priority} from '@/lib/types';
export async function GET(request:Request){const priority=new URL(request.url).searchParams.get('priority')||'balanced';if(!['balanced','win-now','development'].includes(priority))return Response.json({error:'Unknown priority'},{status:400});return Response.json({players:scorePlayers(players,priority as Priority)});}
