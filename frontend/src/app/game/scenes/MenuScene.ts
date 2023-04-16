import { Socket } from "socket.io-client";
import { IMatchInitData } from "../elements/Match";
import { MenuRenderer } from "../elements/MenuRenderer";
import { GameRecoveryService } from "../services/recovery.service";
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
    timeoutDate: number;
    status: number;
}

export interface   IMenuInit {
    //PlayerA, PlayerB, Spectator
    role: string;
    selection: ISelectionData;
}

export class    MenuScene extends BaseScene {

    role: string;
    initData?: ISelectionData;

    private _menuRenderer?: MenuRenderer;

    constructor(sock: Socket,
                    readonly recoveryService: GameRecoveryService,
                    sceneName: string = "Menu") {
        super(sceneName, sock);
        this.role = "";
    }

    init(initData: IMenuInit) {
        this.role = initData.role;
        this.initData = initData.selection;
        this.socket.once("startMatch", (gameData: IMatchInitData) => {
            this.destroy();
            if (this.role != "Spectator")
            {
                this.scene.start("ClassicPlayer", {
                    role: this.role,
                    matchData: gameData
                });
            }
            else
            {
                this.scene.start(this.role, {
                    role: this.role,
                    matchData: gameData
                });
            }
        });
        this.socket.once("end", (data) => {
            this.destroy();
            this.scene.start("End", data);
        });
        this.recoveryService.setUp(this);
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

    destroy(): void {
        this.removeAllListeners();
        if (this._menuRenderer)
            this._menuRenderer.destroy();
        this.initData = undefined;
    }

    recover(data: IMenuInit): void {
        if (this.role != data.role
            || !this.initData
            || this.initData.nickPlayerA != data.selection.nickPlayerA
            || this.initData.nickPlayerB != data.selection.nickPlayerB)
        {
            this.destroy();
            this.init(data);
            this.preload();
            this.create();
        }
    }

}
