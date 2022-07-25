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
            this.games.set("Game1", new Game()); //Provisional
            client.emit("role", {
                role: "PlayerA",
                room: "Game1",
                initData: this.games.get("Game1")
            });
        }
        else if (sockLen === 2)
        {
            console.log("Player B joined");
            client.join("PlayerB"); //Provisional
            client.join("Game1"); //Provisional
            client.emit("role", {
                role: "PlayerB",
                room: "Game1",
                initData: this.games.get("Game1")
            });
            this.server.to("Game1").emit("start", "start");
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
    
    @SubscribeMessage('paddleAUp')
    async paddleAUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);
        const   playerA: Player = game.playerA;
        const   playerAHalfHeight: number = playerA.height / 2;

        if (playerA.yPosition - 8 < playerAHalfHeight)
            playerA.yPosition = playerAHalfHeight;
        else
            playerA.yPosition -= 8;
        /*
        **  volatile will not send events if the connection is not available.
        **  Works more or less like UDP.
        **  Only using it for updating paddle and ball positions, as only
        **  the latest data is useful, and does not make sense to store the
        **  past data to be sent when the connection is available again.
        */
       //In paddles does not work well
        this.server/*.volatile*/.to(data.room).emit('paddleA', {
            y: playerA.yPosition
        });
    }

    @SubscribeMessage('paddleADown')
    async paddleADown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);
        const   playerA: Player = game.playerA;
        const   playerAHalfHeight: number = playerA.height / 2;

        if (playerA.yPosition + 8 > game.height - playerAHalfHeight)
            playerA.yPosition = game.height - playerAHalfHeight;
        else
            playerA.yPosition += 8;
        /*
        **  volatile will not send events if the connection is not available.
        **  Works more or less like UDP.
        **  Only using it for updating paddle and ball positions, as only
        **  the latest data is useful, and does not make sense to store the
        **  past data to be sent when the connection is available again.
        */
       //In paddles does not work well
        this.server/*.volatile*/.to(data.room).emit('paddleA', {
            y: playerA.yPosition
        });
    }

    @SubscribeMessage('paddleBUp')
    async paddleBUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);
        const   playerB: Player = game.playerB;
        const   playerBHalfHeight = playerB.height / 2;

        if (playerB.yPosition - 8 < playerBHalfHeight)
            playerB.yPosition = playerBHalfHeight;
        else
            playerB.yPosition -= 8;
        /*
        **  volatile will not send events if the connection is not available.
        **  Works more or less like UDP.
        **  Only using it for updating paddle and ball positions, as only
        **  the latest data is useful, and does not make sense to store the
        **  past data to be sent when the connection is available again.
        */
        //In paddles does not work well
        this.server/*.volatile*/.to(data.room).emit('paddleB', {
            y: playerB.yPosition
        });
    }

    @SubscribeMessage('paddleBDown')
    async paddleBDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);
        const   playerB: Player = game.playerB;
        const   playerBHalfHeight = playerB.height / 2;

        if (playerB.yPosition + 8 > game.height - playerBHalfHeight)
            playerB.yPosition = game.height - playerBHalfHeight;
        else
            playerB.yPosition += 8;
        /*
        **  volatile will not send events if the connection is not available.
        **  Works more or less like UDP.
        **  Only using it for updating paddle and ball positions, as only
        **  the latest data is useful, and does not make sense to store the
        **  past data to be sent when the connection is available again.
        */
        //In paddles does not work well
        this.server/*.volatile*/.to(data.room).emit('paddleB', {
            y: playerB.yPosition
        });
    }

    @SubscribeMessage('ball')
    async ballUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);
        const   playerA: Player = game.playerA;
        const   playerB: Player = game.playerB;
        const   ball: Ball = game.ball;
        const   currentUpdate: number = Date.now();
        const   secondsElapsed: number = (currentUpdate - game.lastUpdate) / 1000;
        const   xDisplacement: number = ball.displacement('x', secondsElapsed);
        const   yDisplacement: number = ball.displacement('y', secondsElapsed);

        if (ball.xPosition - ball.radius > playerA.xPosition + (playerA.width / 2)
            && ball.xPosition - ball.radius + xDisplacement <= playerA.xPosition + (playerA.width / 2)
            && (
                (ball.yPosition - ball.radius <= playerA.yPosition + (playerA.height / 2) && ball.yPosition - ball.radius >= playerA.yPosition - (playerA.height / 2))
                ||
                (ball.yPosition + ball.radius <= playerA.yPosition + (playerA.height / 2) && ball.yPosition + ball.radius >= playerA.yPosition - (playerA.height / 2))
            ))
        {//Collision PlayerA
            ball.xPosition = playerA.xPosition + (playerA.width / 2) + ball.radius;
            ball.xVelocity *= -1;
        }
        else if (ball.xPosition + ball.radius < playerB.xPosition - (playerB.width / 2)
                && ball.xPosition + ball.radius + xDisplacement >= playerB.xPosition - (playerB.width / 2)
                && (
                    (ball.yPosition + ball.radius <= playerB.yPosition + (playerB.height / 2) && ball.yPosition + ball.radius >= playerB.yPosition - (playerB.height / 2))
                    ||
                    (ball.yPosition - ball.radius <= playerB.yPosition + (playerB.height / 2) && ball.yPosition - ball.radius >= playerB.yPosition - (playerB.height / 2))
                ))
        {//Collision PlayerB
            ball.xPosition = playerB.xPosition - (playerB.width / 2) - ball.radius;
            ball.xVelocity *= -1;
        }
        else if (ball.yPosition - ball.radius + yDisplacement <= 0)
        {// Collision Upper border
            ball.yPosition = 0 + ball.radius;
            ball.yVelocity *= -1;
        }
        else if (ball.yPosition + ball.radius + yDisplacement >= 600)
        {// Collision Lower border
            ball.yPosition = 600 - ball.radius;
            ball.yVelocity *= -1;
        }
        else if (ball.xPosition + ball.radius + xDisplacement >= 800)
        {//Collision Right border
            ball.xVelocity = 0;
            ball.yVelocity = 0;
            ball.xPosition = (game.width / 2) - ball.radius;
            ball.yPosition = (game.height / 2) - ball.radius;
            playerA.score += 1;
            this.server.to(data.room).emit('score', {
                a: playerA.score,
                b: playerB.score
            });
        }
        else if (ball.xPosition - ball.radius + xDisplacement <= 0)
        {//Collision Left border
            ball.xVelocity = 0;
            ball.yVelocity = 0;
            ball.xPosition = (game.width / 2) - ball.radius;
            ball.yPosition = (game.height / 2) - ball.radius;
            playerB.score += 1;
            this.server.to(data.room).emit('score', {
                a: playerA.score,
                b: playerB.score
            });
        }
        else
        {
            ball.xPosition += xDisplacement;
            ball.yPosition += yDisplacement;
        }
        game.lastUpdate = currentUpdate;
        /*
        **  volatile will not send events if the connection is not available.
        **  Works more or less like UDP.
        **  Only using it for updating paddle and ball positions, as only
        **  the latest data is useful, and does not make sense to store the
        **  past data to be sent when the connection is available again.
        */
        this.server.volatile.to(data.room).emit('ball', {
            x: ball.xPosition,
            y: ball.yPosition
        });
    }

    @SubscribeMessage('serve')
    async serveCompleted(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (!game.ball.xVelocity)
            game.serveBall();
        this.server.to(data.room).emit("served", "served");
    }

  }
