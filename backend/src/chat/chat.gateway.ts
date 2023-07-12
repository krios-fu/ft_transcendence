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

  constructor(private messageService: ChatMessageService) {

  }
  afterInit(Server: any) { }


  handleConnection(client: any, ...args): any {
  }

  handleDisconnect() {

  }


  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(`room_${room}`);
  }


  @SubscribeMessage('message')
  handleIncommingMessage(
    client: Socket,
    payload: { msg: string, sender: number, id_chat: number },
  ) {
    this.server.to(`room_${payload.id_chat}`).emit('new_message', payload);
    this.messageService.saveMessages(payload);
  }

  @SubscribeMessage('message-game')
  gameMessage(
    client: Socket,
    payload: { msg: string, sender: number, id_chat: number },
  ) {
    this.server.to(`room_${payload.id_chat}`).emit('new_message-game', payload);
  }


  /*
   ** Funtions send notification to user "invite game "
   **
   */

  @SubscribeMessage('join_room_notification')
  handleJoinnotification(client: Socket, room: string) {
    client.join(`notifications_${room}`);
  }

  @SubscribeMessage('notifications')
  notification(
    client: Socket,
    payload: {
      user: any,
      msg: string
      dest: string
    }) {
    this.server.to(`notifications_${payload.dest}`).emit('notifications', payload)
  }

  @SubscribeMessage('join_room_game')
  async joinRoomGame(
    client: Socket,
    payload: { room: string, user: any }) {

    payload.user.defaultOffline = true;

    client.data = payload.user;
    let users_send = [];

    client.join(`noti_roomGame_${payload.room}`);
    client.data.room_id = payload.room;
    client.join(`global_online`);

    let users_in_room = await this.server.in(`noti_roomGame_${payload.room}`).fetchSockets();
    for (let user of users_in_room) {
      let data = user.data;
      users_send.push(data);
    }

    this.server.to(`noti_roomGame_${payload.room}`).emit('noti_game_room', users_send);
    this.server.to(payload.user.username).emit(payload.user.username, users_send);
  }

  @SubscribeMessage('room_leave')
  async leaveRoomGame(
    client: Socket,
    payload: { room: string, user: any }) {
    this.server.to(`noti_roomGame_${payload.room}`).emit('room_leave', payload)
    let users_in_room = await this.server.in(`noti_roomGame_${payload.room}`).fetchSockets();
    for (let user of users_in_room) {
      if (user.data.username === payload.user.username) {
        user.leave(`noti_roomGame_${payload.room}`);
        user.leave('global_online');
      }
    }

  }

  @SubscribeMessage('player_update')
  playerUpdate(
    client: Socket,
    payload: { room: string, user: any }) {
    this.server.to(`noti_roomGame_${payload.room}`).emit('player_update', payload)
    client.data = payload.user;
  }


  @SubscribeMessage('noti_game_room')
  notificationRoomGame(
    client: Socket,
    payload: { room: string, user: any }) {
    this.server.to(`noti_roomGame_${payload.room}`).emit('noti_game_room', payload)
  }

  @SubscribeMessage('global_online')
  async notificationGlobalOnline(
    client: Socket,
    payload: { user: any }) {

      let users_in_room = await this.server.in(`global_online`).fetchSockets();
      for (let user_online of users_in_room) {
        if (user_online.data.username === payload.user.username)
          client.emit('global_online', user_online.data);
      }
  }



}
