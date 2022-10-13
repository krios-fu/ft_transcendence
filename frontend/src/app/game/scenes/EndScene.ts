import * as SocketIO from 'socket.io-client'
import { BaseScene } from './BaseScene'

export class    EndScene extends BaseScene {
    winner?: string;

    constructor(
        sock: SocketIO.Socket, room: string, initData: any
    ) {
        super("End", sock, room, initData);
    }

    override init(data: any) {
        this.winner = data.winner;
        this.socket.on("newMatch", (data: any) => {
            this.scene.start(data.role, data.initData);
        });
    }

    createInitText() {
        //Init screen setup
        this.initText = this.add.text(400, 250, `${this.winner} wins!`,
                                    { fontSize: '20px', color: '#fff' });
        this.initText.setDepth(1);
        //Sets the origin coordinates of the object to its center
        this.initText.setOrigin(0.5);
    }

    override create() {
        this.createInitText();
    }
}
