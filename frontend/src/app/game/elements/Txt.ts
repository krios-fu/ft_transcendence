import * as Phaser from 'phaser'
import { BaseScene } from '../scenes/BaseScene';
import { PositionInit } from './MenuArrows';

export interface    ITxtInitData {
    xPos: number;
    yPos: number;
    content?: string;
    style: any;
    xOrigin: number;
    yOrigin: number;
    depth: number;
}

export class    Txt {

    private _text: Phaser.GameObjects.Text;

    constructor(scene: BaseScene, initData: ITxtInitData) {
        this._text = scene.add.text(
            initData.xPos,
            initData.yPos,
            initData.content ? initData.content : "",
            initData.style,
        );
        this._text.setOrigin(initData.xOrigin, initData.yOrigin);
        this._text.setDepth(initData.depth);
    }

    get content(): string {
        return (this._text.text);
    }

    set content(input: string) {
        this._text.setText(input);
    }

    get visible(): boolean {
        return (this._text.visible);
    }

    set visible(input: boolean) {
        this._text.setVisible(input);
    }

    setPos(data: PositionInit) {
        this._text.x = data.x;
        this._text.y = data.y;
    }

}
