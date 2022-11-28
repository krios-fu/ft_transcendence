import { UserEntity } from "src/user/user.entity";
import { MatchEntity } from "../match.entity";
export declare class WinnerEntity {
    id: number;
    user: UserEntity;
    match: MatchEntity;
    score: number;
}
