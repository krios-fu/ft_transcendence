import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameQueueService } from './game.queueService';
import { SocketHelper } from './game.socket.helper';
import { GameUpdateService } from './game.updateService';
export declare class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly updateService;
    private readonly queueService;
    private readonly socketHelper;
    server: Server;
    mockUserNum: number;
    constructor(updateService: GameUpdateService, queueService: GameQueueService, socketHelper: SocketHelper);
    afterInit(): void;
    handlePlayerDisconnect(playerRoom: string): Promise<void>;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): void;
    addToGameQueue(client: Socket, data: any): Promise<void>;
    leftSelection(client: Socket): void;
    rightSelection(client: Socket): void;
    confirmSelection(client: Socket): void;
    paddleUp(client: Socket): void;
    paddleDown(client: Socket): void;
    heroUp(client: Socket): void;
    heroDown(client: Socket): void;
}
