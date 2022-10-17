import * as SocketIO from 'socket.io-client'
import { BaseScene } from './BaseScene'

export class    StartScene extends BaseScene {
    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("Start", sock, room);
        this.socket.once("init", (data) => {
            if (data.initData)
                this.scene.start("Spectator", data.initData);
        });
    }

    override init() {
        this.socket.once("newMatch", (gameData: any) => {
            this.removeAllSocketListeners();
            this.scene.start(gameData.role, gameData.initData);
        });
        this.socket.on("end", (data) => {
            this.removeAllSocketListeners();
            this.scene.start("End", data);
        });
    }

    createInitText() {
        //Init screen setup
        this.initText = this.add.text(400, 250, `Waiting for players ...`,
                                    { fontSize: '20px', color: '#fff' });
        this.initText.setDepth(1);
        //Sets the origin coordinates of the object to its center
        this.initText.setOrigin(0.5);
    }

    override create() {
        this.createInitText();
    }
}
