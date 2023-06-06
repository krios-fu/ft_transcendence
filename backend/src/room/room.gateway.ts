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
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoomMsgDto } from '../room/dto/room.dto';

@UseGuards(JwtAuthGuard)
@WebSocketGateway({
    // namespace: 'room-chat',
    cors: {
        origin: 'http://localhost:4200',
        credentials: true,
    }
})
export class RoomGateway implements 
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect {

    /* ** logger functions ** */
    
    private logger: Logger = new Logger('RoomChatGateway');

    afterInit(server: any) {
        this.logger.log('RoomChatGateway initialized');
    }

    @AuthGuard()
    handleConnection(cl: Socket) {
        this.logger.log(`New connection ${cl.id}`);
    }

    handleDisconnect(cl: Socket) {
        this.logger.log(`Connection ${cl.id} closed`);
    }

    @WebSocketServer()
    private wss: Server;


    @SubscribeMessage('join-room')
    @RoomRolesGuard()
    joinRoom(
        @ConnectedSocket() client: Socket,
        room: string
    ): void {
        client.join(room);
    }

    @SubscribeMessage('leave-room')
    leaveRoom(
        @ConnectedSocket() client: Socket,
        room: string
    ): void {
        client.leave(room);
    }

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

    @SubscribeMessage('update-roles')
    public updateRoles(
        @ConnectedSocket() cli: Socket,
        @MessageBody() msg
    ): void {

    }
}
