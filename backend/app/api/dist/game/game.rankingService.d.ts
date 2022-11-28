import { Category } from "../user/user.entity";
export interface RankingData {
    ranking: number;
    category: Category;
}
export declare class GameRankingService {
    getCategory(ranking: number): Category.Iron | Category.Bronze | Category.Silver | Category.Gold | Category.Platinum;
    private getK;
    private calcRankingUpdate;
    private update;
    private calcExpectedScore;
    updateRanking(aData: RankingData, bData: RankingData, win: number): [number, number];
}
