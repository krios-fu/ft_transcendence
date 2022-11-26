import { BaseScene } from "../scenes/BaseScene";
import { Txt } from "./Txt";

export interface    ArrowInit {
    x: number;
    y: number;
}

export class    MenuArrows {

    left: Txt;
    right: Txt;

    constructor(scene: BaseScene, leftInit: ArrowInit, rightInit: ArrowInit) {
        this.left = new Txt(scene, {
            xPos: leftInit.x,
            yPos: leftInit.y,
            content: "<",
            style: { fontSize: '20px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1,
        });
        this.right = new Txt(scene, {
            xPos: rightInit.x,
            yPos: rightInit.y,
            content: ">",
            style: { fontSize: '20px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1,
        });
    }

    get visible(): boolean {
        return (this.left.visible);
    }

    set visible(input: boolean) {
        this.left.visible = input;
        this.right.visible = input;
    }

}
