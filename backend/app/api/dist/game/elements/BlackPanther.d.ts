import { Hero, IHeroInit } from "./Hero";
export declare class BlackPanther extends Hero {
    constructor(initData: IHeroInit);
    ballVelocityAfterHit(): [number, number];
}
