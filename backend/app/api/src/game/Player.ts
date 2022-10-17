export class    Player {
    width: number; //Make it static
    height: number; //Make it static
    xPosition: number;
    yPosition: number;
    score: number;
    halfHeight: number; //Make it static
    halfWidth: number; //Make it static
    nick: string;

    constructor(w: number, h: number, xPos: number, yPos: number, scr: number,
                nick: string) {
        this.width = w;
        this.height = h;
        this.xPosition = xPos;
        this.yPosition = yPos;
        this.score = scr;
        this.halfHeight = this.height / 2;
        this.halfWidth = this.width / 2;
        this.nick = nick;
    }
}
