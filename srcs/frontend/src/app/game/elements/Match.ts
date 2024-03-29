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
import {
    AStage,
    StageName
} from "./AStage";
import { Atlantis } from "./Atlantis";
import { Metropolis } from "./Metropolis";
import { Wakanda } from "./Wakanda";
import { SoundService } from "../services/sound.service";
import { PointTitle } from "./PointTitle";

export interface    IMatchInitData {
    playerA: IPlayerInitData;
    playerB: IPlayerInitData;
    ball: IBallInitData;
    stage: StageName;
    when: number;
}

export interface    IMatchData {
    playerA: IPlayerData;
    playerB: IPlayerData;
    ball: IBallData;
    when: number;
}

export class    Match {

    private _playerA: Player;
    private _playerB: Player;
    private _ball: Ball;
    private _stage?: AStage;
    private _scoreTxt: Txt;
    private _pointTitle: PointTitle;
    private _scoreNicks: string;
    private _when: number;

    constructor(scene: MatchScene, initData: IMatchInitData,
                    showInitCount: boolean,
                    private readonly soundService?: SoundService) {
        this._playerA = new Player(scene, initData.playerA, soundService);
        this._playerB = new Player(scene, initData.playerB, soundService);
        this._ball = new Ball(scene, initData.ball, this.soundService);
        if (initData.playerA.hero && this.soundService)
        {
            if (initData.stage === StageName.Atlantis)
                this._stage = new Atlantis(scene, this.soundService);
            else if (initData.stage === StageName.Metropolis)
                this._stage = new Metropolis(scene, this.soundService);
            else
                this._stage = new Wakanda(scene, this.soundService);
        }
        this._scoreNicks =
            ` ${initData.playerA.nick} - ${initData.playerB.nick} `;
        this._scoreTxt = new Txt(scene, {
            xPos: 400,
            yPos: 20,
            content: initData.playerA.score + this._scoreNicks
                        + this._playerB.score,
            style: { fontSize: '20px', color: '#fff', backgroundColor: '#000' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 0
        });
        this._when = initData.when;
        this._pointTitle = new PointTitle(scene);
        if (this._ball.data.xVel === 0
                && this._playerA.score === 0
                && this._playerB.score === 0
                && showInitCount)
            this._pointTitle.display();
    }

    // Returns a Deep Copy of IPlayerData
    private static _clonePlayer(data: IPlayerData): IPlayerData {
        return ({
            paddleY: data.paddleY,
            hero: data.hero ? {...data.hero} : undefined,
            score: data.score
        });
    }

    // Returns a Deep Copy of IMatchData
    static cloneMatchData(data: IMatchData): IMatchData {
        return ({
            ball: {...data.ball},
            playerA: this._clonePlayer(data.playerA),
            playerB: this._clonePlayer(data.playerB),
            when: data.when
        });
    }

    static copyMatchData(dst: IMatchData, src: IMatchData): void {
        dst.ball = {...src.ball};
        dst.playerA = this._clonePlayer(src.playerA);
        dst.playerB = this._clonePlayer(src.playerB);
        dst.when = src.when;
    }

    static initToData(data: IMatchInitData): IMatchData {
        return ({
            ball: {
                xPos: data.ball.xPos,
                yPos: data.ball.yPos,
                xVel: data.ball.xVel,
                yVel: data.ball.yVel
            },
            playerA: Player.initToData(data.playerA),
            playerB: Player.initToData(data.playerB),
            when: data.when
        });
    }

    get nickA(): string {
        return (this._playerA.nick);
    }

    get nickB(): string {
        return (this._playerB.nick);
    }

    get stage(): StageName | undefined {
        if (!this._stage)
            return (undefined);
        if (this._stage instanceof Atlantis)
            return (StageName.Atlantis);
        if (this._stage instanceof Metropolis)
            return (StageName.Metropolis);
        return (StageName.Wakanda);
    }

    get heroA(): string | undefined {
        return (this._playerA.hero);
    }

    get heroB(): string | undefined {
        return (this._playerB.hero);
    }

    get snapshot(): IMatchData {    
        return ({
            playerA: this._playerA.data,
            playerB: this._playerB.data,
            ball: this._ball.data,
            when: this._when
        });
    }

    stopPointTitle(): void {
        this._pointTitle.stop();
    }

    update(data: IMatchData | undefined): void {
        if (!data)
            return ;
        if (data.playerA.score != this._playerA.score
                || data.playerB.score != this._playerB.score)
        {
            this._scoreTxt.content = data.playerA.score
                + this._scoreNicks + data.playerB.score;
        }
        this._playerA.update(data.playerA);
        this._playerB.update(data.playerB);
        this._ball.update(data.ball);
        this._stage?.update();
        this._when = data.when;
    }

    destroy(): void {
        this._scoreTxt.destroy();
        this._ball.destroy();
        this._playerA.destroy();
        this._playerB.destroy();
        this._stage?.destroy();
        this._pointTitle.destroy();
    }

}
