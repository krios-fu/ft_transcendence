import { IGameSelectionData } from './GameSelection';
import {
    Game,
    GameState
} from './Game';

export class   GameHero extends Game {

    constructor (gameSelection: IGameSelectionData) {
        super(gameSelection);
    }

    override ballUpdate(secondsElapsed: number): boolean {
        if (this._ball.checkHeroCollision(this._playerA.hero,
                                            secondsElapsed))
            return (false);
        if (this._ball.checkHeroCollision(this._playerB.hero,
                                                secondsElapsed))
            return (false);
        return (super.ballUpdate(secondsElapsed));
    }

    override update(): boolean {
        const   currentTime: number = Date.now();
        const   secondsElapsed: number = this.deltaTime(currentTime);
        let     pointTransition: boolean = false;     
    
        this._playerA.updatePaddle(this._height);
        this._playerB.updatePaddle(this._height);
        //Just marks corresponding hero sprite as active
        this._playerA.processHeroInvocation();
        this._playerB.processHeroInvocation();
        if (this.ballUpdate(secondsElapsed))
        {
            pointTransition = true;
            if (this.getWinnerNick() != "")
                this._state = GameState.Finished;
        }
        this._playerA.updateHero(secondsElapsed);
        this._playerB.updateHero(secondsElapsed);
        this._lastUpdate = currentTime;
        return (pointTransition);
    }

}
