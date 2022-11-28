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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateRoomGuard = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("../room.service");
let PrivateRoomGuard = class PrivateRoomGuard {
    constructor(roomService) {
        this.roomService = roomService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return this.roomService.loginToRoom(request.body);
    }
};
PrivateRoomGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _a : Object])
], PrivateRoomGuard);
exports.PrivateRoomGuard = PrivateRoomGuard;
//# sourceMappingURL=private-room.guard.js.map