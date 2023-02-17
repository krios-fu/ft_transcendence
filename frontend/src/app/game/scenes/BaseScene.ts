import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { IMatchInitData } from '../elements/Match';
import { IResultData } from '../elements/Result';
import { Txt } from '../elements/Txt';
import { IMenuInit } from './MenuScene';

export abstract class    BaseScene extends Phaser.Scene {

    socket: SocketIO.Socket;
    room: string;
    initTxt?: Txt;

    constructor(
        role: string, socket: SocketIO.Socket, room: string
    ) {
        super(role);

        this.socket = socket;
        this.room = room;
    }

    private removeAllSocketListeners(): void {
        this.socket.off("leftSelection");
        this.socket.off("rightSelection");
        this.socket.off("confirmSelection");
        this.socket.off("newGame");
        this.socket.off("startMatch");
        this.socket.off("end");
        this.socket.off("matchUpdate");
        this.socket.off("recoverData");
    }

    private removeAllGameListeners(): void {
        this.game.events.off("focus");
    }

    removeAllListeners(): void {
        this.removeAllSocketListeners();
        this.removeAllGameListeners();
    }

    private emitRecover(): void {
        this.socket.emit("recover", this.room);
    }

    setUpRecovery(): void {
        this.game.events.on("focus", () => {
            this.emitRecover();
        });
    }

    abstract destroy(): void;

    abstract recover(data?: IMenuInit
                                | IMatchInitData
                                | IResultData): void;

}
