import { UserEntity } from "src/user/user.entity";

export class    MatchDto {

    winner: UserEntity;
    loser: UserEntity;
    winnerScore: number;
    loserScore: number;
    official: boolean;

}
