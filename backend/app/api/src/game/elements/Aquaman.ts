import {
    IHero,
    IHeroClientStart,
    IHeroData
} from "./IHero";

/*
**  The trident's tip area is represented by
**  an invisible circle that moves at a specific velocity
**  from the top or bottom (depending on the player's choice)
**  right or left (depending on the player's side) towards
**  a specific point near the center of the game area
**  following a straight line.
*/
interface   TridentI {
    xPosInit: number;
    yPosInit: number;
    xPosEnd: number;
    yPosEnd: number;
    xPos: number;
    yPos: number;
    radius: number;
    xVelocity: number;
    yVelocity: number;
}

export class    Aquaman implements IHero {

    private _name: string;
    private _isActing: boolean;
    private _pointInvocation: boolean;
    private _activeTrident: number; //-1: none, 0: lower, 1: upper
    private _hitBall: boolean;
    private _upperTrident: TridentI;
    private _lowerTrident: TridentI;
    private _playerSide: number; //0: left, 1: right
    private _noEndUpdate: (xDisplacement: number, xPos: number,
                            xPosEnd: number) => boolean;

    constructor(playerSide: number, gameWidth: number, gameHeight: number) {
        this._name = "aquaman";
        this._isActing = false;
        this._pointInvocation = false;
        this._activeTrident = -1;
        this._hitBall = false;
        this._upperTrident = this.initUpperTrident(playerSide, gameWidth);
        this._lowerTrident = this.initLowerTrident(playerSide, gameWidth,
                                                    gameHeight);
        this._playerSide = playerSide;
        // Selects a function at runtime
        this._noEndUpdate = playerSide ? this.rightNoEndUpdate
                                            : this.leftNoEndUpdate;
    }

    private initUpperTrident(playerSide: number, gameWidth: number): TridentI {
        let trident: any = {};

        trident.radius = 20;
        if (playerSide === 0) //0: left, else: right
        {
            trident.xPosInit = 80;
            trident.yPosInit = 0;
            trident.xPosEnd = 335;
            trident.yPosEnd = 255;
            trident.xPos = trident.xPosInit;
            trident.yPos = trident.yPosInit;
            trident.xVelocity = 800;
            trident.yVelocity = 800;
        }
        else
        {
            trident.xPosInit = gameWidth - 80;
            trident.yPosInit = 0;
            trident.xPosEnd = 465;
            trident.yPosEnd = 255;
            trident.xPos = trident.xPosInit;
            trident.yPos = trident.yPosInit;
            trident.xVelocity = -800;
            trident.yVelocity = 800;
        }
        return (trident);
    }

    private initLowerTrident(playerSide: number, gameWidth: number,
                        gameHeight: number): TridentI {
        let trident: any = {};

        trident.radius = 20;
        if (playerSide === 0) //0: left, else: right
        {
            trident.xPosInit = 80;
            trident.yPosInit = gameHeight;
            trident.xPosEnd = 335;
            trident.yPosEnd = gameHeight - 255;
            trident.xPos = trident.xPosInit;
            trident.yPos = trident.yPosInit;
            trident.xVelocity = 800;
            trident.yVelocity = -800;
        }
        else
        {
            trident.xPosInit = gameWidth - 80;
            trident.yPosInit = gameHeight;
            trident.xPosEnd = 465;
            trident.yPosEnd = gameHeight - 255;
            trident.xPos = trident.xPosInit;
            trident.yPos = trident.yPosInit;
            trident.xVelocity = -800;
            trident.yVelocity = -800;
        }
        return (trident);
    }

    get name(): string {
        return (this._name);
    }

    get isActing(): boolean {
        return (this._isActing);
    }

    get pointInvocation(): boolean {
        return (this._pointInvocation);
    }

    /*
    **  button === 1 = W click
    **  button === 0 = S click
    */
    invocation(button: number): void {
        if (this._pointInvocation != false)
            return ;
        this._isActing = true;
        this._pointInvocation = true;
        this._activeTrident = button != 0
                                ? 1 : 0;
    }

    private getActiveTrident(): TridentI {
        if (this._activeTrident === -1)
            return (undefined);
        return (this._activeTrident != 0
                    ? this._upperTrident : this._lowerTrident);
    }

    private leftNoEndUpdate(xDisplacement: number, xPos: number,
                                xPosEnd: number): boolean {
        return (xPos + xDisplacement <= xPosEnd);
    }

    private rightNoEndUpdate(xDisplacement: number, xPos: number,
                                xPosEnd: number): boolean {
        return (xPos + xDisplacement >= xPosEnd);
    }

    private updateTrident(seconds: number, trident: TridentI): void {
        const   xDisplacement = seconds * trident.xVelocity;
        const   yDisplacement = seconds * trident.yVelocity;    
        
        if (this._noEndUpdate(xDisplacement, trident.xPos,
                trident.xPosEnd))
        {
            trident.xPos += xDisplacement;
            trident.yPos += yDisplacement;
        }
        else
        {
            trident.xPos = trident.xPosEnd;
            trident.yPos = trident.yPosEnd;
        }
    }

    checkBallHit(ballXPosition: number, ballYPosition: number,
                    ballRadius: number): [number, number] {
        const   trident: TridentI = this.getActiveTrident();
        let     ballTridentXDist: number;
        let     ballTridentYDist: number;

        if (!trident)
            return (undefined);
        ballTridentXDist = Math.abs(ballXPosition - trident.xPos);
        ballTridentYDist = Math.abs(ballYPosition - trident.yPos);
        if (this._hitBall === false
            && ballTridentXDist - ballRadius <= trident.radius
            && ballTridentYDist - ballRadius <= trident.radius)
        {
            this._hitBall = true;
            return ([trident.xVelocity, trident.yVelocity]);
        }
        return (undefined);
    }

    private endAction(trident: TridentI): void {
        this._isActing = false;
        trident.xPos = trident.xPosInit;
        trident.yPos = trident.yPosInit;
        this._activeTrident = -1;
        this._hitBall = false;
        this._pointInvocation = false; // For testing
    }

    checkEnd(): void {
        let trident: TridentI;
    
        if (this._activeTrident === -1)
            return ;
        trident = this._activeTrident != 0
                    ? this._upperTrident : this._lowerTrident;
        if (trident.xPos === trident.xPosEnd)
            this.endAction(trident);
    }

    update(seconds: number): void {
        let trident: TridentI;
    
        if (this._activeTrident === -1)
            return ;
        trident = this._activeTrident != 0
                    ? this._upperTrident : this._lowerTrident;
        this.updateTrident(seconds, trident);
    }

    data(): IHeroData {
        return ({
            xPos: this._upperTrident.xPos,
            yPos: this._upperTrident.yPos,
            lowXPos: this._lowerTrident.xPos,
            lowYPos: this._lowerTrident.yPos,
            activeTrident: this._activeTrident,
            active: true
        });
    }

    clientStartData(): IHeroClientStart {
        return ({
            playerSide: this._playerSide,
            name: this._name,
            xPos: this._upperTrident.xPos,
            yPos: this._upperTrident.yPos,
            lowXPos: this._lowerTrident.xPos,
            lowYPos: this._lowerTrident.yPos,
            xOrigin: this._playerSide ? 0 : 1,
            yOrigin: 1,
            lowXOrigin: this._playerSide ? 0 : 1,
            lowYOrigin: 0
        });
    }

}
