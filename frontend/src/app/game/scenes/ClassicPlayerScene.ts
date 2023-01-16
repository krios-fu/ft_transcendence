import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { MatchScene } from './MatchScene';

export class    ClassicPlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(
        socket: SocketIO.Socket, room: string,
        override readonly lagCompensator: LagCompensationService
    ) {
        super("ClassicPlayer", socket, room, lagCompensator);
    }

    override create() {
        //Activate keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        super.create();
    }

    override update() {    
        if (this.cursors?.up.isDown)
            this.socket.emit('paddleUp');
        else if (this.cursors?.down.isDown)
            this.socket.emit('paddleDown');
        super.update();
    }

}
