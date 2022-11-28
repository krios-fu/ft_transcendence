import {
    Hero,
    IHeroInit
} from "./Hero";

export class    BlackPanther extends Hero {

    constructor(initData: IHeroInit) {
        super(initData);
    }

    override ballVelocityAfterHit(): [number, number] {
        let xVelocity: number;

        if (this._playerSide === 0)
            xVelocity = this._upperSprite.yVelocity;
        else
            xVelocity = this._lowerSprite.yVelocity;
        return ([xVelocity, 0]);
    }

}
