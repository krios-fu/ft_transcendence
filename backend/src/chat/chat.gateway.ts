import {
    OnGatewayConnection, OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageService } from './message/chat-message.service';

@WebSocketGateway(3001, {
  namespace: 'private',
  cors: { 
    origin: process.env.WEBAPP_IP,
    credentials: true
  }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

    constructor(private messageService : ChatMessageService){

  }
  afterInit(Server: any) { }


  handleConnection(client: any, ...args): any {
    console.log('Join connection ');
    console.log("---> " + client.id)
    console.log(args);
  }

  handleDisconnect(client: Socket) {
    // client.leave();
  }


  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(`room_${room}`);
    console.log("Join cliente", client.id, "to", `room_${room}`);
  }


  @SubscribeMessage('message')
  handleIncommingMessage(
    client: Socket,
    payload: {msg: string, sender: number,  id_chat: number },
  ) {
    // const {  msg, sender, id_chat } = payload;
    this.server.to(`room_${payload.id_chat}`).emit('new_message', payload);
    console.log(payload);
    this.messageService.saveMessages(payload);
  }

  @SubscribeMessage('message-game')
  gameMessage(
    client: Socket,
    payload: {msg: string, sender: number,  id_chat: number },
  ) {
    // const {  msg, sender, id_chat } = payload;
    this.server.to(`room_${payload.id_chat}`).emit('new_message-game', payload);
  }


  /*
   ** Funtions send notification to user "invite game "
   **
   */

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
      msg: string
      dest: string
    }) {
    console.log('PAYLOAD', payload)
    this.server.to(`notifications_${payload.dest}`).emit('notifications', payload)
  }

  @SubscribeMessage('join_room_game')
  async joinRoomGame(
    client: Socket,
    payload: { room: string, user: any }) {

    let users_send = [];
    client.data = payload.user;
    client.join(`noti_roomGame_${payload.room}`);
    client.join(payload.user.username);
    let users_in_room = await this.server.in(`noti_roomGame_${payload.room}`).fetchSockets();

    for (let user of users_in_room) {
      let data = user.data;
      if (!(users_send.find((element: any) => element.id == data.id)))
        users_send.push(data);
    }
    // send all user in room
    this.server.to(payload.user.username).emit(payload.user.username, users_send);
    this.server.to(`noti_roomGame_${payload.room}`).emit('noti_game_room', payload);
  }

  @SubscribeMessage('room_leave')
  leaveRoomGame(
    client: Socket,
    payload: { room: string, user: any }) {
    this.server.to(`noti_roomGame_${payload.room}`).emit('room_leave', payload)
    client.leave(`noti_roomGame_${payload.room}`);
  }


  @SubscribeMessage('noti_game_room')
  notificationRoomGame(
    client: Socket,
    payload: { room: string, user: any }) {
    console.log('PAYLOAD', payload)
    this.server.to(`noti_roomGame_${payload.room}`).emit('noti_game_room', payload)
  }
}
