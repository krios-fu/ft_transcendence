import { Socket } from "socket.io-client";
import { IMatchInitData } from "../elements/Match";
import { PlayerInfo } from "../elements/PlayerInfo";
import { BaseScene } from "./BaseScene";

export interface   ISelectionData {
    nickPlayerA: string;
    nickPlayerB: string;
    heroA: number;
    heroB: number;
    heroAConfirmed: boolean;
    heroBConfirmed: boolean;
    stage: number;
    status: number;
}

export interface   IMenuInit {
    hero: boolean;
    //PlayerA, PlayerB, Spectator
    role: string;
    selection: ISelectionData;
}

export class    MenuScene extends BaseScene {

    role: string;
    initData?: ISelectionData;
    playerInfoA?: PlayerInfo;
    playerInfoB?: PlayerInfo;

    constructor(sock: Socket, room: string, sceneName: string = "") {
        if (sceneName != "")
            super(sceneName, sock, room);
        else
            super("Menu", sock, room);
        this.role = "";
    }

    init(initData: IMenuInit) {
        this.role = initData.role;
        this.initData = initData.selection;
        this.socket.once("startMatch", (gameData: IMatchInitData) => {
            this.removeAllSocketListeners();
            if (this.role != "Spectator")
                this.scene.start("ClassicPlayer", gameData);
            else
                this.scene.start(this.role, gameData);
        });
        this.socket.once("end", (data) => {
            this.removeAllSocketListeners();
            this.scene.start("End", data);
        });
    }

    preload() {
        /*if (!this.initData)
            return ;
        this.load.image('playerA', this.initData.aAvatarUrl);
        this.load.image('playerB', this.initData.bAvatarUrl);*/
    }

    create() {
        if (!this.initData)
            return ;
        this.playerInfoA = new PlayerInfo(this, {
            nickname: this.initData.nickPlayerA,
            x: 200,
            y: 300
        });
        this.playerInfoB = new PlayerInfo(this, {
            nickname: this.initData.nickPlayerB,
            x: 600,
            y: 300
        });
    }

}
