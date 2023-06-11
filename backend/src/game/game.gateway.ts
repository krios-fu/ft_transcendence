import {
    UseGuards,
    UsePipes
} from '@nestjs/common';
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
import { IGameSelectionData } from './elements/GameSelection';
import { GameMatchmakingService } from './game.matchmaking.service';
import { GameRecoveryService } from './game.recovery.service';
import { SocketHelper } from './game.socket.helper';
import { GameSocketAuthService } from './game.socketAuth.service';
import {
    GameUpdateService,
    IGameResultData
} from './game.updateService';
import { GameAuthGuard } from './guards/game.auth.guard';
import { GameRoomGuard } from './guards/game.room.guard';
import {
    IMatchRecoverData,
    IMenuInit
} from './interfaces/msg.interfaces';
import { MatchInviteResponseDto } from './dtos/matchInviteResponse.dto';
import { NumberValidator } from './validators/number.validator';
import { StringValidator } from './validators/string.validator';
import { GameRoomService } from './game.room.service';
import { UserRolesService } from 'src/user_roles/user_roles.service';
import { UserRolesEntity } from 'src/user_roles/entity/user_roles.entity';

@WebSocketGateway(3001, {
    cors: {
        origin: process.env.WEBAPP_IP,
        credentials: true
    },
})
export class    GameGateway implements OnGatewayInit,
                                OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    constructor(
        private readonly updateService: GameUpdateService,
        private readonly matchMakingService: GameMatchmakingService,
        private readonly socketHelper: SocketHelper,
        private readonly recoveryService: GameRecoveryService,
        private readonly socketAuthService: GameSocketAuthService,
        private readonly roomService: GameRoomService,
        private readonly userRolesService: UserRolesService
    ) {}
  
    afterInit() {
        this.socketHelper.initServer(this.server);
        console.log("Game Gateway initiated");
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Socket ${client.id} connected in h*a*n*d*l*e*c*o*n*n*e*c*t*i*o*n`);
        this.socketAuthService.addAuthTimeout(client);
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket ${client.id} disconnected`);
    }

    @UseGuards(GameAuthGuard)
    @SubscribeMessage("authentication")
    async authentication(
        @ConnectedSocket() client: Socket
    ) {
        const   clientId: string = client.id;
        const   username: string = client.data.username;
        const   globalRoles: string[] = (await this.userRolesService
                    .getAllRolesFromUsername(username))
                    .map((ur: UserRolesEntity) => ur.role.role);
    
        console.log('[ ON AUTHENTICATION EVENT ]');
        this.socketAuthService.clearTimeout(clientId);
        await this.socketAuthService.registerUser(client, username);
        client.removeAllListeners("disconnecting");
        client.on("disconnecting", async () => {
            await this.socketAuthService.removeUser(client, username);
            this.socketAuthService.deleteTimeout(clientId);
        });
        /* *** GLOBAL role setting *** */
        if (!client.data.roles) {
            client.data.roles = {};
        }
        client.data.roles['global'] = globalRoles;
        console.log(`[ IN GAME.GATEWAY ] data obj.: ${JSON.stringify(client.data, null, 2)}`)
        /* ***                     *** */
        client.emit("authSuccess");
    }

    @UseGuards(GameAuthGuard, GameRoomGuard)
    @UsePipes(NumberValidator)
    @SubscribeMessage("joinRoom")
    async joinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: number
    ) {
        const   roomName: string = SocketHelper.roomIdToName(roomId);
        const   username: string = client.data.username;
        const   [initScene, initData]: [string,
                                        IMenuInit |
                                        IMatchRecoverData |
                                        IGameResultData |
                                        undefined] =
                    this.updateService.getClientInitData(roomName, client);
    
        this.roomService.join(
            username,
            roomName
        );
        await this.matchMakingService.emitQueuesInfo(
            roomName,
            client.id,
            username
        );
        if (initScene && initData)
            client.emit(initScene, initData);
        await this.matchMakingService.updateNextPlayerRoom(
            username,
            roomName,
            true
        );
        console.log(`${username} joined Game room ${roomName}`);
    }

    @UseGuards(GameAuthGuard, GameRoomGuard)
    @UsePipes(NumberValidator)
    @SubscribeMessage("leaveRoom")
    async leaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: number
    ) {
        const   roomName: string = SocketHelper.roomIdToName(roomId);
        this.roomService.leave(
            client,
            client.data.username,
            roomName
        );
        await this.matchMakingService.updateNextPlayerRoom(
            client.data.username,
            roomName,
            false
        );
        console.log(`${client.data.username} left Game room ${roomName}`);
    }

    @UseGuards(GameAuthGuard, GameRoomGuard)
    @UsePipes(StringValidator)
    @SubscribeMessage('addToGameQueue')
    async addToGameQueue(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string
    ) {
        await this.matchMakingService.addToQueue(
            roomId,
            "classic",
            client.data.username
        );
    }

    @UseGuards(GameAuthGuard, GameRoomGuard)
    @UsePipes(StringValidator)
    @SubscribeMessage('addToGameHeroQueue')
    async addToGameHeroQueue(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string
    ) {
        await this.matchMakingService.addToQueue(
            roomId,
            "hero",
            client.data.username
        );
    }

    @UseGuards(GameAuthGuard, GameRoomGuard)
    @UsePipes(StringValidator)
    @SubscribeMessage('removeFromGameQueue')
    async removeFromGameQueue(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string
    ) {
        await this.matchMakingService.removeFromQueue(
            roomId,
            "classic",
            client.data.username
        );
    }

    @UseGuards(GameAuthGuard, GameRoomGuard)
    @UsePipes(StringValidator)
    @SubscribeMessage('removeFromGameHeroQueue')
    async removeFromGameHeroQueue(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string
    ) {
        await this.matchMakingService.removeFromQueue(
            roomId,
            "hero",
            client.data.username
        );
    }

    @UseGuards(GameAuthGuard, GameRoomGuard)
    @UsePipes(MatchInviteResponseDto)
    @SubscribeMessage('matchInviteResponse')
    async matchInviteResponse(
        @ConnectedSocket() client: Socket,
        @MessageBody() invite: MatchInviteResponseDto
    ) {
        await this.matchMakingService.updateNextPlayerInvite(
            client.data.username,
            invite.roomId,
            invite.accept
        );
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

    @UsePipes(NumberValidator)
    @SubscribeMessage('paddleUp')
    paddleUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() when: number
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        
        this.updateService.paddleInput(room, player, true, when);
    }

    @UsePipes(NumberValidator)
    @SubscribeMessage('paddleDown')
    paddleDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() when: number
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);
        
        this.updateService.paddleInput(room, player, false, when);
    }

    @UsePipes(NumberValidator)
    @SubscribeMessage('heroUp')
    heroUp(
        @ConnectedSocket() client: Socket,
        @MessageBody() when: number
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);

        this.updateService.heroInput(room, player, true, when);
    }

    @UsePipes(NumberValidator)
    @SubscribeMessage('heroDown')
    heroDown(
        @ConnectedSocket() client: Socket,
        @MessageBody() when: number
    ) {
        const   [room, player] = this.socketHelper.getClientRoomPlayer(client);

        this.updateService.heroInput(room, player, false, when);
    }

    @UseGuards(GameRoomGuard)
    @UsePipes(StringValidator)
    @SubscribeMessage('recover')
    recover(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string
    ) {
        this.recoveryService.recover(client, roomId);
    }

    public refreshToken(): void {
        
    }

  }
