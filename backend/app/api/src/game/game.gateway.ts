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
} from './elements/Game'
import { GameService } from './game.service';
import { UserEntity } from 'src/user/user.entity';
import {
    GameSelection,
    IGameSelectionData
} from './elements/GameSelection';

@WebSocketGateway(3001, {
    cors: {
        origin: '*',
    },
})
export class    GameGateway implements OnGatewayInit,
                                OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    games: Map<string, Game>;
    gameSelections: Map<string, GameSelection>;
    updateInterval: NodeJS.Timer = undefined;
    mockUserNum: number = 1; //Provisional

    constructor(
        private readonly gameService: GameService
    ) {}
  
    afterInit() {
        console.log("Game Gateway initiated");
        this.games = new Map<string, Game>();
        this.gameSelections = new Map<string, GameSelection>;
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

    gameEnd(gameId: string, game: Game): void {
        const   winnerNickname = game.getWinnerNick();
        
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
            game.serveBall();
            this.emitToRoom(gameId, "served");
        }, 3000);
    }

    gameUpdate(game: Game, room: string): void {
        if (game.update())
        { // A player scored
            if (game.getWinnerNick() != "")
            {
                game.pause();
                this.gameEnd(room, game);
                return ;
            }
            else
                this.pointTransition(game, room);
        }
        this.server.to(room).emit('matchUpdate', game.data());
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

    sendSelectionData(role: string, selectionData: IGameSelectionData,
                        roomId: string): void {
        this.emitToRoom(roomId, "newGame", {
            role: role,
            selection: selectionData
        });
    }

    async startGame(gameId: string): Promise<void> {
        let gameSelection: GameSelection;
        let selectionData: IGameSelectionData;
        let playerRoom: string;
        let players: [UserEntity, UserEntity] =
            this.gameService.startGame(gameId);

        if (!players[0] || !players[1])
            return ;
        if (this.gameSelections.get(gameId) != undefined)
            this.gameSelections.delete(gameId);
        gameSelection = this.gameSelections.set(gameId, new GameSelection(
            players[0].username,
            players[1].username
        )).get(gameId);
        selectionData = gameSelection.data;
        playerRoom = `${gameId}-PlayerA`;
        await this.addUserToRoom(players[0].username, playerRoom);
        this.sendSelectionData("PlayerA", selectionData, playerRoom);
        playerRoom = `${gameId}-PlayerB`;
        await this.addUserToRoom(players[1].username, playerRoom);
        this.sendSelectionData("PlayerB", selectionData, playerRoom);
        this.sendSelectionData("Spectator", selectionData, gameId);
    }

    startMatch(gameId: string,
                        gameSelectionData: IGameSelectionData): void {
        let game: Game;
    
        if (this.games.get(gameId) != undefined)
            this.games.delete(gameId);
        game = this.games.set(gameId, new Game(
            gameSelectionData
        )).get(gameId);
        this.emitToRoom(gameId, "startMatch", game.clientStartData());
        this.pointTransition(game, gameId);
        this.manageUpdateInterval();
    }

    async handlePlayerDisconnect(playerRoom: string): Promise<void> {
        const   gameId: string = playerRoom.slice(0, playerRoom.indexOf('-'));
        const   game: Game = this.games.get(gameId);
        let     roomSockets: RemoteSocket<DefaultEventsMap, any>[];
        let     winner: number;
    
        roomSockets = await this.server.in(playerRoom).fetchSockets();
        /*
        **  Checking for > 1, because socket has not left the room yet.
        **  socket.io Event "disconnecting".
        */
        if (roomSockets.length > 1)
            return ;
        if (!game
                || game.state != GameState.Running)
            return ;
        game.pause();
        winner = playerRoom[playerRoom.length - 1] === 'A'
                    ? 1 : 0;
        game.forceWin(winner);
        this.gameEnd(gameId, game);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        let gameSelection: GameSelection;
        let game: Game;
        let username: string = `user-${this.mockUserNum}`; //Provisional

        console.log("User joined Game room");
        client.join("Game1"); //Provisional
        client.emit("mockUser", {
            mockUser: username
        }); //Provisional
        client.join(username);
        //client.join(userSession)
        gameSelection = this.gameSelections.get("Game1");
        if (gameSelection)
        {
            client.emit("newGame", {
                role: "Spectator",
                selection: gameSelection.data
            });
        }
        else
        {
            game = this.games.get("Game1");
            if (game)
                client.emit("startMatch", game.clientStartData());
        }
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
    getClientRoomPlayer(client: Socket): [string, string] {
        const   rooms: IterableIterator<string> = client.rooms.keys();
        let     room: string = undefined;
        let     player: string = undefined;
        let     separatorPosition: number;

        for (const r of rooms)
        {
            if (r.includes("-Player"))
            {
                separatorPosition = r.indexOf('-');
                room = r.slice(0, separatorPosition);
                player = r.slice(separatorPosition + 1);
                break ;
            }
        }
        return ([room, player]);
    }

    @SubscribeMessage('leftSelection')
    async leftSelection(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   [room, player] = this.getClientRoomPlayer(client);
        let     gameSelection: GameSelection;

        if (!room)
            return ;
        gameSelection = this.gameSelections.get(room);
        if (!gameSelection)
            return ;
        client.to(room).emit('leftSelection', {
            player: player
        });
        gameSelection.nextLeft(player);
    }

    @SubscribeMessage('rightSelection')
    async rightSelection(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   [room, player] = this.getClientRoomPlayer(client);
        let     gameSelection: GameSelection;

        if (!room)
            return ;
        gameSelection = this.gameSelections.get(room);
        if (!gameSelection)
            return ;
        client.to(room).emit('rightSelection', {
            player: player
        });
        gameSelection.nextRight(player);
    }

    @SubscribeMessage('confirmSelection')
    async confirmSelection(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   [room, player] = this.getClientRoomPlayer(client);
        let     gameSelection: GameSelection;

        if (!room)
            return ;
        gameSelection = this.gameSelections.get(room);
        if (!gameSelection)
            return ;
        client.to(room).emit('confirmSelection', {
            player: player
        });
        gameSelection.confirm(player);
        if (gameSelection.finished)
        {
            this.startMatch(room, gameSelection.data);
            this.gameSelections.delete(room);
        }
    }
    
    @SubscribeMessage('paddleAUp')
    async paddleAUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (game.state != GameState.Running)
            return ;
        game.addPaddleAMove(1); //1: Up
    }

    @SubscribeMessage('paddleADown')
    async paddleADown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (game.state != GameState.Running)
            return ;
        game.addPaddleAMove(0); //0: Down
    }

    @SubscribeMessage('paddleBUp')
    async paddleBUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (game.state != GameState.Running)
            return ;
        game.addPaddleBMove(1); //1: Up
    }

    @SubscribeMessage('paddleBDown')
    async paddleBDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (game.state != GameState.Running)
            return ;
        game.addPaddleBMove(0); //0: Down
    }

    @SubscribeMessage('heroAUp')
    async heroAUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (game.state != GameState.Running)
            return ;
        game.addHeroAInvocation(1); //1 === W
    }

    @SubscribeMessage('heroADown')
    async heroADown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (game.state != GameState.Running)
            return ;
        game.addHeroAInvocation(0); //0 === S
    }

    @SubscribeMessage('heroBUp')
    async heroBUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (game.state != GameState.Running)
            return ;
        game.addHeroBInvocation(1); //1 === W
    }

    @SubscribeMessage('heroBDown')
    async heroBDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        const   game: Game = this.games.get(data.room);

        if (game.state != GameState.Running)
            return ;
        game.addHeroBInvocation(0); //0 === S
    }

  }
