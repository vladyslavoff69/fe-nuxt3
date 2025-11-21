export type coefficientsType = {
  [key: number]: {
    [key: string]: number[];
  };
}

export type BallPath = {
  x: number;
  y: number;
}

export type Peg = {
  pulse: boolean;
}

export type PegAni = {
  sprite: any;
}

export type RippleAni = {
  sprite: any;
  time?: number | null
}

export type BallV = {
  transactionId: string;
  balance: number;
}

export type PegBody = Peg[]
export type PegAniBody = RippleAni[]

export type PlinkoBall = {
  sprite: any;
  path: BallPath[];
  pathIndex: number;
  pos: number;
  v: BallV;
}
