import { MatchScene } from "../scenes/MatchScene";
import { SoundService } from "../services/sound.service";
import {
    Hero,
    IHeroInitData
} from "./Hero";

export class    Superman extends Hero {

    private _soundKey: string;

    constructor(scene: MatchScene, initData: IHeroInitData,
                    private readonly soundService: SoundService) {
        super(scene, initData);
        if (initData.playerSide === 0)
        {
            this._upperSprite.flipX = true;
            this._lowerSprite.flipX = true;
        }
        this._upperSprite.scale = 0.4; //Provisional. It should not be necessary to scale
        this._lowerSprite.scale = 0.4; //Provisional. It should not be necessary to scale
        this._soundKey = SoundService.heroSoundKeys.superman;
    }

    protected _shout(): void {
        this.soundService.play(this._soundKey, false);
    }

}
