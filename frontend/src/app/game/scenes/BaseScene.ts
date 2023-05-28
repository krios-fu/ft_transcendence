import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { IResultData } from '../elements/Result';
import { Txt } from '../elements/Txt';
import { IMatchRecoveryData } from '../services/recovery.service';
import {
    GameScene,
    IMenuInit
} from '../interfaces/scene.interfaces';

export abstract class    BaseScene extends Phaser.Scene {

    socket: SocketIO.Socket;
    initTxt?: Txt;

    constructor(
        scene: GameScene, socket: SocketIO.Socket
    ) {
        super(scene);

        this.socket = socket;
    }

    removeAllListeners(): void {
        this.socket.off("leftSelection");
        this.socket.off("rightSelection");
        this.socket.off("confirmSelection");
        this.socket.off("newGame");
        this.socket.off("startMatch");
        this.socket.off("end");
        this.socket.off("matchUpdate");
        this.socket.off("recoverData");
    }

    abstract destroy(): void;

    abstract recover(data?: IMenuInit
                                | IMatchRecoveryData
                                | IResultData): void;

}
