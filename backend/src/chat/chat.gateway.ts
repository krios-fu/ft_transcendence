import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message/message.service';
import { Public } from "src/common/decorators/public.decorator";

@WebSocketGateway(3001, {
  namespace: 'private',
  cors: { origin: '*' }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessageService) {

  }
  afterInit(Server: any) {
    // console.log( this.server );
  }


  handleConnection(client: any, ...args): any {
    console.log('Join connection ');
    console.log("---> " + client.id)
    console.log(args);
  }

  handleDisconnect(client: any) {
    console.log('Disconnect');
    console.log(client.id);
  }


  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(`room_${room}`);
    console.log("Join cliente", client.id, "to", `room_${room}`);
  }


  @SubscribeMessage('message')
  handleIncommingMessage(
    client: Socket,
    payload: { id_chat: string, msg: string, sender: string, reciver: string; },
  ) {
    const { id_chat, msg, sender, reciver } = payload;
    this.server.to(`room_${id_chat}`).emit('new_message', payload);
    this.messageService.saveMessages(payload);
  }


  @SubscribeMessage('join_room_notification')
  handleJoinnotification(client: Socket, room: string) {
    client.join(`notifications_${room}`);
    console.log("Join cliente", client.id, "to", `notifications_${room}`);
  }

  @SubscribeMessage('notifications')
  notification(
    client: Socket,
    payload: {
      user: any,
      dest : string
      msg: string
    }) {
      console.log('PAYLOAD', payload)
    this.server.to(`notifications_${payload.dest}`).emit('notifications', payload)
  }

}
