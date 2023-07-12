import { IMatchInitData } from "../elements/Match";

export type GameRole = "PlayerA"
                    | "PlayerB"
                    | "Spectator";

export type GameScene = "Start"
                            | "Menu"
                            | "MenuHero"
                            | "Player"
                            | "ClassicPlayer"
                            | "Spectator"
                            | "End";

export interface   ISelectionData {
    nickPlayerA: string;
    nickPlayerB: string;
    categoryA: string;
    categoryB: string;
    avatarA: string;
    avatarB: string;
    heroA: number;
    heroB: number;
    heroAConfirmed: boolean;
    heroBConfirmed: boolean;
    stage: number;
    timeoutDate: number;
    status: number;
}

export interface   IMenuInit {
    role: GameRole;
    selection: ISelectionData;
}

export interface    IMatchSceneInit {
    role: GameRole;
    matchData: IMatchInitData;
    recover?: boolean;
}
