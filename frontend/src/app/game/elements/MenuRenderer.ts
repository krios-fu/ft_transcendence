import {
    ISelectionData,
    MenuScene
} from "../scenes/MenuScene";
import { SelectionStatus } from "./MenuSelector";
import { Txt } from "./Txt";

export class    MenuRenderer {

    private _heroImages: string[];
    private _heroConfirmImages: string[];
    private _stageImages: string[];
    private _heroAImage: Phaser.GameObjects.Image;
    private _heroBImage: Phaser.GameObjects.Image;
    private _stageImage: Phaser.GameObjects.Image;
    private _vsTxt: Txt;
    private _nickATxt: Txt;
    private _nickBTxt: Txt;

    constructor(scene: MenuScene, initData: ISelectionData) {
        this._heroImages = [
            'aquamanMenu', //Provisional, none image
            'aquamanMenu',
            'supermanMenu',
            'blackPantherMenu'
        ];
        this._heroConfirmImages = [
            'aquamanConfirm', //Provisional, none image
            'aquamanConfirm',
            'supermanConfirm',
            'blackPantherConfirm'
        ];
        this._stageImages = [
            'atlantisMenu', //Provisional, none image
            'atlantisMenu',
            'metropolisMenu',
            'wakandaMenu'
        ];
        (this._vsTxt = new Txt(scene, {
            xPos: 400,
            yPos: 300,
            content: "VS",
            style: { fontSize: '30px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        })).visible = false;
        (this._nickATxt = new Txt(scene, {
            xPos: 200,
            yPos: 500,
            content: initData.nickPlayerA,
            style: { fontSize: '20px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        })).visible = false;
        (this._nickBTxt = new Txt(scene, {
            xPos: 600,
            yPos: 500,
            content: initData.nickPlayerB,
            style: { fontSize: '20px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        })).visible = false;
        (this._heroAImage = scene.add.image(200, 250,
                                this._heroImages[initData.heroA])).visible = false;
        (this._heroBImage = scene.add.image(600, 250,
                                this._heroImages[initData.heroB])).visible = false;
        (this._stageImage = scene.add.image(400, 300,
                                this._stageImages[initData.stage])).visible = false;
        if (initData.status === SelectionStatus.Hero)
        {
            this._heroAImage.visible = true;
            this._heroBImage.visible = true;
            this._vsTxt.visible = true;
            this._nickATxt.visible = true;
            this._nickBTxt.visible = true;
        }
        else
            this._stageImage.visible = true;
    }

    private changeImage(image: Phaser.GameObjects.Image,
                        imagePaths: string[], element: number): void {
        image.setTexture(imagePaths[element]);
    }

    render(selectionStatus: SelectionStatus, player: string,
            element: number, confirm: boolean): void {
        let heroImages: string[];

        if (selectionStatus === SelectionStatus.Hero)
        {
            heroImages = confirm ? this._heroConfirmImages : this._heroImages;
            if (player === "PlayerA")
                this.changeImage(this._heroAImage, heroImages, element);
            else
                this.changeImage(this._heroBImage, heroImages, element);
        }
        else if (selectionStatus === SelectionStatus.Stage)
        {
            if (player === "PlayerA")
                this.changeImage(this._stageImage, this._stageImages, element);
        }
    }

    changeStatus(selectionStatus: SelectionStatus): void {
        if (selectionStatus === SelectionStatus.Stage)
        {
            if (this._heroAImage.visible != false)
            {
                this._heroAImage.visible = false;
                this._heroBImage.visible = false;
                this._vsTxt.visible = false;
                this._nickATxt.visible = false;
                this._nickBTxt.visible = false;
                this._stageImage.visible = true;
            }
        }
    }

}
