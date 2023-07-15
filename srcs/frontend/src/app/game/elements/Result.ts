import { EndScene } from "../scenes/EndScene";
import { PlayerInfo } from "./PlayerInfo";
import { Txt } from "./Txt";

export interface    IResultData {
    aNick: string;
    bNick: string;
    aCategory: string,
    bCategory: string,
    aScore: number;
    bScore: number;
    aAvatar: string;
    bAvatar: string;
}

export class    Result {

    private _aPlayerInfo: PlayerInfo;
    private _bPlayerInfo: PlayerInfo;
    private _aScore: Txt;
    private _bScore: Txt;
    private _aTitle: Txt;
    private _bTitle: Txt;

    constructor(scene: EndScene, initData: IResultData) {
        let aTitleContent: string = `${initData.aScore > initData.bScore
                                        ? 'WINNER' : 'LOSER'}`;
        let bTitleContent: string = `${initData.bScore > initData.aScore
                                        ? 'WINNER' : 'LOSER'}`;
        
        if (initData.aScore === initData.bScore)
        {
            aTitleContent = "LAG";
            bTitleContent = "LAG";
        }
        this._aPlayerInfo = new PlayerInfo(scene, {
            nickname: initData.aNick,
            category: initData.aCategory,
            photo: initData.aAvatar,
            x: 200,
            y: 280
        }, false);
        this._bPlayerInfo = new PlayerInfo(scene, {
            nickname: initData.bNick,
            category: initData.bCategory,
            photo: initData.bAvatar,
            x: 600,
            y: 280
        }, false);
        this._aScore = new Txt(scene, {
            xPos: 200,
            yPos: 450,
            content: `Score: ${initData.aScore}`,
            style: {fontSize: '25px', color: '#fff'},
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this._bScore = new Txt(scene, {
            xPos: 600,
            yPos: 450,
            content: `Score: ${initData.bScore}`,
            style: {fontSize: '25px', color: '#fff'},
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this._aTitle = new Txt(scene, {
            xPos: 200,
            yPos: 500,
            content: aTitleContent,
            style: {fontSize: '40px', color: '#fff'},
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this._bTitle = new Txt(scene, {
            xPos: 600,
            yPos: 500,
            content: bTitleContent,
            style: {fontSize: '40px', color: '#fff'},
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
    }

    destroy(): void {
        this._aPlayerInfo.destroy();
        this._bPlayerInfo.destroy();
        this._aScore.destroy();
        this._bScore.destroy();
        this._aTitle.destroy();
        this._bTitle.destroy();
    }

}
