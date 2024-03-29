import { ISelectionData } from "../interfaces/scene.interfaces";
import { MenuScene } from "../scenes/MenuScene";
import {
    SelectionSoundKeys,
    SoundService
} from "../services/sound.service";
import { MenuArrows } from "./MenuArrows";
import { MenuRenderer } from "./MenuRenderer";
import { SelectionStatus } from "./MenuSelector";
import { Timer } from "./Timer";

export class    MenuHeroRenderer extends MenuRenderer {

    private _heroImages: string[];
    private _heroConfirmImages: string[];
    private _stageImages: string[];
    private _stageConfirmImages: string[];
    private _heroAImage: Phaser.GameObjects.Image;
    private _heroBImage: Phaser.GameObjects.Image;
    private _stageImage: Phaser.GameObjects.Image;
    private _sounds: SelectionSoundKeys;
    private _aArrows: MenuArrows;
    private _bArrows: MenuArrows;
    private _timer: Timer;

    constructor(scene: MenuScene, initData: ISelectionData,
                    private readonly soundService: SoundService) {
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
        this._stageConfirmImages = [
            'atlantisConfirm',
            'metropolisConfirm',
            'wakandaConfirm'
        ];
        this._sounds = SoundService.selectionSoundKeys;
        (this._aArrows = new MenuArrows(scene,
            { x: 50, y: 220 },
            { x: 350, y: 220 }
        )).visible = false;
        (this._bArrows = new MenuArrows(scene,
            { x: 450, y: 220 },
            { x: 750, y: 220 }
        )).visible = false;
        this._timer = new Timer(scene, 400, 50, initData.timeoutDate);
        (this._heroAImage = scene.add.image(
            200, 220,
            this.initImage(initData.heroA, this._heroImages,
                this._heroConfirmImages, initData.heroAConfirmed)
        )).visible = false;
        (this._heroBImage = scene.add.image(
            600, 220,
            this.initImage(initData.heroB, this._heroImages,
                this._heroConfirmImages, initData.heroBConfirmed)
        )).visible = false;
        (this._stageImage = scene.add.image(
            400, 300,
            this.initImage(initData.stage, this._stageImages,
                this._stageConfirmImages,
                initData.status === SelectionStatus.Finished)
        )).visible = false;
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
        else if (initData.status === SelectionStatus.Stage)
        {
            this._stageImage.visible = true;
            this.showStageArrows();
        }
        else if (initData.status === SelectionStatus.Finished)
            this._stageImage.visible = true;
        this.soundService.play(this._sounds.theme, true);
    }

    private initImage(index: number, imgs: string[], confirmImgs: string[],
                        confirmed: boolean): string {
        return (
            confirmed ? confirmImgs[index] : imgs[index]
        );
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
                this.soundService.play(this._sounds.confirm, false);
            }
            else
            {
                heroImages = this._heroImages;
                this.soundService.play(this._sounds.change, false);
            }
            if (player === "PlayerA")
                this.changeImage(this._heroAImage, heroImages, element);
            else
                this.changeImage(this._heroBImage, heroImages, element);
        }
        else if (selectionStatus === SelectionStatus.Stage)
        {
            if (player === "PlayerA")
            {
                this.changeImage(this._stageImage, this._stageImages, element);
                this.soundService.play(this._sounds.change, false);
            }
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

    /*
    **  Sounds take longer to finish than image display,
    **  and scene transition time must be taken into account.
    **  That's why finish sound is played before.
    */
    finish(element: number): void {
        this.soundService.play(this._sounds.finish, false);
        this.soundService.stop(this._sounds.theme);
        this._aArrows.visible = false;
        this._stageImages = this._stageConfirmImages;
        this.changeImage(this._stageImage, this._stageImages, element);
    }

    override destroy(): void {
        super.destroy();
        this._heroAImage.destroy();
        this._heroBImage.destroy();
        this._stageImage.destroy();
        this._aArrows.destroy();
        this._bArrows.destroy();
        this._timer.destroy();
    }

}
