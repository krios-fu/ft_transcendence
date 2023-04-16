import * as SocketIO from 'socket.io-client'
import {
    IResultData,
    Result
} from '../elements/Result';
import { GameRecoveryService } from '../services/recovery.service';
import { BaseScene } from './BaseScene'
import { IMenuInit } from './MenuScene';

export class    EndScene extends BaseScene {

    resultData?: IResultData;
    result?: Result;
    startTimeout: number | undefined;

    constructor(
        sock: SocketIO.Socket, room: string,
        private readonly recoveryService: GameRecoveryService
    ) {
        super("End", sock, room);
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
