export const positions = ['ST','CM','CB','RW'] as const;
export type Position = typeof positions[number];
export type Priority = 'balanced'|'win-now'|'development';
export type Stats = {goals:number; assists:number; progression:number; tackles:number; duels:number};
export type Player = {id:string; name:string; club:string; age:number; position:Position; role:string; league:string; season:string; minutes:number; per90:Stats; estimatedFee:number; feeSource:string; dataSource:string; dataConfidence:'illustrative';};
export type Needs = Record<Position,number>;
export type ScoredPlayer = Player & {score:number; raw:number; reliability:number; components:{metric:string; percentile:number; weight:number}[]};
