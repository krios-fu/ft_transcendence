import { UseGuards } from '@nestjs/common';
import {
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import {
    Server,
    Socket
} from 'socket.io';
import { IGameClientStart } from './elements/Game'
import { IGameSelectionData } from './elements/GameSelection';
import { GameQueueService } from './game.queueService';
import { GameRecoveryService } from './game.recovery.service';
import { SocketHelper } from './game.socket.helper';
import { GameSocketAuthService } from './game.socketAuth.service';
import { GameUpdateService } from './game.updateService';
import { GameAuthGuard } from './guards/game.auth.guard';

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
        private readonly recoveryService: GameRecoveryService,
        private readonly socketAuthService: GameSocketAuthService
    ) {}
  
    afterInit() {
        this.socketHelper.initServer(this.server);
        console.log("Game Gateway initiated");
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Socket ${client.id} connected`);
        this.socketAuthService.addAuthTimeout(client);
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket ${client.id} disconnected`);
    }

    @UseGuards(GameAuthGuard)
    @SubscribeMessage("authentication")
    authentication(
        @ConnectedSocket() client: Socket
    ) {
        const   clientId: string = client.id;
        const   username: string = client.data.username;
    
        this.socketAuthService.clearTimeout(clientId);
        this.socketAuthService.registerUser(client, username);
        client.removeAllListeners("disconnecting");
        client.on("disconnecting", () => {
            this.socketAuthService.removeUser(client, username);
            this.socketAuthService.deleteTimeout(clientId);
        });
        client.emit("authSuccess");
    }

    @UseGuards(GameAuthGuard)
    @SubscribeMessage("joinRoom")
    async joinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string
    ) {
        let gameSelectionData: IGameSelectionData;
        let gameStartData: IGameClientStart;
    
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
        console.log(`${client.data.username} joined Game room ${roomId}`);
    }

    @UseGuards(GameAuthGuard)
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

    @UseGuards(GameAuthGuard)
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
