import { MatchScene } from "../scenes/MatchScene";
import { AStage, StageKeys } from "./AStage";

export class    Metropolis extends AStage {

    private _clouds: Phaser.GameObjects.TileSprite;

    constructor(scene: MatchScene) {
        const   keys: StageKeys = AStage.stageKeys;
    
        super(scene, keys.metropolis);
        this._clouds = scene.add.tileSprite(
            0, 0,
            1500, 600,
            keys.metropolisClouds
        );
        this._clouds.setOrigin(0, 0);
        this._clouds.depth = -0.5;
    }

    update(): void {
        this._clouds.tilePositionX += 0.1;
    }

    override destroy(): void {
        super.destroy();
        this._clouds.destroy();
    }

}
