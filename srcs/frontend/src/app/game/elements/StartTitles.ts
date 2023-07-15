import { BaseScene } from "../scenes/BaseScene";
import { Txt } from "./Txt";

export  class   StartTitles {

    private _background: Phaser.GameObjects.Image;
    private _mainText: Txt;
    private _waitingText: Txt;
    private _tween: Phaser.Tweens.Tween;
    private _padA: Phaser.GameObjects.Rectangle;
    private _padB: Phaser.GameObjects.Rectangle;

    constructor(scene: BaseScene) {
        this._background = scene.add.image(400, 300, 'startBackground');
        this._padA = scene.add.rectangle(200, 200, 20, 100, 0xffffff);
        this._padB = scene.add.rectangle(600, 200, 20, 100, 0xffffff);
        this._mainText = new Txt(scene, {
            xPos: 300,
            yPos: 200,
            content: 'PING',
            style : {
                fontFamily: 'Courier',
                fontSize: 64,
                fontStyle: 'bold',
                stroke: '#fff',
                strokeThickness: 5,
                color: '#000',
                shadow: {
                    offsetX: -6,
                    stroke: true,
                    fill: true,
                    color: '#fff'
                },
                padding: {
                    left: 8
                }
            },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this._waitingText = new Txt(scene, {
            xPos: 400,
            yPos: 450,
            content: `Waiting for players ...`,
            style: {
                fontFamily: 'Courier',
                fontSize: '30px',
                color: '#fff',
                backgroundColor: '#000'
            },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this._tween = scene.tweens.add({
            targets: this._mainText.element,
            x: 500,
            ease: 'Linear',
            duration: 5000,
            repeat: -1,
            yoyo: true,
        });
        this._tween.on('yoyo', () => {
            let val = this._mainText.shadowOffsetX;
        
            this._mainText.setShadowOffset(
                val * -1,
                0
            );
            this._mainText.content = 'PONG';
        });
        this._tween.on('repeat', () => {
            let val = this._mainText.shadowOffsetX;
        
            this._mainText.setShadowOffset(
                val * -1,
                0
            );
            this._mainText.content = 'PING';
        });
    }

    destroy(): void {
        this._background.destroy();
        this._mainText.destroy();
        this._waitingText.destroy();
        this._tween.stop();
        this._padA.destroy();
        this._padB.destroy();
    }

}
