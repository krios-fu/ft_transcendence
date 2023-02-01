import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { MatchScene } from './MatchScene';

export class    PlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    powerKeys: any;

    constructor(
        socket: SocketIO.Socket, room: string,
        override readonly lagCompensator: LagCompensationService
    ) {
        super("Player", socket, room, lagCompensator);
    }

    override create() {
        //Activate keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        this.powerKeys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S'
        });
        super.create();
    }

    override update(time: number) {
        let     input: [paddleUp: number, heroUp: number] = [0, 0];
    
        if (this.cursors?.up.isDown)
        {
            if (this.match)
                this.socket.emit('paddleUp', this.match.snapshot.when);
            input[0] = 2;
        }
        else if (this.cursors?.down.isDown)
        {
            if (this.match)
                this.socket.emit('paddleDown', this.match.snapshot.when);
            input[0] = 1;
        }
        if (this.powerKeys.up.isDown)
        {
            if (this.match)
                this.socket.emit('heroUp', this.match.snapshot.when);
            input[1] = 2;
        }
        else if (this.powerKeys.down.isDown)
        {
            if (this.match)
                this.socket.emit('heroDown', this.match.snapshot.when);
            input[1] = 1;
        }
        if (input[0] || input[1])
            this.buffer?.input(input[0], input[1], this.match?.snapshot);
        super.update(time);
    }

}
