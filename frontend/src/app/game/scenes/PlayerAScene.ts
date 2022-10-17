import * as SocketIO from 'socket.io-client'
import { PlayerScene } from './PlayerScene'

export class    PlayerAScene extends PlayerScene {
    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("PlayerA", sock, room);
    }

    override update() {
        if (!this.cursors)
            return ;
        if (this.cursors.up.isDown) //Move playerA's paddle up
        {
            this.socket.emit('paddleAUp',{
                room: this.room
            });
        }
        else if (this.cursors.down.isDown) //Move playerA's paddle down
        {
            this.socket.emit('paddleADown',{
                room: this.room
            });
        }
    }
}
