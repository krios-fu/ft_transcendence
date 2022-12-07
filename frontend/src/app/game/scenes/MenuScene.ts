import { Socket } from "socket.io-client";
import { IMatchInitData } from "../elements/Match";
import { MenuRenderer } from "../elements/MenuRenderer";
import { BaseScene } from "./BaseScene";

export interface   ISelectionData {
    nickPlayerA: string;
    nickPlayerB: string;
    categoryA: string;
    categoryB: string;
    avatarA: string;
    avatarB: string;
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

    private _menuRenderer?: MenuRenderer;

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
            if (this._menuRenderer)
                this._menuRenderer.destroy();
            this.removeAllSocketListeners();
            if (this.role != "Spectator")
                this.scene.start("ClassicPlayer", gameData);
            else
                this.scene.start(this.role, gameData);
        });
        this.socket.once("end", (data) => {
            if (this._menuRenderer)
                this._menuRenderer.destroy();
            this.removeAllSocketListeners();
            this.scene.start("End", data);
        });
    }

    preload() {
        if (!this.initData)
            return ;
        this.load.image('playerA', this.initData.avatarA);
        this.load.image('playerB', this.initData.avatarB);
        this.initData.avatarA = 'playerA';
        this.initData.avatarB = 'playerB';
    }

    create() {
        if (!this.initData)
            return ;
        this._menuRenderer = new MenuRenderer(
            this,
            this.initData,
            false
        );
    }

}
