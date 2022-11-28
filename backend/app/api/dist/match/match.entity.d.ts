import { WinnerEntity } from "src/match/winner/winner.entity";
import { LoserEntity } from "src/match/loser/loser.entity";
export declare class MatchEntity {
    id: number;
    winner: WinnerEntity;
    loser: LoserEntity;
    official: boolean;
    playedAt: Date;
}
