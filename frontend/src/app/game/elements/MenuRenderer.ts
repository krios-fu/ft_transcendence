import {
    ISelectionData,
    MenuScene
} from "../scenes/MenuScene";
import { PlayerInfo } from "./PlayerInfo";
import { Txt } from "./Txt";

export class    MenuRenderer {

    protected _vsTxt: Txt;
    protected _playerInfoA: PlayerInfo;
    protected _playerInfoB: PlayerInfo;

    constructor(scene: MenuScene, initData: ISelectionData,
                hero: boolean = false) {
        (this._vsTxt = new Txt(scene, {
            xPos: 400,
            yPos: 300,
            content: "VS",
            style: { fontSize: '30px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        })).visible = hero ? false : true;
        (this._playerInfoA = new PlayerInfo(
            scene,
            {
                x: 200,
                y: hero ? 500 : 350,
                nickname: initData.nickPlayerA,
                category: initData.categoryA,
                photo: initData.avatarA
            },
            hero
        )).visible = hero ? false : true;
        (this._playerInfoB = new PlayerInfo(
            scene,
            {
                x: 600,
                y: hero ? 500 : 350,
                nickname: initData.nickPlayerB,
                category: initData.categoryB,
                photo: initData.avatarB
            },
            hero
        )).visible = hero ? false : true;
    }

    destroy(): void {
        this._vsTxt.destroy();
        this._playerInfoA.destroy();
        this._playerInfoB.destroy();
    }

}
