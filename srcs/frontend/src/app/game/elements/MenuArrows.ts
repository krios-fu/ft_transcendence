import { BaseScene } from "../scenes/BaseScene";
import { Txt } from "./Txt";

export interface    PositionInit {
    x: number;
    y: number;
}

export class    MenuArrows {

    private _left: Txt;
    private _right: Txt;

    constructor(scene: BaseScene, leftInit: PositionInit, rightInit: PositionInit) {
        this._left = new Txt(scene, {
            xPos: leftInit.x,
            yPos: leftInit.y,
            content: "<",
            style: { fontSize: '30px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1,
        });
        this._right = new Txt(scene, {
            xPos: rightInit.x,
            yPos: rightInit.y,
            content: ">",
            style: { fontSize: '30px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1,
        });
    }

    get visible(): boolean {
        return (this._left.visible);
    }

    set visible(input: boolean) {
        this._left.visible = input;
        this._right.visible = input;
    }

    setLeftPos(data: PositionInit): void {
        this._left.setPos(data);
    }

    setRightPos(data: PositionInit): void {
        this._right.setPos(data);
    }

    destroy(): void {
        this._left.destroy();
        this._right.destroy();
    }

}
