import { Injectable } from "@angular/core";
import { IHeroData } from "../elements/Hero";
import { IMatchData } from "../elements/Match";
import { IBallData } from "../elements/Ball";

@Injectable({
    providedIn: "root"
})
export class    SmoothingService {

    smoothValue(targetValue: number, previousValue: number,
                    step: number, totalSteps: number): number {
        const   diff: number = targetValue - previousValue;
        let     displacement;

        displacement = diff * (step / totalSteps);
        return (previousValue + displacement);
    }

    copySmoothBall(incoming: IBallData,
                    current: IBallData,
                    step: number,
                    totalSteps: number) {
        current.xPos = this.smoothValue(incoming.xPos,
                                                current.xPos,
                                                step, totalSteps);
        current.yPos = this.smoothValue(incoming.yPos,
                                                current.yPos,
                                                step, totalSteps);
        current.xVel = incoming.xVel;
        current.yVel = incoming.yVel;
    }

    copySmoothSnapshot(incoming: IMatchData,
                    current: IMatchData,
                    step: number,
                    totalSteps: number): void {
        this.copySmoothBall(incoming.ball, current.ball,
                                step, totalSteps);
        current.playerA.paddleY = incoming.playerA.paddleY;
        current.playerA.score = incoming.playerA.score;
        if (current.playerA.hero)
            Object.assign(current.playerA.hero, incoming.playerA.hero);
        current.playerB.paddleY = incoming.playerB.paddleY;
        current.playerB.score = incoming.playerB.score;
        if (current.playerB.hero)
            Object.assign(current.playerB.hero, incoming.playerB.hero);
        current.when = incoming.when;
    }

    smoothSnapshot(incoming: IMatchData,
                    current: IMatchData,
                    step: number,
                    totalSteps: number): IMatchData {
        return ({
            ball: {
                xPos: this.smoothValue(incoming.ball.xPos, current.ball.xPos,
                                        step, totalSteps),
                yPos: this.smoothValue(incoming.ball.yPos, current.ball.yPos,
                                        step, totalSteps),
                xVel: incoming.ball.xVel,
                yVel: incoming.ball.yVel
            },
            playerA: {
                paddleY: incoming.playerA.paddleY,
                hero: Object.assign({} as IHeroData, incoming.playerA.hero),
                score: incoming.playerA.score
            },
            playerB: {
                paddleY: incoming.playerB.paddleY,
                hero: Object.assign({} as IHeroData, incoming.playerB.hero),
                score: incoming.playerB.score
            },
            when: incoming.when,
        });
    }

}
