"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_queueService_1 = require("./game.queueService");
const game_socket_helper_1 = require("./game.socket.helper");
const game_updateService_1 = require("./game.updateService");
let GameGateway = class GameGateway {
    constructor(updateService, queueService, socketHelper) {
        this.updateService = updateService;
        this.queueService = queueService;
        this.socketHelper = socketHelper;
        this.mockUserNum = 1;
    }
    afterInit() {
        this.updateService.initServer(this.server);
        console.log("Game Gateway initiated");
    }
    async handlePlayerDisconnect(playerRoom) {
        const roomId = playerRoom.slice(0, playerRoom.indexOf('-'));
        let roomSockets;
        roomSockets = await this.server.in(playerRoom).fetchSockets();
        if (roomSockets.length > 1)
            return;
        this.updateService.playerWithdrawal(roomId, playerRoom);
    }
    async handleConnection(client, ...args) {
        let gameSelectionData;
        let gameStartData;
        let username = `user-${this.mockUserNum}`;
        console.log("User joined Game room");
        client.join("Game1");
        client.emit("mockUser", {
            mockUser: username
        });
        client.join(username);
        gameSelectionData = this.updateService.getGameSelectionData("Game1");
        if (gameSelectionData) {
            client.emit("newGame", {
                role: "Spectator",
                selection: gameSelectionData
            });
        }
        else {
            gameStartData = this.updateService.getGameClientStartData("Game1");
            if (gameStartData)
                client.emit("startMatch", gameStartData);
        }
        client.on("disconnecting", () => {
            const rooms = client.rooms.values();
            this.queueService.remove("Game1", username);
            for (const room of rooms) {
                if (room.includes("Player")) {
                    this.handlePlayerDisconnect(room);
                    break;
                }
            }
        });
        ++this.mockUserNum;
        console.log(`With id: ${client.id} and username ${username}`);
    }
    handleDisconnect(client) {
        console.log(`Socket ${client.id} disconnected`);
    }
    async addToGameQueue(client, data) {
        if (!client.rooms.has(data.room))
            return;
        await this.queueService.add(data.room, data.username);
        this.updateService.attemptGameInit(data.room);
    }
    leftSelection(client) {
        const [room, player] = this.socketHelper.getClientRoomPlayer(client);
        let selectionData;
        selectionData = this.updateService.selectionInput(room, player, 0);
        if (selectionData)
            client.to(room).emit('leftSelection', selectionData);
    }
    rightSelection(client) {
        const [room, player] = this.socketHelper.getClientRoomPlayer(client);
        let selectionData;
        selectionData = this.updateService.selectionInput(room, player, 1);
        if (selectionData)
            client.to(room).emit('rightSelection', selectionData);
    }
    confirmSelection(client) {
        const [room, player] = this.socketHelper.getClientRoomPlayer(client);
        let selectionData;
        selectionData = this.updateService.selectionInput(room, player, 2);
        if (selectionData) {
            client.to(room).emit('confirmSelection', selectionData);
            this.updateService.attemptSelectionFinish(room);
        }
    }
    paddleUp(client) {
        const [room, player] = this.socketHelper.getClientRoomPlayer(client);
        this.updateService.paddleInput(room, player, 1);
    }
    paddleDown(client) {
        const [room, player] = this.socketHelper.getClientRoomPlayer(client);
        this.updateService.paddleInput(room, player, 0);
    }
    heroUp(client) {
        const [room, player] = this.socketHelper.getClientRoomPlayer(client);
        this.updateService.heroInput(room, player, 1);
    }
    heroDown(client) {
        const [room, player] = this.socketHelper.getClientRoomPlayer(client);
        this.updateService.heroInput(room, player, 0);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('addToGameQueue'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "addToGameQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leftSelection'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "leftSelection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rightSelection'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "rightSelection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('confirmSelection'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "confirmSelection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('paddleUp'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "paddleUp", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('paddleDown'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "paddleDown", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('heroUp'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "heroUp", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('heroDown'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "heroDown", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, {
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [game_updateService_1.GameUpdateService,
        game_queueService_1.GameQueueService,
        game_socket_helper_1.SocketHelper])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map