import { ISelectionData } from "../scenes/MenuScene";
import { MenuHeroRenderer } from "./MenuHeroRenderer";

enum    Hero {
    Aquaman,
    Superman,
    BlackPanther
}

enum    Stage {
    Atlantis,
    Metropolis,
    Wakanda
}

export enum SelectionStatus {
    Hero,
    Stage,
    Finished
}

export class    MenuSelector {

    private _heroA: Hero;
    private _heroB: Hero;
    private _heroAConfirmed: boolean;
    private _heroBConfirmed: boolean;
    private _stage: number;
    private _status: SelectionStatus;
    private _renderer: MenuHeroRenderer;

    constructor(initData: ISelectionData, renderer: MenuHeroRenderer) {
        this._heroA = initData.heroA;
        this._heroB = initData.heroB;
        this._heroAConfirmed = initData.heroAConfirmed;
        this._heroBConfirmed = initData.heroBConfirmed;
        this._stage = initData.stage;
        this._status = initData.status;
        this._renderer = renderer;
    }

    get finished(): boolean {
        return (this._status === SelectionStatus.Finished);
    }

    private heroLeft(hero: Hero, player: string): number {
        if (hero === Hero.Aquaman)
            hero = Hero.BlackPanther;
        else
            --hero;
        this._renderer.render(this._status, player, hero, false);
        return (hero);
    }

    private heroRight(hero: Hero, player: string): number {
        if (hero === Hero.BlackPanther)
            hero = Hero.Aquaman;
        else
            ++hero;
        this._renderer.render(this._status, player, hero, false);
        return (hero);
    }

    private stageLeft(stage: Stage, player: string): number {
        if (stage === Stage.Atlantis)
            stage = Stage.Wakanda;
        else
            --stage;
        this._renderer.render(this._status, player, stage, false);
        return (stage);
    }

    private stageRight(stage: Stage, player: string): number {
        if (stage === Stage.Wakanda)
            stage = Stage.Atlantis;
        else
            ++stage;
        this._renderer.render(this._status, player, stage, false);
        return (stage);
    }

    nextLeft(player: string): void {
        if (this._status === SelectionStatus.Hero)
        {
            if (player === "PlayerA"
                    && !this._heroAConfirmed)
                this._heroA = this.heroLeft(this._heroA, player);
            else if (player === "PlayerB"
                    && !this._heroBConfirmed)
                this._heroB = this.heroLeft(this._heroB, player);
        }
        else if (this._status === SelectionStatus.Stage)
        {
            if (player != "PlayerA")
                return ;
            this._stage = this.stageLeft(this._stage, player);
        }
    }

    nextRight(player: string): void {
        if (this._status === SelectionStatus.Hero)
        {
            if (player === "PlayerA"
                    && !this._heroAConfirmed)
                this._heroA = this.heroRight(this._heroA, player);
            else if (player === "PlayerB"
                    && !this._heroBConfirmed)
                this._heroB = this.heroRight(this._heroB, player);
        }
        else if (this._status === SelectionStatus.Stage)
        {
            if (player != "PlayerA")
                return ;
            this._stage = this.stageRight(this._stage, player);
        }
    }

    confirm(player: string): void {
        if (this._status === SelectionStatus.Hero)
        {
            if (player === "PlayerA"
                && !this._heroAConfirmed)
            {
                this._heroAConfirmed = true;
                this._renderer.render(this._status, player, this._heroA, true);
            }
            else if (player === "PlayerB"
                && !this._heroBConfirmed)
            {
                this._heroBConfirmed = true;
                this._renderer.render(this._status, player, this._heroB, true);
            }
            if (this._heroAConfirmed && this._heroBConfirmed)
            {
                this._status = SelectionStatus.Stage;
                this._renderer.changeStatus(this._status);
            }
        }
        else if (this._status === SelectionStatus.Stage)
        {
            if (player === "PlayerA")
            {
                this._status = SelectionStatus.Finished;
                this._renderer.finish(this._stage);
            }
        }
    }

    private updateHeroes(data: ISelectionData): void {
        if (data.heroAConfirmed && !this._heroAConfirmed)
        {
            this._heroAConfirmed = true;
            this._renderer.render(this._status, "PlayerA", this._heroA, true);
        }
        else if (data.heroA != this._heroA)
        {
            this._heroA = data.heroA;
            this._renderer.render(this._status, "PlayerA", this._heroA, false);
        }
        if (data.heroBConfirmed && !this._heroBConfirmed)
        {
            this._heroBConfirmed = true;
            this._renderer.render(this._status, "PlayerB", this._heroB, true);
        }
        else if (data.heroB != this._heroB)
        {
            this._heroB = data.heroB;
            this._renderer.render(this._status, "PlayerB", this._heroB, false);
        }
    }

    serverUpdate(data: ISelectionData, role?: string): void {
        if (this._status === SelectionStatus.Hero
            && data.status != this._status)
        {
            this.updateHeroes(data);
            this._status = data.status;
            this._renderer.changeStatus(this._status);
        }
        if (this._status === SelectionStatus.Hero)
            this.updateHeroes(data);
        else
        {
            if (this._stage != data.stage)
            {
                this._stage = data.stage;
                this._renderer.render(this._status, "PlayerA", this._stage, false);
            }
            else if (role === "PlayerB")
                this._renderer.finish(this._stage);
        }
    }

}
