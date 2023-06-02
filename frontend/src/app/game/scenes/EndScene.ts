import * as SocketIO from 'socket.io-client'
import {
    IResultData,
    Result
} from '../elements/Result';
import { GameRecoveryService } from '../services/recovery.service';
import { BaseScene } from './BaseScene'
import { IMenuInit } from '../interfaces/scene.interfaces';

export class    EndScene extends BaseScene {

    resultData?: IResultData;
    result?: Result;
    startTimeout: number | undefined;

    constructor(
        sock: SocketIO.Socket,
        private readonly recoveryService: GameRecoveryService
    ) {
        super("End", sock);
        this.startTimeout = undefined;
    }

    init(data: IResultData) {
        this.resultData = data;
        this.socket.once("newGame", (menuData: IMenuInit) => {
            this.destroy();
            if (menuData.selection.heroA != undefined)
                this.scene.start("MenuHero", menuData);
            else
                this.scene.start("Menu", menuData);
        });
        this.startTimeout = window.setTimeout(() => {
            this.destroy();
            this.scene.start("Start");
        }, 15000);
        this.recoveryService.setUp(this);
    }

    preload() {
        if (!this.resultData)
            return ;
        if (!this.resultData.aAvatar)
            this.resultData.aAvatar = "noUrl";
        if (!this.resultData.bAvatar)
            this.resultData.bAvatar = "noUrl";
        this.load.image('playerA', this.resultData.aAvatar);
        this.load.image('playerB', this.resultData.bAvatar);
        this.resultData.aAvatar = 'playerA';
        this.resultData.bAvatar = 'playerB';
    }

    create() {
        if (this.resultData)
            this.result = new Result(this, this.resultData);
    }

    destroy(): void {
        if (this.startTimeout)
        {
            window.clearTimeout(this.startTimeout);
            this.startTimeout = undefined;
        }
        this.result?.destroy();
        this.removeAllListeners();
    }

    recover(data: IResultData): void {
        /*
        **  Generating new instance in case it recovers on a different
        **  end scene.
        */
        this.destroy();
        this.init(data);
        this.create();
    }

}
