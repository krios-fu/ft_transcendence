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
import {
    Game,
    GameState
} from './Game'
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
    updateInterval: NodeJS.Timer = undefined;
    mockUserNum: number = 1; //Provisional

    constructor(
        private readonly gameService: GameService
    ) {}
  
    afterInit() {
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

    gameTransition(gameId: string): void {
        setTimeout(() => {
            this.games.delete(gameId);
            this.manageUpdateInterval();
            this.startGame(gameId);
        }, 10000);
    }

    gameEnd(gameId: string, game: Game, winnerRole: string): void {
        const   winnerNickname = winnerRole === "PlayerA"
                                    ? game.playerA.nick : game.playerB.nick;
        
        this.emitToRoom(gameId, "end", {
            winner: winnerNickname
        });
        this.gameService.endGame(gameId, game);
        this.clearRoom(`${gameId}-PlayerA`);
        this.clearRoom(`${gameId}-PlayerB`);
        this.gameTransition(gameId);
    }

    pointTransition(game: Game, gameId: string): void {
        setTimeout(() => {
            this.updater.serve(game);
            this.emitToRoom(gameId, "served");
        }, 3000);
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
                this.updater.pauseGame(game);
                this.gameEnd(room, game, "PlayerA");
            }
            else
                this.pointTransition(game, room);
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
                this.updater.pauseGame(game);
                this.gameEnd(room, game, "PlayerB");
            }
            else
                this.pointTransition(game, room);
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

    manageUpdateInterval(): void {
        if (this.updateInterval === undefined
                && this.games.size === 1) {
            this.updateInterval = setInterval(() => {
                    this.games.forEach(
                        (gameElem, room) => {
                            if (gameElem.state != GameState.Paused)
                                this.gameUpdate(gameElem, room);
                        }
                    );
                },
                16
            );
        }
        else if (this.updateInterval
                    && this.games.size === 0)
        {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined
        }
    }

    setRole(role: string, roomId: string, gameData: Game): void {
        this.emitToRoom(roomId, "newMatch", {
            role: role,
            initData: gameData
        });
    }

    async startGame(gameId: string): Promise<void> {
        let game: Game;
        let playerRoom: string;
        let players: [UserEntity, UserEntity] =
            this.gameService.startGame(gameId);

        if (!players[0] || !players[1])
            return ;
        if (this.games.get(gameId) != undefined)
            this.games.delete(gameId);
        game = this.games.set(gameId,
                                new Game(
                                    players[0].username,
                                    players[1].username
                                )).get(gameId);
        playerRoom = `${gameId}-PlayerA`;
        await this.addUserToRoom(players[0].username, playerRoom);
        this.setRole("PlayerA", playerRoom, game);
        playerRoom = `${gameId}-PlayerB`;
        await this.addUserToRoom(players[1].username, playerRoom);
        this.setRole("PlayerB", playerRoom, game);
        this.setRole("Spectator", gameId, game);
        this.pointTransition(game, gameId);
        this.manageUpdateInterval();
    }

    async handlePlayerDisconnect(playerRoom: string): Promise<void> {
        const   gameId: string = playerRoom.slice(0, playerRoom.indexOf('-'));
        const   game: Game = this.games.get(gameId);
        let     roomSockets: RemoteSocket<DefaultEventsMap, any>[];
        let     winnerRole: string;
    
        roomSockets = await this.server.in(playerRoom).fetchSockets();
        /*
        **  Checking for > 1, because socket has not left the room yet.
        **  socket.io Event "disconnecting".
        */
        if (roomSockets.length > 1)
            return ;
        if (game.state != GameState.Running)
            return ;
        this.updater.pauseGame(game);
        winnerRole = playerRoom[playerRoom.length - 1] === 'A'
                        ? "PlayerB" : "PlayerA";
        this.updater.forceWin(game, winnerRole);
        this.gameEnd(gameId, game, winnerRole);
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
        client.emit("init", {
            //Send latest game data
            initData: gameData
        });
        client.on("disconnecting", () => {
            const   rooms: IterableIterator<string> = client.rooms.values();

            for (const room of rooms)
            {
                if (room.includes("Player"))
                {
                    this.handlePlayerDisconnect(room);
                    break ;
                }
            }
        });
        ++this.mockUserNum; //Provisional
        console.log(`With id: ${client.id} and username ${username}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket ${client.id} disconnected`);
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
        if (!this.games.get(data.gameId))
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

        if (game.state != GameState.Running)
            return ;
        if (playerA.yPosition - 8 < playerA.halfHeight)
            playerA.yPosition = playerA.halfHeight;
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

        if (game.state != GameState.Running)
            return ;
        if (playerA.yPosition + 8 > game.height - playerA.halfHeight)
            playerA.yPosition = game.height - playerA.halfHeight;
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

        if (game.state != GameState.Running)
            return ;
        if (playerB.yPosition - 8 < playerB.halfHeight)
            playerB.yPosition = playerB.halfHeight;
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

        if (game.state != GameState.Running)
            return ;
        if (playerB.yPosition + 8 > game.height - playerB.halfHeight)
            playerB.yPosition = game.height - playerB.halfHeight;
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
