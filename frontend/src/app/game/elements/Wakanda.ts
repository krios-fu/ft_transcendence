import { MatchScene } from "../scenes/MatchScene";
import { SoundService } from "../services/sound.service";
import {
    AStage,
    StageKeys
} from "./AStage";

export class    Wakanda extends AStage {

    private _city: Phaser.GameObjects.Image;
    private _jungle: Phaser.GameObjects.Image;
    private _activeBackground: Phaser.GameObjects.Image;
    private _alphaUp: boolean;

    constructor(scene: MatchScene,
                    private readonly soundService: SoundService) {
        const   keys: StageKeys = AStage.stageKeys;
    
        super(scene, keys.wakanda);
        this._city = scene.add.image(
            Number(scene.game.config.width) / 2,
            Number(scene.game.config.height),
            keys.wakandaCity
        );
        this._city.setAlpha(1);
        this._city.setOrigin(0.5, 1);
        this._city.depth = -2;
        this._jungle = scene.add.image(
            Number(scene.game.config.width) / 2,
            Number(scene.game.config.height),
            keys.wakandaJungle
        );
        this._jungle.setAlpha(0);
        this._jungle.setOrigin(0.5, 1);
        this._jungle.depth = -2;
        this._activeBackground = this._city;
        this._alphaUp = false;
        this.soundService.play(SoundService.stageSoundKeys.wakanda, true);
    }

    private _switchBackground(): void {
        if (this._activeBackground === this._city)
            this._activeBackground = this._jungle;
        else
            this._activeBackground = this._city;
    }

    update(): void {
        if (this._alphaUp)
        {
            if (this._activeBackground.alpha === 1)
                this._alphaUp = false;
            else
                this._activeBackground.alpha += 0.02;
        }
        else
        {
            if (this._activeBackground.alpha === 0)
            {
                this._alphaUp = true;
                this._switchBackground();
            }
            else
                this._activeBackground.alpha -= 0.02;
        }
    }

    override destroy(): void {
        super.destroy();
        this._city.destroy();
        this._jungle.destroy();
    }

}
