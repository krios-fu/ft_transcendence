import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message/message.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private messageService;
    server: Server;
    constructor(messageService: MessageService);
    afterInit(Server: any): void;
    handleConnection(client: any, ...args: any[]): any;
    handleDisconnect(client: any): void;
    handleJoinRoom(client: Socket, room: string): void;
    handleIncommingMessage(client: Socket, payload: {
        id_chat: string;
        msg: string;
        sender: string;
        reciver: string;
    }): void;
}
