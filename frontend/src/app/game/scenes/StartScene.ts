import * as SocketIO from 'socket.io-client'
import { IMatchInitData } from '../elements/Match';
import { Txt } from '../elements/Txt';
import { BaseScene } from './BaseScene'

export class    StartScene extends BaseScene {

    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("Start", sock, room);
    }

    init() {
        this.socket.once("newGame", (data: any) => {
            this.removeAllSocketListeners();
            this.scene.start("Menu", data);
        });
        this.socket.once("startMatch", (gameData: any) => {
            this.removeAllSocketListeners();
            this.scene.start("Spectator", gameData);
        });
        this.socket.once("end", (data) => {
            this.removeAllSocketListeners();
            this.scene.start("End", data);
        });
    }

    createInitText() {
        //Init screen setup
        this.initTxt = new Txt(this, {
            xPos: 400,
            yPos: 250,
            content: `Waiting for players ...`,
            style: { fontSize: '20px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
    }

    create() {
        this.createInitText();
    }
}
