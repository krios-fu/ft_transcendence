import {
    ISelectionData,
    MenuScene
} from "../scenes/MenuScene";
import { MenuArrows } from "./MenuArrows";
import { MenuRenderer } from "./MenuRenderer";
import { SelectionStatus } from "./MenuSelector";

export class    MenuHeroRenderer extends MenuRenderer {

    private _heroImages: string[];
    private _heroConfirmImages: string[];
    private _stageImages: string[];
    private _heroAImage: Phaser.GameObjects.Image;
    private _heroBImage: Phaser.GameObjects.Image;
    private _stageImage: Phaser.GameObjects.Image;
    private _aArrows: MenuArrows;
    private _bArrows: MenuArrows;

    constructor(scene: MenuScene, initData: ISelectionData) {
        super(scene, initData, true);
        this._heroImages = [
            'aquamanMenu',
            'supermanMenu',
            'blackPantherMenu'
        ];
        this._heroConfirmImages = [
            'aquamanConfirm',
            'supermanConfirm',
            'blackPantherConfirm'
        ];
        this._stageImages = [
            'atlantisMenu',
            'metropolisMenu',
            'wakandaMenu'
        ];
        (this._aArrows = new MenuArrows(scene,
            { x: 50, y: 220 },
            { x: 350, y: 220 }
        )).visible = false;
        (this._bArrows = new MenuArrows(scene,
            { x: 450, y: 220 },
            { x: 750, y: 220 }
        )).visible = false;
        (this._heroAImage = scene.add.image(200, 220,
                                this._heroImages[initData.heroA])).visible = false;
        (this._heroBImage = scene.add.image(600, 220,
                                this._heroImages[initData.heroB])).visible = false;
        (this._stageImage = scene.add.image(400, 300,
                                this._stageImages[initData.stage])).visible = false;
        if (initData.status === SelectionStatus.Hero)
        {
            this._heroAImage.visible = true;
            this._heroBImage.visible = true;
            if (!initData.heroAConfirmed)
                this._aArrows.visible = true;
            if (!initData.heroBConfirmed)
                this._bArrows.visible = true;
            this._vsTxt.visible = true;
            this._playerInfoA.visible = true;
            this._playerInfoB.visible = true;
        }
        else
        {
            this._stageImage.visible = true;
            this.showStageArrows();
        }
    }

    private changeImage(image: Phaser.GameObjects.Image,
                        imagePaths: string[], element: number): void {
        image.setTexture(imagePaths[element]);
    }

    private showStageArrows(): void {
        this._aArrows.setLeftPos({
            x: 50,
            y: 300
        });
        this._aArrows.setRightPos({
            x: 750,
            y: 300
        });
        this._aArrows.visible = true;
    }

    render(selectionStatus: SelectionStatus, player: string,
            element: number, confirm: boolean): void {
        let heroImages: string[];

        if (selectionStatus === SelectionStatus.Hero)
        {
            if (confirm)
            {
                if (player == "PlayerA")
                    this._aArrows.visible = false;
                else
                    this._bArrows.visible = false;
                heroImages = this._heroConfirmImages;
            }
            else
                heroImages = this._heroImages;
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
                this._aArrows.visible = false;
                this._bArrows.visible = false;
                this._vsTxt.visible = false;
                this._playerInfoA.visible = false;
                this._playerInfoB.visible = false;
                this._stageImage.visible = true;
            }
            this.showStageArrows();
        }
    }

    override destroy(): void {
        super.destroy();
        this._heroAImage.destroy();
        this._heroBImage.destroy();
        this._stageImage.destroy();
        this._aArrows.destroy();
        this._bArrows.destroy();
    }

}
