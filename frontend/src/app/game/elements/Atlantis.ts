import { MatchScene } from "../scenes/MatchScene";
import { SoundService } from "../services/sound.service";
import {
    AStage,
    StageKeys
} from "./AStage";

export class    Atlantis extends AStage {

    private _bubbles: Phaser.GameObjects.TileSprite;

    constructor(scene: MatchScene,
                    private readonly soundService: SoundService) {
        const   keys: StageKeys = AStage.stageKeys;
    
        super(scene, keys.atlantis);
        this._bubbles = scene.add.tileSprite(
            0, 0,
            800, 1500,
            keys.atlantisBubbles
        );
        this._bubbles.setOrigin(0, 0);
        this._bubbles.depth = -0.5;
        this.soundService.play(SoundService.stageSoundKeys.atlantis, true);
    }

    update(): void {
        this._bubbles.tilePositionY += 0.1;
    }

    override destroy(): void {
        super.destroy();
        this._bubbles.destroy();
    }

}
