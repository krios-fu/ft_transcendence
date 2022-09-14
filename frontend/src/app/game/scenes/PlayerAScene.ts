import * as SocketIO from 'socket.io-client'
import { PlayerScene } from './PlayerScene'

export class    PlayerAScene extends PlayerScene {
    constructor(
        sock: SocketIO.Socket, room: string, initData: any
    ) {
        super("PlayerA", sock, room, initData);
    }

    override update() {
        if (!this.cursors)
            return ;
        this.socket.emit('ball',{
            room: this.room
        });
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
