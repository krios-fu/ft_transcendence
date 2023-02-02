import { MatchScene } from "../scenes/MatchScene";

export enum StageName {
    Atlantis,
    Metropolis,
    Wakanda
}

export interface    StageKeys {
    readonly atlantis: string;
    readonly atlantisBubbles: string;
    readonly metropolis: string;
    readonly metropolisClouds: string;
    readonly wakanda: string;
    readonly wakandaCity: string;
    readonly wakandaJungle: string;
}

export abstract class   AStage {

    private _stage: Phaser.GameObjects.Image;

    static readonly stageKeys = {
        atlantis: 'atlantis',
        atlantisBubbles: 'atlantisBubbles',
        metropolis: 'metropolis',
        metropolisClouds: 'metropolisClouds',
        wakanda: 'wakanda',
        wakandaCity: 'wakandaCity',
        wakandaJungle: 'wakandaJungle'
    };

    constructor(scene: MatchScene, stageKey: string) {
        this._stage = scene.add.image(
            Number(scene.game.config.width) / 2,
            Number(scene.game.config.height),
            stageKey
        );
        this._stage.setOrigin(0.5, 1);
        this._stage.depth = -1;
    }

    abstract update(): void;

    destroy(): void {
        this._stage.destroy();
    }

}
