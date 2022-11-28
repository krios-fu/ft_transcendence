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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const message_service_1 = require("./message/message.service");
let ChatGateway = class ChatGateway {
    constructor(messageService) {
        this.messageService = messageService;
    }
    afterInit(Server) {
    }
    handleConnection(client, ...args) {
        console.log('Join connection ');
        console.log("---> " + client.id);
        console.log(args);
    }
    handleDisconnect(client) {
        console.log('Disconnect');
        console.log(client.id);
    }
    handleJoinRoom(client, room) {
        client.join(`room_${room}`);
        console.log("Join cliente", client.id, "to", `room_${room}`);
    }
    handleIncommingMessage(client, payload) {
        const { id_chat, msg, sender, reciver } = payload;
        console.log("******>", payload);
        this.server.to(`room_${id_chat}`).emit('new_message', payload);
        this.messageService.saveMessages(payload);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleIncommingMessage", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, {
        namespace: 'private',
        cors: { origin: '*' }
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map