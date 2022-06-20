import { Logger, UseGuards } from '@nestjs/common';
import { 
    ConnectedSocket, 
    MessageBody, 
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    OnGatewayInit, 
    SubscribeMessage, 
    WebSocketGateway, 
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoomMsgDto } from './room-msg.dto';

@WebSocketGateway({
    namespace: 'room-chat',
    cors: true, /* esto está MUY mal */
})
export class RoomChatGateway implements 
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect {

    /* ** logger functions ** */
    
    private logger: Logger = new Logger('RoomChatGateway');

    afterInit(server: any) {
        this.logger.log('RoomChatGateway initialized');
    }

    handleConnection(cl: Socket) {
        this.logger.log(`New connection ${cl.id}`);
    }

    handleDisconnect(cl: Socket) {
        this.logger.log(`Connection ${cl.id} closed`);0
    }

    /*                         */

    @WebSocketServer()
    private wss: Server;

    @SubscribeMessage('join-room')
    joinRoom(
        @ConnectedSocket() client: Socket,
        room: string
    ): void {
        client.join(room);
    }

    @SubscribeMessage('leave-room')

    @SubscribeMessage('room-chat')
    handleMessage(
        @ConnectedSocket() client: Socket, 
        @MessageBody(/*validator pipe here */)  roomMsgDto: RoomMsgDto
    ): void {
        const { room, message } = roomMsgDto;

        this.wss.to(room).emit("room-chat", message, (data: string) => {
            console.log("missatge: " + data); /* Error connection timed out */
        });
    }
}
