import { Injectable } from "@nestjs/common";
import { IBallData } from "./elements/Ball";
import {
    IGameData,
    IGamePhysicsData,
    IInputData
} from "./elements/Game";
import { Hero } from "./elements/Hero";
import { Paddle } from "./elements/Paddle";
import {
    IPlayerData,
    IPlayerPhysicsData
} from "./elements/Player";
import { GameBallPhysicsService } from "./game.ballPhysics.service";
import { GameHeroPhysicsService } from "./game.heroPhysics.service";

@Injectable()
export class    GameSnapshotService {

    constructor(
        private readonly ballPhysicsService: GameBallPhysicsService,
        private readonly heroPhysicsService: GameHeroPhysicsService
    ) {}

    private _playerUpdateData(data: IPlayerPhysicsData,
                                targetTime: number): IPlayerData {
        return ({
            paddleY: data.paddleY,
            hero: data.hero
                    ? this.heroPhysicsService.update(data.hero, targetTime)
                    : undefined,
            score: data.score
        });
    }

    private _ballUpdateData(data: IGamePhysicsData,
                                targetTime: number): IBallData {
        return (
            this.ballPhysicsService.update(data, targetTime)
        );
    }

    update(initSnapshot: Readonly<IGamePhysicsData>,
            targetTime: number): [IGameData, boolean]
    {
        const   endBall: IBallData = this._ballUpdateData(
                    initSnapshot, targetTime
        );
        const   endPlayerA: IPlayerData = this._playerUpdateData(
                    initSnapshot.playerA, targetTime
        );
        const   endPlayerB: IPlayerData = this._playerUpdateData(
                    initSnapshot.playerB, targetTime
        );
        let     pointTransition: boolean = false;
    
        if (initSnapshot.ball.xVel != 0
                && endBall.xVel === 0)
        {
            if (initSnapshot.ball.xVel > 0)
                endPlayerA.score += 1;
            else
                endPlayerB.score += 1;
            pointTransition = true;
        }
        return([
            {
                ball: endBall,
                playerA: endPlayerA,
                playerB: endPlayerB,
                when: targetTime
            },
            pointTransition
        ]);
    }

    private _clonePlayer(src: IPlayerData): IPlayerData
    {
        return ({
            paddleY: src.paddleY,
            hero: src.hero ? {...src.hero} : undefined,
            score: src.score
        });
    }

    clone(src: Readonly<IGameData>): IGameData {
        return {
            ball: {...src.ball},
            playerA: this._clonePlayer(src.playerA),
            playerB: this._clonePlayer(src.playerB),
            when: src.when
        };
    }

    private _copyPlayer(src: Readonly<IPlayerData>, dst: IPlayerData): void {
        dst.paddleY = src.paddleY;
        dst.hero = src.hero ? {...src.hero} : undefined;
        dst.score = src.score;
    }

    copy(src: Readonly<IGameData>, dst: IGameData): void {    
        dst.ball = {...src.ball};
        this._copyPlayer(src.playerA, dst.playerA);
        this._copyPlayer(src.playerB, dst.playerB);
        dst.when = src.when;
    }

    applyInput(initSnapshot: Readonly<IGameData>,
                input: IInputData[]): IGameData {
        const   endSnapshot: IGameData = this.clone(initSnapshot);
    
        input.forEach(elem => {
            if (elem.paddle)
            {
                if (elem.playerA)
                {
                    endSnapshot.playerA.paddleY =
                        Paddle.input(elem.up, endSnapshot.playerA.paddleY);
                }
                else
                {
                    endSnapshot.playerB.paddleY =
                        Paddle.input(elem.up, endSnapshot.playerB.paddleY);
                }
            }
            else
            {//Just marks corresponding hero sprite as active
                if (elem.playerA)
                {
                    endSnapshot.playerA.hero =
                        Hero.invocation(elem.up, endSnapshot.playerA.hero);
                }
                else
                {
                    endSnapshot.playerB.hero =
                        Hero.invocation(elem.up, endSnapshot.playerB.hero);
                }
            }
        });
        return (endSnapshot);
    }

}
