export class    Ball {
    diameter: number;
    radius: number;
    xPosition: number;
    yPosition: number;
    xVelocity: number; // pixels/second
    yVelocity: number; // pixels/second

    constructor(
        d: number, xPos: number, yPos: number, xVel: number, yVel: number
    ) {
        this.diameter = d;
        this.radius = this.diameter / 2;
        this.xPosition = xPos;
        this.yPosition = yPos;
        this.xVelocity = xVel;
        this.yVelocity = yVel;
    }

    displacement(axis: string, seconds: number): number {
        if (axis === 'x')
            return (this.xVelocity * seconds);
        if (axis === 'y')
            return (this.yVelocity * seconds);
    }
}
