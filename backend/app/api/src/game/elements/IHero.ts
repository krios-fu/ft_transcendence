export interface    IHeroData {
    xPos: number;
    yPos: number;
    lowXPos?: number; //For Aquaman's lower trident.
    lowYPos?: number; //For Aquaman's lower trident.
    activeTrident?: number; //For Aquaman. 0: lower, 1: upper
    active: boolean; //Hero is active
}

export interface    IHeroClientStart {
    playerSide: number;
    name: string;
    xPos: number;
    yPos: number;
    xOrigin: number;
    yOrigin: number;
    lowXPos?: number; //For Aquaman's lower trident.
    lowYPos?: number; //For Aquaman's lower trident.
    lowXOrigin?: number;
    lowYOrigin?: number;
}

export interface    IHero {
    name: string;
    isActing: boolean; //Check if it is performing an action currently.
    pointInvocation: boolean; //Check if it was invoked in the current point.
    /*
    **  button === 1 = W click
    **  button === 0 = S click
    */
    invocation(button: number): void;
    update(seconds: number): void;
    //Returns new x and y ball velocities or undefined if no hit
    checkBallHit(ballXPosition: number, ballYPosition: number,
                    ballRadius: number): [number, number];
    checkEnd(): void;
    data(): IHeroData;
    clientStartData(): IHeroClientStart;
}
