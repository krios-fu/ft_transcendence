export interface    IHeroInitData {
    playerSide: number; //0: left, 1: right
    xPos: number;
    yPos: number;
    xOrigin: number;
    yOrigin: number;
    name: string; // aquaman, blackPanther, superman
    lowXPos?: number; // For Aquaman.
    lowYPos?: number; // For Aquaman.
    lowXOrigin?: number; // For Aquaman.
    lowYOrigin?: number; // For Aquaman.
}

export interface    IHeroData {
    xPos: number;
    yPos: number;
    lowXPos?: number; // For Aquaman.
    lowYPos?: number; // For Aquaman.
}

export interface    IHero {
    update(data: IHeroData): void;
}
