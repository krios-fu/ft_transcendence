import { WinnerEntity } from "./winner/winner.entity";
import { LoserEntity } from "./loser/loser.entity";

export class    MatchDto {

    winner: WinnerEntity;
    loser: LoserEntity;
    official: boolean;

}
