import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    namespace: 'room/chat',
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

    /* ** ***        *** ** */

    @WebSocketServer()
    private wss: Server;

    @SubscribeMessage('room-chat')
    handleMessage(
        @ConnectedSocket() client: Socket, 
        @MessageBody(/*validator pipe here */)  msg: string): void {
        this.wss.emit(msg);
    }
}
