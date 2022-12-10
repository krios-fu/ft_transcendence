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
        const   ballXDisplacement: number =
                    this._ball.displacement('x', secondsElapsed);
        const   ballYDisplacement: number =
                    this._ball.displacement('y', secondsElapsed);
        
        /*
        **  Hero collisions do not work with ball next
        **  position (ballDisplacement) at the moment.
        */
        if (this._ball.xVelocity < 0)
        {
            if (this._ball.checkHeroCollision(this._playerA.hero/*,
                ballXDisplacement, ballYDisplacement*/))
            return (false);
        }
        else if (this._ball.checkHeroCollision(this._playerB.hero/*,
                    ballXDisplacement, ballYDisplacement*/))
            return (false);
        return (super.ballUpdate(secondsElapsed));
    }

    override update(): boolean {
        const   currentTime: number = Date.now();
        const   secondsElapsed: number = this.deltaTime(currentTime);
        let     pointTransition: boolean = false;     
        
        this._playerA.update(secondsElapsed, this._height);
        this._playerB.update(secondsElapsed, this._height);
        if (this.ballUpdate(secondsElapsed))
        {
            pointTransition = true;
            if (this.getWinnerNick() != "")
                this._state = GameState.Finished;
        }
        // Sets hero's position to initial one if its action ended.
        this._playerA.checkHeroEnd();
        this._playerB.checkHeroEnd();
        this._lastUpdate = currentTime;
        return (pointTransition);
    }

}
