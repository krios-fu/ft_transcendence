import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { BaseScene } from './BaseScene'

export class    PlayerScene extends BaseScene {
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(
        role: string, socket: SocketIO.Socket, room: string, initData: any
    ) {
        super(role, socket, room, initData);
    }

    createInitText() {
        //Init screen setup
        this.initText = this.add.text(400, 250, "Prepare to serve ...",
                                    { fontSize: '20px', color: '#fff' });
        this.initText.setDepth(1);
        //Sets the origin coordinates of the object to its center
        this.initText.setOrigin(0.5);
    }

    override create() {
        this.ball = this.add.ellipse(
            this.initData.ball.xPosition,
            this.initData.ball.yPosition, 10, 10, 0xffffff
        );

        this.playerA = this.add.rectangle(
            this.initData.playerA.xPosition,
            this.initData.playerA.yPosition, 10, 50, 0xffffff
        );

        this.playerB = this.add.rectangle(
            this.initData.playerB.xPosition,
            this.initData.playerB.yPosition, 10, 50, 0xffffff
        );

        //Score creation
        this.createScore(
            this.initData.playerA.score, this.initData.playerB.score
        );

        //Serve text creation
        this.createInitText();

        //Delete temporary value of initData.
        delete this.initData;

        //Activate keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
    }
}