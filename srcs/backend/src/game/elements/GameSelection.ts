import { Category } from "../../user/enum/category.enum";

export enum HeroId {
    Aquaman,
    Superman,
    BlackPanther
}

export enum StageId {
    Atlantis,
    Metropolis,
    Wakanda
}

export enum SelectionStatus {
    Hero,
    Stage,
    Finished,
    Canceled
}

export interface    IGameSelectionInit {
    nickPlayerA: string;
    nickPlayerB: string;
    categoryA: Category;
    categoryB: Category;
    avatarA: string;
    avatarB: string;
}

export interface    IGameSelectionData {
    nickPlayerA: string;
    nickPlayerB: string;
    categoryA: string;
    categoryB: string;
    avatarA: string;
    avatarB: string;
    heroA?: HeroId;
    heroB?: HeroId;
    heroAConfirmed?: boolean;
    heroBConfirmed?: boolean;
    stage?: StageId;
    timeoutDate?: number;
    status: SelectionStatus;
}

export class    GameSelection {

    private _nickPlayerA: string;
    private _nickPlayerB: string;
    private _categoryA: Category;
    private _categoryB: Category;
    private _avatarA: string;
    private _avatarB: string;
    private _heroA?: HeroId;
    private _heroB?: HeroId;
    private _heroAConfirmed?: boolean;
    private _heroBConfirmed?: boolean;
    private _stage?: number;
    private _timeoutDate?: number;
    private _timeout?: NodeJS.Timeout;
    private _status: SelectionStatus;

    constructor(initData: IGameSelectionInit, hero: boolean) {
        this._nickPlayerA = initData.nickPlayerA;
        this._nickPlayerB = initData.nickPlayerB;
        this._categoryA = initData.categoryA;
        this._categoryB = initData.categoryB;
        this._avatarA = initData.avatarA;
        this._avatarB = initData.avatarB;
        if (hero)
        {
            this._heroA = HeroId.Aquaman;
            this._heroB = HeroId.Aquaman;
            this._heroAConfirmed = false;
            this._heroBConfirmed = false;
            this._stage = StageId.Atlantis;
            this._timeoutDate = Date.now() + 1.5 * 60 * 1000;
        }
        this._status = SelectionStatus.Hero;
    }

    set status(input: SelectionStatus) {
        this._status = input;
    }

    get status(): SelectionStatus {
        return (this._status);
    }

    get finished(): boolean {
        return (this._status === SelectionStatus.Finished);
    }

    static stringifyCategory(cat: Category): string {
        const   s: string[] = [
            "Pending",
            "Iron",
            "Bronze",
            "Silver",
            "Gold",
            "Platinum"
        ];

        return (s[cat]);
    }

    get data(): IGameSelectionData {
        return ({
            nickPlayerA: this._nickPlayerA,
            nickPlayerB: this._nickPlayerB,
            categoryA: GameSelection.stringifyCategory(this._categoryA),
            categoryB: GameSelection.stringifyCategory(this._categoryB),
            avatarA: this._avatarA,
            avatarB: this._avatarB,
            heroA: this._heroA,
            heroB: this._heroB,
            heroAConfirmed: this._heroAConfirmed,
            heroBConfirmed: this._heroBConfirmed,
            stage: this._stage,
            timeoutDate: this._timeoutDate,
            status: this._status
        });
    }

    get heroMenuTimeoutDate(): number | undefined {
        return (this._timeoutDate);
    }

    set heroMenuTimeout(timeout: NodeJS.Timeout | undefined) {
        if (!this._timeoutDate)
            return ;
        this._timeout = timeout;
    }

    clearHeroMenuTimeout(): void {
        if (!this._timeout)
            return ;
        clearTimeout(this._timeout);
        this._timeout = undefined;
    }

    private heroLeft(hero: HeroId): HeroId {
        if (hero === HeroId.Aquaman)
            hero = HeroId.BlackPanther;
        else
            --hero;
        return (hero);
    }

    private heroRight(hero: HeroId): HeroId {
        if (hero === HeroId.BlackPanther)
            hero = HeroId.Aquaman;
        else
            ++hero;
        return (hero);
    }

    private stageLeft(stage: StageId): StageId {
        if (stage === StageId.Atlantis)
            stage = StageId.Wakanda;
        else
            --stage;
        return (stage);
    }

    private stageRight(stage: StageId): StageId {
        if (stage === StageId.Wakanda)
            stage = StageId.Atlantis;
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

    forceConfirm(): void {
        if (!this._timeoutDate)
            return ;
        this._heroAConfirmed = true;
        this._heroBConfirmed = true;
        this._status = SelectionStatus.Finished;
    }

}
