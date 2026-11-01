import seed from '../data/players.json' with { type: 'json' };
import type {Player} from './types';
export const players=seed as Player[];
export const defaultNeeds={ST:1,CM:1,CB:1,RW:0};
