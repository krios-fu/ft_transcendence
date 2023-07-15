import { BaseScene } from "../scenes/BaseScene";
import { Txt } from "./Txt";

export interface    IPlayerInfoInit {
    nickname: string;
    category: string;
    photo: string;
    x: number;
    y: number;
}

export  class   PlayerInfo {

    private _nickname: Txt;
    private _category: Txt;
    private _photoShape: Phaser.GameObjects.Graphics;
    private _photo: Phaser.GameObjects.Image;
    private _mask: Phaser.Display.Masks.GeometryMask;

    constructor(scene: BaseScene, info: IPlayerInfoInit, hero: boolean) {    
        this._nickname = new Txt(scene, {
            xPos: hero ? info.x + 30 : info.x,
            yPos: hero ? info.y - 20 : info.y + 10,
            content: info.nickname,
            style: {fontSize: '20px', color: '#fff'},
            xOrigin: hero ? 0 : 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this._category = new Txt(scene, {
            xPos: hero ? info.x + 30 : info.x,
            yPos: hero ? info.y + 20 : info.y + 50,
            content: "cat. " + info.category,
            style: {fontSize: '20px', color: '#fff'},
            xOrigin: hero ? 0 : 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this._photo = scene.add.image(
            hero ? info.x - 60 : info.x,
            hero ? info.y : info.y - 90,
            info.photo
        );
        this.scaleImage(this._photo,
            hero ? 100 : 200
        );
        this._photoShape = scene.make.graphics({});
        this._photoShape.fillCircle(
            hero ? info.x - 60 : info.x,
            hero ? info.y : info.y - 110,
            hero ? 50 : 80
        );
        this._mask =  this._photoShape.createGeometryMask();
        this._photo.setMask(this._mask);
    }

    private scaleImage(img: Phaser.GameObjects.Image, target: number): void {
        const   diff: number = img.width - target;
        let     scale: number;
    
        if (diff <= 0)
            return ;
        scale = target / img.width;
        img.scaleX = scale;
        img.scaleY = scale;
    }

    set visible(input: boolean) {
        this._nickname.visible = input;
        this._category.visible = input;
        this._photo.visible = input;
        this._photoShape.visible = input;
    }

    destroy(): void {
        this._category.destroy();
        this._nickname.destroy();
        this._photo.clearMask(true);
        this._photoShape.destroy();
        this._photo.destroy();
    }

}
