import { MatchScene } from "../scenes/MatchScene";
import {
    AStage,
    StageKeys
} from "./AStage";

export class    Atlantis extends AStage {

    private _bubbles: Phaser.GameObjects.TileSprite;

    constructor(scene: MatchScene) {
        const   keys: StageKeys = AStage.stageKeys;
    
        super(scene, keys.atlantis);
        this._bubbles = scene.add.tileSprite(
            0, 0,
            800, 1500,
            keys.atlantisBubbles
        );
        this._bubbles.setOrigin(0, 0);
        this._bubbles.depth = -0.5;
    }

    update(): void {
        this._bubbles.tilePositionY += 0.1;
    }

    override destroy(): void {
        super.destroy();
        this._bubbles.destroy();
    }

}
