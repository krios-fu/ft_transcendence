import * as SocketIO from 'socket.io-client'
import { IResultData, Result } from '../elements/Result';
import { BaseScene } from './BaseScene'
import { IMenuInit } from './MenuScene';

export class    EndScene extends BaseScene {

    resultData?: IResultData;
    result?: Result;

    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("End", sock, room);
    }

    init(data: IResultData) {
        this.resultData = data;
        this.socket.once("newGame", (data: IMenuInit) => {
            this.result?.destroy();
            this.removeAllSocketListeners();
            if (data.hero)
                this.scene.start("MenuHero", data);
            else
                this.scene.start("Menu", data);
        });
    }

    create() {
        if (this.resultData)
            this.result = new Result(this, this.resultData);
    }
}
