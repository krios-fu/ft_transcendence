export interface    IHeroData {
    xPos: number;
    yPos: number;
    lowXPos: number;
    lowYPos: number;
    active: number; //0: inactive, 1: lower, 2: upper
    pointInvocation: boolean;
}

export interface    IHeroPhysicsData {
    readonly hero: ISprite;
    readonly heroLow: ISprite;
    readonly active: number; //0: inactive, 1: lower, 2: upper
    readonly pointInvocation: boolean;
}

export interface    IHeroClientStart {
    playerSide: number;
    name: string;
    sprite: ISprite;
    spriteLow: ISprite;
    active: number; //0: inactive, 1: lower, 2: upper
    pointInvocation: boolean;
}

export interface    IHeroInit {
    name: string;
    upperSprite: ISprite;
    lowerSprite: ISprite;
    playerSide: number;
}

/*
**  The sprite's action area is represented by
**  an invisible circle that moves at a specific velocity
**  from a specific initial position towards a specific end
**  position of the game area following a straight line.
*/
export interface   ISprite {
    xPosInit: number;
    yPosInit: number;
    xPosEnd: number;
    yPosEnd: number;
    xPos: number;
    yPos: number;
    radius: number;
    xVelocity: number;
    yVelocity: number;
    xOrigin: number; //For client sprite origin
    yOrigin: number; //For client sprite origin
    ballVelocityX: number; //Velocity of the ball after hero hit
    ballVelocityY: number; //Velocity of the ball after hero hit
}

export class    Hero {

    private _name: string;
    private _pointInvocation: boolean;
    private _activeSprite: number; //0: inactive, 1: lower, 2: upper
    private _upperSprite: ISprite;
    private _lowerSprite: ISprite;
    private _playerSide: number; //0: left, 1: right
    private _horizontalEndUpdate: (xDisplacement: number, xPos: number,
                            xPosEnd: number) => boolean;

    constructor(initData: IHeroInit) {
        this._name = initData.name;
        this._pointInvocation = false;
        this._activeSprite = 0;
        this._upperSprite = initData.upperSprite;
        this._lowerSprite = initData.lowerSprite;
        this._playerSide = initData.playerSide;
    }

    get name(): string {
        return (this._name);
    }

    get isActing(): boolean {
        return (this._activeSprite != 0);
    }

    get pointInvocation(): boolean {
        return (this._pointInvocation);
    }

    mimic(data: IHeroData): void {
        this._upperSprite.xPos = data.xPos;
        this._upperSprite.yPos = data.yPos;
        this._lowerSprite.xPos = data.lowXPos;
        this._lowerSprite.yPos = data.lowYPos;
        this._activeSprite = data.active;
        this._pointInvocation = data.pointInvocation;
    }

    /*
    **  up === true = W click
    **  up === false = S click
    */
    static invocation(up: boolean,
                        data: Readonly<IHeroData>): IHeroData | undefined {
        const   result: IHeroData | undefined = data ? {...data} : undefined;
    
        if (!data
            || data.active != 0
            || data.pointInvocation)
            return (result);
        result.pointInvocation = true;
        result.active = up ? 2 : 1;
        return (result);
    }

    data(): IHeroData {
        return ({
            xPos: this._upperSprite.xPos,
            yPos: this._upperSprite.yPos,
            lowXPos: this._lowerSprite.xPos,
            lowYPos: this._lowerSprite.yPos,
            active: this._activeSprite,
            pointInvocation: this._pointInvocation
        });
    }

    physicsData(): IHeroPhysicsData {
        return ({
            hero: {...this._upperSprite},
            heroLow: {...this._lowerSprite},
            active: this._activeSprite,
            pointInvocation: this._pointInvocation
        });
    }

    clientStartData(): IHeroClientStart {
        return ({
            playerSide: this._playerSide,
            name: this._name,
            sprite: this._upperSprite,
            spriteLow: this._lowerSprite,
            active: this._activeSprite,
            pointInvocation: this._pointInvocation
        });
    }

}
