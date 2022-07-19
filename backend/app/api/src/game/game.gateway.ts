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
        else if (sockLen === 2)
        {
            console.log("Player B joined");
            client.join("PlayerB");
            client.emit("role", "PlayerB");
            //Send start to PlayerA to start serving the ball
            this.server.to("PlayerA").emit("start", "start");
        }
        else
        {
            console.log("Spectator joined");
            client.join("Spectator");
            client.emit("role", "Spectator");
            /*
            **  Send event to PlayerB to get the latest game data
            **  and then pass it to this Spectator.
            */
            this.server.to("PlayerB").emit('latestGameData', client.id);
        }
        console.log("With id: ", client.id);
    }

    async handleDisconnect(client: Socket) {
        const playerA = this.server.in("PlayerA").fetchSockets();
        const PlayerB = this.server.in("PlayerB").fetchSockets();

        if (!(await playerA).length)
            console.log("Player A disconnected");
        else if (!(await PlayerB).length)
            console.log("Player B disconnected");
        else
            console.log("A spectator disconnected");
        console.log("With id: ", client.id);
    }

    @SubscribeMessage('paddleA')
    async paddleAUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        console.log("PaddleA update received:");
        console.log(data);
        client.broadcast.emit('paddleA', data);
    }

    @SubscribeMessage('paddleB')
    async paddleBUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        console.log("PaddleB update received:");
        console.log(data);
        client.broadcast.emit('paddleB', data);
    }

    @SubscribeMessage('ball')
    async ballUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        console.log("Ball update received:");
        console.log(data);
        client.broadcast.emit('ball', data);
    }

    @SubscribeMessage('score')
    async scoreUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        console.log("Score update received:");
        console.log(data);
        client.broadcast.emit('score', data);
    }

    @SubscribeMessage('serve')
    async serveCompleted(
        @ConnectedSocket() client: Socket,
    ) {
        console.log("serve completed");
        //Send serve completed event to PlayerB to hide init text
        this.server.to("PlayerB").emit("serve", "serve");
    }

    @SubscribeMessage('latestGameData')
    async initSpectator(
        @MessageBody() data: any
    ) {
        console.log("init data for new Spectator:");
        console.log(data);
        this.server.to(data.spectatorId).emit('initGameData', data.gameData);
    }

  }
