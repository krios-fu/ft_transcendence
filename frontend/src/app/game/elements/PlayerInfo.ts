import { BaseScene } from "../scenes/BaseScene";
import { Txt } from "./Txt";

export interface    IPlayerInfoInit {
    nickname: string;
    /*category: ;
    photo: ;*/
    x: number;
    y: number;
}

export  class   PlayerInfo {

    nickname: Txt;
    category: Txt;

    constructor(scene: BaseScene, info: IPlayerInfoInit) {
        this.nickname = new Txt(scene, {
            xPos: info.x,
            yPos: info.y + 10,
            content: info.nickname,
            style: {fontSize: '20px', color: '#fff'},
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this.category = new Txt(scene, {
            xPos: info.x,
            yPos: info.y + 50,
            content: "cat. " + "Platinum",
            style: {fontSize: '20px', color: '#fff'},
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
    }

}
