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
import { IGameClientStart } from './elements/Game'
import { IGameSelectionData } from './elements/GameSelection';
import { GameQueueService } from './game.queueService';
import { SocketHelper } from './game.socket.helper';
import { GameUpdateService } from './game.updateService';

@WebSocketGateway(3001, {
    cors: {
        origin: '*',
    },
})
export class    GameGateway implements OnGatewayInit,
                                OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;
    mockUserNum: number = 1; //Provisional

    constructor(
        private readonly updateService: GameUpdateService,
        private readonly queueService: GameQueueService,
        private readonly socketHelper: SocketHelper
    ) {}
  
    afterInit() {
        this.updateService.initServer(this.server);
        console.log("Game Gateway initiated");
    }

    async handlePlayerDisconnect(playerRoom: string): Promise<void> {
        const   roomId: string = playerRoom.slice(0, playerRoom.indexOf('-'));
        let     roomSockets: RemoteSocket<DefaultEventsMap, any>[];
    
        roomSockets = await this.server.in(playerRoom).fetchSockets();
        /*
        **  Checking for > 1, because socket has not left the room yet.
        **  socket.io Event "disconnecting".
        */
        if (roomSockets.length > 1)
            return ;
        this.updateService.playerWithdrawal(roomId, playerRoom);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        let gameSelectionData: IGameSelectionData;
        let gameStartData: IGameClientStart;
        let username: string = `user-${this.mockUserNum}`; //Provisional

        console.log("User joined Game room");
        client.join("Game1"); //Provisional
        client.emit("mockUser", {
            mockUser: username
        }); //Provisional
        client.join(username);
        //client.join(userSession)
        gameSelectionData = this.updateService.getGameSelectionData("Game1");
        if (gameSelectionData)
        {
            client.emit("newGame", {
                role: "Spectator",
                selection: gameSelectionData
            });
        }
        else
        {
            gameStartData = this.updateService.getGameClientStartData("Game1");
            if (gameStartData)
                client.emit("startMatch", gameStartData);
        }
        client.on("disconnecting", () => {
            const   rooms: IterableIterator<string> = client.rooms.values();

            for (const room of rooms)
            {
                if (room.includes("Player"))
                    this.handlePlayerDisconnect(room);
                else
                    this.queueService.removeAll(room, username);
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
        if (!client.rooms.has(data.room))
            return ;
        //Need to implement user authentication
        await this.queueService.add(data.room, false, data.username);
        this.updateService.attemptGameInit(data.room);
    }

    @SubscribeMessage('addToGameHeroQueue')
    async addToGameHeroQueue(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any
    ) {
        if (!client.rooms.has(data.room))
            return ;
        //Need to implement user authentication
        await this.queueService.add(data.room, true, data.username);
        this.updateService.attemptGameInit(data.room);
    }

    @SubscribeMessage('leftSelection')
    leftSelection(
        @ConnectedSocket() client: Socket
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        let     selectionData: IGameSelectionData;

        selectionData = this.updateService.selectionInput(room, player, 0);
        if (selectionData)
            client.to(room).emit('leftSelection', selectionData);
    }

    @SubscribeMessage('rightSelection')
    rightSelection(
        @ConnectedSocket() client: Socket
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        let     selectionData: IGameSelectionData;

        selectionData = this.updateService.selectionInput(room, player, 1);
        if (selectionData)
            client.to(room).emit('rightSelection', selectionData);
    }

    @SubscribeMessage('confirmSelection')
    confirmSelection(
        @ConnectedSocket() client: Socket
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        let     selectionData: IGameSelectionData;

        selectionData = this.updateService.selectionInput(room, player, 2);
        if (selectionData)
        {
            client.to(room).emit('confirmSelection', selectionData);
            this.updateService.attemptSelectionFinish(room);
        }
    }
    
    @SubscribeMessage('paddleUp')
    paddleUp(
        @ConnectedSocket() client: Socket
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        
        this.updateService.paddleInput(room, player, 2);
    }

    @SubscribeMessage('paddleDown')
    paddleDown(
        @ConnectedSocket() client: Socket
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        
        this.updateService.paddleInput(room, player, 1);
    }

    @SubscribeMessage('heroUp')
    heroUp(
        @ConnectedSocket() client: Socket
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);

        this.updateService.heroInput(room, player, 2);
    }

    @SubscribeMessage('heroDown')
    heroDown(
        @ConnectedSocket() client: Socket
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);

        this.updateService.heroInput(room, player, 1);
    }

  }
