import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { Txt } from '../elements/Txt';

export class    BaseScene extends Phaser.Scene {

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

    removeAllSocketListeners() {
        this.socket.off("leftSelection");
        this.socket.off("rightSelection");
        this.socket.off("confirmSelection");
        this.socket.off("newGame");
        this.socket.off("startMatch");
        this.socket.off("end");
        this.socket.off("matchUpdate");
    }

}
