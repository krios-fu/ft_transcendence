import {
    ISelectionInit,
    MenuScene
} from "../scenes/MenuScene";
import { MenuRenderer } from "./MenuRenderer";

enum    Hero {
    None,
    Aquaman,
    Superman,
    BlackPanther
}

enum    Stage {
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

export class    MenuSelector {

    private _heroA: Hero;
    private _heroB: Hero;
    private _heroAConfirmed: boolean;
    private _heroBConfirmed: boolean;
    private _stage: number;
    private _status: SelectionStatus;
    private _renderer: MenuRenderer;

    constructor(scene: MenuScene, initData: ISelectionInit) {
        this._heroA = initData.heroA;
        this._heroB = initData.heroB;
        this._heroAConfirmed = initData.heroAConfirmed;
        this._heroBConfirmed = initData.heroBConfirmed;
        this._stage = initData.stage;
        this._status = initData.status;
        this._renderer = new MenuRenderer(scene, initData);
    }

    get finished(): boolean {
        return (this._status === SelectionStatus.Finished);
    }

    private heroLeft(hero: Hero, player: string): number {
        if (hero === Hero.None)
            hero = Hero.BlackPanther;
        else
            --hero;
        this._renderer.render(this._status, player, hero, false);
        return (hero);
    }

    private heroRight(hero: Hero, player: string): number {
        if (hero === Hero.BlackPanther)
            hero = Hero.None;
        else
            ++hero;
        this._renderer.render(this._status, player, hero, false);
        return (hero);
    }

    private stageLeft(stage: Stage, player: string): number {
        if (stage === Stage.None)
            stage = Stage.Wakanda;
        else
            --stage;
        this._renderer.render(this._status, player, stage, false);
        return (stage);
    }

    private stageRight(stage: Stage, player: string): number {
        if (stage === Stage.Wakanda)
            stage = Stage.None;
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
                this._status = SelectionStatus.Finished;
        }
    }

}
