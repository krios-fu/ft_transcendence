import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'

export class    BaseScene extends Phaser.Scene {
    ball?: Phaser.GameObjects.Ellipse;
    playerA?: Phaser.GameObjects.Rectangle;
    playerB?: Phaser.GameObjects.Rectangle;
    scoreA?: number;
    scoreB?: number;
    scoreText?: Phaser.GameObjects.Text;
    static readonly scoreTextContent: string = " playerA - playerB ";
    initText?: Phaser.GameObjects.Text;
    socket: SocketIO.Socket;
    room: string;
    initData: any; // Create dto

    constructor(
        role: string, socket: SocketIO.Socket, room: string, initData: any
    ) {
        super(role);

        this.socket = socket;
        this.room = room;
        this.initData = initData;
    }

    createScore(scoreA: number = 0, scoreB: number = 0) {
        this.scoreA = scoreA;
        this.scoreB = scoreB;
        this.scoreText = this.add.text(400, 20, this.scoreA
                                        + BaseScene.scoreTextContent
                                        + this.scoreB,
                                        { fontSize: '20px', color: '#fff' });
        this.scoreText.setOrigin(0.5);
    }

    init(initData: any = {}) {
        if (Object.keys(initData).length != 0)
            this.initData = initData;
        this.socket.on("newMatch", (data: any) => {
            this.scene.start(data.role, data.initData);
        });
        this.socket.on("end", (data) => {
            this.scene.start("End", data);
        });
        //Register paddleA update event
        this.socket.on("paddleA", (coord) => {
            if (!this.playerA)
                return ;
            this.playerA.y = coord.y;
        });
        //Register paddleB update event
        this.socket.on("paddleB", (coord) => {
            if (!this.playerB)
                return ;
            this.playerB.y = coord.y;
        });
        this.socket.on("ball", (coords) => {
            if (!this.ball)
                return ;
            this.ball.x = coords.x;
            this.ball.y = coords.y;
        })
        this.socket.on("score", (data) => {
            if (!this.scoreText || !this.initText)
                return ;
            this.scoreA = data.a;
            this.scoreB = data.b;
            this.scoreText.setText(
                this.scoreA + BaseScene.scoreTextContent + this.scoreB);
            this.initText.setVisible(true);
        });
        this.socket.on("served", () => {
            if (!this.initText)
                return ;
            this.initText.setVisible(false);
        });
    }

    create() {
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
        //Delete temporary value of initData.
        delete this.initData;           
    }
}
