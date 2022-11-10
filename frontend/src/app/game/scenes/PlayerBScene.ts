import * as SocketIO from 'socket.io-client'
import { PlayerScene } from './PlayerScene'

export class    PlayerBScene extends PlayerScene {
    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("PlayerB", sock, room);
    }

    override update() {
        if (this.cursors?.up.isDown)
        {
            this.socket.emit('paddleBUp',{
                room: this.room
            });
        }
        else if (this.cursors?.down.isDown)
        {
            this.socket.emit('paddleBDown',{
                room: this.room
            });
        }
        if (this.powerKeys.up.isDown)
        {
            this.socket.emit('heroBUp',{
                room: this.room
            });
        }
        else if (this.powerKeys.down.isDown)
        {
            this.socket.emit('heroBDown',{
                room: this.room
            });
        }
    }
}
