export enum HeroId {
    None,
    Aquaman,
    Superman,
    BlackPanther
}

export enum StageId {
    None,
    Atlantis,
    Metropolis,
    Wakanda
}

export enum SelectionStatus {
    Hero,
    Stage,
    Finished
}

export interface    IGameSelectionData {
    nickPlayerA: string;
    nickPlayerB: string;
    heroA: HeroId;
    heroB: HeroId;
    heroAConfirmed: boolean;
    heroBConfirmed: boolean;
    stage: StageId;
    status: SelectionStatus;
}

export class    GameSelection {

    private _nickPlayerA: string;
    private _nickPlayerB: string;
    private _heroA: HeroId;
    private _heroB: HeroId;
    private _heroAConfirmed: boolean;
    private _heroBConfirmed: boolean;
    private _stage: number;
    private _status: SelectionStatus;

    constructor(nickPlayerA: string, nickPlayerB: string) {
        this._nickPlayerA = nickPlayerA;
        this._nickPlayerB = nickPlayerB;
        this._heroA = HeroId.None;
        this._heroB = HeroId.None;
        this._heroAConfirmed = false;
        this._heroBConfirmed = false;
        this._stage = StageId.None;
        this._status = SelectionStatus.Hero;
    }

    get finished(): boolean {
        return (this._status === SelectionStatus.Finished);
    }

    get data(): IGameSelectionData {
        return ({
            nickPlayerA: this._nickPlayerA,
            nickPlayerB: this._nickPlayerB,
            heroA: this._heroA,
            heroB: this._heroB,
            heroAConfirmed: this._heroAConfirmed,
            heroBConfirmed: this._heroBConfirmed,
            stage: this._stage,
            status: this._status
        });
    }

    private heroLeft(hero: HeroId): HeroId {
        if (hero === HeroId.None)
            hero = HeroId.BlackPanther;
        else
            --hero;
        return (hero);
    }

    private heroRight(hero: HeroId): HeroId {
        if (hero === HeroId.BlackPanther)
            hero = HeroId.None;
        else
            ++hero;
        return (hero);
    }

    private stageLeft(stage: StageId): StageId {
        if (stage === StageId.None)
            stage = StageId.Wakanda;
        else
            --stage;
        return (stage);
    }

    private stageRight(stage: StageId): StageId {
        if (stage === StageId.Wakanda)
            stage = StageId.None;
        else
            ++stage;
        return (stage);
    }

    nextLeft(player: string): void {
        if (this._status === SelectionStatus.Hero)
        {
            if (player === "PlayerA"
                    && !this._heroAConfirmed)
                this._heroA = this.heroLeft(this._heroA);
            else if (player === "PlayerB"
                    && !this._heroBConfirmed)
                this._heroB = this.heroLeft(this._heroB);
        }
        else if (this._status === SelectionStatus.Stage)
        {
            if (player != "PlayerA")
                return ;
            this._stage = this.stageLeft(this._stage);
        }
    }

    nextRight(player: string): void {
        if (this._status === SelectionStatus.Hero)
        {
            if (player === "PlayerA"
                    && !this._heroAConfirmed)
                this._heroA = this.heroRight(this._heroA);
            else if (player === "PlayerB"
                    && !this._heroBConfirmed)
                this._heroB = this.heroRight(this._heroB);
        }
        else if (this._status === SelectionStatus.Stage)
        {
            if (player != "PlayerA")
                return ;
            this._stage = this.stageRight(this._stage);
        }
    }

    confirm(player: string): void {
        if (this._status === SelectionStatus.Hero)
        {
            if (player === "PlayerA"
                && !this._heroAConfirmed)
                this._heroAConfirmed = true;
            else if (player === "PlayerB"
                && !this._heroBConfirmed)
                this._heroBConfirmed = true;
            if (this._heroAConfirmed && this._heroBConfirmed)
                this._status = SelectionStatus.Stage;
        }
        else if (this._status === SelectionStatus.Stage)
        {
            if (player === "PlayerA")
                this._status = SelectionStatus.Finished;
        }
    }

}
