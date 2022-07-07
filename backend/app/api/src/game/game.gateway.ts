import {
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, {
    cors: {
      origin: '*',
    },
})
export class    GameGateway implements OnGatewayInit,
                                OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    afterInit(server: any) {
        console.log("Game Gateway initiated");
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const sockets = await this.server.fetchSockets();
        const sockLen: Number = sockets.length;
        if (sockLen < 2)
        {
          console.log("Player A joined");
          client.join("PlayerA");
          client.emit("role", "PlayerA");
        }
        /*else if (sockLen === 2)
        {
          console.log("Player B joined");
          client.join("PlayerB");
          client.emit("role", "PlayerB");
        }*/
        else
        {
          console.log("Spectator joined");
          client.join("Spectator");
          client.emit("role", "Spectator");
        }
        console.log("With id: ", client.id);
    }

    async handleDisconnect(client: Socket) {
        const playerA = this.server.in("PlayerA").fetchSockets();
        //const PlayerB = this.server.in("PlayerB").fetchSockets();

        if (!(await playerA).length)
          console.log("Player A disconnected");
        /*else if (!(await PlayerB).length)
          console.log("Player B disconnected");*/
        else
          console.log("A spectator disconnected");
        console.log("With id: ", client.id);
    }

    @SubscribeMessage('paddle')
    async paddleUpdate(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: string
    ) {
      console.log("Paddle update received:");
      console.log(data);
      client.broadcast.emit('paddle', data);
    }

  }
