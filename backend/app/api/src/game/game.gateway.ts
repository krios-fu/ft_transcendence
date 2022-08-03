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
import { Updater } from './Updater';

@WebSocketGateway(3001, {
    cors: {
        origin: '*',
    },
})
export class    GameGateway implements OnGatewayInit,
                                OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    games: Map<string, Game>;
    updater: Updater;
    updateInterval: NodeJS.Timer;
  
    afterInit(server: any) {
        console.log("Game Gateway initiated");
        this.games = new Map<string, Game>();
        this.updater = new Updater();
    }

    gameUpdate(game: Game, room: string): void {
        const   playerA: Player = game.playerA;
        const   playerB: Player = game.playerB;
        const   ball: Ball = game.ball;
        const   currentUpdate: number = Date.now();
        const   secondsElapsed: number = (currentUpdate - game.lastUpdate) / 1000;
        const   xDisplacement: number = ball.displacement('x', secondsElapsed);
        const   yDisplacement: number = ball.displacement('y', secondsElapsed);
        /*
        **  IMPORTANT!!!
        **
        **  playerA.width / 2, playerA.height / 2, ball.radius, etc
        **  Are calculated because the origin coordinates of the position
        **  of players and ball are at the center of the object.
        */
        if (this.updater.checkPlayerACollision(ball, playerA, xDisplacement))
        {//Collision PlayerA
            this.updater.collisionPlayerA(ball, playerA);
        }
        else if (this.updater.checkPlayerBCollision(ball, playerB, xDisplacement))
        {//Collision PlayerB
            this.updater.collisionPlayerB(ball, playerB);
        }
        else if (this.updater.checkCollisionUp(ball, yDisplacement))
        {// Collision Upper border
            this.updater.collisionUp(ball);
        }
        else if (this.updater.checkCollisionDown(ball, yDisplacement))
        {// Collision Lower border
            this.updater.collisionDown(ball);
        }
        else if (this.updater.checkCollisionRight(ball, xDisplacement))
        {//Collision Right border
            this.updater.collisionRight(game, ball, playerA);
            this.server.to(room).emit('score', {
                a: playerA.score,
                b: playerB.score
            });
        }
        else if (this.updater.checkCollisionLeft(ball, xDisplacement))
        {//Collision Left border
            this.updater.collisionLeft(game, ball, playerB);
            this.server.to(room).emit('score', {
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
        this.server.volatile.to(room).emit('ball', {
            x: ball.xPosition,
            y: ball.yPosition
        });
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
            if (this.games.size === 1) {
                this.updateInterval = setInterval(() => {
                        this.games.forEach(
                            (game, room) => { this.gameUpdate(game, room) }
                        );
                    },
                    16
                );
            }
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
        /*
        **  Check if there's any game room without socket connections
        **  and delete its respective game class if that is the case.
        **
        **  Keep in mind that a disconnected socket might have left
        **  more than one game room at the same time.
        */
        for (const [room] of this.games)
        {
            if ((await this.server.in(room).fetchSockets()).length === 0)
                this.games.delete(room);
        }
        if (this.games.size === 0)
            clearInterval(this.updateInterval);
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
