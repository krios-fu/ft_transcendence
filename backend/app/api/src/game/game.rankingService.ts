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

export interface    RankingData {
    ranking: number;
    category: Category;
}

@Injectable()
export class    GameRankingService {

    getCategory(ranking: number) {
        if (ranking >= 2500)
            return (Category.Platinum);
        if (ranking >= 2000)
            return (Category.Gold);
        if (ranking >= 1500)
            return (Category.Silver);
        if (ranking >= 1000)
            return (Category.Bronze);
        return (Category.Iron);
    }

    /*
    **  K is set so high because the number of matches to determine
    **  a new Player's category is set very low, for testing
    **  and fast presentation purposes. K = 50 during the first 20 matches
    **  should be set for production.
    */
    private getK(category: Category): number {
        if (category === Category.Pending)
            return (200);
        return (32);
    }

    private calcRankingUpdate(ranking: number, kFactor: number, win: boolean,
                                expectedScore: number): number {
        const   winBin = win ? 1 : 0;
    
        return (
            Math.round(ranking + kFactor * (winBin - expectedScore))
        );
    }

    private update(targetData: RankingData, rivalData: RankingData,
                        win: boolean, expect: number): number {
        if (targetData.category === Category.Pending
            || rivalData.category != Category.Pending)
        {
            return (this.calcRankingUpdate(
                targetData.ranking,
                this.getK(targetData.category),
                win,
                expect
            ));
        }
        return (targetData.ranking);
    }

    // Returns the probability of target winning rival
    private calcExpectedScore(targetRanking: number,
                                rivalRanking: number): number {
        return (
            1 / (1 + Math.pow(10, (rivalRanking - targetRanking) / 400))
        );
    }

    // win === 0 A Won | win === 1 B Won
    updateRanking(aData: RankingData, bData: RankingData,
                    win: number): [number, number] {
        let expectA: number;
        let expectB: number;
        let updateA: number;
        let updateB: number;
    
        expectA = this.calcExpectedScore(aData.ranking, bData.ranking);
        expectB = this.calcExpectedScore(bData.ranking, aData.ranking);
        updateA = this.update(aData, bData, win === 0, expectA);
        updateB = this.update(bData, aData, win === 1, expectB);
        return ([updateA, updateB]);
    }

}
