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
import {
    RemoteSocket,
    Server,
    Socket
} from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Game } from './Game'
import { Ball } from './Ball';
import { Player } from './Player';
import { Updater } from './Updater';
import { GameService } from './game.service';
import { UserEntity } from 'src/user/user.entity';

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
    mockUserNum: number = 1; //Provisional

    constructor(
        private readonly gameService: GameService
    ) {}
  
    afterInit(server: any) {
        console.log("Game Gateway initiated");
        this.games = new Map<string, Game>();
        this.updater = new Updater();
    }

    async addUserToRoom(username: string, roomId: string): Promise<void> {
        let userSockets: RemoteSocket<DefaultEventsMap, any>[];

        userSockets = await this.server.in(username).fetchSockets();
        userSockets.forEach((sock) => {
            sock.join(roomId);
        });
    }

    emitToRoom(roomId: string, eventId: string, data: any = null): void {
        this.server.to(roomId).emit(eventId, data);
        return ;
    }

    async clearRoom(roomId: string): Promise<void> {
        let roomSockets: RemoteSocket<DefaultEventsMap, any>[];

        roomSockets = await this.server.in(roomId).fetchSockets();
        roomSockets.forEach((sock) => {
            sock.leave(roomId);
        });
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
        else if (this.updater.checkCollisionDown(game, yDisplacement))
        {// Collision Lower border
            this.updater.collisionDown(game);
        }
        else if (this.updater.checkCollisionRight(game, xDisplacement))
        {//Collision Right border
            this.updater.collisionRight(game, playerA);
            this.server.to(room).emit('score', {
                a: playerA.score,
                b: playerB.score
            });
            if (this.updater.checkWin(playerA.score))
            {
                this.emitToRoom(room, "end", {
                    winner: "PlayerA"
                });
                this.gameService.endGame(room, game);
                this.clearRoom("PlayerA");
                this.clearRoom("PlayerB");
                this.games.delete(room);
                if (this.games.size === 0)
                    clearInterval(this.updateInterval);
            }
            else
            {
                setTimeout(() => {
                    game.serveBall();
                    this.emitToRoom(room, "served");
                }, 3000);
            }
        }
        else if (this.updater.checkCollisionLeft(ball, xDisplacement))
        {//Collision Left border
            this.updater.collisionLeft(game, playerB);
            this.server.to(room).emit('score', {
                a: playerA.score,
                b: playerB.score
            });
            if (this.updater.checkWin(playerB.score))
            {
                this.emitToRoom(room, "end", {
                    winner: "PlayerB"
                });
                this.gameService.endGame(room, game);
                this.clearRoom("PlayerA");
                this.clearRoom("PlayerB");
                this.games.delete(room);
                if (this.games.size === 0)
                    clearInterval(this.updateInterval);
            }
            else
            {
                setTimeout(() => {
                    game.serveBall();
                    this.emitToRoom(room, "served");
                }, 3000);
            }
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

    startGame(gameId: string): void {
        let players: [UserEntity, UserEntity] =
            this.gameService.startGame(gameId);

        if (!players[0] || !players[1])
            return ;
        if (this.games.get(gameId) != undefined)
            this.games.delete(gameId);
        this.games.set(gameId, new Game());
        this.emitToRoom(gameId, "newMatch", {
            role: "Spectator",
            initData: this.games.get(gameId)
        });
        this.emitToRoom(players[0].username, "newMatch", {
            role: "PlayerA",
            initData: this.games.get(gameId)
        });
        this.addUserToRoom(players[0].username, "PlayerA");
        this.emitToRoom(players[1].username, "newMatch", {
            role: "PlayerB",
            initData: this.games.get(gameId)
        });
        this.addUserToRoom(players[1].username, "PlayerB");
        setTimeout(() => {
            this.games.get(gameId).serveBall();
            this.server.to(gameId).emit("served");
        }, 3000);
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

    async handleConnection(client: Socket, ...args: any[]) {
        let gameData: Game;
        let username: string = `user-${this.mockUserNum}`; //Provisional

        console.log("User joined Game room");
        client.join("Game1"); //Provisional
        client.emit("mockUser", {
            mockUser: username
        }); //Provisional
        client.join(username);
        //client.join(userSession)
        gameData = this.games.get("Game1");
        if (!gameData) // Provisional
            gameData = this.games.set("Game1", new Game()).get("Game1"); //Provisional
        client.emit("init", {
            //Send latest game data
            initData: gameData
        });
        ++this.mockUserNum; //Provisional
        console.log(`With id: ${client.id} and username ${username}`);
    }

    async handleDisconnect(client: Socket) {
        const playerA = this.server.in("PlayerA").fetchSockets();
        const PlayerB = this.server.in("PlayerB").fetchSockets();

        if (!(await playerA).length)
            console.log("Player A disconnected");
        else if (!(await PlayerB).length)
            console.log("Player B disconnected");
        else
            console.log("A spectator or extra player socket disconnected");
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

    @SubscribeMessage('addToGameQueue')
    async addToGameQueue(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        if (!client.rooms.has(data.gameId))
            return ;
        //Need to implement user authentication
        await this.gameService.addToQueue(data.gameId, data.username);
        if (!this.gameService.gameStarted(data.gameId))
            this.startGame(data.gameId);
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

  }
