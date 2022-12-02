import * as SocketIO from 'socket.io-client'
import { Txt } from '../elements/Txt';
import { BaseScene } from './BaseScene'
import { IMenuInit } from './MenuScene';

export class    EndScene extends BaseScene {

    winner?: string;

    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("End", sock, room);
    }

    init(data: any) {
        this.winner = data.winner;
        this.socket.once("newGame", (data: IMenuInit) => {
            this.initTxt?.destroy();
            this.removeAllSocketListeners();
            if (data.hero)
                this.scene.start("MenuHero", data);
            else
                this.scene.start("Menu", data);
        });
    }

    createInitText() {
        //Init screen setup
        this.initTxt = new Txt(this, {
            xPos: 400,
            yPos: 250,
            content: `${this.winner} wins!`,
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
