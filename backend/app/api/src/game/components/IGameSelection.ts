import { UserEntity } from "src/user/user.entity";

export interface    IGameSelection {
    playerA: UserEntity;
    playerB: UserEntity;
    //0: aquaman, 1: superman, 2: blackPanther, 3: none
    heroA: number;
    heroB: number;
    //0: atlantis, 1: metropolis, 2: wakanda, 3: none
    stage: number;
}
