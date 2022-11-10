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
        this.socket.off("newMatch");
        this.socket.off("end");
        this.socket.off("matchUpdate");
        this.socket.off("served");
    }

}
