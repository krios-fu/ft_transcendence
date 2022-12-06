import { MatchScene } from "../scenes/MatchScene";
import {
    Ball,
    IBallData,
    IBallInitData
} from "./Ball";
import {
    Player,
    IPlayerInitData,
    IPlayerData
} from "./Player";
import { Txt } from "./Txt";

export interface    IMatchInitData {
    playerA: IPlayerInitData;
    playerB: IPlayerInitData;
    ball: IBallInitData;
    stage: string;
}

export interface    IMatchData {
    playerA: IPlayerData;
    playerB: IPlayerData;
    ball: IBallData;
}

export class    Match {

    private _playerA: Player;
    private _playerB: Player;
    private _ball: Ball;
    private _stage?: Phaser.GameObjects.Image;
    private _scoreTxt: Txt;
    private _scoreNicks: string;

    constructor(scene: MatchScene, initData: IMatchInitData) {
        this._playerA = new Player(scene, initData.playerA);
        this._playerB = new Player(scene, initData.playerB);
        this._ball = new Ball(scene, initData.ball);
        if (initData.playerA.hero)
        {
            this._stage = scene.add.image(
                Number(scene.game.config.width) / 2,
                Number(scene.game.config.height),
                initData.stage
            );
            this._stage.setOrigin(0.5, 1);
            this._stage.depth = -1;
        }
        this._scoreNicks =
            ` ${initData.playerA.nick} - ${initData.playerB.nick} `;
        this._scoreTxt = new Txt(scene, {
            xPos: 400,
            yPos: 20,
            content: initData.playerA.score + this._scoreNicks
                        + this._playerB.score,
            style: { fontSize: '20px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 0
        });
    }

    update(data: IMatchData): void {
        if (data.playerA.score != this._playerA.score
                || data.playerB.score != this._playerB.score)
        {
            this._scoreTxt.content = data.playerA.score
                + this._scoreNicks + data.playerB.score;
        }
        this._playerA.update(data.playerA);
        this._playerB.update(data.playerB);
        this._ball.update(data.ball);
    }

    destroy(): void {
        this._scoreTxt.destroy();
        this._ball.destroy();
        this._playerA.destroy();
        this._playerB.destroy();
        this._stage?.destroy();
    }

}
