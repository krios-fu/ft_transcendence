export class    Player {
    width: number;
    height: number;
    xPosition: number;
    yPosition: number;
    score: number;

    constructor(w: number, h: number, xPos: number, yPos: number, scr: number) {
        this.width = w;
        this.height = h;
        this.xPosition = xPos;
        this.yPosition = yPos;
        this.score = scr;
    }
}
