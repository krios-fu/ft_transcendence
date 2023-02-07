import { MatchScene } from "../scenes/MatchScene";
import { PositionInit } from "./MenuArrows";
import { Txt } from "./Txt";

export class    PointTitle {

    private _title: Txt;
    private _tween: Phaser.Tweens.Tween | undefined;
    private _scene: MatchScene;

    constructor(scene: MatchScene) {
        this._title = new Txt(scene, {
            xPos: Number(scene.game.config.width) / 2,
            yPos: Number(scene.game.config.height) / 2,
            content: '3',
            style: {
                fontFamily: 'Arial',
                fontSize: 500,
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 50
            },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 0
        });
        this._tween = undefined;
        this._scene = scene;
    }

    display(): void {
        if (this._tween)
        {
            this._title.visible = true;
            this._tween.restart();
            return ;
        }
        this._tween = this._scene.tweens.add({
            targets: this._title.element,
            scale: 0.1,
            ease: 'Power3',
            duration: 1000,
            repeat: 3,
        });
        this._tween.on('repeat', () => {
            let val = Number(this._title.content);
        
            if (val === 1)
                this._title.content = 'GO!';
            else
                this._title.content = String(val - 1);
            this._title.element.setOrigin(0.5);
        });
        this._tween.on('update', () => {
            this._title.setPos({
                x: Number(this._scene.game.config.width) / 2,
                y: Number(this._scene.game.config.height) / 2
            } as PositionInit);
        });
        this._tween.on('complete', () => {
            this._title.visible = false;
            this._title.content = '3';
            this._title.element.scale = 1;
        });
    }

    destroy(): void {
        if (this._tween)
            this._tween.stop();
        this._title.destroy();
    }

}
