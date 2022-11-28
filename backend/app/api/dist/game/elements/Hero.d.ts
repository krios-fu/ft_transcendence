export interface IHeroData {
    xPos: number;
    yPos: number;
    lowXPos: number;
    lowYPos: number;
    activeSprite: number;
    active: boolean;
}
export interface IHeroClientStart {
    playerSide: number;
    name: string;
    xPos: number;
    yPos: number;
    xOrigin: number;
    yOrigin: number;
    lowXPos: number;
    lowYPos: number;
    lowXOrigin: number;
    lowYOrigin: number;
}
export interface IHeroInit {
    name: string;
    upperSprite: ISprite;
    lowerSprite: ISprite;
    playerSide: number;
}
export interface ISprite {
    xPosInit: number;
    yPosInit: number;
    xPosEnd: number;
    yPosEnd: number;
    xPos: number;
    yPos: number;
    radius: number;
    xVelocity: number;
    yVelocity: number;
    xOrigin: number;
    yOrigin: number;
}
export declare class Hero {
    private _name;
    private _isActing;
    private _pointInvocation;
    private _activeSprite;
    private _hitBall;
    protected _upperSprite: ISprite;
    protected _lowerSprite: ISprite;
    protected _playerSide: number;
    private _horizontalEndUpdate;
    constructor(initData: IHeroInit);
    get name(): string;
    get isActing(): boolean;
    get pointInvocation(): boolean;
    invocation(button: number): void;
    private getActiveSprite;
    private leftEndUpdate;
    private rightEndUpdate;
    private upEndUpdate;
    private downEndUpdate;
    private verticalEndUpdate;
    private updateSprite;
    protected ballVelocityAfterHit(): [number, number];
    checkBallHit(ballXPosition: number, ballYPosition: number, ballRadius: number): [number, number];
    private endAction;
    checkEnd(): void;
    update(seconds: number): void;
    data(): IHeroData;
    clientStartData(): IHeroClientStart;
}
