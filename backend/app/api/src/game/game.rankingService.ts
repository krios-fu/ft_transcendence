import { Injectable } from "@nestjs/common";
import { Category } from "../user/user.entity";

/*
**  Using Elo Rating system.
**
**  https://en.wikipedia.org/wiki/Elo_rating_system
**
**  https://www.chess.com/blog/wizzy232/how-to-calculate-the-elo-system-of-rating
**
*/

@Injectable()
export class    GameRankingService {

    getCategory(ranking: number) {
        if (ranking >= 2500)
            return (Category.Platinum);
        if (ranking >= 2000)
            return (Category.Gold);
        if (ranking >= 1500)
            return (Category.Silver);
        if (ranking >= 1100)
            return (Category.Bronze);
        return (Category.Iron);
    }

    // Returns the probability of target winning rival
    private calcExpectedScore(targetRanking: number,
                                rivalRanking: number): number {
        return (
            1 / (1 + Math.pow(10, (rivalRanking - targetRanking) / 400))
        );
    }

    // win === 0 Lost | win === 1 Won
    private calcRankingUpdate(ranking: number, win: number,
                                expectedScore: number): number {
        return (
            Math.round(ranking + 32 * (win - expectedScore))
        );
    }

    // win === 0 A Won | win === 1 B Won
    updateRanking(rankingA: number, rankingB: number,
                    win: number): [number, number] {
        let expectA: number;
        let expectB: number;
        let updateA: number;
        let updateB: number;
    
        expectA = this.calcExpectedScore(rankingA, rankingB);
        expectB = this.calcExpectedScore(rankingB, rankingA);
        if (win === 0)
            updateA = this.calcRankingUpdate(rankingA, 1, expectA);
        else
            updateA = this.calcRankingUpdate(rankingA, 0, expectA);
        updateB = this.calcRankingUpdate(rankingB, win, expectB);
        return ([updateA, updateB]);
    }

}
