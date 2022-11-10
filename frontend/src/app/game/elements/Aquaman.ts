import { MatchScene } from "../scenes/MatchScene";
import {
    IHeroData,
    IHero,
    IHeroInitData
} from "./IHero";

export class    Aquaman implements IHero {

    private _upperTrident: Phaser.GameObjects.Sprite;
    private _lowerTrident: Phaser.GameObjects.Sprite;

    constructor(scene: MatchScene, initData: IHeroInitData) {
        this._upperTrident = scene.add.sprite(
            initData.xPos,
            initData.yPos,
            initData.name
        );
        this._lowerTrident = scene.add.sprite(
            initData.lowXPos != undefined ? initData.lowXPos : 0,
            initData.lowYPos != undefined ? initData.lowYPos : 0,
            initData.name
        );
        this._upperTrident.setOrigin(initData.xOrigin, initData.yOrigin);
        this._lowerTrident.setOrigin(initData.lowXOrigin, initData.lowYOrigin);
        this._lowerTrident.flipY = true;
        if (initData.playerSide === 0)
        {
            this._upperTrident.flipX = true;
            this._lowerTrident.flipX = true;
        }
        this._upperTrident.scale = 0.5; //Provisional. It should not be necessary to scale
        this._lowerTrident.scale = 0.5; //Provisional. It should not be necessary to scale
    }

    update(data: IHeroData): void {
        this._upperTrident.x = data.xPos;
        this._upperTrident.y = data.yPos;
        if (data.lowXPos && data.lowYPos)
        {
            this._lowerTrident.x = data.lowXPos;
            this._lowerTrident.y = data.lowYPos;
        }
    }

}
