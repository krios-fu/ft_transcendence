export declare enum HeroId {
    None = 0,
    Aquaman = 1,
    Superman = 2,
    BlackPanther = 3
}
export declare enum StageId {
    None = 0,
    Atlantis = 1,
    Metropolis = 2,
    Wakanda = 3
}
export declare enum SelectionStatus {
    Hero = 0,
    Stage = 1,
    Finished = 2,
    Canceled = 3
}
export interface IGameSelectionData {
    nickPlayerA: string;
    nickPlayerB: string;
    heroA: HeroId;
    heroB: HeroId;
    heroAConfirmed: boolean;
    heroBConfirmed: boolean;
    stage: StageId;
    status: SelectionStatus;
}
export declare class GameSelection {
    private _nickPlayerA;
    private _nickPlayerB;
    private _heroA;
    private _heroB;
    private _heroAConfirmed;
    private _heroBConfirmed;
    private _stage;
    private _status;
    constructor(nickPlayerA: string, nickPlayerB: string);
    set status(input: SelectionStatus);
    get finished(): boolean;
    get data(): IGameSelectionData;
    private heroLeft;
    private heroRight;
    private stageLeft;
    private stageRight;
    nextLeft(player: string): void;
    nextRight(player: string): void;
    confirm(player: string): void;
}
