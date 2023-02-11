import * as SocketIO from 'socket.io-client'
import {
    IResultData,
    Result
} from '../elements/Result';
import { BaseScene } from './BaseScene'
import { IMenuInit } from './MenuScene';

export class    EndScene extends BaseScene {

    resultData?: IResultData;
    result?: Result;
    startTimeout: number | undefined;

    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("End", sock, room);
        this.startTimeout = undefined;
    }

    init(data: IResultData) {
        this.resultData = data;
        this.socket.once("newGame", (data: IMenuInit) => {
            window.clearTimeout(this.startTimeout);
            this.startTimeout = undefined;
            this.result?.destroy();
            this.removeAllSocketListeners();
            if (data.selection.heroA != undefined)
                this.scene.start("MenuHero", data);
            else
                this.scene.start("Menu", data);
        });
        this.startTimeout = window.setTimeout(() => {
            this.result?.destroy();
            this.removeAllSocketListeners();
            this.scene.start("Start");
        }, 15000);
    }

    create() {
        if (this.resultData)
            this.result = new Result(this, this.resultData);
    }
}
