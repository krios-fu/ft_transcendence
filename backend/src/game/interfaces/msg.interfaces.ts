import { IGameSelectionData } from "../elements/GameSelection";

export type GameRole = "Spectator" | "PlayerA" | "PlayerB";

export interface    IMenuInit {
    role: GameRole;
    selection: IGameSelectionData;
}
