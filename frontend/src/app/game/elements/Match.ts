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
    private _scoreTxt: Txt;
    private _scoreNicks: string;

    constructor(scene: MatchScene, initData: IMatchInitData) {
        this._playerA = new Player(scene, initData.playerA);
        this._playerB = new Player(scene, initData.playerB);
        this._ball = new Ball(scene, initData.ball);
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

}
