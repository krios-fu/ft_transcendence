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
import { Game } from './Game'
import { Ball } from './Ball';
import { Player } from './Player';

@WebSocketGateway(3001, {
    cors: {
        origin: '*',
    },
})
export class    GameGateway implements OnGatewayInit,
                                OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    games: Map<string, Game>;
  
    afterInit(server: any) {
        console.log("Game Gateway initiated");
        this.games = new Map<string, Game>();
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const sockets = await this.server.fetchSockets();
        const sockLen: Number = sockets.length;

        if (sockLen < 2)
        {
            console.log("Player A joined");
            client.join("PlayerA"); //Provisional
            client.join("Game1"); //Provisional
            client.emit("role", {
                role: "PlayerA",
                room: "Game1"
            });
            this.games.set("Game1", new Game()); //Provisional
        }
        else if (sockLen === 2)
        {
            console.log("Player B joined");
            client.join("PlayerB"); //Provisional
            client.join("Game1"); //Provisional
            client.emit("role", {
                role: "PlayerB",
                room: "Game1"
            });
            //Send start to PlayerA to start serving the ball
            this.server.to("PlayerA").emit("start", "start");
        }
        else
        {
            console.log("Spectator joined");
            client.emit("role", {
                role: "Spectator",
                room: "Game1",
                //Send latest game data
                initData: this.games.get("Game1")
            });
            client.join("Game1"); //Provisional
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

    /*
    **  client.rooms returns a Set with the socket id as first element,
    **  and the next ones, the ids of the rooms it is currently in.
    */
    
    @SubscribeMessage('paddleA')
    async paddleAUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        let playerA: Player;

        playerA = this.games.get(data.room).playerA;
        playerA.xPosition = data.x;
        playerA.yPosition = data.y;
        /*
        **  volatile will not send events if the connection is not available.
        **  Works more or less like UDP.
        **  Only using it for updating paddle and ball positions, as only
        **  the latest data is useful, and does not make sense to store the
        **  past data to be sent when the connection is available again.
        */
       //In paddles does not work well
        this.server/*.volatile*/.to(data.room).emit('paddleA', data);
    }

    @SubscribeMessage('paddleB')
    async paddleBUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        let playerB: Player;

        playerB = this.games.get(data.room).playerB;
        playerB.xPosition = data.x;
        playerB.yPosition = data.y;
        /*
        **  volatile will not send events if the connection is not available.
        **  Works more or less like UDP.
        **  Only using it for updating paddle and ball positions, as only
        **  the latest data is useful, and does not make sense to store the
        **  past data to be sent when the connection is available again.
        */
        //In paddles does not work well
        this.server/*.volatile*/.to(data.room).emit('paddleB', data);
    }

    @SubscribeMessage('ball')
    async ballUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        let ball: Ball;

        ball = this.games.get(data.room).ball;
        ball.xPosition = data.x;
        ball.yPosition = data.y;
        /*
        **  volatile will not send events if the connection is not available.
        **  Works more or less like UDP.
        **  Only using it for updating paddle and ball positions, as only
        **  the latest data is useful, and does not make sense to store the
        **  past data to be sent when the connection is available again.
        */
        this.server.volatile.to(data.room).emit('ball', data);
    }

    @SubscribeMessage('score')
    async scoreUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        if (data.player == "playerA")
            this.games.get(data.room).playerA.score = data.score;
        else
            this.games.get(data.room).playerB.score = data.score;
        this.server.to(data.room).emit('score', data);
    }

    @SubscribeMessage('serve')
    async serveCompleted(
        @ConnectedSocket() client: Socket,
    ) {
        this.server.to("PlayerB").emit("serve", "serve"); //Provisional
    }

  }
