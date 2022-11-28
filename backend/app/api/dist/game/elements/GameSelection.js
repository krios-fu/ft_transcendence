"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSelection = exports.SelectionStatus = exports.StageId = exports.HeroId = void 0;
var HeroId;
(function (HeroId) {
    HeroId[HeroId["None"] = 0] = "None";
    HeroId[HeroId["Aquaman"] = 1] = "Aquaman";
    HeroId[HeroId["Superman"] = 2] = "Superman";
    HeroId[HeroId["BlackPanther"] = 3] = "BlackPanther";
})(HeroId = exports.HeroId || (exports.HeroId = {}));
var StageId;
(function (StageId) {
    StageId[StageId["None"] = 0] = "None";
    StageId[StageId["Atlantis"] = 1] = "Atlantis";
    StageId[StageId["Metropolis"] = 2] = "Metropolis";
    StageId[StageId["Wakanda"] = 3] = "Wakanda";
})(StageId = exports.StageId || (exports.StageId = {}));
var SelectionStatus;
(function (SelectionStatus) {
    SelectionStatus[SelectionStatus["Hero"] = 0] = "Hero";
    SelectionStatus[SelectionStatus["Stage"] = 1] = "Stage";
    SelectionStatus[SelectionStatus["Finished"] = 2] = "Finished";
    SelectionStatus[SelectionStatus["Canceled"] = 3] = "Canceled";
})(SelectionStatus = exports.SelectionStatus || (exports.SelectionStatus = {}));
class GameSelection {
    constructor(nickPlayerA, nickPlayerB) {
        this._nickPlayerA = nickPlayerA;
        this._nickPlayerB = nickPlayerB;
        this._heroA = HeroId.None;
        this._heroB = HeroId.None;
        this._heroAConfirmed = false;
        this._heroBConfirmed = false;
        this._stage = StageId.None;
        this._status = SelectionStatus.Hero;
    }
    set status(input) {
        this._status = input;
    }
    get finished() {
        return (this._status === SelectionStatus.Finished);
    }
    get data() {
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
    heroLeft(hero) {
        if (hero === HeroId.None)
            hero = HeroId.BlackPanther;
        else
            --hero;
        return (hero);
    }
    heroRight(hero) {
        if (hero === HeroId.BlackPanther)
            hero = HeroId.None;
        else
            ++hero;
        return (hero);
    }
    stageLeft(stage) {
        if (stage === StageId.None)
            stage = StageId.Wakanda;
        else
            --stage;
        return (stage);
    }
    stageRight(stage) {
        if (stage === StageId.Wakanda)
            stage = StageId.None;
        else
            ++stage;
        return (stage);
    }
    nextLeft(player) {
        if (this._status === SelectionStatus.Hero) {
            if (player === "PlayerA"
                && !this._heroAConfirmed)
                this._heroA = this.heroLeft(this._heroA);
            else if (player === "PlayerB"
                && !this._heroBConfirmed)
                this._heroB = this.heroLeft(this._heroB);
        }
        else if (this._status === SelectionStatus.Stage) {
            if (player != "PlayerA")
                return;
            this._stage = this.stageLeft(this._stage);
        }
    }
    nextRight(player) {
        if (this._status === SelectionStatus.Hero) {
            if (player === "PlayerA"
                && !this._heroAConfirmed)
                this._heroA = this.heroRight(this._heroA);
            else if (player === "PlayerB"
                && !this._heroBConfirmed)
                this._heroB = this.heroRight(this._heroB);
        }
        else if (this._status === SelectionStatus.Stage) {
            if (player != "PlayerA")
                return;
            this._stage = this.stageRight(this._stage);
        }
    }
    confirm(player) {
        if (this._status === SelectionStatus.Hero) {
            if (player === "PlayerA"
                && !this._heroAConfirmed)
                this._heroAConfirmed = true;
            else if (player === "PlayerB"
                && !this._heroBConfirmed)
                this._heroBConfirmed = true;
            if (this._heroAConfirmed && this._heroBConfirmed)
                this._status = SelectionStatus.Stage;
        }
        else if (this._status === SelectionStatus.Stage) {
            if (player === "PlayerA")
                this._status = SelectionStatus.Finished;
        }
    }
}
exports.GameSelection = GameSelection;
//# sourceMappingURL=GameSelection.js.map