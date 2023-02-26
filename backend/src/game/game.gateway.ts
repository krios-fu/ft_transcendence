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
import { GameRecoveryService } from './game.recovery.service';
import { SocketHelper } from './game.socket.helper';
import { GameUpdateService } from './game.updateService';

@WebSocketGateway(3001, {
    cors: {
        origin: 'http://localhost:4200',
        credentials: true
    },
})
export class    GameGateway implements OnGatewayInit,
                                OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    constructor(
        private readonly updateService: GameUpdateService,
        private readonly queueService: GameQueueService,
        private readonly socketHelper: SocketHelper,
        private readonly recoveryService: GameRecoveryService
    ) {}
  
    afterInit() {
        this.socketHelper.initServer(this.server);
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
        let username: string | undefined = undefined;

        if (client.handshake.auth)
        {
            username = this.socketHelper.authenticateConnection(
                client,
                client.handshake.auth.token
            );
        }
        if (!username)
            return client.emit("authFailure");
        else
            client.emit("authSuccess");
        this.socketHelper.registerUser(client, username);
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
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket ${client.id} disconnected`);
    }

    @SubscribeMessage("authentication")
    async authentication(
        @ConnectedSocket() client: Socket,
        @MessageBody() token: string
    ) {
        const   username: string | undefined =
                    this.socketHelper.authenticateConnection(client, token);
    
        if (!username)
        {
            client.emit("authFailure");
            return ;
        }
        this.socketHelper.registerUser(client, username);
        client.emit("authSuccess");
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string
    ) {
        let gameSelectionData: IGameSelectionData;
        let gameStartData: IGameClientStart;
    
        /*if (!checkRoomExistsInDB()
                || !checkAuthConnection()
                || !checkUserAuthorization)
            return ;*/
        client.join(roomId);
        this.queueService.clientInitQueuesLength(roomId, client.id);
        gameSelectionData = this.updateService.getGameSelectionData(roomId);
        if (gameSelectionData)
        {
            client.emit("newGame", {
                role: "Spectator",
                selection: gameSelectionData
            });
        }
        else
        {
            gameStartData = this.updateService.getGameClientStartData(roomId);
            if (gameStartData)
                client.emit("startMatch", gameStartData);
        }
        console.log(`User joined Game room ${roomId}`);
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
        @ConnectedSocket() client: Socket,
        @MessageBody() when: number
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        
        this.updateService.paddleInput(room, player, true, when);
    }

    @SubscribeMessage('paddleDown')
    paddleDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() when: number
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        
        this.updateService.paddleInput(room, player, false, when);
    }

    @SubscribeMessage('heroUp')
    heroUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() when: number
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);

        this.updateService.heroInput(room, player, true, when);
    }

    @SubscribeMessage('heroDown')
    heroDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() when: number
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);

        this.updateService.heroInput(room, player, false, when);
    }

    @SubscribeMessage('recover')
    recover(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string
    ) {
        this.recoveryService.recover(client, roomId);
    }

  }
