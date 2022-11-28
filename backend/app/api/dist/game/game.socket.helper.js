"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHelper = void 0;
const common_1 = require("@nestjs/common");
let SocketHelper = class SocketHelper {
    async addUserToRoom(server, username, roomId) {
        let userSockets;
        userSockets = await server.in(username).fetchSockets();
        userSockets.forEach((sock) => {
            sock.join(roomId);
        });
    }
    emitToRoom(server, roomId, eventId, data = null) {
        server.to(roomId).emit(eventId, data);
        return;
    }
    async clearRoom(server, roomId) {
        let roomSockets;
        roomSockets = await server.in(roomId).fetchSockets();
        roomSockets.forEach((sock) => {
            sock.leave(roomId);
        });
    }
    getClientRoomPlayer(client) {
        const rooms = client.rooms.keys();
        let room = undefined;
        let player = undefined;
        let separatorPosition;
        for (const r of rooms) {
            if (r.includes("-Player")) {
                separatorPosition = r.indexOf('-');
                room = r.slice(0, separatorPosition);
                player = r.slice(separatorPosition + 1);
                break;
            }
        }
        return ([room, player]);
    }
};
SocketHelper = __decorate([
    (0, common_1.Injectable)()
], SocketHelper);
exports.SocketHelper = SocketHelper;
//# sourceMappingURL=game.socket.helper.js.map