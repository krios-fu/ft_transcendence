import { MatchScene } from "../scenes/MatchScene";
import {
    Hero,
    IHeroInitData
} from "./Hero";

export class    Superman extends Hero {

    constructor(scene: MatchScene, initData: IHeroInitData) {
        super(scene, initData);
        if (initData.playerSide === 0)
        {
            this._upperSprite.flipX = true;
            this._lowerSprite.flipX = true;
        }
        this._upperSprite.scale = 0.4; //Provisional. It should not be necessary to scale
        this._lowerSprite.scale = 0.4; //Provisional. It should not be necessary to scale
    }

}
