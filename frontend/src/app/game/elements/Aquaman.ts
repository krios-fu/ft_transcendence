import { MatchScene } from "../scenes/MatchScene";
import {
    Hero,
    IHeroInitData
} from "./Hero";

export class    Aquaman extends Hero {

    constructor(scene: MatchScene, initData: IHeroInitData) {
        super(scene, initData);
        this._lowerSprite.flipY = true;
        if (initData.playerSide === 0)
        {
            this._upperSprite.flipX = true;
            this._lowerSprite.flipX = true;
        }
        this._upperSprite.scale = 0.5; //Provisional. It should not be necessary to scale
        this._lowerSprite.scale = 0.5; //Provisional. It should not be necessary to scale
    }

}
